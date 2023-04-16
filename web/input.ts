/**
 * Represents the callback invoked when a user presses a key bound to an action
 * @param parity Whether the input is being pressed or released
 */
type InputCallback = (parity: "start" | "stop") => void;

/**
 * A singleton for managing user input
 */
const InputManager = new (srvsdbx_OOP.createSingleton(class InputManager {
    /**
     * A map whose keys are the names of the bound keys and whose values are arrays of callbacks to be invoked when the key is pressed
     */
    readonly #keybinds: Map<string, InputCallback[]> = new Map;
    /**
     * A map whose keys are the names of the bound keys and whose values are arrays of callbacks to be invoked when the key is pressed
     */
    get keybinds() { return this.#keybinds; }

    /**
     * Adds a callback to the designated input
     * @param key The input name
     * - For keys, identical to the one returned by `KeyboardEvent.code` (`KeyW`, `KeyF`)
     * - For mouse buttons, according to the format "Mouse + `MouseEvent.button`" (`Mouse0`, `Mouse3`)
     * @param callback The callback to be invoked when the input is pressed or released
     */
    readonly register = (() => {
        type Base = (
            key: KeyboardEvent["code"]
                | `Mouse${MouseEvent["button"]}`
                | `MWheel${"Right" | "Left" | "Down" | "Up" | "Forwards" | "Backwards"}`,
            callback: InputCallback
        ) => void;

        type Extended = Base & {
            /**
             * A version of this function whose callback will only be invoked
             * when the corresponding input is started and not when it is released
             */
            onlyOnStart?: Base;
            /**
             * A version of this function whose callback will only be invoked
             * when the corresponding input is stopped (released) and not when it is started
             */
            onlyOnStop?: Base;
        };

        const fn: Extended = ((
            key: KeyboardEvent["code"]
                | `Mouse${MouseEvent["button"]}`
                | `MWheel${"Right" | "Left" | "Down" | "Up" | "Forwards" | "Backwards"}`,
            callback: InputCallback
        ) => {
            (
                this.#keybinds.get(key) ?? (() => {
                    const array: InputCallback[] = [];
                    this.#keybinds.set(key, array);

                    return array;
                })()
            ).push(callback);
        }).bind(this);

        fn.onlyOnStart = function(
            key: KeyboardEvent["code"]
                | `Mouse${MouseEvent["button"]}`
                | `MWheel${"Right" | "Left" | "Down" | "Up" | "Forwards" | "Backwards"}`,
            callback: InputCallback
        ) {
            fn(key, (parity: "start" | "stop") => parity == "start" && callback(parity));
        };

        fn.onlyOnStop = function(
            key: KeyboardEvent["code"]
                | `Mouse${MouseEvent["button"]}`
                | `MWheel${"Right" | "Left" | "Down" | "Up" | "Forwards" | "Backwards"}`,
            callback: InputCallback
        ) {
            fn(key, (parity: "start" | "stop") => parity == "stop" && callback(parity));
        };

        return fn as Base & Required<Extended>;
    })();

    /**
     * `* It's a constructor. It constructs.`
     */
    constructor() {
        let timer: number | false = false;

        const dispatchInput = (ev: KeyboardEvent | MouseEvent | WheelEvent) => {
            const [type, code] = ((): ["start" | "stop", string] => {
                if (ev instanceof KeyboardEvent) {
                    return [ev.type.replace("key", "") == "down" ? "start" : "stop", ev.code];
                } else if (ev instanceof WheelEvent) {
                    let type: "right" | "left" | "down" | "up" | "forwards" | "backwards" = "" as any;

                    switch (true) {
                        case ev.deltaX > 0: type = "right"; break;
                        case ev.deltaX < 0: type = "left"; break;
                        case ev.deltaY > 0: type = "down"; break;
                        case ev.deltaY < 0: type = "up"; break;
                        case ev.deltaZ > 0: type = "forwards"; break;
                        case ev.deltaZ < 0: type = "backwards"; break;
                    }

                    const code = `MWheel${type[0].toUpperCase()}${type.slice(1)}`;

                    /*
                        The browser doesn't emit mouse wheel "stop" events, so instead, we schedule the invocation
                        of the stop callback to next tick, cancelling the previous callback

                        This has the effect of continuously cancelling the stop callback whenever a wheel event is
                        detected, which is what we want
                    */
                    clearTimerIfPresent(timer);
                    timer = setTimeout(
                        () => {
                            for (const listener of this.#keybinds.get(code) ?? []) listener("stop");
                        },
                        50
                    ) as unknown as number;

                    return ["start" as const, code];
                } else /* if (ev instanceof MouseEvent) */ {
                    return [ev.type.replace("mouse", "") == "down" ? "start" : "stop", `Mouse${ev.button}`];
                }
            })(),
                listeners = this.#keybinds.get(code);

            for (const listener of listeners ?? []) listener(type);
        };

        window.addEventListener("keydown", dispatchInput);
        window.addEventListener("keyup", dispatchInput);
        window.addEventListener("mousedown", dispatchInput);
        window.addEventListener("mouseup", dispatchInput);
        window.addEventListener("wheel", dispatchInput);
    }
}));

