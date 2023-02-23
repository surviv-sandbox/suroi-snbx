/**
 * Represents the callback invoked when a user presses a key bound to an action
 * @param parity Whether the input is being pressed or released
 */
type InputCallback = (parity: "start" | "stop") => void;
/**
 * A singleton for managing user input
 */
declare const InputManager: {
    /**
     * A map whose keys are the names of the bound keys and whose values are arrays of callbacks to be invoked when the key is pressed
     */
    readonly "__#9@#keybinds": Map<string, InputCallback[]>;
    /**
     * A map whose keys are the names of the bound keys and whose values are arrays of callbacks to be invoked when the key is pressed
     */
    readonly keybinds: Map<string, InputCallback[]>;
    /**
     * Adds a callback to the designated key
     * @param key The key name
     * - For keys, identical to the one returned by `KeyboardEvent.code` (`KeyW`, `KeyF`)
     * - For mouse buttons, according to the format "Mouse + `MouseEvent.button`" (`Mouse0`, `Mouse3`)
     * @param callback The callback to be invoked when the key is pressed
     */
    register(key: KeyboardEvent["code"] | `Mouse${MouseEvent["button"]}` | `MWheel${"Right" | "Left" | "Down" | "Up" | "Forwards" | "Backwards"}`, callback: InputCallback): void;
};
