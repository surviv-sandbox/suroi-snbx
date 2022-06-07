declare class uiManager {
    #private;
    get elements(): string[];
    constructor();
    add(...items: {
        readonly name: string;
        readonly create?: ((uiContainer: HTMLDivElement) => void);
        readonly update?: ((player: playerLike, activeItem: gun) => void);
        callCreateImmediately?: boolean;
    }[]): void;
    remove(item: string): void;
    create(): void;
    update(): void;
}
declare const ui: uiManager;
