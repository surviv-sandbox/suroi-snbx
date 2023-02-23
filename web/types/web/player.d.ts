/// <reference types="p5" />
/**
 * Represents a bot or player: generally, something that can act as a player
 */
declare class PlayerLike extends Generic<{
    collision: {
        event: CollisionEvent;
        args: [Generic];
    };
    /**
     * This player's death
     */
    death: {
        /**
         * The `Event` instance
         */
        event: Event;
        /**
         * The `PlayerLike` that killed this instance, if applicable
         */
        args: [PlayerLike | undefined];
    };
    /**
     * This player's killing of another
     */
    kill: {
        /**
         * The `Event` instance
         */
        event: Event;
        /**
         * The `PlayerLike` that was killed
         */
        args: [PlayerLike];
    };
}> implements Destroyable {
    #private;
    /**
     * This player's inventory object
     */
    get inventory(): Inventory;
    /**
     * The index of the last active item
     */
    get previousActiveIndex(): number;
    /**
     * Returns the index of the active item
     */
    get activeItemIndex(): number;
    /**
     * The item currently in use by the PlayerLike
     */
    get activeItem(): (InventoryItem<InventoryItemPrototype> & EquipableItem<ItemAnimation, "idle" | "using">) | undefined;
    get state(): {
        /**
         * Whether or not this player is currently attempting to attack
         */
        attacking: boolean;
        /**
         * The amount of time a user will have to wait before using their item, taking free switches into account
         */
        effectiveSwitchDelay: number;
        /**
         * Whether or not this player is currently firing their weapon
         */
        firing: boolean;
        /**
         * The timestamp of the last time the user swapped items
         */
        lastSwitch: number;
        /**
         * The timestamp of the last "free" switch the user has performed
         *
         * A "free switch" is defined as an item switch that bypasses an item's usual switch delay: "quickswitching"
         */
        lastFreeSwitch: number;
        /**
         * Whether firing speed penalties should apply
         */
        noSlow: boolean;
        /**
         * Whether or not this player is currently reloading their weapon
         */
        reloading: number | false;
    };
    /**
     * The maximum amount of health this player may have
     *
     * `get`: Returns the player's maximum health
     *
     * `set`: Sets the player's maximum health, except if the value is `NaN` (the setter serves to prevent accidentally corrupting the health with a `NaN`)
     */
    get maxHealth(): number;
    set maxHealth(v: number);
    /**
     * The player's current health
     *
     * `get`: Returns the player's current health
     *
     * `set`: Sets the player's current health, except if the value is `NaN` (the setter serves to prevent accidentally corrupting the health with a `NaN`)
     */
    get health(): number;
    get timers(): {
        /**
         * The timer responsible for firing the user's current weapon
         */
        firing: number | false;
        /**
         * The timer responsible for replenishing the user's ammo after some delay
         */
        reload: number | false;
    };
    get hands(): {
        /**
         * Information about the player's left hand
         */
        leftHand: {
            /**
             * How far along the axis parallel to the player's view line this hand is
             */
            parr: number;
            /**
             * How far along the axis perpendicular to the player's view line this hand is
             */
            perp: number;
        };
        /**
         * Information about the player's right hand
         */
        rightHand: {
            /**
             * How far along the axis parallel to the player's view line this hand is
             */
            parr: number;
            /**
             * How far along the axis perpendicular to the player's view line this hand is
             */
            perp: number;
        };
    };
    /**
     * Information about the speed players travel at
     */
    get speed(): {
        default: number;
    };
    /**
     * The point in the game world this player is aiming at
     */
    get aimPoint(): srvsdbx_Geometry.Point2D;
    /**
     * A rough measure of this player's "scope" level
     *
     * Passed directly as the z position of p5's camera
     */
    get view(): number;
    /**
     * A collections of `Map`s whose role is to modify the intensity of actions
     * performed by this player, such as dealing damage, speed, etc
     */
    get modifiers(): {
        /**
         * A `Map` whose values will modify outgoing damage by multiplying it and whose keys are their respectives sources
        */
        readonly damage: ReducibleMap<string, number, number>;
        /**
          * A `Map` whose values will modify incoming damage by multiplying it and whose keys are their respectives sources
         */
        readonly protection: ReducibleMap<string, number, number>;
        /**
         * A `Map` whose values are speed multipliers and whose keys are their respectives sources
         *
         * Note that additive modifiers have precedence over multiplicative ones; the formula
         * for the final speed is therefore `(s + a) * m`, where `s` is the base speed, `m` is
         * the product of all the multiplicative speed modifiers and `a` is the sum of all the
         * additive modifiers
         */
        readonly speedMult: ReducibleMap<string, number, number>;
        /**
         * A `Map` whose values are speed additions and whose keys are their respectives sources
         *
         * Note that additive modifiers have precedence over multiplicative ones; the formula
         * for the final speed is therefore `(s + a) * m`, where `s` is the base speed, `m` is
         * the product of all the multiplicative speed modifiers and `a` is the sum of all the
         * additive modifiers
         */
        readonly speedAdd: ReducibleMap<string, number, number>;
        /**
         * A `Map` whose values will modify reload time and fire rate by multiplying it and whose keys are their respectives sources
         */
        readonly ergonomics: ReducibleMap<string, number, number>;
    };
    /**
     * A `Set` of status effects currently affecting this player
     */
    get statusEffects(): Set<StatusEffect<{}>>;
    /**
     * The radius of this player
     *
     * - `get`: Returns this player's radius
     * - `set`: Sets this player's radius if it is not `NaN`
     */
    get radius(): number;
    set radius(r: number);
    /**
     * `* It's a constructor. It constructs.`
     * @param position A `Point2D` object dictating this object's starting position
     */
    constructor(position: srvsdbx_Geometry.Point2D);
    /**
     * Determines if this player can currently use their active item
     *
     * A player can use their active item if:
     * - There is an active item
     * - It is equippable
     * - The elapsed time since its last use is greater than the item's use delay
     * @returns Whether or not the item can be used
     */
    canAttack(): boolean;
    /**
     * Inverses the weapon slots, putting the first weapon in the second and vice versa
     */
    swapWeapons(): void;
    /**
     * Sets the player's active item by referring to the at which it's contained
     * @param slotId The slot in the inventory to switch to
     */
    setActiveItemIndex(slotId: number): void;
    /**
     * Identical to the method it overrides, save for the fact that it pays special consideration to the velocities corresponding to keyboard inputs
     * These correspond to the following keys in the `velocityMap`: `forwards`, `strafeL`, `backwards`, `strafeR`. The addition of the velocities is a vector,
     * whose magnitude is set to a certain amount corresponding to the player's speed.
     *
     * Other velocities are treated normally.
     */
    compileVelocities(): srvsdbx_Geometry.Vector3D;
    /**
     * Uses this player's state to determine the speed at which they should move
     * @returns This player's speed, in surviv units per second
     */
    determineMoveSpeed(): number;
    /**
     * Makes the player face the user's mouse cursor, setting its aim point to that of the mouse cursor's (after adjustment)
     */
    lookAtMouse(p5: import("p5")): void;
    /**
     * Makes the player look at a specified point
     * @param pt The point to look at
     */
    lookAtPoint(pt: srvsdbx_Geometry.Point2D): void;
    /**
     * Applies the specified amount of damage to a player
     * @param amount The amount of damage to deal. Negative numbers heal
     */
    applyDamage(amount: number, source?: PlayerLike): srvsdbx_ErrorHandling.Result<undefined, string>;
    /**
     * Heals the players by the specified amount
     * @param amount The amount of health to heal by. Negative numbers harm
    */
    applyHealing(amount: number, source?: PlayerLike): srvsdbx_ErrorHandling.Result<undefined, string>;
    /**
     * Directly set the player's health
     * @param amount The amount to set the player's health at
     */
    setHealth(amount: number): srvsdbx_ErrorHandling.Result<undefined, string>;
    /**
     * Identical to the method it overrides, but clears `PlayerLike`-specific fields
     */
    destroy(): void;
}
/**
 * A singleton class representing the player
 */
