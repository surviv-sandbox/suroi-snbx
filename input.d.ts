declare const keyBindings: {
    [key: string]: {
        key: string;
        allowedModifiers: ("alt" | "ctrl" | "meta" | "shift")[];
        callback(type: `${"key" | "mouse"}${"down" | "up"}` | "wheel", modifiers: {
            altKey: boolean;
            ctrlKey: boolean;
            metaKey: boolean;
            shiftKey: boolean;
        }): void;
    };
};
declare function registerInput(event: KeyboardEvent | MouseEvent | WheelEvent): void;
declare function freezeAllInputs(): void;
declare function unfreezeInputs(): void;
