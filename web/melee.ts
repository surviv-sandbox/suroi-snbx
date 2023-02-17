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
        parr: number,
        /**
         * The hand's offset in surviv units along the axis perpendicular to the player's aim line
         */
        perp: number;
    },
    /**
     * Information about the right hand
     */
    rightHand?: {
        /**
         * The hand's offset in surviv units along the axis parallel to the player's aim line
         */
        parr: number,
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
    readonly autoAttack: boolean,
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
        readonly damage: number,
        /**
         * The time to wait after the initial swing before testing for a hit
         */
        readonly time: number,
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
                readonly parr: number,
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
    }[],
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
    readonly obstacleMult: number,
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
            readonly width: Dimension,
            /**
             * The image's height in surviv units
             */
            readonly height: Dimension,
            /**
             * The layer to draw this weapon on
             *
             * - 0 is the default and situates the item below both hands and body
             * - 1 places the item is below the hands but above the body
             * - 2 places the item above both hands and body
             */
            readonly layer?: 0 | 1 | 2;
        },
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
            readonly width: Dimension | "match",
            /**
             * The rectangle's height, in surviv units
             *
             * If `match` is specified, the holstered image's corresponding dimension is used
             */
            readonly height: Dimension | "match",
            /**
             * The offset along the axis parallel to the player's aim line
             */
            readonly offsetParr: number;
            /**
             * The offset along the axis perpendicular to the player's aim line
             */
            readonly offsetPerp: number;
        },
        /**
         * At what offset to draw this image, with (0, 0) being the player's center
         */
        readonly offset: {
            /**
             * The offset in surviv units to apply along the axis parallel to the player's aim line
             */
            readonly parr: number,
            /**
             * The offset in surviv units to apply along the axis perpendicular to the player's aim line
             */
            readonly perp: number,
            /**
             * The angular offset to apply
             */
            readonly angle: number;
        };
    },
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
            readonly height: Dimension,
            /**
             * On what layer to draw this image
             */
            readonly layer?: 0 | 1 | 2;
        },
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
            readonly width: Dimension | "match",
            /**
             * The rectangle's height, in surviv units
             *
             * If `match` is specified, the holstered image's corresponding dimension is used
             */
            readonly height: Dimension | "match",
            /**
             * The offset along the axis parallel to the holstered image's orientation, *relative to the holstered image's position*
             */
            readonly offsetParr: number;
            /**
             * The offset along the axis perpendicular to the holstered image's orientation, *relative to the holstered image's position*
             */
            readonly offsetPerp: number;
        },
        /**
         * At what offset to draw this image, with (0, 0) being the player's center
         */
        readonly offset?: {
            /**
             * The offset in surviv units to apply along the axis parallel to the player's aim line
             */
            readonly parr: number,
            /**
             * The offset in surviv units to apply along the axis perpendicular to the player's aim line
             */
            readonly perp: number,
            /**
             * The angular offset to apply
             */
            readonly angle: number;
        };
    },
    /**
     * A set of `Animation`s for this melee weapon to use
     */
    readonly animations: {
        /**
         * An animation to be played when this weapon is active and not being used
         */
        readonly idle: MayBeFunctionWrapped<srvsdbx_Animation.AnimationSkeleton<ItemAnimation> | "none">,
        /**
         * An animation to be played when this weapon is being used
         */
        readonly using: MayBeFunctionWrapped<srvsdbx_Animation.AnimationSkeleton<ItemAnimation> | "none">;
    },
    /**
     * An array of additional objects that can be rendered alongside this item
     */
    readonly addons?: {
        /**
         * An array containing paths to the images for this addon
         */
        readonly images: string[],
        /**
         * Optionally specifies whether this addon should be shown
         *
         * Defaults to `true`
         */
        readonly show?: MayBeFunctionWrapped<boolean, [Melee]>,
        /**
         * The color to tint this addon
         */
        readonly tint: MayBeFunctionWrapped<string, [Melee]>,
        /**
         * Specifies this addon's dimensions
         */
        readonly dimensions: {
            /**
             * This addon's width, in surviv units
             */
            readonly width: MayBeFunctionWrapped<Dimension, [Melee]>,
            /**
             * This addon's height, in surviv units
             */
            readonly height: MayBeFunctionWrapped<Dimension, [Melee]>,
            /**
             * The layer at which this addon exists
             *
             * - `-1`: Below the item
             * - `1`: Above the item
             */
            readonly layer: -1 | 1;
        },
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
            readonly parr: MayBeFunctionWrapped<number, [Melee]>,
            /**
             * This addon's position along the axis perpendicular to the player's line of sight
             */
            readonly perp: MayBeFunctionWrapped<number, [Melee]>;
        };
    }[];
};

