/**
 * Represents a singular UI element
 */
interface UIElement {
    /**
     * The element's name
     */
    readonly name: string;
    /**
     * A function that'll be called to create this element in the DOM
     * @param uiContainer The `HTMLDivElement` containing the other UI elements
     */
    readonly create?: (uiContainer: HTMLDivElement) => void;
    /**
     * A function that'll be called to update this UI element
     *
     * _It is recommended to first check that an update is actually required before
     * making any DOM operations; for example, a health bar only needs to be updated
     * when the user's health changes_
     */
    readonly update?: () => void;
    /**
     * A method that will be invoked in order to remove this UI element
     */
    destroy(): void;
    /**
     * Elements deemed 'essential'. When clearing the UI, these elements will persist unless the `force` option is specified.
     */
    readonly core: boolean;
}
/**
 * An object for managing UI elements
 */
declare const UIManager: {
    /**
     * The `HTMLDivElement` containing the UI
     */
    readonly "__#25@#container": HTMLDivElement;
    /**
     * The `HTMLDivElement` containing the UI
     */
    readonly container: HTMLDivElement;
    /**
     * A Map whose values correspond to this manager's elements and whose keys are their corresponding names
     */
    "__#25@#elements": Map<string, UIElement>;
    /**
     * A Map whose valuess correspond to this manager's elements and whose keys are their corresponding names
     */
    readonly elements: Map<string, UIElement>;
    /**
     * UI elements marked as `core` won't be cleared when calling `UIManager.clear()` unless `force` is set to `true`.
     */
    readonly core: UIElement[];
    /**
     * Adds UI elements to the manager
     * @param items An array of `UIElement`s to append
     * @param items[].instantiateImmediately - Whether to call the element's `create` function immediately
     */
    add(...items: (UIElement & {
        instantiateImmediately?: boolean;
    })[]): void;
    /**
     * Removes the item with the specified name
     * @param item The UI element's name
     */
    remove(item: string): void;
    /**
     * Removes all UI elements not marked as `core`.
     *
     * If `force` is set to true, `core` elements will be cleared as well
     */
    clear(force?: boolean): void;
    /**
     * Calls every UI element's `create` method.
     *
     * This method does nothing if there is no `Player` present
     */
    create(): void;
    /**
     * Calls every UI element's `update` method
     *
     * This method does nothing if there is no `Player` present
     */
    update(): void;
};
