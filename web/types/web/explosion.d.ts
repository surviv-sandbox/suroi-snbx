interface SimpleExplosion extends SimpleImport {
    readonly damage: number;
    readonly obstacleMultiplier: number;
    readonly radii: {
        readonly min: number;
        readonly max: number;
    };
    readonly particle?: PrototypeReference<"particles">;
    readonly shakeStrength?: MayBeFunctionWrapped<number>;
    readonly shakeDuration?: MayBeFunctionWrapped<number>;
    readonly decal?: PrototypeReference<"decals">;
    readonly shrapnel?: {
        readonly count: MayBeFunctionWrapped<number>;
        readonly damage: number;
        readonly velocity: number;
        readonly range: MayBeFunctionWrapped<number>;
        readonly falloff: number;
        readonly tracer: {
            readonly image: string;
            readonly color: string;
            readonly width: Dimension;
            readonly height: Dimension;
        };
    };
    readonly scatter?: {
        readonly count: number;
        readonly velocity: MayBeFunctionWrapped<number>;
        readonly particleType: string;
    };
}
declare class ExplosionPrototype extends ImportedObject {
    #private;
    get damage(): number;
    get obstacleMultiplier(): number;
    get radii(): {
        readonly min: number;
        readonly max: number;
    };
    get particle(): string | undefined;
    get shakeStrength(): MayBeFunctionWrapped<number, []> | undefined;
    get shakeDuration(): MayBeFunctionWrapped<number, []> | undefined;
    get decal(): string | undefined;
    get shrapnel(): srvsdbx_AssetManagement.ConvertPathsToImages<{
        readonly count: MayBeFunctionWrapped<number, []>;
        readonly damage: number;
        readonly velocity: number;
        readonly range: MayBeFunctionWrapped<number, []>;
        readonly falloff: number;
        readonly tracer: {
            readonly image: string;
            readonly color: string;
            readonly width: Dimension;
            readonly height: Dimension;
        };
    }> | undefined;
    get scatter(): {
        readonly count: number;
        readonly velocity: MayBeFunctionWrapped<number, []>;
        readonly particleType: string;
    } | undefined;
    static from(obj: SimpleExplosion): Promise<srvsdbx_ErrorHandling.Result<ExplosionPrototype, srvsdbx_Errors.SandboxError[]>>;
    constructor(name: ImportedObject["name"], displayName: ImportedObject["displayName"], objectType: ImportedObject["objectType"], includePath: ImportedObject["includePath"], namespace: ImportedObject["namespace"], targetVersion: ImportedObject["targetVersion"], damage: ExplosionPrototype["damage"], obstacleMultiplier: ExplosionPrototype["obstacleMultiplier"], radii: ExplosionPrototype["radii"], particle: ExplosionPrototype["particle"], shakeStrength: ExplosionPrototype["shakeStrength"], shakeDuration: ExplosionPrototype["shakeDuration"], decal: ExplosionPrototype["decal"], shrapnel: ExplosionPrototype["shrapnel"], scatter: ExplosionPrototype["scatter"]);
    create(position: srvsdbx_Geometry.Point3D, effectsOnHit?: PrototypeReference<"statusEffects">[]): Explosion;
}
declare class Explosion implements Destroyable {
    #private;
    get prototype(): ExplosionPrototype;
    get position(): srvsdbx_Geometry.Point3D;
    get id(): bigint;
    get duration(): number;
    get strength(): number;
    get created(): number;
    get destroyed(): boolean;
    constructor(prototype: ExplosionPrototype, position: srvsdbx_Geometry.Point3D, effectsOnHit?: PrototypeReference<"statusEffects">[]);
    update(): void;
    draw(p5: import("p5")): void;
    destroy(): void;
}