declare const Player: {
    new (position: srvsdbx_Geometry.Point2D): {
        /**
         * A `Map` whose values are shake intensities and whose keys are the intensities' corresponding sources
         */
        readonly "__#17@#shakeIntensities": ReducibleMap<string, number, number>;
        /**
         * Returns the largest shake intensity out of the ones registered. For repeated use, assign this value to a variable to avoid repeatedly running the getter
         */
        readonly shakeIntensity: number;
        /**
         * Adds a source of screen shake to the player. Sources farther than 40 surviv units have no effect
         * @param source The name of the source this shake is originating from
         * @param strength The shake's strength
         * @param origin The point from which the shake originates
         */
        addShake(source: string, strength: number, origin: srvsdbx_Geometry.Point2D): void;
        /**
         * Removes a source of screen shake from this player
         * @param source The name of the source to remove
         */
        removeShake(source: string): void;
        /**
         * Determines the final shake intensity given an initial strength and the shake's distance from the player
         * @param origin The point from which the shake originates
         * @param strength The strength of the shake
         */
        "__#17@#determineShakeIntensity"(origin: {
            x: number;
            y: number;
        }, strength: number): number;
        /**
         * Identical to the method it overrides, but clears `Player`-specific fields
         */
        destroy(): void;
        /**
         * This player's inventory object
         */
        readonly "__#16@#inventory": Inventory;
        /**
         * This player's inventory object
         */
        readonly inventory: Inventory;
        /**
         * The index of the last active item
         */
        "__#16@#previousActiveIndex": number;
        /**
         * The index of the last active item
         */
        readonly previousActiveIndex: number;
        /**
         * The index of the active item
         */
        "__#16@#activeItemIndex": number;
        /**
         * Returns the index of the active item
         */
        readonly activeItemIndex: number;
        /**
         * The item currently in use by the PlayerLike
         */
        readonly activeItem: (InventoryItem<InventoryItemPrototype> & EquipableItem<ItemAnimation, "idle" | "using">) | undefined;
        /**
         * Holds information about the current state of this player
         */
        readonly "__#16@#state": {
            /**
             * Whether or not this player is currently attempting to attack
             */
            attacking: boolean;
            /**
             * The amount of time a user will have to wait before using their item, taking free switches into account
             */
            effectiveSwitchDelay: number;
            /**
             * Whether or not this player is currently firing their weapon
             */
            firing: boolean;
            /**
             * The timestamp of the last time the user swapped items
             */
            lastSwitch: number;
            /**
             * The timestamp of the last "free" switch the user has performed
             *
             * A "free switch" is defined as an item switch that bypasses an item's usual switch delay: "quickswitching"
             */
            lastFreeSwitch: number;
            /**
             * Whether firing speed penalties should apply
             */
            noSlow: boolean;
            /**
             * Whether or not this player is currently reloading their weapon
             */
            reloading: false | number;
        };
        readonly state: {
            /**
             * Whether or not this player is currently attempting to attack
             */
            attacking: boolean;
            /**
             * The amount of time a user will have to wait before using their item, taking free switches into account
             */
            effectiveSwitchDelay: number;
            /**
             * Whether or not this player is currently firing their weapon
             */
            firing: boolean;
            /**
             * The timestamp of the last time the user swapped items
             */
            lastSwitch: number;
            /**
             * The timestamp of the last "free" switch the user has performed
             *
             * A "free switch" is defined as an item switch that bypasses an item's usual switch delay: "quickswitching"
             */
            lastFreeSwitch: number;
            /**
             * Whether firing speed penalties should apply
             */
            noSlow: boolean;
            /**
             * Whether or not this player is currently reloading their weapon
             */
            reloading: false | number;
        };
        /**
         * The maximum amount of health this player may have
         */
        "__#16@#maxHealth": number;
        /**
         * The maximum amount of health this player may have
         *
         * `get`: Returns the player's maximum health
         *
         * `set`: Sets the player's maximum health, except if the value is `NaN` (the setter serves to prevent accidentally corrupting the health with a `NaN`)
         */
        maxHealth: number;
        /**
         * The player's current health
         */
        "__#16@#health": number;
        /**
         * The player's current health
         *
         * `get`: Returns the player's current health
         *
         * `set`: Sets the player's current health, except if the value is `NaN` (the setter serves to prevent accidentally corrupting the health with a `NaN`)
         */
        readonly health: number;
        /**
         * Stores any timers on this player. Timers are used to delay actions, like reloads.
         *
         * **When assigning these timers, take care to clear any timer that might be stored there!**
         */
        readonly "__#16@#timers": {
            /**
             * The timer responsible for firing the user's current weapon
             */
            firing: false | number;
            /**
             * The timer responsible for replenishing the user's ammo after some delay
             */
            reload: false | number;
        };
        readonly timers: {
            /**
             * The timer responsible for firing the user's current weapon
             */
            firing: false | number;
            /**
             * The timer responsible for replenishing the user's ammo after some delay
             */
            reload: false | number;
        };
        /**
         * Information about this player's hand positions
         */
        readonly "__#16@#hands": {
            /**
             * Information about the player's left hand
             */
            leftHand: {
                /**
                 * How far along the axis parallel to the player's view line this hand is
                 */
                parr: number;
                /**
                 * How far along the axis perpendicular to the player's view line this hand is
                 */
                perp: number;
            };
            /**
             * Information about the player's right hand
             */
            rightHand: {
                /**
                 * How far along the axis parallel to the player's view line this hand is
                 */
                parr: number;
                /**
                 * How far along the axis perpendicular to the player's view line this hand is
                 */
                perp: number;
            };
        };
        readonly hands: {
            /**
             * Information about the player's left hand
             */
            leftHand: {
                /**
                 * How far along the axis parallel to the player's view line this hand is
                 */
                parr: number;
                /**
                 * How far along the axis perpendicular to the player's view line this hand is
                 */
                perp: number;
            };
            /**
             * Information about the player's right hand
             */
            rightHand: {
                /**
                 * How far along the axis parallel to the player's view line this hand is
                 */
                parr: number;
                /**
                 * How far along the axis perpendicular to the player's view line this hand is
                 */
                perp: number;
            };
        };
        /**
         * Information about the speed players travel at
         */
        readonly "__#16@#speed": {
            default: number;
        };
        /**
         * Information about the speed players travel at
         */
        readonly speed: {
            default: number;
        };
        /**
         * The point in the game world this player is aiming at
         */
        "__#16@#aimPoint": srvsdbx_Geometry.Point2D;
        /**
         * The point in the game world this player is aiming at
         */
        readonly aimPoint: srvsdbx_Geometry.Point2D;
        /**
         * A rough measure of this player's "scope" level
         *
         * Passed directly as the z position of p5's camera
         */
        "__#16@#view": number;
        /**
         * A rough measure of this player's "scope" level
         *
         * Passed directly as the z position of p5's camera
         */
        readonly view: number;
        /**
         * A collections of `Map`s whose role is to modify the intensity of actions
         * performed by this player, such as dealing damage, speed, etc
         */
        "__#16@#modifiers": {
            /**
             * A `Map` whose values will modify outgoing damage by multiplying it and whose keys are their respectives sources
            */
            readonly damage: ReducibleMap<string, number, number>;
            /**
              * A `Map` whose values will modify incoming damage by multiplying it and whose keys are their respectives sources
             */
            readonly protection: ReducibleMap<string, number, number>;
            /**
             * A `Map` whose values are speed multipliers and whose keys are their respectives sources
             *
             * Note that additive modifiers have precedence over multiplicative ones; the formula
             * for the final speed is therefore `(s + a) * m`, where `s` is the base speed, `m` is
             * the product of all the multiplicative speed modifiers and `a` is the sum of all the
             * additive modifiers
             */
            readonly speedMult: ReducibleMap<string, number, number>;
            /**
             * A `Map` whose values are speed additions and whose keys are their respectives sources
             *
             * Note that additive modifiers have precedence over multiplicative ones; the formula
             * for the final speed is therefore `(s + a) * m`, where `s` is the base speed, `m` is
             * the product of all the multiplicative speed modifiers and `a` is the sum of all the
             * additive modifiers
             */
            readonly speedAdd: ReducibleMap<string, number, number>;
            /**
             * A `Map` whose values will modify reload time and fire rate by multiplying it and whose keys are their respectives sources
             */
            readonly ergonomics: ReducibleMap<string, number, number>;
        };
        /**
         * A collections of `Map`s whose role is to modify the intensity of actions
         * performed by this player, such as dealing damage, speed, etc
         */
        readonly modifiers: {
            /**
             * A `Map` whose values will modify outgoing damage by multiplying it and whose keys are their respectives sources
            */
            readonly damage: ReducibleMap<string, number, number>;
            /**
              * A `Map` whose values will modify incoming damage by multiplying it and whose keys are their respectives sources
             */
            readonly protection: ReducibleMap<string, number, number>;
            /**
             * A `Map` whose values are speed multipliers and whose keys are their respectives sources
             *
             * Note that additive modifiers have precedence over multiplicative ones; the formula
             * for the final speed is therefore `(s + a) * m`, where `s` is the base speed, `m` is
             * the product of all the multiplicative speed modifiers and `a` is the sum of all the
             * additive modifiers
             */
            readonly speedMult: ReducibleMap<string, number, number>;
            /**
             * A `Map` whose values are speed additions and whose keys are their respectives sources
             *
             * Note that additive modifiers have precedence over multiplicative ones; the formula
             * for the final speed is therefore `(s + a) * m`, where `s` is the base speed, `m` is
             * the product of all the multiplicative speed modifiers and `a` is the sum of all the
             * additive modifiers
             */
            readonly speedAdd: ReducibleMap<string, number, number>;
            /**
             * A `Map` whose values will modify reload time and fire rate by multiplying it and whose keys are their respectives sources
             */
            readonly ergonomics: ReducibleMap<string, number, number>;
        };
        /**
         * A `Set` of status effects currently affecting this player
         *
         * **Implementation note:** Calling this object's `.clear` method will call each status effect's
         * `.destroy` method before clearing the set
         */
        readonly "__#16@#statusEffects": Set<StatusEffect<{}>>;
        /**
         * A `Set` of status effects currently affecting this player
         */
        readonly statusEffects: Set<StatusEffect<{}>>;
        /**
         * The radius of this player
         */
        "__#16@#radius": number;
        /**
         * The radius of this player
         *
         * - `get`: Returns this player's radius
         * - `set`: Sets this player's radius if it is not `NaN`
         */
        radius: number;
        /**
         * Determines if this player can currently use their active item
         *
         * A player can use their active item if:
         * - There is an active item
         * - It is equippable
         * - The elapsed time since its last use is greater than the item's use delay
         * @returns Whether or not the item can be used
         */
        canAttack(): boolean;
        /**
         * Inverses the weapon slots, putting the first weapon in the second and vice versa
         */
        swapWeapons(): void;
        /**
         * Sets the player's active item by referring to the at which it's contained
         * @param slotId The slot in the inventory to switch to
         */
        setActiveItemIndex(slotId: number): void;
        /**
         * Identical to the method it overrides, save for the fact that it pays special consideration to the velocities corresponding to keyboard inputs
         * These correspond to the following keys in the `velocityMap`: `forwards`, `strafeL`, `backwards`, `strafeR`. The addition of the velocities is a vector,
         * whose magnitude is set to a certain amount corresponding to the player's speed.
         *
         * Other velocities are treated normally.
         */
        compileVelocities(): srvsdbx_Geometry.Vector3D;
        /**
         * Uses this player's state to determine the speed at which they should move
         * @returns This player's speed, in surviv units per second
         */
        determineMoveSpeed(): number;
        /**
         * Makes the player face the user's mouse cursor, setting its aim point to that of the mouse cursor's (after adjustment)
         */
        lookAtMouse(p5: import("p5")): void;
        /**
         * Makes the player look at a specified point
         * @param pt The point to look at
         */
        lookAtPoint(pt: srvsdbx_Geometry.Point2D): void;
        /**
         * Applies the specified amount of damage to a player
         * @param amount The amount of damage to deal. Negative numbers heal
         */
        applyDamage(amount: number, source?: PlayerLike): srvsdbx_ErrorHandling.Result<undefined, string>;
        /**
         * Heals the players by the specified amount
         * @param amount The amount of health to heal by. Negative numbers harm
        */
        applyHealing(amount: number, source?: PlayerLike): srvsdbx_ErrorHandling.Result<undefined, string>;
        /**
         * Directly set the player's health
         * @param amount The amount to set the player's health at
         */
        setHealth(amount: number): srvsdbx_ErrorHandling.Result<undefined, string>;
        "__#3@#body": Matter.Body;
        body: Matter.Body;
        collidable: boolean;
        readonly "__#3@#velocityMap": ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
        readonly velocityMap: ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
        readonly "__#3@#angularVelocityMap": ReducibleMap<string, number, number>;
        readonly angularVelocityMap: ReducibleMap<string, number, number>;
        "__#3@#angle": number;
        angle: number;
        "__#3@#layer": number;
        layer: number;
        readonly position: srvsdbx_Geometry.Point3D; /**
         * The maximum amount of health this player may have
         *
         * `get`: Returns the player's maximum health
         *
         * `set`: Sets the player's maximum health, except if the value is `NaN` (the setter serves to prevent accidentally corrupting the health with a `NaN`)
         */
        fillColor: string;
        strokeColor: string;
        readonly "__#3@#draw": (p5: import("p5")) => void;
        readonly "__#3@#events": SandboxEventTarget<{
            collision: {
                event: CollisionEvent;
                args: [Generic];
            };
            /**
             * This player's death
             */
            death: {
                /**
                 * The `Event` instance
                 */
                event: Event;
                /**
                 * The `PlayerLike` that killed this instance, if applicable
                 */
                args: [PlayerLike | undefined];
            };
            /**
             * This player's killing of another
             */
            kill: {
                /**
                 * The `Event` instance
                 */
                event: Event;
                /**
                 * The `PlayerLike` that was killed
                 */
                args: [PlayerLike];
            };
        }>;
        readonly events: SandboxEventTarget<{
            collision: {
                event: CollisionEvent;
                args: [Generic];
            };
            /**
             * This player's death
             */
            death: {
                /**
                 * The `Event` instance
                 */
                event: Event;
                /**
                 * The `PlayerLike` that killed this instance, if applicable
                 */
                args: [PlayerLike | undefined];
            };
            /**
             * This player's killing of another
             */
            kill: {
                /**
                 * The `Event` instance
                 */
                event: Event;
                /**
                 * The `PlayerLike` that was killed
                 */
                args: [PlayerLike];
            };
        }>;
        "__#3@#destroyed": boolean;
        readonly destroyed: boolean;
        readonly "__#3@#id": bigint;
        readonly id: bigint; /**
         * The timer responsible for firing the user's current weapon
         */
        "__#3@#parent": srvsdbx_ErrorHandling.Maybe<Generic<BaseGenericEvents>>;
        readonly parent: srvsdbx_ErrorHandling.Maybe<Generic<BaseGenericEvents>>;
        "__#3@#followOffset": {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        };
        readonly followOffset: {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        };
        readonly "__#3@#followers": Map<bigint, Generic<BaseGenericEvents>>;
        readonly followers: Map<bigint, Generic<BaseGenericEvents>>;
        update(): void;
        setPosition(position: srvsdbx_Geometry.Point2D): void;
        "__#3@#updateFollowers"(): void;
        draw(p5: import("p5")): void;
        compileAngularVelocities(): number;
        follow(obj: Generic<BaseGenericEvents>, offset?: {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        } | undefined): void;
        unfollow(): void;
    };
    drawPolygon(this: Generic<BaseGenericEvents>, p5: import("p5")): void;
    drawCircle(this: Generic<BaseGenericEvents>, p5: import("p5")): void;
};
type Player = InstanceType<typeof Player>;
/**
 * Represents a player's inventory
 */
