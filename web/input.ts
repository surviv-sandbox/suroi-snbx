/**
 * Represents the callback invoked when a user presses a key bound to an action
 * @param parity Whether the input is being pressed or released
 */
type InputCallback = (parity: "start" | "stop") => void;

/**
 * A singleton for managing user input
 */
const InputManager = new (createSingleton(class InputManager {
    /**
     * A map whose keys are the names of the bound keys and whose values are arrays of callbacks to be invoked when the key is pressed
     */
    readonly #keybinds: Map<string, InputCallback[]> = new Map;
    /**
     * A map whose keys are the names of the bound keys and whose values are arrays of callbacks to be invoked when the key is pressed
     */
    get keybinds() { return this.#keybinds; }

    /**
     * Adds a callback to the designated key
     * @param key The key name
     * - For keys, identical to the one returned by `KeyboardEvent.code` (`KeyW`, `KeyF`)
     * - For mouse buttons, according to the format "Mouse + `MouseEvent.button`" (`Mouse0`, `Mouse3`)
     * @param callback The callback to be invoked when the key is pressed
     */
    register(
        key: KeyboardEvent["code"]
            | `Mouse${MouseEvent["button"]}`
            | `MWheel${"Right" | "Left" | "Down" | "Up" | "Forwards" | "Backwards"}`,
        callback: InputCallback
    ) {
        (
            this.#keybinds.get(key) ?? (() => {
                const array: InputCallback[] = [];
                this.#keybinds.set(key, array);

                return array;
            })()
        ).push(callback);
    }

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
    function onlyOnStart(cb: InputCallback) {
        return (parity: "start" | "stop") => parity == "start" && cb(parity);
    }

    const zero = srvsdbx_Geometry.Vector3D.zeroPt(),
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
            let player: srvsdbx_ErrorHandling.Maybe<Player>;

            if (player = gamespace.player) {
                player.velocityMap.set(
                    velocityMapKey,
                    parity == "start" ? { x: velocity.x, y: velocity.y, z: 0 } : zero
                );
            }
        };
    }

    Object.entries(movements)
        .forEach(([k, v]) => {
            InputManager.register(k, generateMovementCallback(v[0], v[1]));
        });

    function absMod(a: number, b: number) {
        return a >= 0 ? a % b : (a % b + b) % b;
    }

    function cycleItems(dir: 1 | -1) {
        const player = gamespace.player;

        if (player && player.inventory.items.size > 1) {
            let target = player.activeItemIndex;

            while (!player.inventory.hasItem(absMod(target += dir, 4), "Main"));

            player.setActiveItemIndex(absMod(target, 4));
        }
    }

    InputManager.register("MWheelUp", onlyOnStart(cycleItems.bind(null, 1)));

    InputManager.register("MWheelDown", onlyOnStart(cycleItems.bind(null, -1)));

    InputManager.register("Mouse0", parity => {
        const player = gamespace.player;

        if (player) {
            player.state.attacking = parity == "start";

            player?.activeItem?.usePrimary?.();
        }
    });

    InputManager.register("KeyR", onlyOnStart(() => {
        const player = gamespace.player;

        if (player) {
            const activeItem = player?.activeItem;

            if (activeItem instanceof Gun) activeItem.standardReload();
        }
    }));

    InputManager.register("KeyQ", onlyOnStart(() => {
        const player = gamespace.player;

        player?.setActiveItemIndex?.(player.previousActiveIndex);
    }));

    for (let i = 0; i < 4; i++) {
        InputManager.register(`Digit${i + 1}`, onlyOnStart(() => {
            const player = gamespace.player;

            player?.setActiveItemIndex?.(i);
        }));
    }

    InputManager.register("KeyT", onlyOnStart(() => {
        const player = gamespace.player;

        player?.swapWeapons?.();
    }));

    InputManager.register("KeyH", onlyOnStart(() => (gamespace.settings.drawHitboxes = !gamespace.settings.drawHitboxes)));

    InputManager.register("KeyJ", onlyOnStart(() => (gamespace.settings.drawVelocities = !gamespace.settings.drawVelocities)));
}