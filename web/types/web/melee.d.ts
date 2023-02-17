/**
 * Represents the positions of a player's hands
 */
type HandPositions = {
    /**
     * Information about the left hand
     */
    leftHand?: {
        /**
         * The hand's offset in surviv units along the axis parallel to the player's aim line
         */
        parr: number;
        /**
         * The hand's offset in surviv units along the axis perpendicular to the player's aim line
         */
        perp: number;
    };
    /**
     * Information about the right hand
     */
    rightHand?: {
        /**
         * The hand's offset in surviv units along the axis parallel to the player's aim line
         */
        parr: number;
        /**
         * The hand's offset in surviv units along the axis perpendicular to the player's aim line
         */
        perp: number;
    };
};
/**
 * A simplified representation of a melee weapon
 */
interface SimpleMelee extends SimpleEquipableItem {
    /**
     * Whether or not this melee is swung as long as the attack input is down—whether the melee "fires automatically"
     */
    readonly autoAttack: boolean;
    /**
     * Specify default positions for the user's hands when holding this weapon when no animations are playing
     */
    readonly handPositions?: Required<HandPositions>;
    /**
     * Information about the damage this melee weapon deals, their offsets in time and their areas of effect
     */
    readonly damages: {
        /**
         * The base damage of this hit
         */
        readonly damage: number;
        /**
         * The time to wait after the initial swing before testing for a hit
         */
        readonly time: number;
        /**
         * Information about the area in which a target must be in order to have damage dealt to it
         */
        readonly areaOfEffect: {
            /**
             * An offset relative to the player's center that will be applied before testing for collisions.
             */
            readonly offset: {
                /**
                 * The offset to apply in surviv units along to axis parallel to the user's view line
                 */
                readonly parr: number;
                /**
                 * The offset to apply in surviv units along to axis perpendicular to the user's view line
                 */
                readonly perp: number;
            };
            /**
             * The maximum distance between the melee and a target that is still considered a hit
             */
            readonly radius: number;
        };
    }[];
    /**
     * Whether or not this melee weapon's bounding box reflects bullets
     */
    readonly isReflective?: boolean;
    /**
     * The maximum amount of targets this melee weapon can strike per hit
     *
     * This applies every time a damage calculation is done, so a melee weapon
     * that deals damage twice per swing (like the bonesaw) and that has this
     * property set to 3 can hit a total of 6 targets per swing
     */
    readonly maxTargets?: number;
    /**
     * A number by which this weapon's damage will be multiplied when the damage is applied to an obstacle
     */
    readonly obstacleMult: number;
    /**
     * Information about this weapon's in-world rendition when active
     */
    readonly worldObject?: {
        /**
         * A color to tint the image
         */
        readonly tint: string;
        /**
         * The image's dimensions
         */
        readonly dimensions: {
            /**
             * The image's width in surviv units
             */
            readonly width: Dimension;
            /**
             * The image's height in surviv units
             */
            readonly height: Dimension;
            /**
             * The layer to draw this weapon on
             *
             * - 0 is the default and situates the item below both hands and body
             * - 1 places the item is below the hands but above the body
             * - 2 places the item above both hands and body
             */
            readonly layer?: 0 | 1 | 2;
        };
        /**
         * Determine a rectangle that will act as this melee weapon's collider when holstered
         *
         * THe rectangle has the same orientation as the holstered image
         */
        readonly collider?: {
            /**
             * The rectangle's width, in surviv units
             *
             * If `match` is specified, the holstered image's corresponding dimension is used
             */
            readonly width: Dimension | "match";
            /**
             * The rectangle's height, in surviv units
             *
             * If `match` is specified, the holstered image's corresponding dimension is used
             */
            readonly height: Dimension | "match";
            /**
             * The offset along the axis parallel to the player's aim line
             */
            readonly offsetParr: number;
            /**
             * The offset along the axis perpendicular to the player's aim line
             */
            readonly offsetPerp: number;
        };
        /**
         * At what offset to draw this image, with (0, 0) being the player's center
         */
        readonly offset: {
            /**
             * The offset in surviv units to apply along the axis parallel to the player's aim line
             */
            readonly parr: number;
            /**
             * The offset in surviv units to apply along the axis perpendicular to the player's aim line
             */
            readonly perp: number;
            /**
             * The angular offset to apply
             */
            readonly angle: number;
        };
    };
    /**
     * Describes this weapon's appearance when holstered
     */
    readonly holstered?: {
        /**
         * The address of the image to use. If not specified, the world image is used
         */
        readonly image?: string;
        /**
         * The dimensions of the new image. If not specified, the normal dimensions are used
         */
        readonly dimensions?: {
            /**
             * The image's width
             */
            readonly width: Dimension;
            /**
             * The image's height
             */
            readonly height: Dimension;
            /**
             * On what layer to draw this image
             */
            readonly layer?: 0 | 1 | 2;
        };
        /**
         * Determine a rectangle that will act as this melee weapon's collider when holstered
         *
         * THe rectangle has the same orientation as the holstered image
         */
        readonly collider?: {
            /**
             * The rectangle's width, in surviv units
             *
             * If `match` is specified, the holstered image's corresponding dimension is used
             */
            readonly width: Dimension | "match";
            /**
             * The rectangle's height, in surviv units
             *
             * If `match` is specified, the holstered image's corresponding dimension is used
             */
            readonly height: Dimension | "match";
            /**
             * The offset along the axis parallel to the holstered image's orientation, *relative to the holstered image's position*
             */
            readonly offsetParr: number;
            /**
             * The offset along the axis perpendicular to the holstered image's orientation, *relative to the holstered image's position*
             */
            readonly offsetPerp: number;
        };
        /**
         * At what offset to draw this image, with (0, 0) being the player's center
         */
        readonly offset?: {
            /**
             * The offset in surviv units to apply along the axis parallel to the player's aim line
             */
            readonly parr: number;
            /**
             * The offset in surviv units to apply along the axis perpendicular to the player's aim line
             */
            readonly perp: number;
            /**
             * The angular offset to apply
             */
            readonly angle: number;
        };
    };
    /**
     * A set of `Animation`s for this melee weapon to use
     */
    readonly animations: {
        /**
         * An animation to be played when this weapon is active and not being used
         */
        readonly idle: MayBeFunctionWrapped<srvsdbx_Animation.AnimationSkeleton<ItemAnimation> | "none">;
        /**
         * An animation to be played when this weapon is being used
         */
        readonly using: MayBeFunctionWrapped<srvsdbx_Animation.AnimationSkeleton<ItemAnimation> | "none">;
    };
    /**
     * An array of additional objects that can be rendered alongside this item
     */
    readonly addons?: {
        /**
         * An array containing paths to the images for this addon
         */
        readonly images: string[];
        /**
         * Optionally specifies whether this addon should be shown
         *
         * Defaults to `true`
         */
        readonly show?: MayBeFunctionWrapped<boolean, [Melee]>;
        /**
         * The color to tint this addon
         */
        readonly tint: MayBeFunctionWrapped<string, [Melee]>;
        /**
         * Specifies this addon's dimensions
         */
        readonly dimensions: {
            /**
             * This addon's width, in surviv units
             */
            readonly width: MayBeFunctionWrapped<Dimension, [Melee]>;
            /**
             * This addon's height, in surviv units
             */
            readonly height: MayBeFunctionWrapped<Dimension, [Melee]>;
            /**
             * The layer at which this addon exists
             *
             * - `-1`: Below the item
             * - `1`: Above the item
             */
            readonly layer: -1 | 1;
        };
        /**
         * Whether or not this addon should be duplicated if the item is dual-wielded
         *
         * Defaults to `true`
         */
        readonly dual?: boolean;
        /**
         * Specifies this addon's position, using the same coordinate space as everything else
         * (relative to the player's center)
         */
        readonly position: {
            /**
             * This addon's position along the axis parallel to the player's line of sight
             */
            readonly parr: MayBeFunctionWrapped<number, [Melee]>;
            /**
             * This addon's position along the axis perpendicular to the player's line of sight
             */
            readonly perp: MayBeFunctionWrapped<number, [Melee]>;
        };
    }[];
}
/**
 * Represents a certain type of melee weapon
 */