declare class Inventory implements Destroyable {
    #private;
    /**
     * A reference to the PlayerLike that owns this inventory
     */
    get owner(): PlayerLike;
    /**
     * A map whose keys are the slot names and whose values are the items stocked there
     */
    get items(): Map<string, InventoryItem<InventoryItemPrototype> | (InventoryItem<InventoryItemPrototype> & EquipableItem<ItemAnimation, "idle" | "using">)>;
    /**
     * Whether or not an object has been destroyed
     */
    get destroyed(): boolean;
    /**
     * `* It's a constructor. It constructs.`
     * @param owner The owner of this inventory
     */
    constructor(owner: PlayerLike);
    /**
     * Fetches an item in a given slot corresponding to some category
     * @param slot The slot number
     * @param category The category this item belongs to. (ex: `Main` for firearms, `Medical` for consumables, `Ammo` for ammunition)
     * @template T The category type. `Main` returns `EquipableItem`s, while others just return `InventoryItem`s
     * @template U The type of animations this item has, if applicable
     * @returns The item at the specified location, if it exists
     */
    getItem<T extends "Main" | string, U extends ItemAnimation = ItemAnimation>(slot: number, category: T): InventoryItem & (T extends "Main" ? (EquipableItem<U>) : {}) | undefined;
    /**
     * Checks to see if an item exists in a slot
     * @param slot The slot number
     * @param category The category this item belongs to. (ex: `Main` for firearms, `Medical` for consumables, `Ammo` for ammunition)
     * @returns Whether or not there exists an item there
     */
    hasItem(slot: number, category: string): boolean;
    /**
     * Sets an item in a given slot corresponding to some category
     * @param slot The slot number
     * @param category The category this item belongs to. (ex: `Main` for firearms, `Medical` for consumables, `Ammo` for ammunition)
     * @param item The item to store at that slot
     * @param reset Whether or not to reset the item that was just passed in
     * @template T The category type. `Main` returns `EquipableItem`s, while others just return `InventoryItem`s
     * @template U The type of animations this item has, if applicable
     */
    setItem<T extends "Main" | string, U extends ItemAnimation = ItemAnimation>(slot: number, category: T, item: InventoryItem & (T extends "Main" ? (EquipableItem<U, string>) : {}), reset?: boolean): void;
    /**
     * Clears object attributes from this instance
     *
     * **Warning: Any and all items that are in this inventory when this method is called
     * will also be destroyed. If this is undesirable, drop them into the game world beforehand**
     */
    destroy(): void;
}
/**
 * A simplified representation of an item in a player's inventory
 */
