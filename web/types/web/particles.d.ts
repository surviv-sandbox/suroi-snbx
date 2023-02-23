/**
 * A simple representation of a particle
 */
interface SimpleParticle extends SimpleImport {
    /**
     * A path to this particle's images
     */
    readonly images: string[];
    /**
     * The length of time this particle will exist for
     */
    readonly lifetime: MayBeFunctionWrapped<number>;
    /**
     * Pragmatically, a scale factor for this particle's physics: a value of 1 is normal 0.5 is half speed, etc
     */
    readonly drag: MayBeFunctionWrapped<number>;
    /**
     * The angular velocity at which this particle spins, in radians per second
     */
    readonly rotVel: MayBeFunctionWrapped<number>;
    /**
     * Information about the original size of this particle; `scale` applies itself to this
     */
    readonly baseSize: {
        /**
         * The "normal" width of this particle
         */
        readonly width: MayBeFunctionWrapped<Dimension>;
        /**
         * The "normal" height of this particle
         */
        readonly height: MayBeFunctionWrapped<Dimension>;
    };
    /**
     * Information about the scaling of this particle's image.
     */
    readonly scale: {
        /**
         * The scale this image starts at
         */
        readonly start: MayBeFunctionWrapped<number>;
        /**
         * The scale this image ends at
         */
        readonly end: MayBeFunctionWrapped<number>;
        /**
         * Optionally, a function that will be used to interpolate between
         * the two bounds
         */
        readonly interp?: srvsdbx_Animation.EasingFunction;
    } | MayBeFunctionWrapped<number, [Particle]>;
    /**
     * Information about the opacity of this particle's image.
     */
    readonly alpha: {
        /**
         * The opacity this image starts at
         */
        readonly start: MayBeFunctionWrapped<number>;
        /**
         * The opacity this image ends at
         */
        readonly end: MayBeFunctionWrapped<number>;
        /**
         * Optionally, a function that will be used to interpolate between
         * the two bounds
         */
        readonly interp?: srvsdbx_Animation.EasingFunction;
    } | MayBeFunctionWrapped<number, [Particle]>;
    /**
     * The color to tint this image. While it can have an alpha channel, it's better to use the `alpha` property to do this
     */
    readonly tint: MayBeFunctionWrapped<string>;
    /**
     * The sublayering to apply to this particle. Particles whose sublayer is greater than or equal 0 are drawn above the player,
     * those whose sublayer is below 0 are drawn below. As the name implies, a particle on layer 1 will always be above one on layer
     * 0, regardless of the latter's sublayer.
     */
    readonly subLayer?: number;
}
/**
 * Represents the generalization of a type of particle
 */