declare class MeleePrototype extends InventoryItemPrototype {
    #private;
    /**
     * Whether or not this melee is swung as long as the attack input is down—whether the melee "fires automatically"
     */
    get autoAttack(): boolean;
    /**
     * The maximum amount of targets this melee weapon can strike per hit
     *
     * This applies every time a damage calculation is done, so a melee weapon
     * that deals damage twice per swing (like the bonesaw) and that has this
     * property set to 3 can hit a total of 6 targets per swing
     */
    get maxTargets(): number | undefined;
    /**
     * Information about the damage this melee weapon deals and their offsets in time
     *
     * For each entry, the first number indicates the damage dealt and the second indicates
     * the amount of time after the initial swing that should pass before testing for a hit
     */
    get damages(): {
        /**
         * The base damage of this hit
         */
        readonly damage: number;
        /**
         * The time to wait after the initial swing before testing for a hit
         */
        readonly time: number;
        /**
         * Information about the area in which a target must be in order to have damage dealt to it
         */
        readonly areaOfEffect: {
            /**
             * An offset relative to the player's center that will be applied before testing for collisions.
             */
            readonly offset: {
                /**
                 * The offset to apply in surviv units along to axis parallel to the user's view line
                 */
                readonly parr: number;
                /**
                 * The offset to apply in surviv units along to axis perpendicular to the user's view line
                 */
                readonly perp: number;
            };
            /**
             * The maximum distance between the melee and a target that is still considered a hit
             */
            readonly radius: number;
        };
    }[];
    /**
     * Whether or not this melee weapon's bounding box reflects bullets
     */
    get isReflective(): boolean;
    /**
     * A number by which this weapon's damage will be multiplied when the damage is applied to an obstacle
     */
    get obstacleMult(): number;
    /**
     * The minimum amount of time between two consecutive swings
     */
    get useDelay(): number;
    /**
     * A set of `Animation`s for this melee weapon to use
     */
    get animations(): {
        readonly idle: srvsdbx_Animation.Animation<ItemAnimation> | srvsdbx_Animation.BoundIndeterminateAnimation<ItemAnimation, srvsdbx_Animation.IndeterminateAnimation<ItemAnimation>>;
        readonly using: srvsdbx_Animation.Animation<ItemAnimation> | srvsdbx_Animation.BoundIndeterminateAnimation<ItemAnimation, srvsdbx_Animation.IndeterminateAnimation<ItemAnimation>>;
    };
    /**
     * Information about this weapon's in-world rendition
     */
    get worldObject(): (Omit<{
        /**
         * A color to tint the image
         */
        readonly tint: string;
        /**
         * The image's dimensions
         */
        readonly dimensions: {
            /**
             * The image's width in surviv units
             */
            readonly width: Dimension;
            /**
             * The image's height in surviv units
             */
            readonly height: Dimension;
            /**
             * The layer to draw this weapon on
             *
             * - 0 is the default and situates the item below both hands and body
             * - 1 places the item is below the hands but above the body
             * - 2 places the item above both hands and body
             */
            readonly layer?: 0 | 2 | 1 | undefined;
        };
        /**
         * Determine a rectangle that will act as this melee weapon's collider when holstered
         *
         * THe rectangle has the same orientation as the holstered image
         */
        readonly collider?: {
            /**
             * The rectangle's width, in surviv units
             *
             * If `match` is specified, the holstered image's corresponding dimension is used
             */
            readonly width: "match" | Dimension;
            /**
             * The rectangle's height, in surviv units
             *
             * If `match` is specified, the holstered image's corresponding dimension is used
             */
            readonly height: "match" | Dimension;
            /**
             * The offset along the axis parallel to the player's aim line
             */
            readonly offsetParr: number;
            /**
             * The offset along the axis perpendicular to the player's aim line
             */
            readonly offsetPerp: number;
        } | undefined;
        /**
         * At what offset to draw this image, with (0, 0) being the player's center
         */
        readonly offset: {
            /**
             * The offset in surviv units to apply along the axis parallel to the player's aim line
             */
            readonly parr: number;
            /**
             * The offset in surviv units to apply along the axis perpendicular to the player's aim line
             */
            readonly perp: number;
            /**
             * The angular offset to apply
             */
            readonly angle: number;
        };
    }, "collider"> & {
        collider?: (Omit<{
            /**
             * The rectangle's width, in surviv units
             *
             * If `match` is specified, the holstered image's corresponding dimension is used
             */
            readonly width: "match" | Dimension;
            /**
             * The rectangle's height, in surviv units
             *
             * If `match` is specified, the holstered image's corresponding dimension is used
             */
            readonly height: "match" | Dimension;
            /**
             * The offset along the axis parallel to the player's aim line
             */
            readonly offsetParr: number;
            /**
             * The offset along the axis perpendicular to the player's aim line
             */
            readonly offsetPerp: number;
        }, "height" | "width"> & {
            width: number;
            height: number;
        }) | undefined;
    }) | undefined;
    /**
     * Information about this weapon's in-world rendition
     */
    get holstered(): srvsdbx_AssetManagement.ConvertPathsToImages<Required<Omit<{
        /**
         * The address of the image to use. If not specified, the world image is used
         */
        readonly image?: string | undefined;
        /**
         * The dimensions of the new image. If not specified, the normal dimensions are used
         */
        readonly dimensions?: {
            /**
             * The image's width
             */
            readonly width: Dimension;
            /**
             * The image's height
             */
            readonly height: Dimension;
            /**
             * On what layer to draw this image
             */
            readonly layer?: 0 | 2 | 1 | undefined;
        } | undefined;
        /**
         * Determine a rectangle that will act as this melee weapon's collider when holstered
         *
         * THe rectangle has the same orientation as the holstered image
         */
        readonly collider?: {
            /**
             * The rectangle's width, in surviv units
             *
             * If `match` is specified, the holstered image's corresponding dimension is used
             */
            readonly width: "match" | Dimension;
            /**
             * The rectangle's height, in surviv units
             *
             * If `match` is specified, the holstered image's corresponding dimension is used
             */
            readonly height: "match" | Dimension;
            /**
             * The offset along the axis parallel to the holstered image's orientation, *relative to the holstered image's position*
             */
            readonly offsetParr: number;
            /**
             * The offset along the axis perpendicular to the holstered image's orientation, *relative to the holstered image's position*
             */
            readonly offsetPerp: number;
        } | undefined;
        /**
         * At what offset to draw this image, with (0, 0) being the player's center
         */
        readonly offset?: {
            /**
             * The offset in surviv units to apply along the axis parallel to the player's aim line
             */
            readonly parr: number;
            /**
             * The offset in surviv units to apply along the axis perpendicular to the player's aim line
             */
            readonly perp: number;
            /**
             * The angular offset to apply
             */
            readonly angle: number;
        } | undefined;
    }, "dimensions" | "collider"> & {
        dimensions: {
            width: number;
            height: number;
            layer: 0 | 2 | 1;
        };
        collider: Omit<{
            /**
             * The rectangle's width, in surviv units
             *
             * If `match` is specified, the holstered image's corresponding dimension is used
             */
            readonly width: "match" | Dimension;
            /**
             * The rectangle's height, in surviv units
             *
             * If `match` is specified, the holstered image's corresponding dimension is used
             */
            readonly height: "match" | Dimension;
            /**
             * The offset along the axis parallel to the holstered image's orientation, *relative to the holstered image's position*
             */
            readonly offsetParr: number;
            /**
             * The offset along the axis perpendicular to the holstered image's orientation, *relative to the holstered image's position*
             */
            readonly offsetPerp: number;
        }, "height" | "width"> & {
            width: number;
            height: number;
        };
    }>> | undefined;
    /**
     * An array of additional objects that can be rendered alongside this item
     *
     * This one is concerned with those residing below the item
     */
    get addonsBelow(): (srvsdbx_AssetManagement.ConvertPathsToImages<{
        readonly images: string[];
        readonly show?: MayBeFunctionWrapped<boolean, [Gun]> | undefined;
        readonly tint: MayBeFunctionWrapped<string, [Gun]>;
        readonly dimensions: {
            readonly width: MayBeFunctionWrapped<Dimension, [Gun]>;
            readonly height: MayBeFunctionWrapped<Dimension, [Gun]>;
            readonly layer: 1 | -1;
        };
        readonly dual?: boolean | undefined;
        readonly recoil?: boolean | undefined;
        readonly position: {
            readonly parr: MayBeFunctionWrapped<number, [Gun]>;
            readonly perp: MayBeFunctionWrapped<number, [Gun]>;
        };
    }>[] & {
        [key: number]: {
            dimensions: {
                layer: -1;
            };
        };
    }) | undefined;
    /**
     * An array of additional objects that can be rendered alongside this item
    *
    * This one is concerned with those residing above the item
    */
    get addonsAbove(): (srvsdbx_AssetManagement.ConvertPathsToImages<{
        readonly images: string[];
        readonly show?: MayBeFunctionWrapped<boolean, [Gun]> | undefined;
        readonly tint: MayBeFunctionWrapped<string, [Gun]>;
        readonly dimensions: {
            readonly width: MayBeFunctionWrapped<Dimension, [Gun]>;
            readonly height: MayBeFunctionWrapped<Dimension, [Gun]>;
            readonly layer: 1 | -1;
        };
        readonly dual?: boolean | undefined;
        readonly recoil?: boolean | undefined;
        readonly position: {
            readonly parr: MayBeFunctionWrapped<number, [Gun]>;
            readonly perp: MayBeFunctionWrapped<number, [Gun]>;
        };
    }>[] & {
        [key: number]: {
            dimensions: {
                layer: 1;
            };
        };
    }) | undefined;
    /**
     * An array of additional objects that can be rendered alongside this item
     */
    get addons(): srvsdbx_AssetManagement.ConvertPathsToImages<{
        /**
         * An array containing paths to the images for this addon
         */
        readonly images: string[];
        /**
         * Optionally specifies whether this addon should be shown
         *
         * Defaults to `true`
         */
        readonly show?: MayBeFunctionWrapped<boolean, [Melee]> | undefined;
        /**
         * The color to tint this addon
         */
        readonly tint: MayBeFunctionWrapped<string, [Melee]>;
        /**
         * Specifies this addon's dimensions
         */
        readonly dimensions: {
            /**
             * This addon's width, in surviv units
             */
            readonly width: MayBeFunctionWrapped<Dimension, [Melee]>;
            /**
             * This addon's height, in surviv units
             */
            readonly height: MayBeFunctionWrapped<Dimension, [Melee]>;
            /**
             * The layer at which this addon exists
             *
             * - `-1`: Below the item
             * - `1`: Above the item
             */
            readonly layer: 1 | -1;
        };
        /**
         * Whether or not this addon should be duplicated if the item is dual-wielded
         *
         * Defaults to `true`
         */
        readonly dual?: boolean | undefined;
        /**
         * Specifies this addon's position, using the same coordinate space as everything else
         * (relative to the player's center)
         */
        readonly position: {
            /**
             * This addon's position along the axis parallel to the player's line of sight
             */
            readonly parr: MayBeFunctionWrapped<number, [Melee]>;
            /**
             * This addon's position along the axis perpendicular to the player's line of sight
             */
            readonly perp: MayBeFunctionWrapped<number, [Melee]>;
        };
    }>[] | undefined;
    /**
     * Takes a simplified representation of a firearm and converts it into a more rigorous one
     * @param obj The `SimpleMelee` object to parse
     * @returns A new `MeleePrototype`
     */
    static from(obj: SimpleMelee): Promise<srvsdbx_ErrorHandling.Result<MeleePrototype, unknown[]>>;
    /**
     * `* It's a constructor. It constructs`
     */
    constructor(name: typeof ImportedObject.prototype.name, displayName: typeof ImportedObject.prototype.displayName, targetVersion: typeof ImportedObject.prototype.targetVersion, namespace: typeof ImportedObject.prototype.namespace, includePath: typeof ImportedObject.prototype.includePath, images: typeof InventoryItemPrototype.prototype.images, moveSpeedPenalties: typeof InventoryItemPrototype.prototype.moveSpeedPenalties, isReflective: typeof MeleePrototype.prototype.isReflective, autoAttack: typeof MeleePrototype.prototype.autoAttack, maxTargets: typeof MeleePrototype.prototype.maxTargets, damages: typeof MeleePrototype.prototype.damages, worldObject: srvsdbx_AssetManagement.ConvertPathsToImages<Omit<SimpleMelee["worldObject"] & {}, "collider"> & {
        collider?: (SimpleMelee["worldObject"] & {})["collider"] & {};
    }> | undefined, holstered: srvsdbx_AssetManagement.ConvertPathsToImages<Omit<Required<SimpleMelee["holstered"] & {}>, "collider"> & {
        collider?: (SimpleMelee["holstered"] & {})["collider"];
    }> | undefined, obstacleMult: typeof MeleePrototype.prototype.obstacleMult, firingDelay: typeof MeleePrototype.prototype.useDelay, animations: typeof MeleePrototype.prototype.animations, addons: typeof MeleePrototype.prototype.addons);
}
/**
 * Represents a specific instance of a melee weapon
 */
