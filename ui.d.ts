interface uiElement {
    readonly name: string;
    readonly create?: ((uiContainer: HTMLDivElement) => void);
    readonly update?: ((player: playerLike, activeItem: gun) => void);
    readonly core?: boolean;
}
declare class uiManager {
    #private;
    get elements(): string[];
    constructor();
    add(...items: (uiElement & {
        callCreateImmediately?: boolean;
    })[]): void;
    remove(item: string): void;
    clear(): void;
    create(): void;
    update(): void;
}
declare const ui: uiManager;
