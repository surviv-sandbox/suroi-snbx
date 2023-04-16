interface UIElement {
    readonly name: string;
    create?(uiContainer: HTMLDivElement): void;
    update?(uiContainer: HTMLDivElement): void;
    destroy(): void;
    readonly core: boolean;
}
declare const UIManager: {
    readonly "__#33@#container": HTMLDivElement;
    "__#33@#elements": Map<string, UIElement>;
    readonly elements: Map<string, UIElement>;
    readonly core: UIElement[];
    "__#33@#hidden": boolean;
    readonly hidden: boolean;
    add(...items: (UIElement & {
        instantiateImmediately?: boolean;
    })[]): void;
    remove(item: string): void;
    clear(force?: boolean): void;
    create(): void;
    update(): void;
    show(): void;
    hide(): void;
    toggle(): void;
};
