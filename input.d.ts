declare const keyBindings: {
    [key: string]: {
        key: string;
        callback: Function;
    };
};
declare function registerInput(event: KeyboardEvent | MouseEvent): void;
declare function freezeAllInputs(): void;
