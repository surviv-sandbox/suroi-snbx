// Guns
// #region

/**
 * A simplified representation of a firearm object
 */
interface SimpleGun extends SimpleEquipableItem {
    /**
     * Information about the images associated with this item
     */
    readonly images: {
        /**
         * The path of the image used for this item's display in the inventory and as a dropped item
         */
        readonly loot: string,
        /**
        * The path of the image used for this item's in-world rendition
        */
        readonly world: string;
        // Make the world image mandatory for firearms
    };
    /**
     * Whether this weapon is dual-wielded or not
     */
    readonly dual: boolean,
    /**
     * The color to tint this weapon's world image. Weapons using custom world images set this to `#FFFFFF`
     */
    readonly tint: string,
    /**
     * Information about the projectiles this weapon fires
     */
    readonly ballistics: {
        /**
         * The damage a single projectile inflicts, disregarding falloff and headshots; base damage
         */
        readonly damage: number,
        /**
         * The speed at which the projectile will travel
         */
        readonly velocity: MayBeFunctionWrapped<number, [Gun, PlayerLike]>,
        /**
         * The distance this weapon's projectiles will travel before despawning
         */
        readonly range: MayBeFunctionWrapped<number, [Gun, PlayerLike]>,
        /**
         * The bullet tracer's dimensions
         */
        readonly tracer: {
            /**
             * The tracer's width, in surviv units
             */
            readonly width: Dimension,
            /**
             * The tracer's height, in surviv units
             */
            readonly height: Dimension,
            /**
             * Whether or not this tracer should be drawn above the player
             */
            readonly drawAbovePlayer?: boolean;
            /**
             * Whether or not to always draw this tracer at its maximum length
             */
            readonly forceMaximumLength?: boolean;
            /**
             * Information about the trail that can follow this projectile
             */
            readonly trail?: {
                /**
                 * The path of the image to use for this trail
                 */
                readonly image: string,
                /**
                 * The maximum length the trail can reach
                 */
                readonly maxLength: number,
                /**
                 * The trail's width
                 */
                readonly width: number,
                /**
                 * The color to tint this trail
                 */
                readonly tint: string,
                /**
                 * An offset that will be applied to the trail's regular drawing position
                 */
                readonly offset: {
                    /**
                     * The offset along the axis parallel to the projectile's trajectory
                     */
                    readonly parr: number,
                    /**
                     * The offset along the axis perpendicular to the projectile's trajectory
                     */
                    readonly perp: number;
                };
            };
        },
        /**
         * Information about how this projectile behaves when striking a target. By default, damage is dealt and the projectile despawns
         */
        readonly persistance?: {
            /**
             * The maximum amount of targets this projectile may strike before despawning
             *
             * Setting this to a number below 1 behaves identically to setting it to 1. Its default value is 1
             */
            readonly hitsBeforeDespawn?: number;
            /**
             * If `true`, this projectile will inflict damage to a target every game tick the two are intersecting.
             *
             * It is `false` by default.
             */
            readonly allowMultipleHitsPerTarget?: boolean;
            /**
             * A number by which the projectile's damage will be multiplied when striking a target.
             * If `allowMultipleHits` is `true`, only the first hit modifies the damage.
             */
            readonly hitMultiplier?: number;
        },
        /**
         * An array of the internal names of status effects that are to be applied to targets on hit
         *
         * Note that for explosive weapons, any target within the blast radius will have the status effect
         * applied to the,
         */
        readonly effectsOnHit?: PrototypeReference<"statusEffects">[],
        /**
         * The amount by which a projectile's damage will be multiplied when striking an obstacle
         */
        readonly obstacleMult: number,
        /**
         * The amount by which a projectile's damage will be multiplied if this projectile is a "headshot".
         *
         * Headshots occur at a fixed 15% rate, unless this parameter is set to 1, in which case the rate is 0%.
         */
        readonly headshotMult: number,
        /**
         * Information about this weapon's ability to fire fully-accurate shots
         */
        readonly firstShotAccuracy: {
            /**
             * Whether or not the weapon can fire fully-accurate shots at all
             */
            readonly enabled: boolean,
            /**
             * The minimum amount of time one must wait after firing to have their next shot be fully-accurate
             */
            readonly rechargeTime: number;
        },
        /**
         * A number by which a this projectile's damage will be multiplied every 100 surviv units
         */
        readonly falloff: number,
        /**
         * How many projectiles this weapon fires per shot
         */
        readonly projectiles: number;
    },
    /**
     * Whether or not this weapon is suppressed. Suppressed weapon have less opaque tracers and make less noise
     */
    readonly suppressed: boolean,
    /**
     * The internal name of the ammo type object this firearm uses
     */
    readonly caliber: PrototypeReference<"ammoTypes">,
    /**
     * The `deployGroup` this weapon belongs to; two weapons belonging to the same non-zero deploy group cannot be quickswitched
     */
    readonly deployGroup: number,
    /**
     * Information about the spread this weapon has
     */
    readonly accuracy: {
        /**
         * The spread when standing still
         */
        readonly default: number;
        /**
         * The spread added onto the `default` accuracy if the shooter is moving
         */
        readonly moving: number;
    };
    /**
     * Information about the offset this weapon's image will be drawn at, with (0, 0) being the center of the player
     *
     * Guns are drawn from their centers, so specifying (0, 0) here will lead to the gun being drawn such that
     * its center is at the player's center
     */
    readonly imageOffset: {
        /**
         * The offset along the axis parallel to the player's view line
         */
        readonly parr: number,
        /**
         * The offset along the axis perpendicular to the player's view line
         */
        readonly perp: number;
    },
    /**
     * Information about the dimension of this weapon's world image
     */
    readonly dimensions: {
        /**
         * A width in surviv units.
         *
         * If the string `auto` is specified, the game infers the width from the given height.
         *
         * If both width and height are `auto`, the source image's original dimensions are used
         */
        readonly width: Dimension,
        /**
         * A height in surviv units.
         *
         * If the string `auto` is specified, the game infers the width from the given height.
         *
         * If both width and height are `auto`, the source image's original dimensions are used
         */
        readonly height: Dimension,
        /**
         * The layer to draw this weapon on
         *
         * - 0 is the default and situates the weapon below both hands and body
         * - 1 is used by weapons like the FAMAS, where the weapon is below the hands but above the body
         * - 2 is used by weapons like the M79 and places the weapon above both hands and body
         */
        readonly layer: 0 | 1 | 2;
    },
    /**
     * How long, after switching to this item, its user must wait before using it
     */
    readonly switchDelay: number;
    /**
     * Information about this weapon's reload procedure
     */
    readonly reload: {
        /**
         * How long, in ms, it takes to reload this weapon
         */
        readonly duration: number;
        /**
         * How much ammo is reloaded per cycle. Specifying the string `all` replenishes the weapon's ammunition fully
         */
        readonly ammoReloaded: number | "all";
        /**
         * Whether to automatically start a new reload cycle if the previous one didn't fill the weapon's ammo. Used on the M870 and similar weapons
         */
        readonly chain: boolean;
    },
    /**
     * Information about the reload procedure used for this weapon when reloading from empty
     */
    readonly altReload?: {
        /**
         * How long, in ms, it takes to reload this weapon
         */
        readonly duration: number;
        /**
         * How much ammo is reloaded per cycle. Specifying the string `all` replenishes the weapon's ammunition fully
         */
        readonly ammoReloaded: number | "all";
        /**
         * Whether to automatically start a new reload cycle if the previous one didn't fill the weapon's ammo. Used on the M870 and similar weapons
         */
        readonly chain: boolean;
    };
    /**
     * Information about how many rounds this weapon holds
     */
    readonly magazineCapacity: {
        /**
         * How many rounds can be fired before requiring a reload
         */
        readonly normal: number;
        /**
         * Under this perk, magazine sizes are set to the number indicated by this field
         */
        readonly firepower: number;
    };
    /**
     * Information about where the player's hands should go while holding this weapon
     */
    readonly handPositions: {
        /**
         * Information about the left hand
         */
        readonly leftHand: {
            /**
             * How far along the axis parallel to the player's field of view the hand should be
             */
            readonly parr: number,
            /**
             * How far along the axis perpendicular to the player's field of view the hand should be
             */
            readonly perp: number,
            /**
             * Optionally, the layer this hand should reside on when this weapon is active.
             * If not defined, the hands are rendered according to the `dimensions.layer` property.
             *
             readonly * - 0: Draw the hand under the gun
             readonly * - 1: Draw the hand over the gun
             */
            readonly layer?: 0 | 1;
        },
        /**
         * Information about the right hand
        */
        readonly rightHand?: {
            /**
             * How far along the axis parallel to the player's field of view the hand should be
            */
            readonly parr: number,
            /**
             * How far along the axis perpendicular to the player's field of view the hand should be
            */
            readonly perp: number;
            /**
             * Optionally, the layer this hand should reside on when this weapon is active.
             * If not defined, the hands are rendered according to the `dimensions.layer` property.
             *
             readonly * — 0: Draw the hand under the gun
             readonly * — 1: Draw the hand over the gun
             */
            readonly layer?: 0 | 1;
        };
    };
    /**
     * Information about the offset projectiles will be spawned at, relative to their normal position
     */
    readonly projectileSpawnOffset: {
        /**
         * The offset along the axis parallel to the user's view line
         */
        readonly parr: number;
        /**
         * The offset along the axis perpendicular to the user's view line
         */
        readonly perp: number;
    };
    /**
     * Information about the casings this weapon ejects
     */
    readonly casings?: {
        /**
         * How many casings to spawn per event
         *
         * By default, this is 1 for casings spawned on `fire`, and however many rounds per magazine the weapon has for those spawned on `reload`
         */
        readonly count?: number;
        /**
         * Where, in relation to the back of the gun, casings should spawn
         */
        readonly spawnOffset: {
            /**
             * The offset along the axis parallel to the user's view line, given in surviv units
             */
            readonly parr: number,
            /**
             * The offset along the axis perpendicular to the user's view line, given in surviv units
             */
            readonly perp: number;
        },
        /**
         * Information about this casing's velocity
         */
        readonly velocity: {
            /**
             * How fast, in surviv units per second, this casing travels along the axis parallel to the player's view line
             */
            readonly parr: MayBeFunctionWrapped<number>,
            /**
             * How fast, in surviv units per second, this casing travels along the axis perpendicular to the player's view line
             */
            readonly perp: MayBeFunctionWrapped<number>;
        },
        /**
         * Whether to spawn casings when the weapon is fired or when it is reloaded
         */
        readonly spawnOn: "fire" | "reload",
        /**
         * The delay between the casing's spawn action (`spawnOn`) and the casing being spawned. Corresponds to surviv's `pullDelay`
         */
        readonly spawnDelay: number;
    },
    /**
     * Information about the animation of the weapon recoiling into the player
     */
    readonly recoilImpulse: {
        /**
         * The direction of the impulse
         */
        readonly direction: {
            /**
             * The component parallel to the player's aim line, in surviv units
             */
            readonly parr: number,
            /**
             * The component perpendicular to the player's aim line, in surviv units
             */
            readonly perp: number;
        },
        /**
         * How long the animation lasts for
         */
        readonly duration: number;
    },
    /**
     * What mode of fire this weapon operates in
     *
     * - `automatic` fires continuously while the weapon has ammunition and the owner is attacking
     * - `semi` fires once per input, provided the weapon has ammunition
     * - `burst-n` fires `n` shots automatically, then requiring the attacker to release the attack input before being able to attack again
     * - `auto-burst-n` is identical to `burst-n`, but does not require the owner to release the attack input between bursts
     * - `auto-charge` requires the user to hold down the attack input for some time—the charge time. After this time has elapsed, the shot is fired
     * - `release-charge` requires the user to hold down the attack input for some time—the charge time.
     * After this time has elapsed, the user fires by releasing the attack input
     */
    readonly fireMode: "automatic" | "semi" | `${"auto-" | ""}burst-${number}` | `${"auto" | "release"}-charge`;
    /**
     * Information about this weapon's burst-fire mode, if applicable
     */
    readonly burstProps?: {
        /**
         * The delay in milliseconds between two shots in a burst
         */
        readonly shotDelay: number;
        /**
         * The delay in milliseconds between two consecutive bursts
         */
        readonly burstDelay: number;
    },
    /**
     * Information about this weapon's charging, if applicable
     */
    readonly chargeProps?: {
        /**
         * The amount of time the attack input must be held down before this weapon is ready to fire
         */
        readonly chargeTime: number,
        /**
         * A value to be added to the owner's movement speed when this weapon is being charged
         */
        readonly speedPenalty?: number,
        /**
         * Optionally specify a different world image for when this weapon is in the charged state
         */
        readonly chargeImage?: {
            /**
             * The path to the new image to be used
             */
            readonly image?: string,
            /**
             * Optionally specify new dimensions for this image
             */
            readonly dimensions?: {
                /**
                 * The new image's width
                 */
                readonly width: Dimension,
                /**
                 * The new image's height
                 */
                readonly height: Dimension,
                /**
                 * The new image's layer
                 */
                readonly layer: 0 | 1 | 2;
            },
            /**
             * Optionally specify a new offset for this image
             */
            readonly imageOffset?: {
                /**
                 * The offset along the axis parallel to the player's view line
                 */
                readonly parr: number;
                /**
                 * The offset along the axis perpendicular to the player's view line
                 */
                readonly perp: number;
            };
        },
        /**
         * Optionally specify an image that will be shown in the HUD when this weapon is charging
         *
         * This image will grow in size from left to right as the weapon charges.
         */
        readonly chargeImageHUD?: {
            /**
             * The path to the image to use
             */
            readonly image: string,
            /**
             * How the image should grow as the weapon charges
             *
             * - `clip`: Leave the image at full size, changing the portion that is visible as the charge advances
             * - `scale`: Change the image's width to indicate charge
             */
            readonly growStyle: "clip" | "scale";
        },
        /**
         * Optionally specify a particle that will be spawned while this weapon charging
         */
        readonly chargeParticle?: {
            /**
             * The internal name of the particle to spawn
             */
            readonly particle: PrototypeReference<"particles">,
            /**
             * The particle's offset, using the same coordinate system as `imageOffset`
             */
            readonly offset: {
                /**
                 * The offset along the axis parallel to the player's view line
                 */
                readonly parr: number,
                /**
                 * The offset along the axis perpendicular to the player's view line
                 */
                readonly perp: number;
            },
            /**
             * A function taking the particle's original, intended scale and returning a new scale to use
             */
            readonly scale?: MayBeFunctionWrapped<number, [number, Gun, Particle]>,
            /**
             * A function taking the particle's original, intended opacity and returning a new opacity to use
             */
            readonly alpha?: MayBeFunctionWrapped<number, [number, Gun, Particle]>;
        };
    },
    /**
     * An array of additional objects that can be rendered alongside this weapon
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
        readonly show?: MayBeFunctionWrapped<boolean, [Gun]>,
        /**
         * The color to tint this addon
         */
        readonly tint: MayBeFunctionWrapped<string, [Gun]>,
        /**
         * Specifies this addon's dimensions
         */
        readonly dimensions: {
            /**
             * This addon's width, in surviv units
             */
            readonly width: MayBeFunctionWrapped<Dimension, [Gun]>,
            /**
             * This addon's height, in surviv units
             */
            readonly height: MayBeFunctionWrapped<Dimension, [Gun]>,
            /**
             * The layer at which this addon exists
             *
             * - `-1`: Below the weapon
             * - `1`: Above the weapon
             */
            readonly layer: -1 | 1;
        },
        /**
         * Whether or not this addon should be duplicated if the weapon is dual-wielded
         *
         * Defaults to `true`
         */
        readonly dual?: boolean;
        /**
         * Whether or not this addon should recoil with the weapon or not
         *
         * Defaults to `false`
         */
        readonly recoil?: boolean;
        /**
         * Specifies this addon's position, using the same coordinate space as everything else
         * (relative to the player's center)
         */
        readonly position: {
            /**
             * This addon's position along the axis parallel to the player's line of sight
             */
            readonly parr: MayBeFunctionWrapped<number, [Gun]>,
            /**
             * This addon's position along the axis perpendicular to the player's line of sight
             */
            readonly perp: MayBeFunctionWrapped<number, [Gun]>;
        };
    }[];
}