interface SimpleInventoryItem extends SimpleImport {
    /**
     * Information about the images associated with this item
     */
    readonly images: {
        /**
         * The path of the image used for this item's display in the inventory and as a dropped item
         */
        readonly loot: string;
        /**
         * The path of the image used for this item's in-world rendition
         */
        readonly world?: string;
    };
    /**
     * By how much this item slows down its user, all in surviv units / second
     */
    readonly moveSpeedPenalties: {
        /**
         * The movement penalty incurred when this item is in a player's inventory
         */
        readonly passive: number;
        /**
         * The movement penalty incurred when this item is active
         */
        readonly active: number;
        /**
         * The movement penalty incurred when this item is firing
         */
        readonly using: number;
    };
}
/**
 * All items of the same type—all bandages, all M4's, all smoke grenades—have things in common, like loot image.
 *
 * This class is a template for in-world items to base themselves off of.
 */
declare class InventoryItemPrototype extends ImportedObject {
    #private;
    /**
     * References to this item's associated images
     */
    get images(): {
        /**
         * The image used to represent this item in the inventory, or as a dropped item
         */
        readonly loot: srvsdbx_AssetManagement.ImageSrcPair;
        /**
         * The image used to represent this item in the game worlf
         */
        readonly world?: srvsdbx_AssetManagement.ImageSrcPair | undefined;
    };
    /**
     * Information about the movement speed penalties incurred by the use of this item
     */
    get moveSpeedPenalties(): {
        /**
         * The movement penalty incurred when this item is in a player's inventory
         */
        readonly passive: number;
    };
    /**
     * `* It's a constructor. It constructs.`
     * @param name The name of the item
     * @param displayName Optionally specify a prettier name for this object
     * @param objectType The type of object this is
     * @param targetVersion The version of the sandbox this object targets
     * @param namespace The namespace this object belongs to
     * @param includePath The path this object was imported this
     * @param images Images associated with this item
     * @param moveSpeedPenalties Movement penalties associated with this item
     */
    constructor(name: typeof ImportedObject.prototype.name, displayName: typeof ImportedObject.prototype.displayName, objectType: typeof ImportedObject.prototype.objectType, targetVersion: typeof ImportedObject.prototype.targetVersion, namespace: typeof ImportedObject.prototype.namespace, includePath: typeof ImportedObject.prototype.includePath, images: typeof InventoryItemPrototype.prototype.images, moveSpeedPenalties: typeof InventoryItemPrototype.prototype.moveSpeedPenalties);
}
/**
 * A simplified representation of an item that can be equipped by the user
 */
