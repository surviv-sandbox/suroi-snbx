"use strict";
/**
 * A singleton for managing user input
 */
const InputManager = new (createSingleton(class InputManager {
    /**
     * A map whose keys are the names of the bound keys and whose values are arrays of callbacks to be invoked when the key is pressed
     */
    #keybinds = new Map;
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
    register(key, callback) {
        const keybindEntry = this.#keybinds.get(key) ?? (() => {
            const arr = [];
            this.#keybinds.set(key, arr);
            return arr;
        })();
        keybindEntry.push(callback);
    }
    /**
     * `* It's a constructor. It constructs.`
     */
    constructor() {
        const dispatchInput = (ev) => {
            const [type, code] = (() => {
                if (ev instanceof KeyboardEvent) {
                    return [ev.type.replace("key", ""), ev.code];
                }
                else /* if (ev instanceof MouseEvent) */ {
                    return [ev.type.replace("mouse", ""), `Mouse${ev.button}`];
                }
            })(), listeners = this.#keybinds.get(code);
            for (const listener of listeners ?? [])
                listener(type);
        };
        window.addEventListener("keydown", dispatchInput);
        window.addEventListener("keyup", dispatchInput);
        window.addEventListener("mousedown", dispatchInput);
        window.addEventListener("mouseup", dispatchInput);
        //todo scrollwheel inputs
    }
}));
{
    function onlyOnKeydown(cb) {
        return (parity) => parity == "down" && cb(parity);
    }
    const zero = srvsdbx_Geometry.Vector3D.zeroPt(), movements = {
        "KeyW": ["forwards", { x: 0, y: -1 }],
        "KeyA": ["strafeL", { x: -1, y: 0 }],
        "KeyS": ["backwards", { x: 0, y: 1 }],
        "KeyD": ["strafeR", { x: 1, y: 0 }],
    };
    function generateMovementCallback(velocityMapKey, velocity) {
        return (parity) => {
            let player;
            if (player = gamespace.player) {
                player.velocityMap.set(velocityMapKey, parity == "down" ? { x: velocity.x, y: velocity.y, z: 0 } : zero);
            }
        };
    }
    Object.entries(movements)
        .forEach(([k, v]) => {
        InputManager.register(k, generateMovementCallback(v[0], v[1]));
    });
    InputManager.register("Mouse0", parity => {
        const player = gamespace.player;
        if (player) {
            player.state.attacking = parity == "down";
            player?.activeItem?.usePrimary?.();
        }
    });
    InputManager.register("KeyR", onlyOnKeydown(() => {
        const player = gamespace.player;
        if (player) {
            const activeItem = player?.activeItem;
            if (activeItem instanceof Gun)
                activeItem.standardReload();
        }
    }));
    InputManager.register("KeyQ", onlyOnKeydown(() => {
        const player = gamespace.player;
        player?.setActiveItemIndex?.(player.previousActiveIndex);
    }));
    for (let i = 0; i < 4; i++) {
        InputManager.register(`Digit${i + 1}`, onlyOnKeydown(() => {
            const player = gamespace.player;
            player?.setActiveItemIndex?.(i);
        }));
    }
    InputManager.register("KeyT", onlyOnKeydown(() => {
        const player = gamespace.player;
        player?.swapWeapons?.();
    }));
    InputManager.register("KeyH", onlyOnKeydown(() => (gamespace.settings.drawHitboxes = !gamespace.settings.drawHitboxes)));
    InputManager.register("KeyJ", onlyOnKeydown(() => (gamespace.settings.drawVelocities = !gamespace.settings.drawVelocities)));
}
//# sourceMappingURL=input.js.map