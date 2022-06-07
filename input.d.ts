declare const keyBindings: {
    [key: string]: {
        key: string;
        callback(type?: `${string}${"down" | "up"}`): void;
    };
};
declare function registerInput(event: KeyboardEvent | MouseEvent | WheelEvent): void;
declare function freezeAllInputs(): void;
declare function unfreezeInputs(): void;
