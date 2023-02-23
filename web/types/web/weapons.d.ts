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
        readonly loot: string;
        /**
        * The path of the image used for this item's in-world rendition
        */
        readonly world: string;
    };
    readonly handPositions: {
        readonly leftHand: HandPositions["leftHand"] & {};
        readonly rightHand?: HandPositions["rightHand"] & {};
    };
    /**
     * Whether this weapon is dual-wielded or not
     */
    readonly dual: boolean;
    /**
     * The color to tint this weapon's world image. Weapons using custom world images set this to `#FFFFFF`
     */
    readonly tint: string;
    /**
     * Information about the projectiles this weapon fires
     */
    readonly ballistics: {
        /**
         * The damage a single projectile inflicts, disregarding falloff and headshots; base damage
         */
        readonly damage: number;
        /**
         * The speed at which the projectile will travel
         */
        readonly velocity: MayBeFunctionWrapped<number, [Gun, PlayerLike]>;
        /**
         * The distance this weapon's projectiles will travel before despawning
         */
        readonly range: MayBeFunctionWrapped<number, [Gun, PlayerLike]>;
        /**
         * The bullet tracer's dimensions
         */
        readonly tracer: {
            /**
             * The tracer's width, in surviv units
             */
            readonly width: Dimension;
            /**
             * The tracer's height, in surviv units
             */
            readonly height: Dimension;
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
                readonly image: string;
                /**
                 * The maximum length the trail can reach
                 */
                readonly maxLength: number;
                /**
                 * The trail's width
                 */
                readonly width: number;
                /**
                 * The color to tint this trail
                 */
                readonly tint: string;
                /**
                 * An offset that will be applied to the trail's regular drawing position
                 */
                readonly offset: {
                    /**
                     * The offset along the axis parallel to the projectile's trajectory
                     */
                    readonly parr: number;
                    /**
                     * The offset along the axis perpendicular to the projectile's trajectory
                     */
                    readonly perp: number;
                };
            };
        };
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
        };
        /**
         * An array of the internal names of status effects that are to be applied to targets on hit
         *
         * Note that for explosive weapons, any target within the blast radius will have the status effect
         * applied to the,
         */
        readonly effectsOnHit?: PrototypeReference<"statusEffects">[];
        /**
         * The amount by which a projectile's damage will be multiplied when striking an obstacle
         */
        readonly obstacleMult: number;
        /**
         * The amount by which a projectile's damage will be multiplied if this projectile is a "headshot".
         *
         * Headshots occur at a fixed 15% rate, unless this parameter is set to 1, in which case the rate is 0%.
         */
        readonly headshotMult: number;
        /**
         * Information about this weapon's ability to fire fully-accurate shots
         */
        readonly firstShotAccuracy: {
            /**
             * Whether or not the weapon can fire fully-accurate shots at all
             */
            readonly enabled: boolean;
            /**
             * The minimum amount of time one must wait after firing to have their next shot be fully-accurate
             */
            readonly rechargeTime: number;
        };
        /**
         * A number by which a this projectile's damage will be multiplied every 100 surviv units
         */
        readonly falloff: number;
        /**
         * How many projectiles this weapon fires per shot
         */
        readonly projectiles: number;
    };
    /**
     * Data about status effects applied to players within a certain radius whenever this weapon is fired
     */
    readonly effectsOnFire?: {
        /**
         * The radius of the area-of-effect
         */
        readonly radius: number;
        /**
         * The status effects to apply to targets within the AoE radius
         */
        readonly effects: PrototypeReference<"statusEffects">[];
    }[];
    /**
     * Whether or not this weapon is suppressed. Suppressed weapon have less opaque tracers and make less noise
     */
    readonly suppressed: boolean;
    /**
     * The internal name of the ammo type object this firearm uses
     */
    readonly caliber: PrototypeReference<"ammoTypes">;
    /**
     * The `deployGroup` this weapon belongs to; two weapons belonging to the same non-zero deploy group cannot be quickswitched
     */
    readonly deployGroup: number;
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
        readonly parr: number;
        /**
         * The offset along the axis perpendicular to the player's view line
         */
        readonly perp: number;
    };
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
        readonly width: Dimension;
        /**
         * A height in surviv units.
         *
         * If the string `auto` is specified, the game infers the width from the given height.
         *
         * If both width and height are `auto`, the source image's original dimensions are used
         */
        readonly height: Dimension;
        /**
         * The layer to draw this weapon on
         *
         * - 0 is the default and situates the weapon below both hands and body
         * - 1 is used by weapons like the FAMAS, where the weapon is below the hands but above the body
         * - 2 is used by weapons like the M79 and places the weapon above both hands and body
         */
        readonly layer: 0 | 1 | 2;
    };
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
    };
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
            readonly parr: number;
            /**
             * The offset along the axis perpendicular to the user's view line, given in surviv units
             */
            readonly perp: number;
        };
        /**
         * Information about this casing's velocity
         */
        readonly velocity: {
            /**
             * How fast, in surviv units per second, this casing travels along the axis parallel to the player's view line
             */
            readonly parr: MayBeFunctionWrapped<number>;
            /**
             * How fast, in surviv units per second, this casing travels along the axis perpendicular to the player's view line
             */
            readonly perp: MayBeFunctionWrapped<number>;
        };
        /**
         * Whether to spawn casings when the weapon is fired or when it is reloaded
         */
        readonly spawnOn: "fire" | "reload";
        /**
         * The delay between the casing's spawn action (`spawnOn`) and the casing being spawned. Corresponds to surviv's `pullDelay`
         */
        readonly spawnDelay: number;
    };
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
            readonly parr: number;
            /**
             * The component perpendicular to the player's aim line, in surviv units
             */
            readonly perp: number;
        };
        /**
         * How long the animation lasts for
         */
        readonly duration: number;
    };
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
    };
    /**
     * Information about this weapon's charging, if applicable
     */
    readonly chargeProps?: {
        /**
         * The amount of time the attack input must be held down before this weapon is ready to fire
         */
        readonly chargeTime: number;
        /**
         * A value to be added to the owner's movement speed when this weapon is being charged
         */
        readonly speedPenalty?: number;
        /**
         * Optionally specify a different world image for when this weapon is in the charged state
         */
        readonly chargeImage?: {
            /**
             * The path to the new image to be used
             */
            readonly image?: string;
            /**
             * Optionally specify new dimensions for this image
             */
            readonly dimensions?: {
                /**
                 * The new image's width
                 */
                readonly width: Dimension;
                /**
                 * The new image's height
                 */
                readonly height: Dimension;
                /**
                 * The new image's layer
                 */
                readonly layer: 0 | 1 | 2;
            };
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
        };
        /**
         * Optionally specify an image that will be shown in the HUD when this weapon is charging
         *
         * This image will grow in size from left to right as the weapon charges.
         */
        readonly chargeImageHUD?: {
            /**
             * The path to the image to use
             */
            readonly image: string;
            /**
             * How the image should grow as the weapon charges
             *
             * - `clip`: Leave the image at full size, changing the portion that is visible as the charge advances
             * - `scale`: Change the image's width to indicate charge
             */
            readonly growStyle: "clip" | "scale";
        };
        /**
         * Optionally specify a particle that will be spawned while this weapon charging
         */
        readonly chargeParticle?: {
            /**
             * The internal name of the particle to spawn
             */
            readonly particle: PrototypeReference<"particles">;
            /**
             * The particle's offset, using the same coordinate system as `imageOffset`
             */
            readonly offset: {
                /**
                 * The offset along the axis parallel to the player's view line
                 */
                readonly parr: number;
                /**
                 * The offset along the axis perpendicular to the player's view line
                 */
                readonly perp: number;
            };
            /**
             * A function taking the particle's original, intended scale and returning a new scale to use
             */
            readonly scale?: MayBeFunctionWrapped<number, [number, Gun, Particle]>;
            /**
             * A function taking the particle's original, intended opacity and returning a new opacity to use
             */
            readonly alpha?: MayBeFunctionWrapped<number, [number, Gun, Particle]>;
        };
    };
    /**
     * An array of additional objects that can be rendered alongside this weapon
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
        readonly show?: MayBeFunctionWrapped<boolean, [Gun]>;
        /**
         * The color to tint this addon
         */
        readonly tint: MayBeFunctionWrapped<string, [Gun]>;
        /**
         * Specifies this addon's dimensions
         */
        readonly dimensions: {
            /**
             * This addon's width, in surviv units
             */
            readonly width: MayBeFunctionWrapped<Dimension, [Gun]>;
            /**
             * This addon's height, in surviv units
             */
            readonly height: MayBeFunctionWrapped<Dimension, [Gun]>;
            /**
             * The layer at which this addon exists
             *
             * - `-1`: Below the weapon
             * - `1`: Above the weapon
             */
            readonly layer: -1 | 1;
        };
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
            readonly parr: MayBeFunctionWrapped<number, [Gun]>;
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
declare class GunPrototype extends InventoryItemPrototype {
    #private;
    /**
     * References to this weapon's associated images
     */
    get images(): {
        readonly loot: srvsdbx_AssetManagement.ImageSrcPair;
        readonly world: srvsdbx_AssetManagement.ImageSrcPair;
    };
    /**
     * Whether this weapon is dual-wielded or not
     */
    get dual(): boolean;
    /**
     * The color to tint this weapon's world image. Weapons using custom world images set this to `#FFFFFF`
     */
    get tint(): string;
    /**
     * Information about the projectiles this weapon fires
     */
    get ballistics(): srvsdbx_AssetManagement.ConvertPathsToImages<{
        /**
         * The damage a single projectile inflicts, disregarding falloff and headshots; base damage
         */
        readonly damage: number;
        /**
         * The speed at which the projectile will travel
         */
        readonly velocity: MayBeFunctionWrapped<number, [Gun, PlayerLike]>;
        /**
         * The distance this weapon's projectiles will travel before despawning
         */
        readonly range: MayBeFunctionWrapped<number, [Gun, PlayerLike]>;
        /**
         * The bullet tracer's dimensions
         */
        readonly tracer: {
            /**
             * The tracer's width, in surviv units
             */
            readonly width: Dimension;
            /**
             * The tracer's height, in surviv units
             */
            readonly height: Dimension;
            /**
             * Whether or not this tracer should be drawn above the player
             */
            readonly drawAbovePlayer?: boolean | undefined;
            /**
             * Whether or not to always draw this tracer at its maximum length
             */
            readonly forceMaximumLength?: boolean | undefined;
            /**
             * Information about the trail that can follow this projectile
             */
            readonly trail?: {
                /**
                 * The path of the image to use for this trail
                 */
                readonly image: string;
                /**
                 * The maximum length the trail can reach
                 */
                readonly maxLength: number;
                /**
                 * The trail's width
                 */
                readonly width: number;
                /**
                 * The color to tint this trail
                 */
                readonly tint: string;
                /**
                 * An offset that will be applied to the trail's regular drawing position
                 */
                readonly offset: {
                    /**
                     * The offset along the axis parallel to the projectile's trajectory
                     */
                    readonly parr: number;
                    /**
                     * The offset along the axis perpendicular to the projectile's trajectory
                     */
                    readonly perp: number;
                };
            } | undefined;
        };
        /**
         * Information about how this projectile behaves when striking a target. By default, damage is dealt and the projectile despawns
         */
        readonly persistance?: {
            /**
             * The maximum amount of targets this projectile may strike before despawning
             *
             * Setting this to a number below 1 behaves identically to setting it to 1. Its default value is 1
             */
            readonly hitsBeforeDespawn?: number | undefined;
            /**
             * If `true`, this projectile will inflict damage to a target every game tick the two are intersecting.
             *
             * It is `false` by default.
             */
            readonly allowMultipleHitsPerTarget?: boolean | undefined;
            /**
             * A number by which the projectile's damage will be multiplied when striking a target.
             * If `allowMultipleHits` is `true`, only the first hit modifies the damage.
             */
            readonly hitMultiplier?: number | undefined;
        } | undefined;
        /**
         * An array of the internal names of status effects that are to be applied to targets on hit
         *
         * Note that for explosive weapons, any target within the blast radius will have the status effect
         * applied to the,
         */
        readonly effectsOnHit?: string[] | undefined;
        /**
         * The amount by which a projectile's damage will be multiplied when striking an obstacle
         */
        readonly obstacleMult: number;
        /**
         * The amount by which a projectile's damage will be multiplied if this projectile is a "headshot".
         *
         * Headshots occur at a fixed 15% rate, unless this parameter is set to 1, in which case the rate is 0%.
         */
        readonly headshotMult: number;
        /**
         * Information about this weapon's ability to fire fully-accurate shots
         */
        readonly firstShotAccuracy: {
            /**
             * Whether or not the weapon can fire fully-accurate shots at all
             */
            readonly enabled: boolean;
            /**
             * The minimum amount of time one must wait after firing to have their next shot be fully-accurate
             */
            readonly rechargeTime: number;
        };
        /**
         * A number by which a this projectile's damage will be multiplied every 100 surviv units
         */
        readonly falloff: number;
        /**
         * How many projectiles this weapon fires per shot
         */
        readonly projectiles: number;
    }>;
    /**
     * Whether or not this weapon is suppressed. Suppressed weapons' tracers are less opaque, and they make less noise.
     */
    get suppressed(): boolean;
    /**
     * The internal name of the ammo type object this firearm uses
     */
    get caliber(): string;
    /**
     * The smallest possible delay, measured in milliseconds, between two shots
     */
    get useDelay(): number;
    /**
     * The `deployGroup` this weapon belongs to; two weapons belonging to the same non-zero deploy group cannot be quickswitched
     */
    get deployGroup(): number;
    /**
     * Information about the spread this weapon has
     */
    get accuracy(): {
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
     * Information about the movement speed penalties incurred by the use of this weapon
     */
    get moveSpeedPenalties(): {
        readonly passive: number;
        readonly active: number;
        readonly using: number;
    };
    /**
     * Information about the offset this weapon's world image will be drawn at
     */
    get imageOffset(): {
        /**
         * The offset along the axis parallel to the player's view line
         */
        readonly parr: number;
        /**
         * The offset along the axis perpendicular to the player's view line
         */
        readonly perp: number;
    };
    /**
     * Information about this world image's dimensions
     */
    get dimensions(): {
        /**
         * A width in surviv units.
         *
         * If the string `auto` is specified, the game infers the width from the given height.
         *
         * If both width and height are `auto`, the source image's original dimensions are used
         */
        readonly width: Dimension;
        /**
         * A height in surviv units.
         *
         * If the string `auto` is specified, the game infers the width from the given height.
         *
         * If both width and height are `auto`, the source image's original dimensions are used
         */
        readonly height: Dimension;
        /**
         * The layer to draw this weapon on
         *
         * - 0 is the default and situates the weapon below both hands and body
         * - 1 is used by weapons like the FAMAS, where the weapon is below the hands but above the body
         * - 2 is used by weapons like the M79 and places the weapon above both hands and body
         */
        readonly layer: 0 | 2 | 1;
    };
    /**
     * Information about this weapon's reload procedure
     */
    get reload(): {
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
     * Information about the reload procedure used for this weapon when reloading from empty
     */
    get altReload(): {
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
    } | undefined;
    /**
     * Information about how many rounds this weapon holds
     */
    get magazineCapacity(): {
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
     * Data about status effects applied to players within a certain radius whenever this weapon is fired
     */
    get effectsOnFire(): {
        /**
         * The radius of the area-of-effect
         */
        readonly radius: number;
        /**
         * The status effects to apply to targets within the AoE radius
         */
        readonly effects: string[];
    }[] | undefined;
    /**
     * How long, after switching to this item, its user must wait before using it
     */
    get switchDelay(): number;
    /**
     * Information about the position of the shooter's hands
     */
    get handPositions(): {
        readonly leftHand: {
            readonly parr: number;
            readonly perp: number;
            readonly layer?: 0 | 1 | undefined;
        };
        readonly rightHand?: {
            readonly parr: number;
            readonly perp: number;
            readonly layer?: 0 | 1 | undefined;
        } | undefined;
    };
    /**
     * Information about the offset projectiles will be spawned at, relative to their normal position
     */
    get projectileSpawnOffset(): {
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
    get casings(): {
        /**
         * How many casings to spawn per event
         *
         * By default, this is 1 for casings spawned on `fire`, and however many rounds per magazine the weapon has for those spawned on `reload`
         */
        readonly count?: number | undefined;
        /**
         * Where, in relation to the back of the gun, casings should spawn
         */
        readonly spawnOffset: {
            /**
             * The offset along the axis parallel to the user's view line, given in surviv units
             */
            readonly parr: number;
            /**
             * The offset along the axis perpendicular to the user's view line, given in surviv units
             */
            readonly perp: number;
        };
        /**
         * Information about this casing's velocity
         */
        readonly velocity: {
            /**
             * How fast, in surviv units per second, this casing travels along the axis parallel to the player's view line
             */
            readonly parr: MayBeFunctionWrapped<number, []>;
            /**
             * How fast, in surviv units per second, this casing travels along the axis perpendicular to the player's view line
             */
            readonly perp: MayBeFunctionWrapped<number, []>;
        };
        /**
         * Whether to spawn casings when the weapon is fired or when it is reloaded
         */
        readonly spawnOn: "reload" | "fire";
        /**
         * The delay between the casing's spawn action (`spawnOn`) and the casing being spawned. Corresponds to surviv's `pullDelay`
         */
        readonly spawnDelay: number;
    } | undefined;
    /**
     * Information about the animation of the weapon recoiling into the shooter
     */
    get recoilImpulse(): {
        /**
         * The direction of the impulse
         */
        readonly direction: {
            /**
             * The component parallel to the player's aim line, in surviv units
             */
            readonly parr: number;
            /**
             * The component perpendicular to the player's aim line, in surviv units
             */
            readonly perp: number;
        };
        /**
         * How long the animation lasts for
         */
        readonly duration: number;
    };
    /**
     * What fire mode this weapon uses
     */
    get fireMode(): "automatic" | "semi" | `burst-${number}` | `auto-burst-${number}` | "auto-charge" | "release-charge";
    /**
     * Information about this weapon's burst-fire mode, if applicable
     */
    get burstProps(): {
        /**
         * The delay in milliseconds between two shots in a burst
         */
        readonly shotDelay: number;
        /**
         * The delay in milliseconds between two consecutive bursts
         */
        readonly burstDelay: number;
    } | undefined;
    /**
     * Information about this weapon's charging, if applicable
     */
    get chargeProps(): srvsdbx_AssetManagement.ConvertPathsToImages<{
        /**
         * The amount of time the attack input must be held down before this weapon is ready to fire
         */
        readonly chargeTime: number;
        /**
         * A value to be added to the owner's movement speed when this weapon is being charged
         */
        readonly speedPenalty?: number | undefined;
        /**
         * Optionally specify a different world image for when this weapon is in the charged state
         */
        readonly chargeImage?: {
            /**
             * The path to the new image to be used
             */
            readonly image?: string | undefined;
            /**
             * Optionally specify new dimensions for this image
             */
            readonly dimensions?: {
                /**
                 * The new image's width
                 */
                readonly width: Dimension;
                /**
                 * The new image's height
                 */
                readonly height: Dimension;
                /**
                 * The new image's layer
                 */
                readonly layer: 0 | 2 | 1;
            } | undefined;
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
            } | undefined;
        } | undefined;
        /**
         * Optionally specify an image that will be shown in the HUD when this weapon is charging
         *
         * This image will grow in size from left to right as the weapon charges.
         */
        readonly chargeImageHUD?: {
            /**
             * The path to the image to use
             */
            readonly image: string;
            /**
             * How the image should grow as the weapon charges
             *
             * - `clip`: Leave the image at full size, changing the portion that is visible as the charge advances
             * - `scale`: Change the image's width to indicate charge
             */
            readonly growStyle: "clip" | "scale";
        } | undefined;
        /**
         * Optionally specify a particle that will be spawned while this weapon charging
         */
        readonly chargeParticle?: {
            /**
             * The internal name of the particle to spawn
             */
            readonly particle: string;
            /**
             * The particle's offset, using the same coordinate system as `imageOffset`
             */
            readonly offset: {
                /**
                 * The offset along the axis parallel to the player's view line
                 */
                readonly parr: number;
                /**
                 * The offset along the axis perpendicular to the player's view line
                 */
                readonly perp: number;
            };
            /**
             * A function taking the particle's original, intended scale and returning a new scale to use
             */
            readonly scale?: MayBeFunctionWrapped<number, [number, Gun, Particle]> | undefined;
            /**
             * A function taking the particle's original, intended opacity and returning a new opacity to use
             */
            readonly alpha?: MayBeFunctionWrapped<number, [number, Gun, Particle]> | undefined;
        } | undefined;
    }> | undefined;
    /**
     * An array of additional objects that can be rendered alongside this weapon
     *
     * This one is concerned with those residing below the weapon
     */
    get addonsBelow(): (srvsdbx_AssetManagement.ConvertPathsToImages<{
        /**
         * An array containing paths to the images for this addon
         */
        readonly images: string[];
        /**
         * Optionally specifies whether this addon should be shown
         *
         * Defaults to `true`
         */
        readonly show?: MayBeFunctionWrapped<boolean, [Gun]> | undefined;
        /**
         * The color to tint this addon
         */
        readonly tint: MayBeFunctionWrapped<string, [Gun]>;
        /**
         * Specifies this addon's dimensions
         */
        readonly dimensions: {
            /**
             * This addon's width, in surviv units
             */
            readonly width: MayBeFunctionWrapped<Dimension, [Gun]>;
            /**
             * This addon's height, in surviv units
             */
            readonly height: MayBeFunctionWrapped<Dimension, [Gun]>;
            /**
             * The layer at which this addon exists
             *
             * - `-1`: Below the weapon
             * - `1`: Above the weapon
             */
            readonly layer: 1 | -1;
        };
        /**
         * Whether or not this addon should be duplicated if the weapon is dual-wielded
         *
         * Defaults to `true`
         */
        readonly dual?: boolean | undefined;
        /**
         * Whether or not this addon should recoil with the weapon or not
         *
         * Defaults to `false`
         */
        readonly recoil?: boolean | undefined;
        /**
         * Specifies this addon's position, using the same coordinate space as everything else
         * (relative to the player's center)
         */
        readonly position: {
            /**
             * This addon's position along the axis parallel to the player's line of sight
             */
            readonly parr: MayBeFunctionWrapped<number, [Gun]>;
            /**
             * This addon's position along the axis perpendicular to the player's line of sight
             */
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
     * An array of additional objects that can be rendered alongside this weapon
    *
    * This one is concerned with those residing above the weapon
    */
    get addonsAbove(): (srvsdbx_AssetManagement.ConvertPathsToImages<{
        /**
         * An array containing paths to the images for this addon
         */
        readonly images: string[];
        /**
         * Optionally specifies whether this addon should be shown
         *
         * Defaults to `true`
         */
        readonly show?: MayBeFunctionWrapped<boolean, [Gun]> | undefined;
        /**
         * The color to tint this addon
         */
        readonly tint: MayBeFunctionWrapped<string, [Gun]>;
        /**
         * Specifies this addon's dimensions
         */
        readonly dimensions: {
            /**
             * This addon's width, in surviv units
             */
            readonly width: MayBeFunctionWrapped<Dimension, [Gun]>;
            /**
             * This addon's height, in surviv units
             */
            readonly height: MayBeFunctionWrapped<Dimension, [Gun]>;
            /**
             * The layer at which this addon exists
             *
             * - `-1`: Below the weapon
             * - `1`: Above the weapon
             */
            readonly layer: 1 | -1;
        };
        /**
         * Whether or not this addon should be duplicated if the weapon is dual-wielded
         *
         * Defaults to `true`
         */
        readonly dual?: boolean | undefined;
        /**
         * Whether or not this addon should recoil with the weapon or not
         *
         * Defaults to `false`
         */
        readonly recoil?: boolean | undefined;
        /**
         * Specifies this addon's position, using the same coordinate space as everything else
         * (relative to the player's center)
         */
        readonly position: {
            /**
             * This addon's position along the axis parallel to the player's line of sight
             */
            readonly parr: MayBeFunctionWrapped<number, [Gun]>;
            /**
             * This addon's position along the axis perpendicular to the player's line of sight
             */
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
     * An array of additional objects that can be rendered alongside this weapon
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
        readonly show?: MayBeFunctionWrapped<boolean, [Gun]> | undefined;
        /**
         * The color to tint this addon
         */
        readonly tint: MayBeFunctionWrapped<string, [Gun]>;
        /**
         * Specifies this addon's dimensions
         */
        readonly dimensions: {
            /**
             * This addon's width, in surviv units
             */
            readonly width: MayBeFunctionWrapped<Dimension, [Gun]>;
            /**
             * This addon's height, in surviv units
             */
            readonly height: MayBeFunctionWrapped<Dimension, [Gun]>;
            /**
             * The layer at which this addon exists
             *
             * - `-1`: Below the weapon
             * - `1`: Above the weapon
             */
            readonly layer: 1 | -1;
        };
        /**
         * Whether or not this addon should be duplicated if the weapon is dual-wielded
         *
         * Defaults to `true`
         */
        readonly dual?: boolean | undefined;
        /**
         * Whether or not this addon should recoil with the weapon or not
         *
         * Defaults to `false`
         */
        readonly recoil?: boolean | undefined;
        /**
         * Specifies this addon's position, using the same coordinate space as everything else
         * (relative to the player's center)
         */
        readonly position: {
            /**
             * This addon's position along the axis parallel to the player's line of sight
             */
            readonly parr: MayBeFunctionWrapped<number, [Gun]>;
            /**
             * This addon's position along the axis perpendicular to the player's line of sight
             */
            readonly perp: MayBeFunctionWrapped<number, [Gun]>;
        };
    }>[] | undefined;
    /**
     * Takes a simplified representation of a melee weapon and converts it into a more rigorous one
     * @param obj The `SimpleGun` object to parse
     * @returns A new `GunPrototype`
     */
    static from(obj: SimpleGun): Promise<srvsdbx_ErrorHandling.Result<GunPrototype, SandboxError[]>>;
    /**
     * Creates an `Animation` object representing the animation of this weapon recoiling backwards
     * @param handPositions The default hand positions for this weapon
     * @param worldImage This weapon's world image
     * @param dimensions The world image's dimensions
     * @param imageOffset The offset relative to the player at which the world image is drawn
     * @param recoilImpulse Information about the recoil impulse this animation will be based on
     * @returns An `Animation` object representing the weapon recoiling into the shooter
     */
    static generateRecoilAnimation(handPositions: typeof GunPrototype.prototype.handPositions, worldImage: typeof InventoryItemPrototype.prototype.images.world & {}, dimensions: typeof GunPrototype.prototype.dimensions, imageOffset: typeof GunPrototype.prototype.imageOffset, recoilImpulse: typeof GunPrototype.prototype.recoilImpulse): srvsdbx_Animation.Animation<Required<ItemAnimation & {
        item: {
            offset: {
                parr: number;
                perp: number;
            };
        };
    }>>;
    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(name: typeof ImportedObject.prototype.name, displayName: typeof ImportedObject.prototype.displayName, objectType: typeof ImportedObject.prototype.objectType, includePath: typeof ImportedObject.prototype.includePath, namespace: typeof ImportedObject.prototype.namespace, targetVersion: typeof ImportedObject.prototype.targetVersion, images: typeof GunPrototype.prototype.images, dual: typeof GunPrototype.prototype.dual, tint: typeof GunPrototype.prototype.tint, ballistics: typeof GunPrototype.prototype.ballistics, effectsOnFire: typeof GunPrototype.prototype.effectsOnFire, suppressed: typeof GunPrototype.prototype.suppressed, caliber: typeof GunPrototype.prototype.caliber, useDelay: typeof GunPrototype.prototype.useDelay, deployGroup: typeof GunPrototype.prototype.deployGroup, accuracy: typeof GunPrototype.prototype.accuracy, moveSpeedPenalties: typeof GunPrototype.prototype.moveSpeedPenalties, imageOffset: typeof GunPrototype.prototype.imageOffset, dimensions: typeof GunPrototype.prototype.dimensions, reload: typeof GunPrototype.prototype.reload, altReload: typeof GunPrototype.prototype.altReload, magazineCapacity: typeof GunPrototype.prototype.magazineCapacity, switchDelay: typeof GunPrototype.prototype.switchDelay, handPositions: typeof GunPrototype.prototype.handPositions, projectileSpawnOffset: typeof GunPrototype.prototype.projectileSpawnOffset, casings: typeof GunPrototype.prototype.casings, recoilImpulse: typeof GunPrototype.prototype.recoilImpulse, fireMode: typeof GunPrototype.prototype.fireMode, burstProps: typeof GunPrototype.prototype.burstProps, chargeProps: typeof GunPrototype.prototype.chargeProps, addons: typeof GunPrototype.prototype.addons);
}
/**
 * Represents a physical firearm in the game world
 */
declare class Gun extends InventoryItem<GunPrototype> implements EquipableItem<Required<ItemAnimation> & {
    item: {
        offset: {
            parr: number;
            perp: number;
        };
    };
}>, Destroyable {
    #private;
    /**
     * An object to manage this item's animations
     */
    get animationManager(): srvsdbx_Animation.AnimationManager<Required<ItemAnimation & {
        item: {
            offset: {
                parr: number;
                perp: number;
            };
        };
    }>, "idle" | "using">;
    /**
     * The last time this weapon was fired
     */
    get lastUse(): number;
    /**
     * The ammunition currently in this weapon
     */
    get ammo(): number;
    /**
     * The number of shots this weapon has fired in the current "volley"
     *
     * A "volley" is defined as all the shots fired by a user through a single mouse press
     */
    get shots(): number;
    /**
     * For dual-wielded weapons. Controls whether the left of right gun is fired
     */
    get recoilImpulseParity(): number;
    /**
     * This weapon image's final dimensions
     */
    get dimensions(): {
        width: number;
        height: number;
    };
    /**
     * The final dimensions of this weapon's charged dimensions, if applicable
     */
    get chargedDimensions(): srvsdbx_ErrorHandling.Maybe<{
        width: number;
        height: number;
    }>;
    /**
     * Whether or not the weapon is currently charged
     */
    get charged(): boolean;
    /**
     * The last time this weapon started being charged
     */
    get chargeStart(): number;
    /**
     * Whether or not this weapon is currently being charged
     */
    get isCharging(): boolean;
    /**
     * Whether or not this firearm's animation has been cancelled
     */
    get cancelledAnimation(): boolean;
    /**
     * Tells this weapon to attempt a reload after `delay` milliseconds.
     * @param delay The amount of milliseconds to wait before attempting to reload
     * @returns A function that, when called, will cancel the reload
     */
    scheduleReload(delay: number): () => void;
    /**
     * `* It's a constructor. It constructs.`
     * @param owner The `PlayerLike` that owns this weapon
     * @param prototype The `GunPrototype` this object is based on
     */
    constructor(owner: PlayerLike, prototype: GunPrototype);
    /**
     * Returns this item's current dimensions and offsets, taking animations into account
     *
     * **This method will stop expired animations.**
     * More specifically, if an idle animation is running, but the using animation should be used,
     * the idle animation will be terminated
     */
    getItemReference(): ({
        readonly dimensions?: {
            readonly width?: number | undefined;
            readonly height?: number | undefined;
        } | undefined;
        readonly offset?: {
            readonly parr?: number | undefined;
            readonly perp?: number | undefined;
            readonly angle?: number | undefined;
        } | undefined;
    } & {
        offset: {
            parr: number;
            perp: number;
        };
    }) | undefined;
    /**
     * Returns this item's current hand rigging, taking animations into account
     *
     * **This method will stop expired animations.**
     * More specifically, if an idle animation is running, but the using animation should be used,
     * the idle animation will be terminated
     */
    getHandReference(): HandPositions | undefined;
    /**
     * Serves to stop any animation related to this weapon that are currently playeing
     */
    stopAnimations(): void;
    /**
     * A standard method for firing a weapon. Unless your weapon does something radically different on fire, use this method
     */
    usePrimary(): void;
    /**
     * Resets this weapon's fields
     */
    reset(): void;
    /**
     * A standard method for reloading a weapon
     */
    standardReload(): void;
    /**
     * Figures out whether, given the weapon's current state, the regular or alternate reload should be used
     */
    determineReloadType(): {
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
     * Starts charging this weapon
     */
    startCharging(): void;
    /**
     * Stops charging this weapon
     */
    stopCharging(): void;
    /**
     * Spawns a new casing from this weapon, with an optional delay
     * @param delay How much time, in ms, to wait before spawning the casing
     */
    makeCasing(delay?: number): void;
    /**
     * Clears this instance's object attributes
     */
    destroy(): void;
}
/**
 * A simplified representation of an ammo object
 */
interface SimpleAmmo extends SimpleImport {
    /**
     * Information about the various colors of this ammo's tracers
     */
    readonly tints: {
        /**
         * The regular color tracers should adopt
         */
        readonly normal: string;
        /**
         * A color unused in regular surviv
         */
        readonly saturated: string;
        /**
         * The color to used when the user is under the effects of a perk such as Hollow Points
         */
        readonly chambered: string;
    };
    /**
     * Information about how opaque this tracer is
     */
    readonly alpha: {
        /**
         * The rate at which the tracer's opacity changes, measured in %/ms
         */
        readonly rate: number;
        /**
         * The minimum opacity of a tracer
         */
        readonly min: number;
        /**
         * The maximum opacity of a tracer
         */
        readonly max: number;
    };
    /**
     * Either the dimensions of a box or the radius of a circle.
     *
     * The area outlined by this shape defines where projectiles of this ammo type may spawn
     */
    readonly spawnVar?: {
        /**
         * The rectangle's width
         */
        readonly width: number;
        /**
         * The rectangle's height
         */
        readonly height: number;
    } | {
        /**
         * The circle's radius
         */
        readonly radius: number;
    };
    /**
     * Dictates an offset, relative to the projectile's hitbox, that this tracer will be drawn at
     */
    readonly imageOffset: {
        /**
         * The offset along the axis parallel to the projectile's trajectory
         */
        readonly parr: number;
        /**
         * The offset along the axis perpendicular to the projectile's trajectory
         */
        readonly perp: number;
    };
    /**
     * Information pertaining more to the projectile itself
     */
    readonly projectileInfo: ({
        /**
         * The projectile's type
         */
        readonly type: "explosive";
        /**
         * The *internal name* of the explosion object associated with this projectile
         */
        readonly explosionType: PrototypeReference<"explosions">;
        /**
         * Whether or not the explosion should be spawned when colliding with an object or not
         */
        readonly explodeOnContact: boolean;
        /**
         * Dictates the magnitude of the scaling effect applied to this projectile's world image in order to simulate height change
         */
        readonly heightPeak?: number;
    } | {
        /**
         * The projectile's type
         */
        readonly type: "bullet";
    }) & {
        /**
         * An array containing paths for the images corresponding to this projectile
         *
         * If this ammo type has no images, specify the string `"none"`
         */
        readonly images: string[] | "none";
        /**
         * How fast, in rad/s, this projectile should spin
         */
        readonly spinVel?: MayBeFunctionWrapped<number>;
    };
    /**
     * The internal name of the particle corresponding to the casing guns firing this ammo type eject
     */
    readonly casing?: string;
}
/**
 * Represents an ammo type
 */
declare class Ammo extends ImportedObject {
    #private;
    /**
     * Takes a simplified representation of an ammo type and attempts to convert it into a more rigorous one
     * @param obj The `SimpleAmmo` object to parse
     * @returns Either a new `Ammo` object, or an array containing the errors that prevented its creation
     */
    static from(ammo: SimpleAmmo): Promise<srvsdbx_ErrorHandling.Result<Ammo, SandboxError[]>>;
    /**
     * Information about the various colors of this ammo's tracers
     */
    get tints(): {
        /**
         * The regular color tracers should adopt
         */
        readonly normal: string;
        /**
         * A color unused in regular surviv
         */
        readonly saturated: string;
        /**
         * The color to used when the user is under the effects of a perk such as Hollow Points
         */
        readonly chambered: string;
    };
    /**
     * Information about how opaque this tracer is
     */
    get alpha(): {
        /**
         * The rate at which the tracer's opacity changes, measured in %/ms
         */
        readonly rate: number;
        /**
         * The minimum opacity of a tracer
         */
        readonly min: number;
        /**
         * The maximum opacity of a tracer
         */
        readonly max: number;
    };
    /**
     * Either the dimensions of a box or the radius of a circle.
     *
     * The area outlined by this shape defines where projectiles of this ammo type may spawn
     */
    get spawnVar(): {
        /**
         * The rectangle's width
         */
        readonly width: number;
        /**
         * The rectangle's height
         */
        readonly height: number;
    } | {
        /**
         * The circle's radius
         */
        readonly radius: number;
    } | undefined;
    /**
     * Dictates an offset, relative to the projectile's hitbox, that this tracer will be drawn at
     */
    get imageOffset(): {
        /**
         * The offset along the axis parallel to the projectile's trajectory
         */
        readonly parr: number;
        /**
         * The offset along the axis perpendicular to the projectile's trajectory
         */
        readonly perp: number;
    };
    /**
     * Information pertaining more to the projectile itself
     */
    get projectileInfo(): ({
        /**
         * The projectile's type
         */
        readonly type: "explosive";
        /**
         * The *internal name* of the explosion object associated with this projectile
         */
        readonly explosionType: string;
        /**
         * Whether or not the explosion should be spawned when colliding with an object or not
         */
        readonly explodeOnContact: boolean;
        /**
         * Dictates the magnitude of the scaling effect applied to this projectile's world image in order to simulate height change
         */
        readonly heightPeak?: number | undefined;
    } | {
        /**
         * The projectile's type
         */
        readonly type: "bullet";
    }) & {
        /**
         * An array containing paths for the images corresponding to this projectile
         *
         * If this ammo type has no images, specify the string `"none"`
         */
        readonly images: "none" | srvsdbx_AssetManagement.ImageSrcPair[];
        /**
         * How fast, in rad/s, this projectile should spin
         */
        readonly spinVel?: MayBeFunctionWrapped<number, []> | undefined;
    };
    /**
     * The internal name of the particle corresponding to the casing guns firing this ammo type eject
     */
    get casing(): string | undefined;
    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(name: typeof ImportedObject.prototype.name, displayName: typeof ImportedObject.prototype.displayName, objectType: typeof ImportedObject.prototype.objectType, includePath: typeof ImportedObject.prototype.includePath, namespace: typeof ImportedObject.prototype.namespace, targetVersion: typeof ImportedObject.prototype.targetVersion, tints: typeof Ammo.prototype.tints, alpha: typeof Ammo.prototype.alpha, spawnVar: typeof Ammo.prototype.spawnVar, imageOffset: typeof Ammo.prototype.imageOffset, projectileInfo: typeof Ammo.prototype.projectileInfo, casing: typeof Ammo.prototype.casing);
}
