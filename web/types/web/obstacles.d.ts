/// <reference types="p5" />
type ObstacleTypes = "circle" | "rectangle";
interface SimpleObstacle<S extends ParticleEmitterState & {
    readonly obstacle: Obstacle<ObstacleTypes, S>;
} = ParticleEmitterState & {
    readonly obstacle: Obstacle<ObstacleTypes, any>;
}> extends SimpleImport {
    readonly hitbox: {
        readonly type: "circle";
        readonly radius: MayBeFunctionWrapped<number>;
    } | {
        readonly type: "rectangle";
        readonly dimensions: {
            readonly width: MayBeFunctionWrapped<Dimension>;
            readonly height: MayBeFunctionWrapped<Dimension>;
        };
    };
    scale(health: number): number;
    readonly emitters?: (ParticleEmitter<S>["configuration"] & {
        readonly shouldSpawn?: MayBeFunctionWrapped<boolean, [S]>;
        readonly particleTypes: PrototypeReference<"particles">[];
        readonly initialState: Omit<S, keyof ParticleEmitterState>;
    })[];
    readonly imageScale?: number;
    readonly destroyable: boolean;
    readonly armorPlated: boolean;
    readonly stonePlated: boolean;
    readonly collidable: CollisionLevel;
    readonly reflective: boolean;
    readonly skipProjectileHitIncrement?: boolean;
    readonly hitParticle: {
        readonly particle: PrototypeReference<"particles">;
        readonly count: MayBeFunctionWrapped<number>;
    };
    readonly destroyParticle: {
        readonly particle: PrototypeReference<"particles">;
        readonly count: MayBeFunctionWrapped<number>;
    };
    readonly destructionExplosion?: PrototypeReference<"explosions">;
    readonly residue?: {
        readonly decal: PrototypeReference<"decals">;
        readonly noRotate?: boolean;
    };
    readonly subLayer?: number;
    readonly baseHP: number;
    readonly images: string[];
}
declare class ObstaclePrototype<T extends ObstacleTypes = ObstacleTypes, S extends ParticleEmitterState & {
    readonly obstacle: Obstacle<ObstacleTypes, S>;
} = ParticleEmitterState & {
    readonly obstacle: Obstacle<ObstacleTypes, any>;
}> extends ImportedObject {
    #private;
    get baseHP(): number;
    get destroyable(): boolean;
    get collidable(): {
        getHitboxName(): "DEFAULT" | "COLLIDABLE" | "SEMI_COLLIDABLE" | "GROUND" | "PARTICLE" | "DECAL" | "AREA_OF_EFFECT" | "REFLECTIVE";
        getHitboxColor(): string;
    };
    get skipProjectileHitCount(): boolean;
    get hitbox(): ({
        readonly type: "circle";
        readonly radius: MayBeFunctionWrapped<number, []>;
    } | {
        readonly type: "rectangle";
        readonly dimensions: {
            readonly width: MayBeFunctionWrapped<Dimension, []>;
            readonly height: MayBeFunctionWrapped<Dimension, []>;
        };
    }) & {
        type: T;
    };
    get images(): srvsdbx_AssetManagement.ImageSrcPair[];
    get emitters(): ({
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
    } & {
        readonly shouldSpawn?: MayBeFunctionWrapped<boolean, [S]> | undefined;
        readonly particleTypes: string[];
        readonly initialState: Omit<S, keyof ParticleEmitterState>;
    })[];
    get armorPlated(): boolean;
    get stonePlated(): boolean;
    get hitParticle(): {
        readonly particle: string;
        readonly count: MayBeFunctionWrapped<number, []>;
    };
    get destroyParticle(): {
        readonly particle: string;
        readonly count: MayBeFunctionWrapped<number, []>;
    };
    get destructionExplosion(): string | undefined;
    get residue(): {
        readonly decal: string;
        readonly noRotate?: boolean | undefined;
    } | undefined;
    get imageScale(): number;
    get reflective(): boolean;
    get subLayer(): number;
    get scale(): (health: number) => number;
    static from(obj: SimpleObstacle): Promise<srvsdbx_ErrorHandling.Result<ObstaclePrototype, srvsdbx_Errors.SandboxError[]>>;
    constructor(name: ImportedObject["name"], objectType: ImportedObject["objectType"], targetVersion: ImportedObject["targetVersion"], namespace: ImportedObject["namespace"], includePath: ImportedObject["includePath"], hitbox: ObstaclePrototype<T>["hitbox"], images: ObstaclePrototype["images"], scale: ObstaclePrototype["scale"], emitters: ObstaclePrototype<T, S>["emitters"], hitParticle: ObstaclePrototype["hitParticle"], destroyParticle: ObstaclePrototype["destroyParticle"], destructionExplosion: ObstaclePrototype["destructionExplosion"], residue: ObstaclePrototype["residue"], collidable: CollisionLevel, destroyable: boolean, armorPlated: boolean, stonePlated: boolean, reflective: boolean, skipProjectileHitCount: boolean, baseHP: number, imageScale: number, subLayer: number);
    create(position: srvsdbx_Geometry.Point2D): Obstacle<T, S>;
}
declare class Obstacle<T extends ObstacleTypes = ObstacleTypes, S extends ParticleEmitterState & {
    readonly obstacle: Obstacle<ObstacleTypes, S>;
} = ParticleEmitterState & {
    readonly obstacle: Obstacle<ObstacleTypes, any>;
}> extends Generic<{
    collision: [Generic, srvsdbx_Geometry.Point2D[]];
    death: [];
}> implements Destroyable {
    #private;
    body: T extends "rectangle" ? srvsdbx_Geometry.Rectangle : srvsdbx_Geometry.Circle;
    get prototype(): ObstaclePrototype<T, S>;
    get health(): number;
    get radius(): T extends "circle" ? number : undefined;
    get dimensions(): T extends "rectangle" ? {
        readonly width: number;
        readonly height: number;
    } : undefined;
    get scale(): number;
    get image(): import("p5").Image;
    get subLayer(): number;
    constructor(prototype: ObstaclePrototype<T, S>, position: srvsdbx_Geometry.Point2D);
    update(): void;
    applyBulletDamage(source: Bullet): void;
    applyDamage(amount: number): void;
    destroy(): void;
}
