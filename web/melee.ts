/**
 * A simplified representation of a melee weapon
 */
interface SimpleMelee extends SimpleEquipableItem {
    /**
     * Whether or not this melee is swung as long as the attack input is down—whether the melee "fires automatically"
     */
    readonly autoAttack: boolean,
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
             * The maximum distance between the melee and a target that is still considered a hit in surviv units
             */
            readonly radius: number;
        };
    }[],
    /**
     * Whether or not this melee weapon's bounding box reflects bullets
     *
     * `false` if omitted
     */
    readonly isReflective?: boolean;
    /**
     * Whether or not this melee weapon can reflect bullets while attacking with
     * said melee weapon
     *
     * `false` if omitted
     */
    readonly canReflectWhileAttacking?: boolean;
    /**
     * The maximum amount of targets this melee weapon can strike per hit
     *
     * This applies every time a damage calculation is done, so a melee weapon
     * that deals damage twice per swing (like the bonesaw) and that has this
     * property set to 3 can hit a total of 6 targets per swing
     *
     * `1` if omitted
     */
    readonly maxTargets?: number;
    /**
     * A number by which this weapon's damage will be multiplied when the damage is applied to an obstacle
     */
    readonly obstacleMultiplier: number,
    /**
     * Whether or not this melee weapon can damage obstacles marked as "armor-plated"
     */
    readonly armorPiercing: boolean;
    /**
     * Whether or not this melee weapon can damage obstacles marked as "stone-plated"
     */
    readonly stonePiercing: boolean;
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
         * Determine a rectangle or circle that will act as this melee weapon's collider when holstered
         *
         * THe rectangle has the same orientation as the holstered image
         */
        readonly collider?: ({
            /**
             * The circle's radius, in surviv units
             */
            readonly radius: number,
        } | {
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
            readonly height: Dimension | "match";
        }) & {
            /**
             * This collider's offset along the axis parallel to the player's aim line
             *
             * This refers to where the center of the world image will end up
             */
            readonly offsetParr: number;
            /**
             * This collider's offset along the axis perpendicular to the player's aim line
             *
             * This refers to where the center of the world image will end up
             */
            readonly offsetPerp: number;
        },
        /**
         * At what offset to draw this image, with (0, 0) being the player's center
         *
         * This refers to where the center of the world image will end up
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
        /**
         * An animation to be played when a projectile is deflected off this weapon
         */
        readonly deflect?: MayBeFunctionWrapped<srvsdbx_Animation.AnimationSkeleton<ItemAnimation> | "none">;
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
class MeleePrototype extends InventoryItemPrototype implements EquipableItemPrototype {
    /**
     * Specify default positions for the user's hands when holding this weapon when no animations are playing
     */
    readonly #handPositions: SimpleMelee["handPositions"];
    /**
     * Specify default positions for the user's hands when holding this weapon when no animations are playing
     */
    get handPositions() { return this.#handPositions; }

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
    readonly #damages: SimpleMelee["damages"];
    /**
     * Information about the damage this melee weapon deals and their offsets in time
     *
     * For each entry, the first number indicates the damage dealt and the second indicates
     * the amount of time after the initial swing that should pass before testing for a hit
     */
    get damages() { return this.#damages; }

    /**
     * Whether or not this melee weapon can damage obstacles marked as "armor-plated"
     */
    #armorPiercing: boolean;
    /**
     * Whether or not this melee weapon can damage obstacles marked as "armor-plated"
     */
    get armorPiercing() { return this.#armorPiercing; }

    /**
     * Whether or not this melee weapon can damage obstacles marked as "stone-plated"
     */
    #stonePiercing: boolean;
    /**
     * Whether or not this melee weapon can damage obstacles marked as "stone-plated"
     */
    get stonePiercing() { return this.#stonePiercing; }

    /**
     * Whether or not this melee weapon's bounding box reflects bullets
     */
    #isReflective: boolean;
    /**
     * Whether or not this melee weapon's bounding box reflects bullets
     */
    get isReflective() { return this.#isReflective; }

    /**
     * Whether or not this melee weapon's bounding box reflects bullets
     */
    #canReflectWhileAttacking: boolean;
    /**
     * Whether or not this melee weapon's bounding box reflects bullets
     */
    get canReflectWhileAttacking() { return this.#canReflectWhileAttacking; }

    /**
     * A number by which this weapon's damage will be multiplied when the damage is applied to an obstacle
     */
    #obstacleMultiplier: SimpleMelee["obstacleMultiplier"];
    /**
     * A number by which this weapon's damage will be multiplied when the damage is applied to an obstacle
     */
    get obstacleMultiplier() { return this.#obstacleMultiplier; }

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
    readonly #animations: { [K in keyof SimpleMelee["animations"]]-?: srvsdbx_Animation.Animation<ItemAnimation> | srvsdbx_Animation.BoundIndeterminateAnimation<ItemAnimation> };
    /**
     * A set of `Animation`s for this melee weapon to use
     */
    get animations() { return this.#animations; }

    /**
     * Information about this weapon's in-world rendition
     */
    readonly #worldObject: Omit<SimpleMelee["worldObject"] & {}, "collider"> & {
        readonly collider?: Omit<(SimpleMelee["worldObject"] & {})["collider"] & {}, "width" | "height" | "radius"> & (
            {
                readonly radius: number;
            } | {
                readonly width: number,
                readonly height: number;
            }
        );
    } | undefined;
    /**
     * Information about this weapon's in-world rendition
     */
    get worldObject() { return this.#worldObject; }

    /**
     * Information about this weapon's in-world rendition
     */
    readonly #holstered: srvsdbx_AssetManagement.ConvertPathsToImages<
        Required<
            Omit<
                SimpleMelee["holstered"] & {},
                "dimensions" | "collider"
            > & {
                readonly dimensions: {
                    readonly width: number,
                    readonly height: number,
                    readonly layer: 0 | 1 | 2;
                },
                readonly collider: Omit<(SimpleMelee["holstered"] & {})["collider"] & {}, "width" | "height"> & {
                    readonly width: number,
                    readonly height: number;
                };
            }
        >
    > | undefined;
    /**
     * Information about this weapon's in-world rendition
     */
    get holstered() { return this.#holstered; }

    /**
     * Information about the movement speed penalties incurred by the use of this weapon
     */
    override #moveSpeedPenalties: SimpleMelee["moveSpeedPenalties"];
    /**
     * Information about the movement speed penalties incurred by the use of this weapon
     */
    override get moveSpeedPenalties() { return this.#moveSpeedPenalties; }

    /**
     * An array of additional objects that can be rendered alongside this item
     *
     * This one is concerned with those residing below the item
    */
    readonly #addonsBelow?: srvsdbx_AssetManagement.ConvertPathsToImages<SimpleGun["addons"] & {}> & {
        readonly [key: number]: {
            readonly dimensions: {
                readonly layer: -1;
            };
        };
    };
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
    readonly #addonsAbove?: srvsdbx_AssetManagement.ConvertPathsToImages<SimpleGun["addons"] & {}> & {
        readonly [key: number]: {
            readonly dimensions: {
                readonly layer: 1;
            };
        };
    };
    /**
     * An array of additional objects that can be rendered alongside this item
    *
    * This one is concerned with those residing above the item
    */
    get addonsAbove() { return this.#addonsAbove; }

    /**
     * An array of additional objects that can be rendered alongside this item
     */
    readonly #addons: srvsdbx_AssetManagement.ConvertPathsToImages<SimpleMelee["addons"] & {}> | undefined;
    /**
     * An array of additional objects that can be rendered alongside this item
     */
    get addons() { return this.#addons; }

    /**
     * A map that contains images that have been declared by this object, and whose keys
     * are the paths to those images, *as declared in the original object file*.
     *
     * This map's `get` method is guaranteed not to return `undefined`: if an invalid key
     * is used, an error is thrown
     */
    readonly #imageMap;
    /**
     * A map that contains images that have been declared by this object, and whose keys
     * are the paths to those images, *as declared in the original object file*.
     *
     * This map's `get` method is guaranteed not to return `undefined`: if an invalid key
     * is used, an error is thrown
     */
    get imageMap() { return this.#imageMap; }

    /**
     * Takes a simplified representation of a melee and converts it into a more rigorous one
     * @param obj The `SimpleMelee` object to parse
     * @returns A new `MeleePrototype`
     */
    static async from(obj: SimpleMelee): Promise<srvsdbx_ErrorHandling.Result<MeleePrototype, srvsdbx_Errors.SandboxError[]>> {
        const errors: srvsdbx_Errors.SandboxError[] = [],
            imageMap = (() => {
                const map = new Map<string, srvsdbx_AssetManagement.ImageSrcPair>(),
                    nativeGet = map.get.bind(map);

                map.get = (key: string) => {
                    if (!map.has(key))
                        throw new srvsdbx_Errors.UndeclaredImageUsage(`Attempted to use an undeclared image at path '${key}'`);

                    return nativeGet(key);
                };

                return map as Omit<Map<string, srvsdbx_AssetManagement.ImageSrcPair>, "get"> & {
                    /**
                     * Returns the element located at a certain key.
                     *
                     * **If there is no item at the specified key, _an error is thrown!_**
                     * @param key The key to fetch
                     * @returns The item located there. If this method does not throw, this value is
                     * guaranteed not to be `undefined`.
                     * @throws {srvsdbx_Errors.UndeclaredImageUsage} If there is no item at the given key
                     */
                    get(key: string): NonNullable<srvsdbx_AssetManagement.ImageSrcPair>;
                };
            })(),
            pathPrefix = `${obj.includePath}/`,
            lootImage = srvsdbx_ErrorHandling.handleResult(
                await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${pathPrefix}${obj.images.loot}`),
                res => {
                    imageMap.set(res.src, res);
                    return res;
                },
                e => (errors.push(e), void 0)
            ),

            worldImage = obj.images.world ? srvsdbx_ErrorHandling.handleResult(
                await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${pathPrefix}${obj.images.world}`),
                res => {
                    imageMap.set(res.src, res);
                    return res;
                },
                e => (errors.push(e), void 0)
            ) : void 0,

            holsteredImage = obj.holstered && !!(obj.holstered.image ?? obj.images.world) ? srvsdbx_ErrorHandling.handleResult(
                await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${pathPrefix}${obj.holstered.image ?? obj.images.world}`),
                res => {
                    imageMap.set(res.src, res);
                    return res;
                },
                e => (errors.push(e), void 0)
            ) : void 0,

            addonImages = obj.addons ? await (async () => {
                const addonImages: srvsdbx_AssetManagement.ImageSrcPair[][] = [];

                for (const addon of obj.addons!) {
                    addonImages.push(
                        await srvsdbx_AssetManagement.loadImageArray(addon.images, errors, pathPrefix)
                    );
                }

                for (const imageArray of addonImages)
                    for (const image of imageArray)
                        imageMap.set(image.src, image);

                return addonImages;
            })() : void 0;

        for (const image of (await srvsdbx_AssetManagement.loadImageArray(obj.imageDeclaration ?? [], errors, pathPrefix)))
            imageMap.set(image.src, image);

        if (errors.length) return { err: errors };

        const fetchDimensions = cachify(
            (image: srvsdbx_AssetManagement.ImageSrcPair,
                size: {
                    readonly width?: Dimension,
                    readonly height?: Dimension,
                    readonly layer?: 0 | 1 | 2;
                }
            ) => ({
                ...srvsdbx_AssetManagement.determineImageDimensions(
                    image.asset,
                    {
                        width: size.width ?? "auto",
                        height: size.height ?? "auto"
                    }
                ),
                layer: size.layer
            }),
            {
                equalityFunction([srcA, a], [srcB, b]) {
                    return srcA == srcB
                        && a.width === b.width
                        && a.height === b.height
                        && a.layer === b.layer;
                }
            }
        );

        const worldObject = obj.worldObject,
            size = gamespace.PLAYER_SIZE;

        function interp(a: ItemAnimation, b: ItemAnimation, t: number) {
            const [handA, handB] = [a.hands, b.hands],

                [leftA, leftB] = [handA?.leftHand, handB?.leftHand],
                [rightA, rightB] = [handA?.rightHand, handB?.rightHand],

                [itemA, itemB] = [a.item, b.item],

                [itemAOffset, itemBOffset] = [itemA?.offset, itemB?.offset],

                calculatedWorldImage =
                    itemA?.image !== void 0 ? imageMap.get(`${pathPrefix}${itemA.image}`) :
                        itemB?.image !== void 0 ? imageMap.get(`${pathPrefix}${itemB.image}`) :
                            worldImage,

                [itemADim, itemBDim] = worldImage
                    ? [
                        fetchDimensions(
                            calculatedWorldImage!,
                            {
                                width: itemA?.dimensions?.width ?? worldObject?.dimensions.width ?? "auto",
                                height: itemA?.dimensions?.height ?? worldObject?.dimensions.height ?? "auto",
                                layer: itemA?.dimensions?.layer ?? worldObject?.dimensions.layer
                            }
                        ),
                        fetchDimensions(
                            calculatedWorldImage!,
                            {
                                width: itemB?.dimensions?.width ?? worldObject?.dimensions.width ?? "auto",
                                height: itemB?.dimensions?.height ?? worldObject?.dimensions.height ?? "auto",
                                layer: itemB?.dimensions?.layer ?? worldObject?.dimensions.layer
                            }
                        )
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
                        perp: linterp(leftA?.perp ?? leftB?.perp ?? 0.75, leftB?.perp ?? leftA?.perp ?? 0.75, t)
                    },
                    rightHand: {
                        parr: linterp(rightA?.parr ?? rightB?.parr ?? 0.85, rightB?.parr ?? rightA?.parr ?? 0.85, t),
                        perp: linterp(rightA?.perp ?? rightB?.perp ?? -0.75, rightB?.perp ?? rightA?.perp ?? -0.75, t)
                    }
                },
                item: worldImage ? {
                    image: calculatedWorldImage!.src,
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
                        ),
                        layer: itemADim?.layer ?? itemBDim?.layer ?? worldObject?.dimensions.layer ?? 0
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
                        parr: (obj.handPositions?.leftHand?.parr ?? 0.85),
                        perp: (obj.handPositions?.leftHand?.perp ?? -0.75)
                    },
                    rightHand: {
                        parr: (obj.handPositions?.rightHand?.parr ?? 0.85),
                        perp: (obj.handPositions?.rightHand?.perp ?? 0.75)
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
                                height: dim.height * size,
                                layer: worldObject?.dimensions.layer
                            };
                        })() :
                        void 0,
                    offset: {
                        parr: worldObject?.offset.parr,
                        perp: worldObject?.offset.perp,
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
                obj.objectType,
                obj.targetVersion,
                obj.namespace,
                obj.includePath,
                {
                    loot: lootImage as srvsdbx_AssetManagement.ImageSrcPair,
                    world: worldImage as srvsdbx_AssetManagement.ImageSrcPair | undefined
                },
                obj.moveSpeedPenalties,
                obj.handPositions,
                obj.isReflective ?? false,
                obj.canReflectWhileAttacking ?? false,
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
                obj.obstacleMultiplier,
                obj.armorPiercing,
                obj.stonePiercing,
                obj.useDelay,
                {
                    idle: determineAnimation(obj.animations.idle),
                    using: determineAnimation(obj.animations.using),
                    deflect: determineAnimation(obj.animations.deflect ?? "none"),
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
                    : void 0,
                imageMap
            )
        };
    }

    /**
     * `* It's a constructor. It constructs`
     */
    constructor(
        name: ImportedObject["name"],
        displayName: ImportedObject["displayName"],
        objectType: ImportedObject["objectType"],
        targetVersion: ImportedObject["targetVersion"],
        namespace: ImportedObject["namespace"],
        includePath: ImportedObject["includePath"],
        images: InventoryItemPrototype["images"],
        moveSpeedPenalties: MeleePrototype["moveSpeedPenalties"],
        handPositions: MeleePrototype["handPositions"],
        isReflective: MeleePrototype["isReflective"],
        canReflectWhileAttacking: MeleePrototype["canReflectWhileAttacking"],
        autoAttack: MeleePrototype["autoAttack"],
        maxTargets: MeleePrototype["maxTargets"],
        damages: MeleePrototype["damages"],
        worldObject: srvsdbx_AssetManagement.ConvertPathsToImages<
            Omit<SimpleMelee["worldObject"] & {}, "collider"> &
            {
                readonly collider?: (SimpleMelee["worldObject"] & {})["collider"] & {};
            }
        > | undefined,
        holstered: srvsdbx_AssetManagement.ConvertPathsToImages<
            Omit<
                Required<SimpleMelee["holstered"] & {}>,
                "collider"
            > & {
                readonly collider?: (SimpleMelee["holstered"] & {})["collider"];
            }
        > | undefined,
        obstacleMultiplier: MeleePrototype["obstacleMultiplier"],
        armorPiercing: MeleePrototype["armorPiercing"],
        stonePiercing: MeleePrototype["stonePiercing"],
        firingDelay: MeleePrototype["useDelay"],
        animations: MeleePrototype["animations"],
        addons: MeleePrototype["addons"],
        imageMap: Map<string, srvsdbx_AssetManagement.ImageSrcPair>,
    ) {
        super(
            name,
            displayName,
            objectType,
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

        this.#handPositions = handPositions;
        this.#autoAttack = autoAttack;
        this.#maxTargets = maxTargets;
        this.#damages = damages;
        this.#isReflective = isReflective;
        this.#canReflectWhileAttacking = canReflectWhileAttacking;
        this.#moveSpeedPenalties = moveSpeedPenalties;
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
                    const offset = {
                        offsetParr: worldObject.collider.offsetParr,
                        offsetPerp: worldObject.collider.offsetPerp
                    };

                    if ("width" in worldObject.collider) {
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
                            offsetParr: offset.offsetParr,
                            offsetPerp: offset.offsetPerp
                        };
                    }

                    return {
                        radius: worldObject.collider.radius * size,
                        offsetParr: offset.offsetParr,
                        offsetPerp: offset.offsetPerp
                    };
                })() : void 0
            };
        })() : void 0;
        this.#obstacleMultiplier = obstacleMultiplier;
        this.#armorPiercing = armorPiercing;
        this.#stonePiercing = stonePiercing;
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
        this.#imageMap = imageMap;
    }

    /**
     * Creates a new `Melee` object from this prototype
     * @param owner The `PlayerLike` the created weapon belongs to
     * @returns A new weapon with this object as its prototype
     */
    create(
        owner: PlayerLike
    ) {
        return new Melee(
            this,
            owner
        );
    }
}

/**
 * Represents a specific instance of a melee weapon
 */
class Melee
    extends InventoryItem<MeleePrototype>
    implements EquipableItem<ItemAnimation, "idle" | "using" | "deflect">, Destroyable {
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
     * The last time this melee weapon reflected a projectile
     */
    #lastReflect = 0;
    /**
     * The last time this melee weapon reflected a projectile
     *
     * - `get`: Returns the last time this melee weapon reflected a projectile
     * - `set`: Sets the last time this melee weapon reflected a projectile
     */
    get lastReflect() { return this.#lastReflect; }
    set lastReflect(v) {
        this.#lastReflect = v;
        this.#cancelledAnimation = false;
        this.#animationManager.end("deflect");
    }

    /**
     * `* It's a constructor. It constructs`
     */
    constructor(prototype: MeleePrototype, owner: PlayerLike) {
        super(prototype, owner);

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
            return new srvsdbx_Geometry.Rectangle(
                srvsdbx_Geometry.Vector2D.zeroPoint(),
                this.prototype.holstered!.collider.width,
                this.prototype.holstered!.collider.height
            );
        } else if (this == this.owner.activeItem && this.prototype.worldObject?.collider) {
            const collider = this.prototype.worldObject.collider;

            if ("width" in collider)
                return new srvsdbx_Geometry.Rectangle(
                    srvsdbx_Geometry.Vector2D.zeroPoint(),
                    collider.width,
                    collider.height
                );

            return new srvsdbx_Geometry.Circle(
                srvsdbx_Geometry.Vector2D.zeroPoint(),
                collider.radius
            );
        }
    }

    /**
     * Returns this item's current animation
     *
     * **This method will stop expired animations.**
     * More specifically, if an idle animation is running, but the using animation should be used,
     * the idle animation will be terminated
     */
    #getAnimation(): ItemAnimation | undefined {
        if (this != this.owner.activeItem && this.prototype.holstered?.collider)
            return {
                item: {
                    dimensions: {
                        width: this.prototype.holstered.collider.width,
                        height: this.prototype.holstered.collider.height
                    },
                    offset: {
                        parr: this.prototype.holstered.collider.offsetParr,
                        perp: this.prototype.holstered.collider.offsetPerp,
                    }
                },
                hands: {
                    leftHand: {
                        parr: this.prototype.handPositions?.leftHand?.parr ?? 0.75,
                        perp: this.prototype.handPositions?.leftHand?.perp ?? 0.85
                    },
                    rightHand: {
                        parr: this.prototype.handPositions?.rightHand?.parr ?? 0.75,
                        perp: this.prototype.handPositions?.rightHand?.perp ?? 0.85
                    }
                }
            };

        const timeSinceLastShot = gamespace.currentUpdate - (this.#lastUse ?? 0),
            timeSinceLastReflect = gamespace.currentUpdate - this.#lastReflect;

        if (!this.#cancelledAnimation) {
            let deflect = this.#animationManager.fetchInstance("deflect");

            if (timeSinceLastReflect < deflect[0].duration) {
                this.#animationManager.end("using");
                this.#animationManager.end("idle");
                return deflect[1](timeSinceLastReflect, true);

            } else {
                let using = this.#animationManager.fetchInstance("using");

                if (timeSinceLastShot < this.#animationManager.fetchInstance("using")[0].duration) {
                    this.#animationManager.end("deflect");
                    this.#animationManager.end("idle");
                    return using[1](timeSinceLastShot, true);
                }
            }
        }

        this.#animationManager.end("deflect");
        this.#animationManager.end("using");
        return this.#animationManager.fetch("idle")(gamespace.currentUpdate - this.owner.state.lastSwitch, true);
    }

    /**
     * Returns this item's current dimensions, taking animations into account
     *
     * **This method will stop expired animations.**
     * More specifically, if an idle animation is running, but the using animation should be used,
     * the idle animation will be terminated
     */
    getHandReference() {
        return this.#getAnimation()?.hands;
    }

    /**
     * Returns this item's current dimensions, taking animations into account
     *
     * **This method will stop expired animations.**
     * More specifically, if an idle animation is running, but the using animation should be used,
     * the idle animation will be terminated
     */
    getItemReference() {
        return this.#getAnimation()?.item;
    }

    /**
     * Serves to stop any animation related to this melee that are currently playing
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
            gamespace.currentUpdate - this.#lastUse < player.state.firingDelay
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
                state.noSlow = false;
                melee.#lastUse = gamespace.currentUpdate;
                player.state.firingDelay = prototype.useDelay;
                melee.#cancelledAnimation = false;

                for (const { damage, time, areaOfEffect: collision } of prototype.damages) {
                    function dealDamage() {
                        if (player.activeItem != melee) return;

                        // This is stupid
                        const colliderOriginCirc = srvsdbx_Geometry.Vector2D.fromPolarToVec(
                            player.angle + Math.PI / 2,
                            gamespace.PLAYER_SIZE * collision.offset.parr
                        ).plus(
                            {
                                direction: player.angle,
                                magnitude: gamespace.PLAYER_SIZE * collision.offset.perp
                            },
                            true
                        ),
                            colliderOriginBox = srvsdbx_Geometry.Vector2D.fromPolarToVec(
                                player.angle - Math.PI / 2,
                                gamespace.PLAYER_SIZE * collision.offset.parr
                            ).plus(
                                {
                                    direction: player.angle - Math.PI,
                                    magnitude: gamespace.PLAYER_SIZE * collision.offset.perp
                                },
                                true
                            ).plus(player.position, true),

                            pixelRadius = collision.radius * gamespace.PLAYER_SIZE,
                            targets = (
                                (gamespace.objects.players.toArray() as (PlayerLike | Obstacle)[])
                                    .concat(...gamespace.objects.obstacles.toArray())
                                    .map(obj => {
                                        if (obj == player || obj.collidable == CollisionLevels.NONE) return;

                                        const diff = srvsdbx_Geometry.Vector2D.fromPoint2D(obj.position)
                                            .plus(colliderOriginCirc, true)
                                            .minus(player.position, true),
                                            [direction, length] = [diff.direction, diff.length / gamespace.PLAYER_SIZE];

                                        return { entity: obj, direction, length } as const;
                                    })
                                    .filter(ele => {
                                        if (ele === undefined) return;

                                        if (ele.entity instanceof PlayerLike) {
                                            return ele.length <= collision.radius + ele.entity.radius / gamespace.PLAYER_SIZE;
                                        } else if (ele.entity.prototype.hitbox.type == "circle") {
                                            return ele.length <= collision.radius + (ele.entity.radius! * ele.entity.scale / gamespace.PLAYER_SIZE);
                                        } else {
                                            return (ele.entity.body as srvsdbx_Geometry.Rectangle).vertices
                                                .map((v, i, a) => ({ start: v, end: a[(i + 1) % a.length] } as srvsdbx_Geometry.LineSegment))
                                                .map(v => srvsdbx_Geometry.collisionFunctions.segmentCircle(
                                                    v,
                                                    {
                                                        origin: colliderOriginBox,
                                                        radius: pixelRadius
                                                    }
                                                ))
                                                .some(v => v !== srvsdbx_ErrorHandling.Nothing)
                                                || ele.entity.body.collides(new srvsdbx_Geometry.Circle(colliderOriginBox, pixelRadius));
                                        }
                                    }) as { entity: PlayerLike | Obstacle, direction: number, length: number; }[]
                            ).sort(
                                (a, b) => srvsdbx_Geometry.Vector2D.squaredDistanceBetweenPts(player.position, a.entity.position)
                                /*   */ - srvsdbx_Geometry.Vector2D.squaredDistanceBetweenPts(player.position, b.entity.position)
                            );

                        for (let i = 0, limit = Math.min(targets.length, prototype.maxTargets ?? 1); i < limit; i++) {
                            const target = targets[i],
                                particleSpawn = typeof target.entity.radius == "number"
                                    // If there's a radius, the calculation is easy
                                    ? srvsdbx_Geometry.Vector2D.fromPolarToVec(
                                        target.direction,
                                        -("scale" in target.entity ? target.entity.scale : 1) * target.entity.radius
                                    )
                                        .plus(target.entity.position, true)

                                    // Otherwise, find the intersection point between the line joining the object and the melee's owner and the object's hitbox
                                    : (srvsdbx_Geometry.collisionFunctions.segmentPolygon(
                                        {
                                            start: target.entity.position,
                                            end: melee.owner.position
                                        },
                                        (target.entity.body as srvsdbx_Geometry.Rectangle).vertices
                                    ) ?? [])
                                        .sort((a, b) =>
                                            srvsdbx_Geometry.Vector2D.squaredDistanceBetweenPts(a[0], melee.owner.position) -
                                            srvsdbx_Geometry.Vector2D.squaredDistanceBetweenPts(b[0], melee.owner.position)
                                        )?.[0]?.[0] ?? { x: 0, y: 0 },

                                offsetFromTarget = srvsdbx_Geometry.Vector2D.minus(particleSpawn, target.entity.position),
                                targetIsPlayer = target.entity instanceof PlayerLike,

                                particlePrototype = gamespace.prototypes.particles.get(
                                    targetIsPlayer
                                        ? "srvsdbx::bloodSplat"
                                        : (target.entity as Obstacle).prototype.hitParticle.particle
                                )!;

                            let lethal = false;
                            function listen() { lethal = true; }

                            targetIsPlayer && (target.entity as PlayerLike).events.once("death", listen);
                            /*
                                We want to know if this projectile killed its target, but checking
                                if the hp is less than 0 won't work, because if they're respawned,
                                the check will fail. Instead, we append a listener and store its
                                result in a variable
                            */


                            if (
                                /* Always apply melee damage to players */
                                targetIsPlayer
                                || (
                                    /* If the obstacle isn't armor-plated or if this weapon is armor piercing */
                                    (!(target.entity as Obstacle).prototype.armorPlated || prototype.armorPiercing)
                                    /* If the obstacle isn't stone-plated or if this weapon is stone piercing */
                                    && (!(target.entity as Obstacle).prototype.stonePlated || prototype.stonePiercing)
                                )
                            ) target.entity.applyDamage(damage * (targetIsPlayer ? 1 : prototype.obstacleMultiplier));

                            if (particlePrototype && !target.entity.destroyed && !lethal) {
                                for (let i = 0, limit = targetIsPlayer ? 1 : extractValue((target.entity as Obstacle).prototype.hitParticle.count); i < limit; i++) {
                                    const part = particlePrototype.create(
                                        particleSpawn,
                                        srvsdbx_Math.randomAngle()
                                    );

                                    if (targetIsPlayer) {
                                        part.follow(target.entity, {
                                            x: offsetFromTarget.x,
                                            y: offsetFromTarget.y,
                                            z: 0, parr: 0, perp: 0
                                        });
                                        (target.entity as PlayerLike).events.once("death", () => part.destroyed || part.destroy());
                                    } else {
                                        part.velocityMap.set(
                                            "intrinsic",
                                            srvsdbx_Geometry.Vector2D.fromPolarToVec(
                                                srvsdbx_Geometry.Vector2D.toPolar(offsetFromTarget).direction,
                                                srvsdbx_Math.bounds_random(0.001, 0.005)
                                            ).toPoint3D()
                                        );
                                    }
                                }
                            }
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
        if (this.destroyed) return;
        super.destroy();

        // @ts-expect-error
        this.#animationManager = void 0;
    }
}