type InputCallback = (parity: "start" | "stop") => void;
declare const InputManager: {
    readonly "__#10@#keybinds": Map<string, InputCallback[]>;
    readonly keybinds: Map<string, InputCallback[]>;
    readonly register: ((key: KeyboardEvent["code"] | `Mouse${MouseEvent["button"]}` | `MWheel${"Right" | "Left" | "Down" | "Up" | "Forwards" | "Backwards"}`, callback: InputCallback) => void) & Required<((key: KeyboardEvent["code"] | `Mouse${MouseEvent["button"]}` | `MWheel${"Right" | "Left" | "Down" | "Up" | "Forwards" | "Backwards"}`, callback: InputCallback) => void) & {
        onlyOnStart?: ((key: KeyboardEvent["code"] | `Mouse${MouseEvent["button"]}` | `MWheel${"Right" | "Left" | "Down" | "Up" | "Forwards" | "Backwards"}`, callback: InputCallback) => void) | undefined;
        onlyOnStop?: ((key: KeyboardEvent["code"] | `Mouse${MouseEvent["button"]}` | `MWheel${"Right" | "Left" | "Down" | "Up" | "Forwards" | "Backwards"}`, callback: InputCallback) => void) | undefined;
    }>;
};
