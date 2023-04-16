declare const Projectile: abstract new (trajectory: {
    start: srvsdbx_Geometry.Point2D;
} & (({
    end: srvsdbx_Geometry.Point2D;
} & ({
    speed: number;
} | {
    lifetime: number;
})) | ({
    direction: number;
} & ({
    lifetime: number;
    speed: number;
} | {
    lifetime: number;
    distance: number;
} | {
    distance: number;
    speed: number;
}))) & {
    initialAngle?: number;
    spinVel?: number;
}, drawFunc: (p5: import("p5")) => void, subLayer?: number) => {
    readonly "__#29@#id": bigint;
    readonly id: bigint;
    "__#29@#start": srvsdbx_Geometry.Point2D;
    readonly start: srvsdbx_Geometry.Point2D;
    "__#29@#end": srvsdbx_Geometry.Point2D;
    readonly end: srvsdbx_Geometry.Point2D;
    "__#29@#created": number;
    readonly created: number;
    "__#29@#lifetime": number;
    readonly lifetime: number;
    "__#29@#position": srvsdbx_Geometry.Point2D;
    position: srvsdbx_Geometry.Point3D;
    "__#29@#layer": number;
    layer: number;
    "__#29@#subLayer": number;
    readonly subLayer: number;
    "__#29@#lastPosition": srvsdbx_Geometry.Point2D;
    readonly lastPosition: srvsdbx_Geometry.Point2D;
    "__#29@#startAngle": number;
    "__#29@#trajectory": number;
    readonly trajectory: number;
    "__#29@#angle": number;
    readonly angle: number;
    "__#29@#angularVelocity": number;
    readonly angularVelocity: number;
    "__#29@#alpha": number;
    alpha: number;
    "__#29@#destroyed": boolean;
    readonly destroyed: boolean;
    "__#29@#collidable": {
        getHitboxName(): "DEFAULT" | "COLLIDABLE" | "SEMI_COLLIDABLE" | "GROUND" | "PARTICLE" | "DECAL" | "AREA_OF_EFFECT" | "REFLECTIVE";
        getHitboxColor(): string;
    };
    collidable: {
        getHitboxName(): "DEFAULT" | "COLLIDABLE" | "SEMI_COLLIDABLE" | "GROUND" | "PARTICLE" | "DECAL" | "AREA_OF_EFFECT" | "REFLECTIVE";
        getHitboxColor(): string;
    };
    readonly "__#29@#events": SandboxEventTarget<{
        collision: [Obstacle | PlayerLike, srvsdbx_Geometry.Point2D[]];
        endOfLife: [];
        destroy: [];
    }>;
    readonly events: SandboxEventTarget<{
        collision: [Obstacle | PlayerLike, srvsdbx_Geometry.Point2D[]];
        endOfLife: [];
        destroy: [];
    }>;
    "__#29@#draw": (p5: import("p5")) => void;
    "__#29@#reflectionRecord": Map<bigint, number>;
    "__#29@#inEndOfLife": boolean;
    readonly inEndOfLife: boolean;
    update(): void;
    draw(p5: import("p5")): void;
    setPosition(pos: srvsdbx_Geometry.Point2D): void;
    reflect(origin: srvsdbx_Geometry.Point2D, direction: number, source: Generic): srvsdbx_ErrorHandling.Result<undefined, string>;
    modifyRange(range: number): srvsdbx_ErrorHandling.Result<undefined, string>;
    getRange(): number;
    initiateDestruction(): void;
    destroy(): void;
};
type Projectile = InstanceType<typeof Projectile>;
declare class Bullet extends Projectile implements Destroyable {
    #private;
    static get MAX_REFLECTIONS(): number;
    static get REFLECTION_RANGE_DECAY_FACTOR(): number;
    get damage(): number;
    get isHeadshot(): boolean;
    get falloff(): number;
    get properties(): ({
        readonly type: "explosive";
        readonly explosionType: string;
        readonly explodeOnContact: boolean;
    } | {
        readonly type: "bullet";
    }) & {
        scale: (t: number) => number;
        alpha: (t: number) => number;
        readonly images: "none" | srvsdbx_AssetManagement.ImageSrcPair[];
        readonly spinVel?: MayBeFunctionWrapped<number, []> | undefined;
    };
    get isExplosive(): boolean;
    get hitCount(): number;
    get multipliers(): {
        readonly headshot: number;
        readonly obstacle: number;
    };
    constructor(position: srvsdbx_Geometry.Point2D, falloff: number, end: srvsdbx_Geometry.Point2D, speed: number, damage: number, drawFunction: (p5: import("p5")) => void, properties: Ammo["projectileInfo"], persistance: Required<GunPrototype["ballistics"]["persistance"] & {}>, effectsOnHit: PrototypeReference<"statusEffects">[] | undefined, isHeadshot: boolean, multipliers: {
        headshot: number;
        obstacle: number;
    }, drawAbovePlayer?: boolean, noCollide?: boolean);
    static drawFromFirearm(emitter: Gun): (this: Bullet, p5: import("p5")) => void;
    static drawFromExplosion(emitter: ExplosionPrototype["shrapnel"] & {}): (this: Bullet, p5: import("p5")) => void;
    static makeShrapnel(pos: srvsdbx_Geometry.Point2D, shrapnelData: ExplosionPrototype["shrapnel"] & {}): Bullet;
    update(): void;
    reflect(origin: srvsdbx_Geometry.Point2D, direction: number, source: Generic<BaseGenericEvents>): srvsdbx_ErrorHandling.Result<undefined, string>;
    destroy(): void;
}