declare class Melee extends InventoryItem<MeleePrototype> implements EquipableItem, Destroyable {
    #private;
    /**
     * An object to manage this item's animations
     */
    get animationManager(): srvsdbx_Animation.AnimationManager<ItemAnimation, "idle" | "using">;
    /**
     * The last time this weapon was fired
     */
    get lastUse(): number;
    /**
     * Whether or not this melee's animation has been cancelled
     */
    get cancelledAnimation(): boolean;
    /**
     * `* It's a constructor. It constructs`
     */
    constructor(owner: PlayerLike, prototype: MeleePrototype);
    /**
     * Calculates this melee's bounding box, totally unrelated to its "hitbox" (not that it has one).
     * This is used for reflecting bullets off of reflective melees
     *
     * The returned box only matches the bounding box in dimension; it is neither positioned nor rotated
     * in accordance to its in-game appearance
     */
    getCollider(): Matter.Body | undefined;
    /**
     * Returns this item's current dimensions, taking animations into account
     *
     * **This method will stop expired animations.**
     * More specifically, if an idle animation is running, but the using animation should be used,
     * the idle animation will be terminated
     */
    getItemReference(): ItemAnimation["item"];
    /**
     * Serves to stop any animation related to this melee that are currently playeing
     */
    stopAnimations(): void;
    /**
     * A standard method for attacking with a melee weapon. Unless your melee does something radically different, it's best to use this method
     */
    usePrimary(): void;
    /**
     * Resets this object's fields
     */
    reset(): void;
    /**
     * Clears this instance's object fields
     */
    destroy(): void;
}