{
    const zero = srvsdbx_Geometry.Vector3D.zeroPoint(),
        movements: {
            [key: string]: [string, srvsdbx_Geometry.Point2D];
        } = {
            "KeyW": ["forwards", { x: 0, y: -1 }],
            "KeyA": ["strafeL", { x: -1, y: 0 }],
            "KeyS": ["backwards", { x: 0, y: 1 }],
            "KeyD": ["strafeR", { x: 1, y: 0 }],
        };

    function generateMovementCallback(velocityMapKey: string, velocity: srvsdbx_Geometry.Point2D) {
        return (parity: "start" | "stop") => {
            gamespace.player?.velocityMap.set(
                velocityMapKey,
                parity == "start" ? { x: velocity.x, y: velocity.y, z: 0 } : zero
            );
        };
    }

    Object.entries(movements)
        .forEach(([key, velocity]) => {
            InputManager.register(key, generateMovementCallback(velocity[0], velocity[1]));
        });

    const slots = Inventory.MAIN_SLOTS;

    function absMod(a: number, b: number) {
        return a >= 0 ? a % b : (a % b + b) % b;
    }

    function cycleItems(dir: 1 | -1) {
        const player = gamespace.player;
        if (player) {
            if (player.inventory.containers.main.size > 1) {
                let target = player.activeItemIndex;

                while (!player.inventory.containers.main.has(absMod(target += dir, slots)));

                player.setActiveItemIndex(absMod(target, slots));
            }
        }
    }

    InputManager.register.onlyOnStart("MWheelUp", cycleItems.bind(null, -1));

    InputManager.register.onlyOnStart("MWheelDown", cycleItems.bind(null, 1));

    InputManager.register("Mouse0", parity => {
        const player = gamespace.player;
        if (player) {
            player.state.attacking = parity == "start";
            player.activeItem?.usePrimary?.();
        }
    });

    InputManager.register.onlyOnStart("KeyR", () => {
        const player = gamespace.player;
        if (player) {
            const activeItem = player?.activeItem;

            if (activeItem instanceof Gun) activeItem.standardReload();
        }
    });

    InputManager.register.onlyOnStart("KeyQ", () => {
        gamespace.player?.setActiveItemIndex(gamespace.player.previousActiveIndex);
    });

    for (let i = 0; i < slots; i++) {
        InputManager.register.onlyOnStart(`Digit${i + 1}`, () => {
            gamespace.player?.setActiveItemIndex(i);
        });
    }

    InputManager.register.onlyOnStart("KeyT", () => {
        gamespace.player?.swapWeapons();
    });

    InputManager.register.onlyOnStart("KeyH", () => (gamespace.settings.drawHitboxes = !gamespace.settings.drawHitboxes));

    InputManager.register.onlyOnStart("KeyJ", () => (gamespace.settings.drawVelocities = !gamespace.settings.drawVelocities));

    InputManager.register.onlyOnStart("KeyP", () => UIManager.toggle());
}