interface SimpleParticle extends SimpleImport {
    readonly images: string[];
    readonly lifetime: MayBeFunctionWrapped<number>;
    readonly drag: MayBeFunctionWrapped<number>;
    readonly angularVelocity: MayBeFunctionWrapped<number>;
    readonly baseSize: {
        readonly width: MayBeFunctionWrapped<Dimension>;
        readonly height: MayBeFunctionWrapped<Dimension>;
    };
    readonly scale: {
        readonly start: MayBeFunctionWrapped<number>;
        readonly end: MayBeFunctionWrapped<number>;
        readonly interp?: srvsdbx_Animation.EasingFunction;
    } | MayBeFunctionWrapped<number, [Particle]>;
    readonly alpha: {
        readonly start: MayBeFunctionWrapped<number>;
        readonly end: MayBeFunctionWrapped<number>;
        readonly interp?: srvsdbx_Animation.EasingFunction;
    } | MayBeFunctionWrapped<number, [Particle]>;
    readonly tint: MayBeFunctionWrapped<string>;
    readonly subLayer?: number;
}
declare class ParticlePrototype extends ImportedObject {
    #private;
    get image(): srvsdbx_AssetManagement.ImageSrcPair[];
    get lifetime(): MayBeFunctionWrapped<number, []>;
    get drag(): MayBeFunctionWrapped<number, []>;
    get angularVelocity(): MayBeFunctionWrapped<number, []>;
    get baseSize(): {
        readonly width: MayBeFunctionWrapped<Dimension, []>;
        readonly height: MayBeFunctionWrapped<Dimension, []>;
    };
    get scale(): {
        readonly start: MayBeFunctionWrapped<number, []>;
        readonly end: MayBeFunctionWrapped<number, []>;
        readonly interp?: srvsdbx_Animation.EasingFunction | undefined;
    } | MayBeFunctionWrapped<number, [Particle]>;
    get alpha(): MayBeFunctionWrapped<number, [Particle]> | {
        readonly start: MayBeFunctionWrapped<number, []>;
        readonly end: MayBeFunctionWrapped<number, []>;
        readonly interp?: srvsdbx_Animation.EasingFunction | undefined;
    };
    get tint(): MayBeFunctionWrapped<string, []>;
    get subLayer(): number | undefined;
    static from(obj: SimpleParticle): Promise<srvsdbx_ErrorHandling.Result<ParticlePrototype, srvsdbx_Errors.SandboxError[]>>;
    constructor(name: ImportedObject["name"], displayName: ImportedObject["displayName"], objectType: ImportedObject["objectType"], includePath: ImportedObject["includePath"], namespace: ImportedObject["namespace"], targetVersion: ImportedObject["targetVersion"], image: ParticlePrototype["image"], lifetime: ParticlePrototype["lifetime"], drag: ParticlePrototype["drag"], angularVelocity: ParticlePrototype["angularVelocity"], baseSize: ParticlePrototype["baseSize"], scale: ParticlePrototype["scale"], alpha: ParticlePrototype["alpha"], tint: ParticlePrototype["tint"], subLayer: ParticlePrototype["subLayer"]);
    create(position: srvsdbx_Geometry.Point2D, angle: number): Particle;
}
declare class Particle extends Generic implements Destroyable {
    #private;
    get created(): number;
    get proto(): ParticlePrototype;
    get lifetime(): number;
    get baseSize(): {
        readonly width: Dimension;
        readonly height: Dimension;
    };
    get scale(): MayBeFunctionWrapped<number, [Particle]> | {
        readonly start: number;
        readonly end: number;
        readonly interp: srvsdbx_Animation.EasingFunction;
    };
    get alpha(): MayBeFunctionWrapped<number, [Particle]> | {
        readonly start: number;
        readonly end: number;
        readonly interp: srvsdbx_Animation.EasingFunction;
    };
    get tint(): string;
    get drag(): number;
    get rotDrag(): number;
    get forcedScale(): srvsdbx_ErrorHandling.Maybe<number>;
    get forcedAlpha(): srvsdbx_ErrorHandling.Maybe<number>;
    get subLayer(): number;
    set subLayer(v: number);
    constructor(proto: ParticlePrototype, position: srvsdbx_Geometry.Point2D, angle: number);
    update(): void;
    getCalculatedScale(): number;
    forceScale(scale: number): void;
    relaxScale(): void;
    getCalculatedAlpha(): number;
    forceAlpha(alpha: number): void;
    relaxAlpha(): void;
    destroy(): void;
}
type ParticleEmitterState = {
    lastParticleSpawn: number;
    spawnCount: number;
    spawnDelay: number;
};
declare class ParticleEmitter<S extends ParticleEmitterState = ParticleEmitterState> implements Destroyable {
    #private;
    get id(): bigint;
    get types(): ParticlePrototype[];
    get created(): number;
    get state(): S;
    get configuration(): {
        readonly spawnDelay: MayBeFunctionWrapped<number, [S]>;
        readonly spawnCount: MayBeFunctionWrapped<number, [S]>;
        readonly area: MayBeFunctionWrapped<srvsdbx_Geometry.Point2D | srvsdbx_Geometry.Shape, [S]>;
        readonly particleProperties: MayBeFunctionWrapped<{
            readonly angle?: MayBeFunctionWrapped<number, []> | undefined;
            readonly scale?: MayBeFunctionWrapped<number, []> | undefined;
            readonly alpha?: MayBeFunctionWrapped<number, []> | undefined;
            readonly velocity?: MayBeFunctionWrapped<srvsdbx_Geometry.Point2D, []> | undefined;
            readonly angularVelocity?: MayBeFunctionWrapped<number, []> | undefined;
        }, [S]>;
    };
    get position(): srvsdbx_Geometry.Point3D;
    get destroyed(): boolean;
    get enabled(): boolean;
    enable(): void;
    disable(): void;
    toggle(): void;
    constructor(position: srvsdbx_Geometry.Point3D, particleTypes: ParticlePrototype[], configuration: ParticleEmitter<S>["configuration"], state?: Omit<S, keyof ParticleEmitterState>);
    draw(p5: import("p5")): void;
    update(): void;
    destroy(): void;
}
interface SimpleDecal extends SimpleImport {
    readonly image: string;
    readonly size: {
        readonly width: MayBeFunctionWrapped<Dimension>;
        readonly height: MayBeFunctionWrapped<Dimension>;
    };
    readonly tint: MayBeFunctionWrapped<string>;
}
declare class DecalPrototype extends ImportedObject {
    #private;
    get image(): srvsdbx_AssetManagement.ImageSrcPair;
    get size(): {
        readonly width: MayBeFunctionWrapped<Dimension, []>;
        readonly height: MayBeFunctionWrapped<Dimension, []>;
    };
    get tint(): MayBeFunctionWrapped<string, []>;
    static from(obj: SimpleDecal): Promise<srvsdbx_ErrorHandling.Result<DecalPrototype, srvsdbx_Errors.SandboxError[]>>;
    constructor(name: ImportedObject["name"], displayName: ImportedObject["displayName"], objectType: ImportedObject["objectType"], targetVersion: ImportedObject["targetVersion"], namespace: ImportedObject["namespace"], includePath: ImportedObject["includePath"], image: DecalPrototype["image"], size: DecalPrototype["size"], tint: DecalPrototype["tint"]);
    create(position: srvsdbx_Geometry.Point2D | srvsdbx_Geometry.Point3D, angle: number): Decal;
}
declare class Decal implements Destroyable {
    #private;
    get prototype(): DecalPrototype;
    get position(): srvsdbx_Geometry.Point3D;
    get angle(): number;
    get dimensions(): {
        readonly width: Dimension;
        readonly height: Dimension;
    };
    get tint(): srvsdbx_Geometry.Point3D;
    get id(): bigint;
    get destroyed(): boolean;
    constructor(prototype: DecalPrototype, position: srvsdbx_Geometry.Point2D | srvsdbx_Geometry.Point3D, angle: number);
    draw(p5: import("p5")): void;
    destroy(): void;
}