/**
 * A template for in-world guns to base themselves off of—every "AK-47" will have the same damage, so that gets stored here
 * Not every AK will have the same amount of bullets currently in their magazine, however, so that gets stored on the instance
 * of the gun.
 *
 * In a sense, this is a class for classes.
 */
class GunPrototype extends InventoryItemPrototype {
    /**
     * References to this weapon's associated images
     */
    override #images: { readonly [K in keyof SimpleGun["images"]]: srvsdbx_AssetManagement.ImageSrcPair };
    /**
     * References to this weapon's associated images
     */
    override get images() { return this.#images; }

    /**
     * Whether this weapon is dual-wielded or not
     */
    #dual: SimpleGun["dual"];
    /**
     * Whether this weapon is dual-wielded or not
     */
    get dual() { return this.#dual; }

    /**
     * The color to tint this weapon's world image. Weapons using custom world images set this to `#FFFFFF`
     */
    #tint: SimpleGun["tint"];
    /**
     * The color to tint this weapon's world image. Weapons using custom world images set this to `#FFFFFF`
     */
    get tint() { return this.#tint; }

    /**
     * Information about the projectiles this weapon fires
     */
    readonly #ballistics: srvsdbx_AssetManagement.ConvertPathsToImages<SimpleGun["ballistics"]>;
    /**
     * Information about the projectiles this weapon fires
     */
    get ballistics() { return this.#ballistics; }

    /**
     * Whether or not this weapon is suppressed. Suppressed weapons' tracers are less opaque, and they make less noise.
     */
    #suppressed: boolean;
    /**
     * Whether or not this weapon is suppressed. Suppressed weapons' tracers are less opaque, and they make less noise.
     */
    get suppressed() { return this.#suppressed; }

    /**
     * The internal name of the ammo type object this firearm uses
     */
    #caliber: string;
    /**
     * The internal name of the ammo type object this firearm uses
     */
    get caliber() { return this.#caliber; }

    /**
     * The smallest possible delay, measured in milliseconds, between two shots
     */
    #useDelay: SimpleGun["useDelay"];
    /**
     * The smallest possible delay, measured in milliseconds, between two shots
     */
    get useDelay() { return this.#useDelay; }

    /**
     * The `deployGroup` this weapon belongs to; two weapons belonging to the same non-zero deploy group cannot be quickswitched
     */
    #deployGroup: SimpleGun["deployGroup"];
    /**
     * The `deployGroup` this weapon belongs to; two weapons belonging to the same non-zero deploy group cannot be quickswitched
     */
    get deployGroup() { return this.#deployGroup; }

    /**
     * Information about the spread this weapon has
     */
    #accuracy: SimpleGun["accuracy"];
    /**
     * Information about the spread this weapon has
     */
    get accuracy() { return this.#accuracy; }

    /**
     * Information about the movement speed penalties incurred by the use of this weapon
     */
    override #moveSpeedPenalties: SimpleGun["moveSpeedPenalties"];
    /**
     * Information about the movement speed penalties incurred by the use of this weapon
     */
    override get moveSpeedPenalties() { return this.#moveSpeedPenalties; }

    /**
     * Information about the offset this weapon's world image will be drawn at
     */
    readonly #imageOffset: SimpleGun["imageOffset"];
    /**
     * Information about the offset this weapon's world image will be drawn at
     */
    get imageOffset() { return this.#imageOffset; }

    /**
     * Information about this world image's dimensions
     */
    readonly #dimensions: SimpleGun["dimensions"];
    /**
     * Information about this world image's dimensions
     */
    get dimensions() { return this.#dimensions; }

    /**
     * Information about this weapon's reload procedure
     */
    readonly #reload: SimpleGun["reload"];
    /**
     * Information about this weapon's reload procedure
     */
    get reload() { return this.#reload; }

    /**
     * Information about the reload procedure used for this weapon when reloading from empty
     */
    readonly #altReload: SimpleGun["altReload"];
    /**
     * Information about the reload procedure used for this weapon when reloading from empty
     */
    get altReload() { return this.#altReload; }

    /**
     * Information about how many rounds this weapon holds
     */
    readonly #magazineCapacity: SimpleGun["magazineCapacity"];
    /**
     * Information about how many rounds this weapon holds
     */
    get magazineCapacity() { return this.#magazineCapacity; }

    /**
     *  How long, after switching to this item, its user must wait before using it
     */
    #switchDelay: SimpleGun["switchDelay"];
    /**
     *  How long, after switching to this item, its user must wait before using it
     */
    get switchDelay() { return this.#switchDelay; }

    /**
     * Information about the position of the shooter's hands
     */
    readonly #handPositions: SimpleGun["handPositions"];
    /**
     * Information about the position of the shooter's hands
     */
    get handPositions() { return this.#handPositions; }

    /**
     * Information about the offset projectiles will be spawned at, relative to their normal position
     */
    readonly #projectileSpawnOffset: SimpleGun["projectileSpawnOffset"];
    /**
     * Information about the offset projectiles will be spawned at, relative to their normal position
     */
    get projectileSpawnOffset() { return this.#projectileSpawnOffset; }

    /**
     * Information about the casings this weapon ejects
     */
    readonly #casings: SimpleGun["casings"];
    /**
     * Information about the casings this weapon ejects
     */
    get casings() { return this.#casings; }

    /**
     * Information about the animation of the weapon recoiling into the shooter
     */
    readonly #recoilImpulse: SimpleGun["recoilImpulse"];
    /**
     * Information about the animation of the weapon recoiling into the shooter
     */
    get recoilImpulse() { return this.#recoilImpulse; }

    /**
     * What fire mode this weapon uses
     */
    #fireMode: SimpleGun["fireMode"];
    /**
     * What fire mode this weapon uses
     */
    get fireMode() { return this.#fireMode; }

    /**
     * Information about this weapon's burst-fire mode, if applicable
     */
    readonly #burstProps: SimpleGun["burstProps"];
    /**
     * Information about this weapon's burst-fire mode, if applicable
     */
    get burstProps() { return this.#burstProps; }

    /**
     * Information about this weapon's charging, if applicable
     */
    readonly #chargeProps?: srvsdbx_AssetManagement.ConvertPathsToImages<SimpleGun["chargeProps"] & {}>;
    /**
     * Information about this weapon's charging, if applicable
     */
    get chargeProps() { return this.#chargeProps; }

    /**
     * An array of additional objects that can be rendered alongside this weapon
     *
     * This one is concerned with those residing below the weapon
    */
    readonly #addonsBelow?: srvsdbx_AssetManagement.ConvertPathsToImages<SimpleGun["addons"] & {}> & { [key: number]: { dimensions: { layer: -1; }; }; };
    /**
     * An array of additional objects that can be rendered alongside this weapon
     *
     * This one is concerned with those residing below the weapon
     */
    get addonsBelow() { return this.#addonsBelow; }

    /**
     * An array of additional objects that can be rendered alongside this weapon
     *
     * This one is concerned with those residing above the weapon
     */
    readonly #addonsAbove?: srvsdbx_AssetManagement.ConvertPathsToImages<SimpleGun["addons"] & {}> & { [key: number]: { dimensions: { layer: 1; }; }; };
    /**
     * An array of additional objects that can be rendered alongside this weapon
    *
    * This one is concerned with those residing above the weapon
    */
    get addonsAbove() { return this.#addonsAbove; }

    /**
     * An array of additional objects that can be rendered alongside this weapon
     */
    readonly #addons?: srvsdbx_AssetManagement.ConvertPathsToImages<SimpleGun["addons"] & {}>;
    /**
     * An array of additional objects that can be rendered alongside this weapon
     */
    get addons() { return this.#addons; }

    /**
     * Takes a simplified representation of a melee weapon and converts it into a more rigorous one
     * @param obj The `SimpleGun` object to parse
     * @returns A new `GunPrototype`
     */
    static async from(obj: SimpleGun): Promise<srvsdbx_ErrorHandling.Result<GunPrototype, unknown[]>> {
        const errors: unknown[] = [],
            pathPrefix = `${obj.includePath}/`,
            trailImage = obj.ballistics.tracer.trail
                ? srvsdbx_ErrorHandling.handleResult(
                    await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(
                        `${pathPrefix}/${obj.ballistics.tracer.trail.image}`
                    ),
                    srvsdbx_ErrorHandling.identity,
                    errors.push
                )

                : void 0,
            lootImage = srvsdbx_ErrorHandling.handleResult(
                await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(
                    `${pathPrefix}/${obj.images.loot}`
                ),
                srvsdbx_ErrorHandling.identity,
                errors.push
            ),

            worldImage = srvsdbx_ErrorHandling.handleResult(
                await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(
                    `${pathPrefix}/${obj.images.world}`
                ),
                srvsdbx_ErrorHandling.identity,
                errors.push
            ),

            chargeImage = obj.chargeProps?.chargeImage?.image
                ? srvsdbx_ErrorHandling.handleResult(
                    await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(
                        `${pathPrefix}/${obj.chargeProps.chargeImage.image}`
                    ),
                    srvsdbx_ErrorHandling.identity,
                    errors.push
                )
                : void 0,

            chargeImageHUD = obj.chargeProps?.chargeImageHUD?.image
                ? srvsdbx_ErrorHandling.handleResult(
                    await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(
                        `${pathPrefix}/${obj.chargeProps.chargeImageHUD.image}`
                    ),
                    srvsdbx_ErrorHandling.identity,
                    errors.push
                )
                : void 0,

            addonImages = obj.addons ? await (async () => {
                const array: srvsdbx_AssetManagement.ImageSrcPair[][] = [];

                for (const addon of obj.addons!) {
                    array.push(
                        await srvsdbx_AssetManagement.loadImageArray(
                            addon.images,
                            errors,
                            pathPrefix
                        ) as srvsdbx_AssetManagement.ImageSrcPair[]
                    );
                }

                return array;
            })() : void 0;

        if (!errors.length) {
            return {
                res: new GunPrototype(
                    obj.name,
                    obj.displayName,
                    obj.includePath,
                    obj.namespace,
                    obj.targetVersion,
                    {
                        loot: lootImage as srvsdbx_AssetManagement.ImageSrcPair,
                        world: worldImage as srvsdbx_AssetManagement.ImageSrcPair
                    },
                    obj.dual,
                    obj.tint,
                    {
                        damage: obj.ballistics.damage,
                        effectsOnHit: obj.ballistics.effectsOnHit,
                        falloff: obj.ballistics.falloff,
                        firstShotAccuracy: obj.ballistics.firstShotAccuracy,
                        headshotMult: obj.ballistics.headshotMult,
                        obstacleMult: obj.ballistics.obstacleMult,
                        persistance: obj.ballistics.persistance,
                        projectiles: obj.ballistics.projectiles,
                        range: obj.ballistics.range,
                        velocity: obj.ballistics.velocity,
                        tracer: {
                            drawAbovePlayer: obj.ballistics.tracer.drawAbovePlayer,
                            forceMaximumLength: obj.ballistics.tracer.forceMaximumLength,
                            height: obj.ballistics.tracer.height,
                            width: obj.ballistics.tracer.width,
                            trail: obj.ballistics.tracer.trail ? {
                                maxLength: obj.ballistics.tracer.trail.maxLength,
                                offset: obj.ballistics.tracer.trail.offset,
                                tint: obj.ballistics.tracer.trail.tint,
                                width: obj.ballistics.tracer.trail.width,
                                image: trailImage as srvsdbx_AssetManagement.ImageSrcPair,
                            } : void 0
                        }
                    },
                    obj.suppressed,
                    obj.caliber,
                    obj.useDelay,
                    obj.deployGroup,
                    obj.accuracy,
                    obj.moveSpeedPenalties,
                    obj.imageOffset,
                    obj.dimensions,
                    obj.reload,
                    obj.altReload,
                    obj.magazineCapacity,
                    obj.switchDelay,
                    obj.handPositions,
                    obj.projectileSpawnOffset,
                    obj.casings,
                    obj.recoilImpulse,
                    obj.fireMode,
                    obj.burstProps,
                    obj.chargeProps ? {
                        chargeTime: obj.chargeProps.chargeTime,
                        chargeParticle: obj.chargeProps.chargeParticle,
                        speedPenalty: obj.chargeProps.speedPenalty,
                        chargeImage: obj.chargeProps.chargeImage ? {
                            dimensions: obj.chargeProps.chargeImage.dimensions,
                            imageOffset: obj.chargeProps.chargeImage.imageOffset,
                            image: chargeImage as srvsdbx_AssetManagement.ImageSrcPair,
                        } : void 0,
                        chargeImageHUD: obj.chargeProps.chargeImageHUD ? {
                            growStyle: obj.chargeProps.chargeImageHUD.growStyle,
                            image: chargeImageHUD as srvsdbx_AssetManagement.ImageSrcPair
                        } : void 0
                    } : void 0,
                    obj.addons ?
                        obj.addons.map((addon, i) => {
                            return {
                                dimensions: addon.dimensions,
                                dual: addon.dual,
                                position: addon.position,
                                recoil: addon.recoil,
                                show: addon.show,
                                tint: addon.tint,
                                images: addonImages![i] as srvsdbx_AssetManagement.ImageSrcPair[],
                            };
                        })
                        : void 0
                )
            };
        }

        return { err: errors };
    }

    /**
     * Creates an `Animation` object representing the animation of this weapon recoiling backwards
     * @param handPositions The default hand positions for this weapon
     * @param worldImage This weapon's world image
     * @param dimensions The world image's dimensions
     * @param imageOffset The offset relative to the player at which the world image is drawn
     * @param recoilImpulse Information about the recoil impulse this animation will be based on
     * @returns An `Animation` object representing the weapon recoiling into the shooter
     */
    static generateRecoilAnimation(
        handPositions: typeof GunPrototype.prototype.handPositions,
        worldImage: typeof InventoryItemPrototype.prototype.images.world & {},
        dimensions: typeof GunPrototype.prototype.dimensions,
        imageOffset: typeof GunPrototype.prototype.imageOffset,
        recoilImpulse: typeof GunPrototype.prototype.recoilImpulse
    ) {
        const imageDimensions = srvsdbx_AssetManagement.determineImageDimensions(worldImage.asset, dimensions);

        return new srvsdbx_Animation.Animation<Required<ItemAnimation & { item: { offset: { parr: number, perp: number; }; }; }>>(
            {
                duration: recoilImpulse.duration,
                keyframes: [
                    {
                        fraction: 0,
                        data: {
                            hands: {
                                leftHand: {
                                    parr: handPositions.leftHand.parr + recoilImpulse.direction.parr,
                                    perp: handPositions.leftHand.perp + recoilImpulse.direction.perp,
                                },
                                rightHand: handPositions.rightHand ? {
                                    parr: handPositions.rightHand.parr + recoilImpulse.direction.parr,
                                    perp: handPositions.rightHand.perp + recoilImpulse.direction.perp,
                                } : void 0
                            },
                            item: {
                                dimensions: imageDimensions,
                                offset: {
                                    parr: imageOffset.parr + recoilImpulse.direction.parr,
                                    perp: imageOffset.perp + recoilImpulse.direction.perp,
                                    angle: 0
                                }
                            }
                        }
                    },
                    {
                        fraction: 1,
                        data: {
                            hands: {
                                leftHand: {
                                    parr: handPositions.leftHand.parr,
                                    perp: handPositions.leftHand.perp,
                                },
                                rightHand: handPositions.rightHand ? {
                                    parr: handPositions.rightHand.parr,
                                    perp: handPositions.rightHand.perp,
                                } : void 0
                            },
                            item: {
                                dimensions: imageDimensions,
                                offset: {
                                    parr: imageOffset.parr,
                                    perp: imageOffset.perp,
                                    angle: 0
                                }
                            }
                        }
                    }
                ]
            },
            (a, b, t) => {
                const leftAHand = a.hands.leftHand,
                    rightAHand = a.hands.rightHand,
                    leftBHand = b.hands.leftHand,
                    rightBHand = b.hands.rightHand,

                    linterp = srvsdbx_Animation.easingFunctions.linterp;

                return {
                    hands: {
                        leftHand: {
                            parr: linterp(leftAHand?.parr ?? leftBHand?.parr ?? 0, leftBHand?.parr ?? leftAHand?.parr ?? 0, t),
                            perp: linterp(leftAHand?.perp ?? leftBHand?.perp ?? 0, leftBHand?.perp ?? leftAHand?.perp ?? 0, t)
                        },
                        rightHand: rightAHand || rightBHand ? {
                            parr: linterp(rightAHand?.parr ?? rightBHand?.parr ?? 0, rightBHand?.parr ?? rightAHand?.parr ?? 0, t),
                            perp: linterp(rightAHand?.perp ?? rightBHand?.perp ?? 0, rightBHand?.perp ?? rightAHand?.perp ?? 0, t)
                        } : void 0
                    },
                    item: {
                        dimensions: imageDimensions,
                        offset: {
                            parr: linterp(a.item.offset?.parr ?? 0, b.item.offset?.parr ?? 0, t),
                            perp: linterp(a.item.offset?.perp ?? 0, b.item.offset?.perp ?? 0, t),
                            angle: 0
                        }
                    }
                };
            }
        );
    }

    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(
        name: typeof ImportedObject.prototype.name,
        displayName: typeof ImportedObject.prototype.displayName,
        includePath: typeof ImportedObject.prototype.includePath,
        namespace: typeof ImportedObject.prototype.namespace,
        targetVersion: typeof ImportedObject.prototype.targetVersion,
        images: typeof GunPrototype.prototype.images,
        dual: typeof GunPrototype.prototype.dual,
        tint: typeof GunPrototype.prototype.tint,
        ballistics: typeof GunPrototype.prototype.ballistics,
        suppressed: typeof GunPrototype.prototype.suppressed,
        caliber: typeof GunPrototype.prototype.caliber,
        useDelay: typeof GunPrototype.prototype.useDelay,
        deployGroup: typeof GunPrototype.prototype.deployGroup,
        accuracy: typeof GunPrototype.prototype.accuracy,
        moveSpeedPenalties: typeof GunPrototype.prototype.moveSpeedPenalties,
        imageOffset: typeof GunPrototype.prototype.imageOffset,
        dimensions: typeof GunPrototype.prototype.dimensions,
        reload: typeof GunPrototype.prototype.reload,
        altReload: typeof GunPrototype.prototype.altReload,
        magazineCapacity: typeof GunPrototype.prototype.magazineCapacity,
        switchDelay: typeof GunPrototype.prototype.switchDelay,
        handPositions: typeof GunPrototype.prototype.handPositions,
        projectileSpawnOffset: typeof GunPrototype.prototype.projectileSpawnOffset,
        casings: typeof GunPrototype.prototype.casings,
        recoilImpulse: typeof GunPrototype.prototype.recoilImpulse,
        fireMode: typeof GunPrototype.prototype.fireMode,
        burstProps: typeof GunPrototype.prototype.burstProps,
        chargeProps: typeof GunPrototype.prototype.chargeProps,
        addons: typeof GunPrototype.prototype.addons,
    ) {
        super(name, displayName, targetVersion, namespace, includePath, images, moveSpeedPenalties);

        const size = gamespace.PLAYER_SIZE;

        function autoOrScale(dim: Dimension) {
            return dim == "auto" ? dim : dim * size;
        }

        this.#images = images;
        this.#ballistics = {
            damage: ballistics.damage,
            velocity: (gun, shooter) => extractValue(ballistics.velocity, gun, shooter) * size / 1000,
            range: (gun, shooter) => extractValue(ballistics.range, gun, shooter) * size,
            tracer: {
                width: autoOrScale(ballistics.tracer.width),
                height: autoOrScale(ballistics.tracer.height),
                drawAbovePlayer: ballistics.tracer.drawAbovePlayer,
                forceMaximumLength: ballistics.tracer.forceMaximumLength,
                trail: ballistics.tracer.trail ? {
                    image: ballistics.tracer.trail.image,
                    tint: ballistics.tracer.trail.tint,
                    width: ballistics.tracer.trail.width * size,
                    maxLength: ballistics.tracer.trail.maxLength * size,
                    offset: {
                        parr: ballistics.tracer.trail.offset.parr * size,
                        perp: ballistics.tracer.trail.offset.perp * size
                    }
                } : void 0
            },
            effectsOnHit: ballistics.effectsOnHit,
            falloff: ballistics.falloff,
            firstShotAccuracy: ballistics.firstShotAccuracy,
            headshotMult: ballistics.headshotMult,
            obstacleMult: ballistics.obstacleMult,
            persistance: ballistics.persistance,
            projectiles: ballistics.projectiles,
        };
        this.#dual = dual;
        this.#suppressed = suppressed;
        this.#tint = tint;
        this.#caliber = caliber;
        this.#useDelay = useDelay;
        this.#deployGroup = deployGroup;
        this.#accuracy = {
            default: accuracy.default,
            moving: accuracy.moving
        };
        this.#moveSpeedPenalties = moveSpeedPenalties;
        this.#imageOffset = {
            parr: imageOffset.parr,
            perp: imageOffset.perp,
        };
        this.#dimensions = {
            width: autoOrScale(dimensions.width),
            height: autoOrScale(dimensions.height),
            layer: dimensions.layer
        };
        this.#reload = reload;
        this.#altReload = altReload;
        this.#magazineCapacity = magazineCapacity;
        this.#switchDelay = switchDelay;
        this.#handPositions = {
            leftHand: {
                parr: handPositions.leftHand.parr,
                perp: handPositions.leftHand.perp,
                layer: handPositions.leftHand.layer
            },
            rightHand: handPositions.rightHand ? {
                parr: handPositions.rightHand.parr,
                perp: handPositions.rightHand.perp,
                layer: handPositions.rightHand.layer
            } : void 0
        };
        this.#projectileSpawnOffset = {
            parr: projectileSpawnOffset.parr * size,
            perp: projectileSpawnOffset.perp * size
        };
        this.#casings = casings ? {
            count: casings.count,
            spawnDelay: casings.spawnDelay,
            spawnOffset: casings.spawnOffset,
            spawnOn: casings.spawnOn,
            velocity: {
                parr: () => extractValue(casings.velocity.parr) * 0.05,
                perp: () => extractValue(casings.velocity.perp) * 0.05
            }
        } : void 0;
        this.#recoilImpulse = {
            duration: recoilImpulse.duration,
            direction: {
                parr: recoilImpulse.direction.parr,
                perp: recoilImpulse.direction.perp,
            }
        };
        this.#fireMode = fireMode;
        this.#burstProps = burstProps;

        this.#chargeProps = chargeProps ? {
            chargeTime: chargeProps.chargeTime,
            chargeImageHUD: chargeProps.chargeImageHUD,
            speedPenalty: chargeProps.speedPenalty,
            chargeImage: chargeProps.chargeImage ? {
                image: chargeProps.chargeImage.image,
                dimensions: chargeProps.chargeImage.dimensions ? {
                    width: autoOrScale(chargeProps.chargeImage.dimensions.width),
                    height: autoOrScale(chargeProps.chargeImage.dimensions.height),
                    layer: chargeProps.chargeImage.dimensions.layer
                } : void 0,
                imageOffset: chargeProps.chargeImage.imageOffset ? {
                    parr: chargeProps.chargeImage.imageOffset.parr,
                    perp: chargeProps.chargeImage.imageOffset.perp
                } : void 0
            } : void 0,
            chargeParticle: chargeProps.chargeParticle ? {
                particle: chargeProps.chargeParticle.particle,
                alpha: chargeProps.chargeParticle.alpha,
                scale: chargeProps.chargeParticle.scale,
                offset: {
                    parr: chargeProps.chargeParticle.offset.parr * size,
                    perp: chargeProps.chargeParticle.offset.perp * size
                }
            } : void 0
        } : void 0;

        this.#addons = addons ?
            addons.map(addon => {
                return {
                    images: addon.images,
                    tint: addon.tint,
                    dual: addon.dual,
                    recoil: addon.recoil,
                    show: addon.show,
                    dimensions: {
                        width: gun => autoOrScale(extractValue(addon.dimensions.width, gun)),
                        height: gun => autoOrScale(extractValue(addon.dimensions.height, gun)),
                        layer: addon.dimensions.layer,
                    },
                    position: {
                        parr: gun => extractValue(addon.position.parr, gun),
                        perp: gun => extractValue(addon.position.perp, gun)
                    }
                };
            })
            : void 0;

        this.#addonsBelow = this.#addons?.filter?.(addon => addon.dimensions.layer == -1) as any;
        this.#addonsAbove = this.#addons?.filter?.(addon => addon.dimensions.layer == 1) as any;
    }
}

/**
 * Represents a physical firearm in the game world
 */
class Gun extends InventoryItem<GunPrototype> implements EquipableItem<Required<ItemAnimation> & { item: { offset: { parr: number, perp: number; }; }; }>, Destroyable {
    /**
     * An object to manage this item's animations
     */
    readonly #animationManager: srvsdbx_Animation.AnimationManager<Required<ItemAnimation & { item: { offset: { parr: number, perp: number; }; }; }>, "idle" | "using">;
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
     * The ammunition currently in this weapon
     */
    #ammo: number;
    /**
     * The ammunition currently in this weapon
     */
    get ammo() { return this.#ammo; }

    /**
     * The number of shots this weapon has fired in the current "volley"
     *
     * A "volley" is defined as all the shots fired by a user through a single mouse press
     */
    #shots = 0;
    /**
     * The number of shots this weapon has fired in the current "volley"
     *
     * A "volley" is defined as all the shots fired by a user through a single mouse press
     */
    get shots() { return this.#shots; }

    /**
     * For dual-wielded weapons. Controls whether the left of right gun is fired
     */
    #recoilImpulseParity = 1;
    /**
     * For dual-wielded weapons. Controls whether the left of right gun is fired
     */
    get recoilImpulseParity() { return this.#recoilImpulseParity; }

    /**
     * This weapon image's final dimensions
     */
    readonly #dimensions: { width: number, height: number; };
    /**
     * This weapon image's final dimensions
     */
    get dimensions() { return this.#dimensions; }

    /**
     * The final dimensions of this weapon's charged dimensions, if applicable
     */
    readonly #chargedDimensions: srvsdbx_ErrorHandling.Maybe<{ width: number, height: number; }>;
    /**
     * The final dimensions of this weapon's charged dimensions, if applicable
     */
    get chargedDimensions() { return this.#chargedDimensions; }

    /**
     * Whether or not the weapon is currently charged
     */
    #charged: boolean;
    /**
     * Whether or not the weapon is currently charged
     */
    get charged() { return this.#charged; }

    /**
     * The last time this weapon started being charged
     */
    #chargeStart: number;
    /**
     * The last time this weapon started being charged
     */
    get chargeStart() { return this.#chargeStart; }

    /**
     * Whether or not this weapon is currently being charged
     */
    #isCharging: boolean;
    /**
     * Whether or not this weapon is currently being charged
     */
    get isCharging() { return this.#isCharging; }

    /**
     * A reference to this weapon's charge particle
     */
    #chargeParticle: srvsdbx_ErrorHandling.Maybe<Particle> = srvsdbx_ErrorHandling.Nothing;

    /**
     * Updates this weapon's charge particle, creating it if it is absent and destroying it if it shouldn't be there
     */
    readonly #updateChargeParticle: () => void;

    /**
     * Destroys the current charge particle
     */
    #destroyChargeParticle() {
        this.#chargeParticle?.destroy?.();
        this.#chargeParticle = srvsdbx_ErrorHandling.Nothing;
    }

    /**
     * Whether or not this firearm's animation has been cancelled
     */
    #cancelledAnimation = false;
    /**
     * Whether or not this firearm's animation has been cancelled
     */
    get cancelledAnimation() { return this.#cancelledAnimation; }

    /**
     * `* It's a constructor. It constructs.`
     * @param owner The `PlayerLike` that owns this weapon
     * @param prototype The `GunPrototype` this object is based on
     */
    constructor(owner: PlayerLike, prototype: GunPrototype) {
        super(owner, prototype);

        this.#animationManager = new srvsdbx_Animation.AnimationManager<Required<ItemAnimation & { item: { offset: { parr: number, perp: number; }; }; }>, "idle" | "using">(
            {
                idle: srvsdbx_Animation.Animation.createStillFrame({ hands: prototype.handPositions as HandPositions } as Required<ItemAnimation & { item: { offset: { parr: number, perp: number; }; }; }>),
                using: GunPrototype.generateRecoilAnimation(
                    prototype.handPositions,
                    prototype.images.world,
                    prototype.dimensions,
                    prototype.imageOffset,
                    prototype.recoilImpulse
                )
            }
        );

        this.#ammo = prototype.magazineCapacity.normal;

        // If the weapon's fire mode isn't a charge mode, we'll say it's always charged
        this.#charged = !prototype.fireMode.includes("charge");

        this.#isCharging = false;
        this.#chargeStart = 0;

        this.#dimensions = srvsdbx_AssetManagement.determineImageDimensions(prototype.images.world.asset, prototype.dimensions);

        this.#chargedDimensions = prototype.chargeProps?.chargeImage
            ? srvsdbx_AssetManagement.determineImageDimensions(
                (prototype.chargeProps.chargeImage.image ?? prototype.images.world).asset,
                prototype.chargeProps.chargeImage.dimensions ?? prototype.dimensions
            )
            : srvsdbx_ErrorHandling.Nothing;

        {
            const player = this.owner,
                body = player.body,
                chargeProps = this.prototype.chargeProps;

            if (!chargeProps?.chargeParticle) this.#updateChargeParticle = () => { };
            else {
                const particleProto = gamespace.prototypes.particles.get(chargeProps.chargeParticle.particle)!;

                this.#updateChargeParticle = () => {
                    const playerDir = body.angle - Math.PI / 2;

                    if (chargeProps?.chargeParticle?.particle) {
                        const particle =
                            this.#chargeParticle ??= (() => {
                                const p = new Particle(
                                    particleProto,
                                    srvsdbx_Geometry.Vector2D.fromPoint2D(body.position)
                                        .plus({
                                            direction: playerDir,
                                            magnitude: chargeProps.chargeParticle.offset.parr
                                        }, true)
                                        .plus({
                                            direction: playerDir + Math.PI / 2,
                                            magnitude: chargeProps.chargeParticle.offset.perp
                                        }, true),
                                    player.angle
                                );

                                p.follow(player, {
                                    x: 0,
                                    y: 0,
                                    z: 0,
                                    parr: chargeProps.chargeParticle.offset.parr,
                                    perp: chargeProps.chargeParticle.offset.perp
                                });

                                return p;
                            })();


                        if (chargeProps.chargeParticle.scale)
                            particle.forceScale(
                                extractValue(
                                    chargeProps.chargeParticle.scale,
                                    particle.getCalculatedScale(),
                                    this,
                                    particle
                                )
                            );

                        if (chargeProps.chargeParticle.alpha)
                            particle.forceAlpha(
                                extractValue(
                                    chargeProps.chargeParticle.alpha,
                                    particle.getCalculatedAlpha(),
                                    this,
                                    particle
                                )
                            );

                        particle.angle = playerDir;
                    } else this.#destroyChargeParticle();
                };
            }
        }
    }

    /**
     * Returns this item's current dimensions, taking animations into account
     *
     * **This method will stop expired animations.**
     * More specifically, if an idle animation is running, but the using animation should be used,
     * the idle animation will be terminated
     */
    getItemReference() {
        const timeSinceLastShot = gamespace.currentUpdate - (this.#lastUse ?? 0);

        if (
            !this.cancelledAnimation &&
            timeSinceLastShot < Math.max(this.prototype.useDelay, this.prototype.recoilImpulse.duration)
        ) {
            this.animationManager.end("idle");
            return this.animationManager.fetch("using")(timeSinceLastShot, true)?.item;
        } else {
            this.animationManager.end("using");
            return this.animationManager.fetch("idle")(gamespace.currentUpdate - this.owner.state.lastSwitch, true)?.item;
        }
    }

    /**
     * Serves to stop any animation related to this weapon that are currently playeing
     */
    stopAnimations() {
        this.#animationManager.endAll();
        this.#cancelledAnimation = true;
    }

    /**
     * A standard method for firing a weapon. Unless your weapon does something radically different on fire, use this method
     */
    usePrimary() {
        const player = this.owner,
            prototype = this.prototype,
            ammoInfo = gamespace.prototypes.ammoTypes.get(prototype.caliber)!,
            body = player.body,

            isCharge = !!prototype.fireMode.match(/^(auto|release)-charge/),
            chargeType = isCharge ? prototype.fireMode == "auto-charge" ? "auto" : "release" : srvsdbx_ErrorHandling.Nothing,
            chargeProps = prototype.chargeProps,

            isBurst = !!prototype.fireMode.match(/^(auto-)?burst/),
            burstType = isBurst ? prototype.fireMode.startsWith("auto-") ? "auto" : "semi" : srvsdbx_ErrorHandling.Nothing,
            shotsPerBurst = isBurst ? parseInt(prototype.fireMode.replace(/^(auto-)?burst-/, ""), 10) ?? 1 : Infinity,
            shotDelay = (isBurst && prototype.burstProps ? prototype.burstProps.shotDelay : prototype.useDelay) * this.owner.modifiers.ergonomics.reduced,

            state = player.state;

        if (gamespace.currentUpdate - this.#lastUse >= shotDelay) {
            if (isCharge) { // Terrible charge-fire logic

                // This function, as the name implies, schedules a re-attempt to fire
                const scheduleRetry = () => {
                    player.timers.firing = setTimeout(
                        () => state.attacking && this.usePrimary(),
                        0
                    ) as unknown as number;
                };

                // If the user is attacking and we're neither charged nor charging, start charging if the weapon has ammo
                if (!this.#charged && !this.#isCharging && state.attacking && this.#ammo) {
                    this.startCharging();

                    return scheduleRetry();
                }

                // If we're currently charging
                if (this.#isCharging) {
                    this.#updateChargeParticle();

                    // And the charge time has elapsed
                    if (gamespace.currentUpdate - this.#chargeStart >= (chargeProps?.chargeTime ?? 0)) {
                        this.#charged = true;
                        this.#isCharging = false;
                    } else {
                        // Otherwise if the player has stopped attacking,
                        if (!state.attacking) this.stopCharging();
                        else scheduleRetry();
                        // If the player is still attacking, schedule a retry

                        return; // In any case, exit here
                    }
                }

                // If the weapon is charged and the fire style is release-to-fire and the player is holding the attack button, schedule a retry
                // Notice that this.#charged should always be true (because we'd've exited earlier if not), but it's still there just to be clear
                // If the chargeType is "auto", execution "falls through" to the firing code, which is what we want
                // If the player isn't attacking, then the release type must be release, and we want to fallthrough
                if (this.#charged && chargeType == "release" && state.attacking) {
                    this.#updateChargeParticle();
                    return scheduleRetry();
                }
            }

            clearTimerIfPresent(player.timers.firing);
            this.#shots = 0;
            this.#destroyChargeParticle();
            this.#cancelledAnimation = false;

            player.timers.firing = setTimeout(
                function fire(weapon: Gun) {
                    const firedAllInBurst = weapon.#shots >= shotsPerBurst;

                    // Conditions to stop firing and exit (one of the below)
                    if (
                        (
                            // Not attacking and
                            !state.attacking &&
                            // Not charged and
                            !weapon.#charged &&
                            // We're not in burst or we've fired all the shots in our burst
                            (!isBurst || firedAllInBurst)
                        ) ||
                        (
                            // Reloading          and
                            state.reloading &&
                            // It's not a partial reload
                            weapon.determineReloadType().ammoReloaded == "all"
                        ) ||
                        // We have no ammo
                        weapon.#ammo <= 0 ||
                        // We've fired all the shots in our burst
                        firedAllInBurst
                    ) {
                        weapon.#ammo = Math.max(weapon.#ammo, 0);
                        state.firing = false;

                        if (firedAllInBurst) {
                            prototype.dual && (weapon.#recoilImpulseParity *= -1);

                            if (burstType! == "auto") {
                                player.timers.firing = setTimeout(
                                    () => {
                                        clearTimerIfPresent(player.timers.firing);

                                        if (state.attacking) weapon.usePrimary();
                                    },
                                    prototype.burstProps ? prototype.burstProps.burstDelay : shotDelay
                                ) as unknown as number;
                            }
                        }

                        weapon.#shots = 0;
                        return;
                    }

                    weapon.#charged = false;
                    weapon.#isCharging = false;
                    state.reloading = false;
                    clearTimerIfPresent(player.timers.anticipatedReload);
                    clearTimerIfPresent(player.timers.reload);

                    if (gamespace.currentUpdate - state.lastSwitch < state.effectiveSwitchDelay) {
                        player.timers.firing = setTimeout(() => {
                            clearTimerIfPresent(player.timers.firing);

                            if (state.attacking) weapon.usePrimary();
                        }) as unknown as number;

                        return;
                    }

                    --weapon.#ammo;
                    ++weapon.#shots;
                    state.firing = true;
                    state.noSlow = false;
                    prototype.dual && !isBurst && (weapon.#recoilImpulseParity *= -1);

                    const size = gamespace.PLAYER_SIZE,
                        playerVelocity = player.compileVelocities(),
                        playerDir = body.angle - Math.PI / 2,
                        ballistics = prototype.ballistics,

                        start = srvsdbx_Geometry.Vector2D.fromPoint2D(body.position)
                            /* parallel      offsets */.plus({
                            direction: playerDir,
                            magnitude: prototype.projectileSpawnOffset.parr + size * prototype.imageOffset.parr + weapon.#dimensions.height / 2
                        }, true)
                            /* perpendicular offsets */.plus({
                            direction: playerDir + Math.PI / 2,
                            magnitude: weapon.#recoilImpulseParity * prototype.projectileSpawnOffset.perp
                        }, true),

                        shouldFSA = ballistics.firstShotAccuracy.enabled && gamespace.currentUpdate - weapon.#lastUse > ballistics.firstShotAccuracy.rechargeTime;

                    for (let i = 0, proj = ballistics.projectiles; i < proj; i++) {
                        const deviation =
                            shouldFSA
                                ? 0
                                : (Math.random() - 0.5) * (prototype.accuracy.default + (playerVelocity.squaredLength == 0 ? 0 : prototype.accuracy.moving)),

                            offset = ammoInfo.spawnVar ?
                                "radius" in ammoInfo.spawnVar ?
                                /* spawn variance (circular) */srvsdbx_Geometry.Vector2D.fromPolarToPt(srvsdbx_Math.randomAngle(), ammoInfo.spawnVar.radius * size) :
                                /* spawn variance (box) */{
                                        x: Math.sign(Math.random() - 0.5) * Math.random() * ammoInfo.spawnVar.width * size,
                                        y: Math.sign(Math.random() - 0.5) * Math.random() * ammoInfo.spawnVar.height * size
                                    }
                                : srvsdbx_Geometry.Vector2D.zeroPt(),
                            newStart = start.plus(offset);

                        new Bullet(
                            newStart,
                            ballistics.falloff,
                            newStart
                                .plus(
                                    srvsdbx_Geometry.Vector2D.fromPolarToPt(
                                        playerDir + deviation,
                                        Math.max(0, extractValue(ballistics.range, weapon, player))
                                    )
                                ),
                            extractValue(ballistics.velocity, weapon, player),
                            ballistics.damage * (ballistics.headshotMult != 1 && Math.random() > 0.85 ? ballistics.headshotMult : 1),
                            Bullet.drawFromFirearm(weapon),
                            ammoInfo.projectileInfo,
                            {
                                allowMultipleHitsPerTarget: ballistics.persistance?.allowMultipleHitsPerTarget ?? false,
                                hitMultiplier: ballistics.persistance?.hitMultiplier ?? 0,
                                hitsBeforeDespawn: ballistics.persistance?.hitsBeforeDespawn ?? 1
                            },
                            ballistics.effectsOnHit,
                            weapon
                        );
                    }

                    if (prototype.casings?.spawnOn == "fire") {
                        for (let i = 0, limit = prototype.casings.count ?? 1; i < limit; i++) {
                            weapon.makeCasing(prototype.casings.spawnDelay);
                        }
                    }

                    if (!["semi", "auto-charge", "release-charge"].includes(prototype.fireMode))
                        player.timers.firing = setTimeout(fire, shotDelay, weapon) as unknown as number;
                    else weapon.#shots = 0;

                    if (!weapon.#ammo) {
                        clearTimerIfPresent(player.timers.anticipatedReload);

                        player.timers.anticipatedReload = setTimeout(weapon.#reload.bind(weapon), shotDelay, weapon);
                    }

                    weapon.#lastUse = gamespace.currentUpdate;
                    state.firing = false;
                },
                0,
                this
            ) as unknown as number;
        }
    }

    /**
     * Resets this weapon's fields
     */
    reset() {
        this.#ammo = this.prototype.magazineCapacity.normal;
        this.#isCharging = false;
        this.#chargeStart = 0;
        this.#shots = 0;
        this.#lastUse = 0;
    }

    /**
     * A standard method for reloading a weapon
     */
    standardReload() {
        const proto = this.prototype,
            owner = this.owner,
            // Anticipated reloads sometimes fire a few milliseconds too quick
            padding = 5;

        if ( // Conditions for exiting
            // This item isn't active
            this != owner.activeItem ||
            // The magazine is full
            this.#ammo == proto.magazineCapacity.normal ||
            // We're already reloading
            owner.state.reloading ||
            // The weapon's switch delay hasn't passed
            gamespace.currentUpdate - owner.state.lastSwitch < owner.state.effectiveSwitchDelay - padding ||
            // The weapon's firing delay hasn't passed
            gamespace.currentUpdate - this.#lastUse < proto.useDelay * this.owner.modifiers.ergonomics.reduced - padding
        ) return;

        this.#reload();
    }

    /**
     * The method that actually reloads this weapon. Can be called directly internally to "force" reloads
     * @param forceChains If reloads are to be chained, this argument specifies whether `standardReload` or `#reload` will be called.
     */
    #reload(forceChains?: boolean) {
        const proto = this.prototype,
            owner = this.owner;

        if (this != owner.activeItem) return;

        owner.state.attacking = false;
        owner.state.firing = false;
        this.#shots = 0;
        this.#charged = false;
        this.#isCharging = false;
        this.#destroyChargeParticle();
        clearTimerIfPresent(owner.timers.firing);
        owner.state.reloading = gamespace.currentUpdate;

        const r = this.determineReloadType();

        if (proto.casings?.spawnOn == "reload")
            for (let i = 0, limit = proto.casings.count ?? proto.magazineCapacity.normal; i < limit; i++)
                this.makeCasing(proto.casings.spawnDelay);

        this.owner.timers.reload = setTimeout(() => {
            this.#ammo = Math.min(this.#ammo + (r.ammoReloaded == "all" ? Infinity : r.ammoReloaded), proto.magazineCapacity.normal);

            owner.state.reloading = false;

            if (this.#ammo < proto.magazineCapacity.normal && r.chain) {
                clearTimerIfPresent(this.owner.timers.reload);
                (forceChains ? this.#reload : this.standardReload).call(this);
            }
        }, r.duration * this.owner.modifiers.ergonomics.reduced) as unknown as number;
    }

    /**
     * Figures out whether, given the weapon's current state, the regular or alternate reload should be used
     */
    determineReloadType() {
        return this.prototype.altReload && !this.#ammo ? this.prototype.altReload : this.prototype.reload;
    }

    /**
     * Starts charging this weapon
     */
    startCharging() {
        this.#isCharging = true;
        this.#chargeStart = gamespace.currentUpdate;

        this.#updateChargeParticle();
    }

    /**
     * Stops charging this weapon
     */
    stopCharging() {
        this.#charged = false;
        this.#isCharging = false;

        this.#destroyChargeParticle();
    }

    /**
     * Spawns a new casing from this weapon, with an optional delay
     * @param delay How much time, in ms, to wait before spawning the casing
     */
    makeCasing(delay?: number) {
        if (this.prototype.casings === void 0) return;

        const T = this;

        if (!delay) makeCasing();
        else {
            setTimeout(
                () => {
                    if (this.owner.activeItem == this) makeCasing();
                },
                delay
            );
        }

        function makeCasing() {
            const proto = T.prototype,
                ammo = gamespace.prototypes.ammoTypes.get(proto.caliber)!;

            if (ammo.casing) {
                const playerDir = T.owner.body.angle - Math.PI / 2,
                    size = gamespace.PLAYER_SIZE,
                    start = srvsdbx_Geometry.Vector2D.fromPoint2D(T.owner.position)
                        .plus(srvsdbx_Geometry.Vector2D.fromPolarToVec(playerDir + Math.PI / 2, (T.#recoilImpulseParity * proto.casings!.spawnOffset.perp * size)), true)
                        .plus(srvsdbx_Geometry.Vector2D.fromPolarToVec(playerDir, (proto.casings!.spawnOffset.parr + 1) * size), true),

                    sin = -Math.sin(T.owner.angle + Math.PI / 2),
                    cos = Math.cos(T.owner.angle + Math.PI / 2),
                    casingVel = proto.casings!.velocity,

                    perp = extractValue(casingVel.perp),
                    parr = extractValue(casingVel.parr),

                    casing = new Particle(
                        gamespace.prototypes.particles.get(ammo.casing)!,
                        start,
                        T.owner.angle
                    );

                casing.velocityMap.set("intrinsic", {
                    x: sin * perp - cos * parr,
                    y: cos * perp + sin * parr,
                    z: 0
                });

                // Adjust the sign of the angular velocity to match the casing's direction (for leftwards-ejecting guns)
                // If there's no perpendicular component, the gun is ejecting downwards or upwards, so randomize the sign
                casing.angularVelocityMap.set(
                    "intrinsic",
                    (() => {
                        const current = casing.angularVelocityMap.get("intrinsic")!;

                        switch (Math.sign(perp)) {
                            case -1: return current;
                            case 0: return Math.sign(Math.random() - 0.5) * current;
                            case 1: return -current;
                        }
                    })()!
                );
            }
        }
    }

    /**
     * Clears this instance's object attributes
     */
    destroy() {
        super.destroy();

        // @ts-expect-error
        this.#animationManager = this.#chargeParticle = this.#chargedDimensions = this.#destroyChargeParticle = this.#dimensions = this.#updateChargeParticle = void 0;
    }
}

//#endregion

// Ammunition
// #region
/**
 * A simplified representation of an ammo object
 */
interface SimpleAmmo extends SimpleImport {
    /**
     * Information about the various colors of this ammo's tracers
     */
    tints: {
        /**
         * The regular color tracers should adopt
         */
        normal: string;
        /**
         * A color unused in regular surviv, but that is used to indicate headshots
         */
        saturated: string;
        /**
         * The color to used when the user is under the effects of a perk such as Hollow Points
         */
        chambered: string;
    };
    /**
     * Information about how opaque this tracer is
     */
    alpha: {
        /**
         * The rate at which the tracer's opacity changes, measured in %/ms
         */
        rate: number;
        /**
         * The minimum opacity of a tracer
         */
        min: number;
        /**
         * The maximum opacity of a tracer
         */
        max: number;
    };
    /**
     * Either the dimensions of a box or the radius of a circle.
     *
     * The area outlined by this shape defines where projectiles of this ammo type may spawn
     */
    spawnVar?: {
        /**
         * The rectangle's width
         */
        width: number,
        /**
         * The rectangle's height
         */
        height: number;
    } | {
        /**
         * The circle's radius
         */
        radius: number;
    };
    /**
     * Dictates an offset, relative to the projectile's hitbox, that this tracer will be drawn at
     */
    imageOffset: {
        /**
         * The offset along the axis parallel to the projectile's trajectory
         */
        parr: number;
        /**
         * The offset along the axis perpendicular to the projectile's trajectory
         */
        perp: number;
    };
    /**
     * Information pertaining more to the projectile itself
     */
    projectileInfo: ({
        /**
         * The projectile's type
         */
        type: "explosive";
        /**
         * The *internal name* of the explosion object associated with this projectile
         */
        explosionType: PrototypeReference<"explosions">;
        /**
         * Whether or not the explosion should be spawned when colliding with an object or not
         */
        explodeOnContact: boolean;
        /**
         * Dictates the magnitude of the scaling effect applied to this projectile's world image in order to simulate height change
         */
        heightPeak?: number;
    } | {
        /**
         * The projectile's type
         */
        type: "bullet";
    }) & {
        /**
         * An array containing paths for the images corresponding to this projectile
         */
        images: string[];
        /**
         * How fast, in rad/s, this projectile should spin
         */
        spinVel?: MayBeFunctionWrapped<number>;
    };
    /**
     * The internal name of the particle corresponding to the casing guns firing this ammo type eject
     */
    casing?: string;
}

/**
 * Represents an ammo type
 */
class Ammo extends ImportedObject {
    /**
     * Takes a simplified representation of an ammo type and attempts to convert it into a more rigorous one
     * @param obj The `SimpleAmmo` object to parse
     * @returns Either a new `Ammo` object, or an array containing the errors that prevented its creation
     */
    static async from(ammo: SimpleAmmo): Promise<srvsdbx_ErrorHandling.Result<Ammo, unknown[]>> {
        const errors: unknown[] = [],

            projectileImages = await srvsdbx_AssetManagement.loadImageArray(ammo.projectileInfo.images, errors, `${ammo.includePath}/`);

        if (errors.length) {
            return { err: errors };
        }

        return {
            res: new Ammo(
                ammo.name,
                ammo.displayName,
                ammo.includePath,
                ammo.namespace,
                ammo.targetVersion,
                ammo.tints,
                ammo.alpha,
                ammo.spawnVar,
                ammo.imageOffset,
                {
                    type: ammo.projectileInfo.type,
                    explodeOnContact: (ammo.projectileInfo as any).explodeOnContact,
                    explosionType: (ammo.projectileInfo as any).explosionType,
                    heightPeak: (ammo.projectileInfo as any).heightPeak,
                    spinVel: ammo.projectileInfo.spinVel,
                    images: projectileImages as srvsdbx_AssetManagement.ImageSrcPair[]
                },
                ammo.casing
            )
        };
    }

    /**
     * Information about the various colors of this ammo's tracers
     */
    #tints: SimpleAmmo["tints"];
    /**
     * Information about the various colors of this ammo's tracers
     */
    get tints() { return this.#tints; }

    /**
     * Information about how opaque this tracer is
     */
    #alpha: SimpleAmmo["alpha"];
    /**
     * Information about how opaque this tracer is
     */
    get alpha() { return this.#alpha; }

    /**
     * Either the dimensions of a box or the radius of a circle.
     *
     * The area outlined by this shape defines where projectiles of this ammo type may spawn
     */
    #spawnVar: SimpleAmmo["spawnVar"];
    /**
     * Either the dimensions of a box or the radius of a circle.
     *
     * The area outlined by this shape defines where projectiles of this ammo type may spawn
     */
    get spawnVar() { return this.#spawnVar; }

    /**
     * Dictates an offset, relative to the projectile's hitbox, that this tracer will be drawn at
     */
    #imageOffset: SimpleAmmo["imageOffset"];
    /**
     * Dictates an offset, relative to the projectile's hitbox, that this tracer will be drawn at
     */
    get imageOffset() { return this.#imageOffset; }

    /**
     * Information pertaining more to the projectile itself
     */
    #projectileInfo: srvsdbx_AssetManagement.ConvertPathsToImages<SimpleAmmo["projectileInfo"]>;
    /**
     * Information pertaining more to the projectile itself
     */
    get projectileInfo() { return this.#projectileInfo; }

    /**
     * The internal name of the particle corresponding to the casing guns firing this ammo type eject
     */
    #casing?: string;
    /**
     * The internal name of the particle corresponding to the casing guns firing this ammo type eject
     */
    get casing() { return this.#casing; }

    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(
        name: typeof ImportedObject.prototype.name,
        displayName: typeof ImportedObject.prototype.displayName,
        includePath: typeof ImportedObject.prototype.includePath,
        namespace: typeof ImportedObject.prototype.namespace,
        targetVersion: typeof ImportedObject.prototype.targetVersion,
        tints: typeof Ammo.prototype.tints,
        alpha: typeof Ammo.prototype.alpha,
        spawnVar: typeof Ammo.prototype.spawnVar,
        imageOffset: typeof Ammo.prototype.imageOffset,
        projectileInfo: typeof Ammo.prototype.projectileInfo,
        casing: typeof Ammo.prototype.casing,
    ) {
        super(name, displayName, targetVersion, namespace, includePath);
        this.#tints = tints;
        this.#alpha = alpha;
        this.#spawnVar = spawnVar;
        this.#imageOffset = imageOffset;
        this.#projectileInfo = projectileInfo;
        this.#casing = casing;
    }
}
// #endregion