declare class ParticlePrototype extends ImportedObject {
    #private;
    /**
     * The `ImageSrcPair` containing this particle's image
     */
    get image(): srvsdbx_AssetManagement.ImageSrcPair[];
    /**
     * The length of time this particle will exist for
     */
    get lifetime(): MayBeFunctionWrapped<number, []>;
    /**
     * Pragmatically, a scale factor for this particle's physics: a value of 1 is normal 0.5 is double speed, etc
     */
    get drag(): MayBeFunctionWrapped<number, []>;
    /**
     * The angular velocity at which this particle spins
     */
    get rotVel(): MayBeFunctionWrapped<number, []>;
    /**
     * Information about the original size of this particle; `scale` applies itself to this
     */
    get baseSize(): {
        /**
         * The "normal" width of this particle
         */
        readonly width: MayBeFunctionWrapped<Dimension, []>;
        /**
         * The "normal" height of this particle
         */
        readonly height: MayBeFunctionWrapped<Dimension, []>;
    };
    /**
     * Information about the scaling of this particle's image
     */
    get scale(): MayBeFunctionWrapped<number, [Particle]> | {
        /**
         * The scale this image starts at
         */
        readonly start: MayBeFunctionWrapped<number, []>;
        /**
         * The scale this image ends at
         */
        readonly end: MayBeFunctionWrapped<number, []>;
        /**
         * Optionally, a function that will be used to interpolate between
         * the two bounds
         */
        readonly interp?: srvsdbx_Animation.EasingFunction | undefined;
    };
    /**
     * Information about the opacity of this particle's image
     */
    get alpha(): MayBeFunctionWrapped<number, [Particle]> | {
        /**
         * The opacity this image starts at
         */
        readonly start: MayBeFunctionWrapped<number, []>;
        /**
         * The opacity this image ends at
         */
        readonly end: MayBeFunctionWrapped<number, []>;
        /**
         * Optionally, a function that will be used to interpolate between
         * the two bounds
         */
        readonly interp?: srvsdbx_Animation.EasingFunction | undefined;
    };
    /**
     * The color to tint this image
     */
    get tint(): MayBeFunctionWrapped<string, []>;
    /**
     * The sublayering to apply to this particle. Particles whose sublayer is greater than or equal 0 are drawn above the player,
     * those whose sublayer is below 0 are drawn below. As the name implies, a particle on layer 1 will always be above one on layer
     * 0, regardless of the latter's sublayer.
     */
    get subLayer(): number | undefined;
    /**
     * Takes a simplified representation of a firearm and converts it into a more rigorous one
     * @param obj The `SimpleParticle` object to parse
     * @returns A new `ParticlePrototype`
     */
    static from(obj: SimpleParticle): Promise<srvsdbx_ErrorHandling.Result<ParticlePrototype, SandboxError[]>>;
    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(name: typeof ImportedObject.prototype.name, displayName: typeof ImportedObject.prototype.displayName, objectType: typeof ImportedObject.prototype.objectType, includePath: typeof ImportedObject.prototype.includePath, namespace: typeof ImportedObject.prototype.namespace, targetVersion: typeof ImportedObject.prototype.targetVersion, image: typeof ParticlePrototype.prototype.image, lifetime: typeof ParticlePrototype.prototype.lifetime, drag: typeof ParticlePrototype.prototype.drag, rotVel: typeof ParticlePrototype.prototype.rotVel, baseSize: typeof ParticlePrototype.prototype.baseSize, scale: typeof ParticlePrototype.prototype.scale, alpha: typeof ParticlePrototype.prototype.alpha, tint: typeof ParticlePrototype.prototype.tint, subLayer: typeof ParticlePrototype.prototype.subLayer);
}
/**
 * Represents a specific particle in the game world
 */
declare class Particle extends Generic implements Destroyable {
    #private;
    /**
     * The timestamp this particle was created at
     */
    get created(): number;
    /**
     * The prototype this particle is based
     */
    get proto(): ParticlePrototype;
    /**
     * The lifetime determined for this specific particle
     */
    get lifetime(): number;
    /**
     * Information about the size this specific particle starts at
     */
    get baseSize(): {
        readonly width: Dimension;
        readonly height: Dimension;
    };
    /**
     * Information about the scaling of this specific particle's image
     */
    get scale(): {
        /**
         * The scale this image starts at
         */
        readonly start: number;
        /**
         * The scale this image ends at
         */
        readonly end: number;
        /**
         * Optionally, a function that will be used to interpolate between
         * the two bounds
         */
        readonly interp: srvsdbx_Animation.EasingFunction;
    } | MayBeFunctionWrapped<number, [Particle]>;
    /**
     * Information about the opacity of this specific particle's image
     */
    get alpha(): MayBeFunctionWrapped<number, [Particle]> | {
        /**
         * The opacity this image starts at
         */
        readonly start: number;
        /**
         * The opacity this image ends at
         */
        readonly end: number;
        /**
         * Optionally, a function that will be used to interpolate between
         * the two bounds
         */
        readonly interp: srvsdbx_Animation.EasingFunction;
    };
    /**
     * The color to tint this particle's image
     */
    get tint(): string;
    /**
     * The drag for this particle
     */
    get drag(): number;
    /**
     * The angular drag for this particle
     */
    get rotDrag(): number;
    /**
     * Either a scale factor that overrides this particle's normal one, or `null`, if such behavior isn't desired
     */
    get forcedScale(): srvsdbx_ErrorHandling.Maybe<number>;
    /**
     * Either an opacity that overrides this particle's normal one, or `null`, if such behavior isn't desired
     */
    get forcedAlpha(): srvsdbx_ErrorHandling.Maybe<number>;
    /**
     * The sublayering to apply to this particle. Particles whose sublayer is greater than or equal 0 are drawn above the player,
     * those whose sublayer is below 0 are drawn below. As the name implies, a particle on layer 1 will always be above one on layer
     * 0, regardless of the latter's sublayer.
     *
     * - `get`: Retrieves this particle's sublayer
     *
     * - `set`: Sets this particle's sublayer to the given value if it is not `NaN`
     */
    get subLayer(): number;
    set subLayer(v: number);
    /**
     * `* It's a constructor. It constructs.`
     * @param proto The prototype this particle is based
     * @param position At what position to spawn this particle
     */
    constructor(proto: ParticlePrototype, position: srvsdbx_Geometry.Point2D, angle: number);
    /**
     * A version of the method it overrides that allows time-scaling
     */
    update(): void;
    /**
     * Identical to the method it overrides, but clears particle-specific object fields
     */
    destroy(): void;
    /**
     * Calculates the scale at which this particle would be drawn and returns it
     */
    getCalculatedScale(): number;
    /**
     * Force a scale value onto this particle, overriding default behavior
     * @param scale The scale factor to force
     */
    forceScale(scale: number): void;
    /**
     * Undos a forced scale factor applied with `forceScale`
     */
    relaxScale(): void;
    /**
     * Calculates the opacity at which this particle would be drawn and returns it
     */
    getCalculatedAlpha(): number;
    /**
     * Force an opacity onto this particle, overriding default behavior
     * @param alpha The opacity to force
     */
    forceAlpha(alpha: number): void;
    /**
     * Undos a forced opacity applied with `forceAlpha`
     */
    relaxAlpha(): void;
}
/**
 * A simplified representation of a decal
 */