/**
 * Represents a certain type of melee weapon
 */
class MeleePrototype extends InventoryItemPrototype {
    /**
     * Whether or not this melee is swung as long as the attack input is down—whether the melee "fires automatically"
     */
    #autoAttack: SimpleMelee["autoAttack"];
    /**
     * Whether or not this melee is swung as long as the attack input is down—whether the melee "fires automatically"
     */
    get autoAttack() { return this.#autoAttack; }

    /**
     * The maximum amount of targets this melee weapon can strike per hit
     *
     * This applies every time a damage calculation is done, so a melee weapon
     * that deals damage twice per swing (like the bonesaw) and that has this
     * property set to 3 can hit a total of 6 targets per swing
     */
    #maxTargets: SimpleMelee["maxTargets"];
    /**
     * The maximum amount of targets this melee weapon can strike per hit
     *
     * This applies every time a damage calculation is done, so a melee weapon
     * that deals damage twice per swing (like the bonesaw) and that has this
     * property set to 3 can hit a total of 6 targets per swing
     */
    get maxTargets() { return this.#maxTargets; }

    /**
     * Information about the damage this melee weapon deals and their offsets in time
     *
     * For each entry, the first number indicates the damage dealt and the second indicates
     * the amount of time after the initial swing that should pass before testing for a hit
     */
    #damages: SimpleMelee["damages"];
    /**
     * Information about the damage this melee weapon deals and their offsets in time
     *
     * For each entry, the first number indicates the damage dealt and the second indicates
     * the amount of time after the initial swing that should pass before testing for a hit
     */
    get damages() { return this.#damages; }

    /**
     * Whether or not this melee weapon's bounding box reflects bullets
     */
    #isReflective: boolean;
    /**
     * Whether or not this melee weapon's bounding box reflects bullets
     */
    get isReflective() { return this.#isReflective; }

    /**
     * A number by which this weapon's damage will be multiplied when the damage is applied to an obstacle
     */
    #obstacleMult: SimpleMelee["obstacleMult"];
    /**
     * A number by which this weapon's damage will be multiplied when the damage is applied to an obstacle
     */
    get obstacleMult() { return this.#obstacleMult; }

    /**
     * The minimum amount of time between two consecutive swings
     */
    #useDelay: SimpleMelee["useDelay"];
    /**
     * The minimum amount of time between two consecutive swings
     */
    get useDelay() { return this.#useDelay; }

    /**
     * A set of `Animation`s for this melee weapon to use
     */
    #animations: { [K in keyof SimpleMelee["animations"]]: srvsdbx_Animation.Animation<ItemAnimation> | srvsdbx_Animation.BoundIndeterminateAnimation<ItemAnimation> };
    /**
     * A set of `Animation`s for this melee weapon to use
     */
    get animations() { return this.#animations; }

    /**
     * Information about this weapon's in-world rendition
     */
    #worldObject: Omit<SimpleMelee["worldObject"] & {}, "collider"> & {
        collider?: Omit<(SimpleMelee["worldObject"] & {})["collider"] & {}, "width" | "height"> & { width: number, height: number; };
    } | undefined;
    /**
     * Information about this weapon's in-world rendition
     */
    get worldObject() { return this.#worldObject; }

    /**
     * Information about this weapon's in-world rendition
     */
    #holstered: srvsdbx_AssetManagement.ConvertPathsToImages<
        Required<
            Omit<
                SimpleMelee["holstered"] & {},
                "dimensions" | "collider"
            > & {
                dimensions: { width: number, height: number, layer: 0 | 1 | 2; },
                collider: Omit<(SimpleMelee["holstered"] & {})["collider"] & {}, "width" | "height"> & { width: number, height: number; };
            }
        >
    > | undefined;
    /**
     * Information about this weapon's in-world rendition
     */
    get holstered() { return this.#holstered; }

    /**
     * An array of additional objects that can be rendered alongside this item
     *
     * This one is concerned with those residing below the item
    */
    #addonsBelow?: srvsdbx_AssetManagement.ConvertPathsToImages<SimpleGun["addons"] & {}> & { [key: number]: { dimensions: { layer: -1; }; }; };
    /**
     * An array of additional objects that can be rendered alongside this item
     *
     * This one is concerned with those residing below the item
     */
    get addonsBelow() { return this.#addonsBelow; }

    /**
     * An array of additional objects that can be rendered alongside this item
     *
     * This one is concerned with those residing above the item
     */
    #addonsAbove?: srvsdbx_AssetManagement.ConvertPathsToImages<SimpleGun["addons"] & {}> & { [key: number]: { dimensions: { layer: 1; }; }; };
    /**
     * An array of additional objects that can be rendered alongside this item
    *
    * This one is concerned with those residing above the item
    */
    get addonsAbove() { return this.#addonsAbove; }

    /**
     * An array of additional objects that can be rendered alongside this item
     */
    #addons: srvsdbx_AssetManagement.ConvertPathsToImages<SimpleMelee["addons"] & {}> | undefined;
    /**
     * An array of additional objects that can be rendered alongside this item
     */
    get addons() { return this.#addons; }

    /**
     * Takes a simplified representation of a firearm and converts it into a more rigorous one
     * @param obj The `SimpleMelee` object to parse
     * @returns A new `MeleePrototype`
     */
    static async from(obj: SimpleMelee): Promise<srvsdbx_ErrorHandling.Result<MeleePrototype, unknown[]>> {
        const errors: unknown[] = [],
            pathPrefix = `${obj.includePath}/`,
            lootImage = srvsdbx_ErrorHandling.handleResult(
                await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${pathPrefix}${obj.images.loot}`),
                srvsdbx_ErrorHandling.identity,
                errors.push
            ),

            worldImage = obj.images.world ? srvsdbx_ErrorHandling.handleResult(
                await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${pathPrefix}${obj.images.world}`),
                srvsdbx_ErrorHandling.identity,
                errors.push
            ) : void 0,

            holsteredImage = obj.holstered && !!(obj.holstered.image ?? obj.images.world) ? srvsdbx_ErrorHandling.handleResult(
                await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${pathPrefix}${obj.holstered.image ?? obj.images.world}`),
                srvsdbx_ErrorHandling.identity,
                errors.push
            ) : void 0,

            addonImages = obj.addons ? await (async () => {
                const array: srvsdbx_AssetManagement.ImageSrcPair[][] = [];

                for (const addon of obj.addons!) {
                    array.push(await srvsdbx_AssetManagement.loadImageArray(addon.images, errors, pathPrefix) as srvsdbx_AssetManagement.ImageSrcPair[]);
                }

                return array;
            })() : void 0;

        if (errors.length) return { err: errors };

        const fetchDimensions = cachify((size: { width?: Dimension, height?: Dimension; }) => {
            return srvsdbx_AssetManagement.determineImageDimensions(
                (worldImage as srvsdbx_AssetManagement.ImageSrcPair).asset,
                {
                    width: size.width ?? "auto",
                    height: size.height ?? "auto",
                }
            );
        }, {
            equalityFunction(a, b) {
                return a[0].width === b[0].width
                    && a[0].height === b[0].height;
            }
        });

        const worldObject = obj.worldObject,
            size = gamespace.PLAYER_SIZE;

        function interp(a: ItemAnimation, b: ItemAnimation, t: number) {
            const [handA, handB] = [a.hands, b.hands],

                [leftA, leftB] = [handA?.leftHand, handB?.leftHand],
                [rightA, rightB] = [handA?.rightHand, handB?.rightHand],

                [itemA, itemB] = [a.item, b.item],

                [itemAOffset, itemBOffset] = [itemA?.offset, itemB?.offset],

                [itemADim, itemBDim] = worldImage
                    ? [
                        fetchDimensions(itemA?.dimensions ?? worldObject?.dimensions ?? { width: "auto", height: "auto" }),
                        fetchDimensions(itemB?.dimensions ?? worldObject?.dimensions ?? { width: "auto", height: "auto" })
                    ]
                    : [
                        void 0,
                        void 0
                    ],

                linterp = srvsdbx_Animation.easingFunctions.linterp;

            return {
                hands: {
                    leftHand: {
                        parr: linterp(leftA?.parr ?? leftB?.parr ?? 0.85, leftB?.parr ?? leftA?.parr ?? 0.85, t),
                        perp: linterp(leftA?.perp ?? leftB?.perp ?? 0.75, leftB?.perp ?? leftA?.perp ?? 0.75, t),
                    },
                    rightHand: {
                        parr: linterp(rightA?.parr ?? rightB?.parr ?? 0.85, rightB?.parr ?? rightA?.parr ?? 0.85, t),
                        perp: linterp(rightA?.perp ?? rightB?.perp ?? -0.75, rightB?.perp ?? rightA?.perp ?? -0.75, t),
                    }
                },
                item: worldImage ? {
                    dimensions: {
                        width: size * linterp(
                            itemADim!.width,
                            itemBDim!.width,
                            t
                        ),
                        height: size * linterp(
                            itemADim!.height,
                            itemBDim!.height,
                            t
                        )
                    },
                    offset: {
                        parr: linterp(
                            itemAOffset?.parr ?? itemBOffset?.parr ?? worldObject?.offset.parr ?? 0,
                            itemBOffset?.parr ?? itemAOffset?.parr ?? worldObject?.offset.parr ?? 0,
                            t
                        ),
                        perp: linterp(
                            itemAOffset?.perp ?? itemBOffset?.perp ?? worldObject?.offset.perp ?? 0,
                            itemBOffset?.perp ?? itemAOffset?.perp ?? worldObject?.offset.perp ?? 0,
                            t
                        ),
                        angle: linterp(
                            itemAOffset?.angle ?? itemBOffset?.angle ?? worldObject?.offset.angle ?? 0,
                            itemBOffset?.angle ?? itemAOffset?.angle ?? worldObject?.offset.angle ?? 0,
                            t
                        )
                    }
                } : void 0
            } satisfies ItemAnimation;
        }

        function generateStaticAnim() {
            return srvsdbx_Animation.Animation.createStillFrame({
                hands: {
                    leftHand: {
                        parr: (obj.handPositions?.leftHand.parr ?? 0.85),
                        perp: (obj.handPositions?.leftHand.perp ?? -0.75)
                    },
                    rightHand: {
                        parr: (obj.handPositions?.rightHand.parr ?? 0.85),
                        perp: (obj.handPositions?.rightHand.perp ?? 0.75)
                    }
                },
                item: {
                    dimensions: worldImage ?
                        (() => {
                            const dim = srvsdbx_AssetManagement.determineImageDimensions(
                                (worldImage as srvsdbx_AssetManagement.ImageSrcPair).asset,
                                {
                                    width: worldObject?.dimensions.width ?? "auto",
                                    height: worldObject?.dimensions.height ?? "auto"
                                }
                            );

                            return {
                                width: dim.width * size,
                                height: dim.height * size
                            };
                        })() :
                        void 0,
                    offset: {
                        parr: worldObject?.offset.parr === void 0 ? void 0 : worldObject?.offset.parr,
                        perp: worldObject?.offset.perp === void 0 ? void 0 : worldObject?.offset.perp,
                        angle: worldObject?.offset.angle
                    }
                }
            } satisfies ItemAnimation as ItemAnimation);
        }

        function determineAnimation(animation: MayBeFunctionWrapped<srvsdbx_Animation.AnimationSkeleton<ItemAnimation> | "none">) {
            return animation == "none"
                ? generateStaticAnim()
                : (() => {
                    const resolved = extractValue(animation);

                    return resolved == "none"
                        ? generateStaticAnim()
                        : new srvsdbx_Animation.Animation(resolved, interp);
                }) as srvsdbx_Animation.BoundIndeterminateAnimation<ItemAnimation>;
        }

        const holster = obj.holstered,
            holsterCollider = holster?.collider;

        return {
            res: new MeleePrototype(
                obj.name,
                obj.displayName,
                obj.targetVersion,
                obj.namespace,
                obj.includePath,
                {
                    loot: lootImage as srvsdbx_AssetManagement.ImageSrcPair,
                    world: worldImage as srvsdbx_AssetManagement.ImageSrcPair | undefined
                },
                obj.moveSpeedPenalties,
                obj.isReflective ?? false,
                obj.autoAttack,
                obj.maxTargets,
                obj.damages,
                worldObject,
                holsteredImage ? {
                    image: holsteredImage as srvsdbx_AssetManagement.ImageSrcPair,
                    dimensions: holster?.dimensions ?? worldObject?.dimensions ?? { width: "auto", height: "auto", layer: 0 },
                    offset: holster?.offset ?? worldObject?.offset ?? { parr: 0, perp: 0, angle: 0 },
                    collider: holsterCollider ? {
                        width: holsterCollider?.width ?? holster?.dimensions?.width ?? worldObject?.dimensions.width ?? "match",
                        height: holsterCollider?.height ?? holster?.dimensions?.height ?? worldObject?.dimensions.height ?? "match",
                        offsetParr: holsterCollider?.offsetParr ?? holster?.offset?.parr ?? worldObject?.offset.parr ?? 0,
                        offsetPerp: holsterCollider?.offsetPerp ?? holster?.offset?.perp ?? worldObject?.offset.perp ?? 0,
                    } : void 0
                } : void 0,
                obj.obstacleMult,
                obj.useDelay,
                {
                    idle: determineAnimation(obj.animations.idle),
                    using: determineAnimation(obj.animations.using)
                },
                obj.addons ?
                    obj.addons.map((addon, i) => {
                        return {
                            dimensions: addon.dimensions,
                            position: addon.position,
                            tint: addon.tint,
                            dual: addon.dual,
                            show: addon.show,
                            images: addonImages![i] as srvsdbx_AssetManagement.ImageSrcPair[],
                        };
                    })
                    : void 0
            )
        };
    }

    /**
     * `* It's a constructor. It constructs`
     */
    constructor(
        name: typeof ImportedObject.prototype.name,
        displayName: typeof ImportedObject.prototype.displayName,
        targetVersion: typeof ImportedObject.prototype.targetVersion,
        namespace: typeof ImportedObject.prototype.namespace,
        includePath: typeof ImportedObject.prototype.includePath,
        images: typeof InventoryItemPrototype.prototype.images,
        moveSpeedPenalties: typeof InventoryItemPrototype.prototype.moveSpeedPenalties,
        isReflective: typeof MeleePrototype.prototype.isReflective,
        autoAttack: typeof MeleePrototype.prototype.autoAttack,
        maxTargets: typeof MeleePrototype.prototype.maxTargets,
        damages: typeof MeleePrototype.prototype.damages,
        worldObject: srvsdbx_AssetManagement.ConvertPathsToImages<
            Omit<SimpleMelee["worldObject"] & {}, "collider"> &
            { collider?: (SimpleMelee["worldObject"] & {})["collider"] & {}; }
        > | undefined,
        holstered: srvsdbx_AssetManagement.ConvertPathsToImages<
            Omit<
                Required<SimpleMelee["holstered"] & {}>,
                "collider"
            > & {
                collider?: (SimpleMelee["holstered"] & {})["collider"];
            }
        > | undefined,
        obstacleMult: typeof MeleePrototype.prototype.obstacleMult,
        firingDelay: typeof MeleePrototype.prototype.useDelay,
        animations: typeof MeleePrototype.prototype.animations,
        addons: typeof MeleePrototype.prototype.addons,
    ) {
        super(
            name,
            displayName,
            targetVersion,
            namespace,
            includePath,
            images,
            moveSpeedPenalties
        );

        const size = gamespace.PLAYER_SIZE;

        function autoOrScale(dim: Dimension) {
            return dim == "auto" ? dim : dim * size;
        }

        this.#autoAttack = autoAttack;
        this.#maxTargets = maxTargets;
        this.#damages = damages;
        this.#isReflective = isReflective;
        this.#worldObject = worldObject ? (() => {
            const image = images.world!.asset,
                worldDim = srvsdbx_AssetManagement.determineImageDimensions(image, worldObject.dimensions);

            return {
                tint: worldObject.tint,
                offset: {
                    parr: worldObject.offset.parr,
                    perp: worldObject.offset.perp,
                    angle: worldObject.offset.angle
                },
                dimensions: {
                    width: worldDim.width * size,
                    height: worldDim.height * size,
                    layer: worldObject.dimensions.layer ?? 0
                },
                collider: worldObject.collider ? (() => {
                    const dim = srvsdbx_AssetManagement.determineImageDimensions(
                        image,
                        {
                            width: worldObject.collider.width == "match" ? worldDim.width : worldObject.collider.width,
                            height: worldObject.collider.height == "match" ? worldDim.height : worldObject.collider.height
                        }
                    );

                    return {
                        width: dim.width * size,
                        height: dim.height * size,
                        offsetParr: worldObject.collider.offsetParr,
                        offsetPerp: worldObject.collider.offsetPerp
                    };
                })() : void 0
            };
        })() : void 0;
        this.#obstacleMult = obstacleMult;
        this.#useDelay = firingDelay;
        this.#animations = animations;
        this.#holstered = holstered ? (() => {
            const holsteredDim = srvsdbx_AssetManagement.determineImageDimensions(holstered.image.asset, holstered.dimensions),
                colliderDims = holstered.collider ? srvsdbx_AssetManagement.determineImageDimensions(
                    holstered.image.asset,
                    {
                        width: holstered.collider.width == "match" ? holsteredDim.width : holstered.collider.width,
                        height: holstered.collider.height == "match" ? holsteredDim.height : holstered.collider.height
                    }
                ) : void 0;

            return {
                image: holstered.image,
                dimensions: {
                    width: holsteredDim.width * size,
                    height: holsteredDim.height * size,
                    layer: holstered.dimensions.layer ?? 0
                },
                offset: {
                    parr: holstered.offset.parr,
                    perp: holstered.offset.perp,
                    angle: holstered.offset.angle
                },
                collider: holstered.collider ? {
                    width: colliderDims!.width * size,
                    height: colliderDims!.height * size,
                    offsetParr: holstered.collider.offsetParr,
                    offsetPerp: holstered.collider.offsetPerp,
                } : {
                    width: holsteredDim.width,
                    height: holsteredDim.height,
                    offsetParr: 0,
                    offsetPerp: 0
                }
            };
        })() : void 0;

        this.#addons = addons ?
            addons.map(addon => {
                return {
                    images: addon.images,
                    tint: addon.tint,
                    dual: addon.dual,
                    show: addon.show,
                    dimensions: {
                        width: melee => autoOrScale(extractValue(addon.dimensions.width, melee)),
                        height: melee => autoOrScale(extractValue(addon.dimensions.height, melee)),
                        layer: addon.dimensions.layer
                    },
                    position: {
                        parr: melee => extractValue(addon.position.parr, melee),
                        perp: melee => extractValue(addon.position.perp, melee)
                    }
                };
            })
            : void 0;

        this.#addonsBelow = this.#addons?.filter?.(addon => addon.dimensions.layer == -1) as any;
        this.#addonsAbove = this.#addons?.filter?.(addon => addon.dimensions.layer == 1) as any;
    }
}

/**
 * Represents a specific instance of a melee weapon
 */
class Melee extends InventoryItem<MeleePrototype> implements EquipableItem, Destroyable {
    /**
     * An object to manage this item's animations
     */
    readonly #animationManager: srvsdbx_Animation.AnimationManager<ItemAnimation, keyof MeleePrototype["animations"]>;
    /**
     * An object to manage this item's animations
     */
    get animationManager() { return this.#animationManager; }

    /**
     * The last time this weapon was fired
     */
    #lastUse = 0;
    /**
     * The last time this weapon was fired
     */
    get lastUse() { return this.#lastUse; }

    /**
     * Whether or not this melee's animation has been cancelled
     */
    #cancelledAnimation = false;
    /**
     * Whether or not this melee's animation has been cancelled
     */
    get cancelledAnimation() { return this.#cancelledAnimation; }

    /**
     * `* It's a constructor. It constructs`
     */
    constructor(owner: PlayerLike, prototype: MeleePrototype) {
        super(owner, prototype);

        this.#animationManager = new srvsdbx_Animation.AnimationManager(prototype.animations);
    }

    /**
     * Calculates this melee's bounding box, totally unrelated to its "hitbox" (not that it has one).
     * This is used for reflecting bullets off of reflective melees
     *
     * The returned box only matches the bounding box in dimension; it is neither positioned nor rotated
     * in accordance to its in-game appearance
     */
    getCollider() {
        if (!this.prototype.isReflective) return;

        if (this != this.owner.activeItem && this.prototype.holstered?.collider) {
            return Matter.Bodies.rectangle(
                0,
                0,
                this.prototype.holstered!.collider.width,
                this.prototype.holstered!.collider.height
            );
        } else if (this == this.owner.activeItem && this.prototype.worldObject?.collider) {
            return Matter.Bodies.rectangle(
                0,
                0,
                this.prototype.worldObject.collider.width,
                this.prototype.worldObject.collider.height
            );
        }
    }

    /**
     * Returns this item's current dimensions, taking animations into account
     *
     * **This method will stop expired animations.**
     * More specifically, if an idle animation is running, but the using animation should be used,
     * the idle animation will be terminated
     */
    getItemReference(): ItemAnimation["item"] {
        if (this != this.owner.activeItem && this.prototype.holstered?.collider) {
            return {
                dimensions: {
                    width: this.prototype.holstered.collider.width,
                    height: this.prototype.holstered.collider.height
                },
                offset: {
                    parr: this.prototype.holstered.collider.offsetParr,
                    perp: this.prototype.holstered.collider.offsetPerp,
                }
            };
        }

        const timeSinceLastShot = gamespace.currentUpdate - (this.#lastUse ?? 0);

        if (
            !this.cancelledAnimation &&
            timeSinceLastShot < this.prototype.useDelay
        ) {
            this.animationManager.end("idle");
            return this.animationManager.fetch("using")(timeSinceLastShot, true)?.item;
        } else {
            this.animationManager.end("using");
            return this.animationManager.fetch("idle")(gamespace.currentUpdate - this.owner.state.lastSwitch, true)?.item;
        }
    }

    /**
     * Serves to stop any animation related to this melee that are currently playeing
     */
    stopAnimations() {
        this.#animationManager.endAll();
        this.#cancelledAnimation = true;
    }

    /**
     * A standard method for attacking with a melee weapon. Unless your melee does something radically different, it's best to use this method
     */
    usePrimary() {
        const player = this.owner,
            prototype = this.prototype,
            state = player.state;

        if (
            !state.attacking ||
            gamespace.currentUpdate - state.lastSwitch < state.effectiveSwitchDelay ||
            gamespace.currentUpdate - this.#lastUse < prototype.useDelay
        ) {
            clearTimerIfPresent(player.timers.firing);
            return;
        }

        player.timers.firing = setTimeout(
            function fire(melee: Melee) {
                if (!state.attacking) {
                    clearTimerIfPresent(player.timers.firing);
                    return;
                }

                state.firing = true;
                melee.#lastUse = gamespace.currentUpdate;
                melee.#cancelledAnimation = false;

                for (const { damage, time, areaOfEffect: collision } of prototype.damages) {
                    function dealDamage() {
                        if (player.activeItem != melee) return;

                        const targets = ([...gamespace.objects.players.values()]
                            .map(p => {
                                if (p != player) {
                                    const diff = srvsdbx_Geometry.Vector2D.fromPoint2D(p.position)
                                        .plus({
                                            direction: player.angle + Math.PI / 2,
                                            magnitude: gamespace.PLAYER_SIZE * collision.offset.parr
                                        })
                                        .plus({
                                            direction: player.angle,
                                            magnitude: gamespace.PLAYER_SIZE * collision.offset.perp
                                        })
                                        .minus(player.position, true),
                                        [direction, length] = [diff.direction, diff.length / gamespace.PLAYER_SIZE];

                                    return { player: p, direction, length } as const;
                                }
                            })
                            .filter((ele) => {
                                if (ele === undefined) return;

                                return ele.length <= collision.radius + 1; // Edge detection
                            }) as { player: PlayerLike, direction: number, length: number; }[])
                            .sort(
                                (a, b) => srvsdbx_Geometry.Vector2D.squaredDistBetweenPts(player.position, a.player.position)
                                /*   */ - srvsdbx_Geometry.Vector2D.squaredDistBetweenPts(player.position, b.player.position)
                            );

                        for (let i = 0, limit = Math.min(targets.length, prototype.maxTargets ?? 1); i < limit; i++) {
                            const target = targets[i];

                            new Particle(
                                gamespace.prototypes.particles.get("srvsdbx::blood_splat")!,
                                srvsdbx_Geometry.Vector2D.fromPolarToVec(target.direction, -target.player.radius)
                                    .plus(target.player.position, true),
                                srvsdbx_Math.randomAngle()
                            );

                            target.player.applyDamage(damage);
                        }
                    }

                    if (time) setTimeout(dealDamage, time);
                    else dealDamage();
                }

                state.firing = false;

                if (prototype.autoAttack) {
                    player.timers.firing = setTimeout(
                        () => fire(melee),
                        prototype.useDelay
                    ) as unknown as number;
                }
            },
            0,
            this
        ) as unknown as number;
    }

    /**
     * Resets this object's fields
     */
    reset() {
        this.#lastUse = 0;
    }

    /**
     * Clears this instance's object fields
     */
    destroy() {
        super.destroy();

        // @ts-expect-error
        this.#animationManager = void 0;
    }
}