interface SimpleEquipableItem extends SimpleInventoryItem {
    /**
     * The minimum amount of time that the user must wait before two uses of an item
     */
    readonly useDelay: number;
    /**
     * Specify default positions for the user's hands when holding this weapon when no animations are playing
     */
    readonly handPositions?: HandPositions;
}
/**
 * Represents the positions of a player's hands
 */
type HandPositions = {
    /**
     * Information about the left hand
     */
    readonly leftHand?: {
        /**
         * The hand's offset in surviv units along the axis parallel to the player's aim line
         */
        readonly parr: number;
        /**
         * The hand's offset in surviv units along the axis perpendicular to the player's aim line
         */
        readonly perp: number;
        /**
         * What layer to render this hand on
         * The right hand will be rendered above the left one if they are on the same layer
         *
         * - `0`: The default, renders the hand below the item
         * - `1`: Renders the hand above the item
         */
        readonly layer?: 0 | 1;
    };
    /**
     * Information about the right hand
     */
    readonly rightHand?: {
        /**
         * The hand's offset in surviv units along the axis parallel to the player's aim line
         */
        readonly parr: number;
        /**
         * The hand's offset in surviv units along the axis perpendicular to the player's aim line
         */
        readonly perp: number;
        /**
         * What layer to render this hand on
         * The right hand will be rendered above the left one if they are on the same layer
         *
         * - `0`: The default, renders the hand below the item
         * - `1`: Renders the hand above the item
         */
        readonly layer?: 0 | 1;
    };
};
/**
 * Represents the data for animating an object
 */