interface SimpleDecal extends SimpleImport {
    /**
     * A path to the decal's image
     */
    image: string;
    /**
     * The size of this decal
     */
    size: {
        /**
         * The decal's width
         */
        width: MayBeFunctionWrapped<Dimension>;
        /**
         * The decal's height
         */
        height: MayBeFunctionWrapped<Dimension>;
    };
    /**
     * The color to tint this decal
     */
    tint: MayBeFunctionWrapped<string>;
}
/**
 * Represents the generalization of a certain type of decal
 */
declare class DecalPrototype extends ImportedObject {
    #private;
    /**
     * A path to the decal's image
     */
    get image(): srvsdbx_AssetManagement.ImageSrcPair;
    /**
     * The size of this decal
     */
    get size(): {
        /**
         * The decal's width
         */
        width: MayBeFunctionWrapped<Dimension, []>;
        /**
         * The decal's height
         */
        height: MayBeFunctionWrapped<Dimension, []>;
    };
    /**
     * The color to tint this decal
     */
    get tint(): MayBeFunctionWrapped<string, []>;
    /**
     * Takes a simplified representation of a decal and converts it into a more rigorous one
     * @param obj The `SimpleDecal` object to parse
     * @returns A new `DecalPrototype`
     */
    static from(obj: SimpleDecal): Promise<srvsdbx_ErrorHandling.Result<DecalPrototype, SandboxError[]>>;
    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(name: typeof ImportedObject.prototype.name, displayName: typeof ImportedObject.prototype.displayName, objectType: typeof ImportedObject.prototype.objectType, targetVersion: typeof ImportedObject.prototype.targetVersion, namespace: typeof ImportedObject.prototype.namespace, includePath: typeof ImportedObject.prototype.includePath, image: typeof DecalPrototype.prototype.image, size: typeof DecalPrototype.prototype.size, tint: typeof DecalPrototype.prototype.tint);
}
/**
 * Represents a decal in the game world
 */
declare class Decal implements Destroyable {
    #private;
    /**
     * The `DecalPrototype` this object is based on
     */
    get prototype(): DecalPrototype;
    /**
     * The position of this decal
     */
    get position(): srvsdbx_Geometry.Point3D;
    /**
     * The angle of this decal
     */
    get angle(): number;
    /**
     * The position of this decal
     */
    get dimensions(): {
        /**
         * The decal's width
         */
        width: Dimension;
        /**
         * The decal's height
         */
        height: Dimension;
    };
    /**
     * This decal's tint
     */
    get tint(): srvsdbx_Geometry.Point3D;
    /**
     * This decal's id
     */
    get id(): bigint;
    /**
     * Whether or not this decal has been destroyed
     */
    get destroyed(): boolean;
    /**
     * `* It's a constructor. It constructs.`
     * @param prototype The `DecalPrototype` this decal is based on
     */
    constructor(prototype: DecalPrototype, position: srvsdbx_Geometry.Point2D | srvsdbx_Geometry.Point3D, angle: number);
    /**
     * Draws this decal
     * @param p5 The gamespace's p5 instance
     */
    draw(p5: import("p5")): void;
    /**
     * Similar in spirit to `Generic.destroy`, this method clears any object attributes from this object to encourage the GC to clean up
     */
    destroy(): void;
}