type ItemAnimation = {
    /**
     * Data about the player's hands
     */
    readonly hands?: HandPositions;
    /**
     * Data about the item's world image
     */
    readonly item?: {
        /**
         * The image's dimensions
         */
        readonly dimensions?: {
            /**
             * The image's width in surviv units
             */
            readonly width?: number;
            /**
             * The image's height in surviv units
             */
            readonly height?: number;
        };
        /**
         * At what offset to draw this image, with (0, 0) being the player's center
         */
        readonly offset?: {
            /**
             * The offset in surviv units to apply along the axis parallel to the player's aim line
             */
            readonly parr?: number;
            /**
             * The offset in surviv units to apply along the axis perpendicular to the player's aim line
             */
            readonly perp?: number;
            /**
             * The angular offset to apply to the item
             */
            readonly angle?: number;
        };
    };
};
/**
 * Represents an item that can be equipped by the user, such as guns, melees and grenades
 * @template T The type of animation this item has
 * @template K The names of the animations this item has
 */
interface EquipableItem<T extends ItemAnimation = ItemAnimation, K extends string = "idle" | "using"> {
    /**
     * An object to manage this item's animations
     */
    readonly animationManager: srvsdbx_Animation.AnimationManager<T, K>;
    /**
     * A timestamp indicating the last time this item was used
     */
    readonly lastUse: number;
    /**
     * Resets this object to its default state
     */
    reset(): void;
    /**
     * A method that will be called when this item's owner uses this item with primary fire (usually left mouse)
     */
    usePrimary(): void;
    /**
     * Calculates this item's dimensions and offsets, taking into account any animations currently active
     */
    getItemReference(): ItemAnimation["item"];
    /**
     * Calculates this item's hand rigging, taking into account any animations currently active
     */
    getHandReference(): ItemAnimation["hands"];
    /**
     * Serves to stop any animation related to this item that are currently playing
     */
    stopAnimations(): void;
    /**
     * Whether this item's animations have been cancelled for some reason
     */
    readonly cancelledAnimation: boolean;
}
/**
 * Represents an instance of an item in a user's inventory
 */
declare class InventoryItem<T extends InventoryItemPrototype = InventoryItemPrototype> implements Destroyable {
    #private;
    /**
     * A reference to the PlayerLike that owns this item
     */
    get owner(): PlayerLike;
    /**
     * A reference to the prototype this item is based on
     */
    get prototype(): T;
    /**
     * Whether or not this item has been destroyed
     */
    get destroyed(): boolean;
    /**
     * `* It's a constructor. It constructs.`
     * @param owner The owner of this item
     */
    constructor(owner: PlayerLike, prototype: T);
    /**
     * Destroys this item, clearing its references to other objects
     */
    destroy(): void;
}
