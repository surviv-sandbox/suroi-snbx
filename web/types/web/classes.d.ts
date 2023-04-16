/// <reference types="p5" />
type BaseGenericEvents = {
    collision: [Generic, srvsdbx_Geometry.Point2D[]];
};
declare const CollisionLevels: {
    readonly NONE: {
        getHitboxName(): keyof Gamespace["settings"]["debugColors"];
        getHitboxColor(): string;
    };
    readonly NO_PLAYER: {
        getHitboxName(): keyof Gamespace["settings"]["debugColors"];
        getHitboxColor(): string;
    };
    readonly ALL: {
        getHitboxName(): keyof Gamespace["settings"]["debugColors"];
        getHitboxColor(): string;
    };
};
type CollisionLevel = typeof CollisionLevels[keyof typeof CollisionLevels];
declare const Generic: abstract new <E extends BaseGenericEvents = BaseGenericEvents>(body: srvsdbx_Geometry.Shape, drawFunction: (p5: import("p5")) => void, position: srvsdbx_Geometry.Point2D | srvsdbx_Geometry.Point3D, angle?: number) => {
    readonly "__#3@#body": srvsdbx_Geometry.Shape;
    readonly body: srvsdbx_Geometry.Shape;
    collidable: CollisionLevel;
    readonly "__#3@#velocityMap": ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
    readonly velocityMap: ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
    readonly "__#3@#angularVelocityMap": ReducibleMap<string, number, number>;
    readonly angularVelocityMap: ReducibleMap<string, number, number>;
    "__#3@#angle": number;
    angle: number;
    "__#3@#layer": number;
    layer: number;
    readonly position: srvsdbx_Geometry.Point3D;
    readonly "__#3@#draw": (p5: import("p5")) => void;
    readonly "__#3@#events": SandboxEventTarget<E>;
    readonly events: SandboxEventTarget<E>;
    "__#3@#destroyed": boolean;
    readonly destroyed: boolean;
    readonly "__#3@#id": bigint;
    readonly id: bigint;
    "__#3@#parent": srvsdbx_ErrorHandling.Maybe<{
        readonly "__#3@#body": srvsdbx_Geometry.Shape;
        readonly body: srvsdbx_Geometry.Shape;
        collidable: CollisionLevel;
        readonly "__#3@#velocityMap": ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
        readonly velocityMap: ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
        readonly "__#3@#angularVelocityMap": ReducibleMap<string, number, number>;
        readonly angularVelocityMap: ReducibleMap<string, number, number>;
        "__#3@#angle": number;
        angle: number;
        "__#3@#layer": number;
        layer: number;
        readonly position: srvsdbx_Geometry.Point3D;
        readonly "__#3@#draw": (p5: import("p5")) => void;
        readonly "__#3@#events": SandboxEventTarget<BaseGenericEvents>;
        readonly events: SandboxEventTarget<BaseGenericEvents>;
        "__#3@#destroyed": boolean;
        readonly destroyed: boolean;
        readonly "__#3@#id": bigint;
        readonly id: bigint;
        "__#3@#parent": srvsdbx_ErrorHandling.Maybe<any>;
        readonly parent: srvsdbx_ErrorHandling.Maybe<any>;
        "__#3@#followOffset": {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        };
        readonly followOffset: {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        };
        readonly "__#3@#followers": Map<bigint, any>;
        readonly followers: Map<bigint, any>;
        update(): void;
        setPosition(position: srvsdbx_Geometry.Point2D): void;
        updateFollowers(): void;
        draw(p5: import("p5")): void;
        destroy(): void;
        compileVelocities(): srvsdbx_Geometry.Vector3D;
        compileAngularVelocities(): number;
        follow(object: any, offset?: {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        }): void;
        unfollow(): void;
    }>;
    readonly parent: srvsdbx_ErrorHandling.Maybe<{
        readonly "__#3@#body": srvsdbx_Geometry.Shape;
        readonly body: srvsdbx_Geometry.Shape;
        collidable: CollisionLevel;
        readonly "__#3@#velocityMap": ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
        readonly velocityMap: ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
        readonly "__#3@#angularVelocityMap": ReducibleMap<string, number, number>;
        readonly angularVelocityMap: ReducibleMap<string, number, number>;
        "__#3@#angle": number;
        angle: number;
        "__#3@#layer": number;
        layer: number;
        readonly position: srvsdbx_Geometry.Point3D;
        readonly "__#3@#draw": (p5: import("p5")) => void;
        readonly "__#3@#events": SandboxEventTarget<BaseGenericEvents>;
        readonly events: SandboxEventTarget<BaseGenericEvents>;
        "__#3@#destroyed": boolean;
        readonly destroyed: boolean;
        readonly "__#3@#id": bigint;
        readonly id: bigint;
        "__#3@#parent": srvsdbx_ErrorHandling.Maybe<any>;
        readonly parent: srvsdbx_ErrorHandling.Maybe<any>;
        "__#3@#followOffset": {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        };
        readonly followOffset: {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        };
        readonly "__#3@#followers": Map<bigint, any>;
        readonly followers: Map<bigint, any>;
        update(): void;
        setPosition(position: srvsdbx_Geometry.Point2D): void;
        updateFollowers(): void;
        draw(p5: import("p5")): void;
        destroy(): void;
        compileVelocities(): srvsdbx_Geometry.Vector3D;
        compileAngularVelocities(): number;
        follow(object: any, offset?: {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        }): void;
        unfollow(): void;
    }>;
    "__#3@#followOffset": {
        x: number;
        y: number;
        z: number;
        parr: number;
        perp: number;
    };
    readonly followOffset: {
        x: number;
        y: number;
        z: number;
        parr: number;
        perp: number;
    };
    readonly "__#3@#followers": Map<bigint, {
        readonly "__#3@#body": srvsdbx_Geometry.Shape;
        readonly body: srvsdbx_Geometry.Shape;
        collidable: CollisionLevel;
        readonly "__#3@#velocityMap": ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
        readonly velocityMap: ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
        readonly "__#3@#angularVelocityMap": ReducibleMap<string, number, number>;
        readonly angularVelocityMap: ReducibleMap<string, number, number>;
        "__#3@#angle": number;
        angle: number;
        "__#3@#layer": number;
        layer: number;
        readonly position: srvsdbx_Geometry.Point3D;
        readonly "__#3@#draw": (p5: import("p5")) => void;
        readonly "__#3@#events": SandboxEventTarget<BaseGenericEvents>;
        readonly events: SandboxEventTarget<BaseGenericEvents>;
        "__#3@#destroyed": boolean;
        readonly destroyed: boolean;
        readonly "__#3@#id": bigint;
        readonly id: bigint;
        "__#3@#parent": srvsdbx_ErrorHandling.Maybe<any>;
        readonly parent: srvsdbx_ErrorHandling.Maybe<any>;
        "__#3@#followOffset": {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        };
        readonly followOffset: {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        };
        readonly "__#3@#followers": Map<bigint, any>;
        readonly followers: Map<bigint, any>;
        update(): void;
        setPosition(position: srvsdbx_Geometry.Point2D): void;
        updateFollowers(): void;
        draw(p5: import("p5")): void;
        destroy(): void;
        compileVelocities(): srvsdbx_Geometry.Vector3D;
        compileAngularVelocities(): number;
        follow(object: any, offset?: {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        }): void;
        unfollow(): void;
    }>;
    readonly followers: Map<bigint, {
        readonly "__#3@#body": srvsdbx_Geometry.Shape;
        readonly body: srvsdbx_Geometry.Shape;
        collidable: CollisionLevel;
        readonly "__#3@#velocityMap": ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
        readonly velocityMap: ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
        readonly "__#3@#angularVelocityMap": ReducibleMap<string, number, number>;
        readonly angularVelocityMap: ReducibleMap<string, number, number>;
        "__#3@#angle": number;
        angle: number;
        "__#3@#layer": number;
        layer: number;
        readonly position: srvsdbx_Geometry.Point3D;
        readonly "__#3@#draw": (p5: import("p5")) => void;
        readonly "__#3@#events": SandboxEventTarget<BaseGenericEvents>;
        readonly events: SandboxEventTarget<BaseGenericEvents>;
        "__#3@#destroyed": boolean;
        readonly destroyed: boolean;
        readonly "__#3@#id": bigint;
        readonly id: bigint;
        "__#3@#parent": srvsdbx_ErrorHandling.Maybe<any>;
        readonly parent: srvsdbx_ErrorHandling.Maybe<any>;
        "__#3@#followOffset": {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        };
        readonly followOffset: {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        };
        readonly "__#3@#followers": Map<bigint, any>;
        readonly followers: Map<bigint, any>;
        update(): void;
        setPosition(position: srvsdbx_Geometry.Point2D): void;
        updateFollowers(): void;
        draw(p5: import("p5")): void;
        destroy(): void;
        compileVelocities(): srvsdbx_Geometry.Vector3D;
        compileAngularVelocities(): number;
        follow(object: any, offset?: {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        }): void;
        unfollow(): void;
    }>;
    update(): void;
    setPosition(position: srvsdbx_Geometry.Point2D): void;
    updateFollowers(): void;
    draw(p5: import("p5")): void;
    destroy(): void;
    compileVelocities(): srvsdbx_Geometry.Vector3D;
    compileAngularVelocities(): number;
    follow(object: {
        readonly "__#3@#body": srvsdbx_Geometry.Shape;
        readonly body: srvsdbx_Geometry.Shape;
        collidable: CollisionLevel;
        readonly "__#3@#velocityMap": ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
        readonly velocityMap: ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
        readonly "__#3@#angularVelocityMap": ReducibleMap<string, number, number>;
        readonly angularVelocityMap: ReducibleMap<string, number, number>;
        "__#3@#angle": number;
        angle: number;
        "__#3@#layer": number;
        layer: number;
        readonly position: srvsdbx_Geometry.Point3D;
        readonly "__#3@#draw": (p5: import("p5")) => void;
        readonly "__#3@#events": SandboxEventTarget<BaseGenericEvents>;
        readonly events: SandboxEventTarget<BaseGenericEvents>;
        "__#3@#destroyed": boolean;
        readonly destroyed: boolean;
        readonly "__#3@#id": bigint;
        readonly id: bigint;
        "__#3@#parent": srvsdbx_ErrorHandling.Maybe<any>;
        readonly parent: srvsdbx_ErrorHandling.Maybe<any>;
        "__#3@#followOffset": {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        };
        readonly followOffset: {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        };
        readonly "__#3@#followers": Map<bigint, any>;
        readonly followers: Map<bigint, any>;
        update(): void;
        setPosition(position: srvsdbx_Geometry.Point2D): void;
        updateFollowers(): void;
        draw(p5: import("p5")): void;
        destroy(): void;
        compileVelocities(): srvsdbx_Geometry.Vector3D;
        compileAngularVelocities(): number;
        follow(object: any, offset?: {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        }): void;
        unfollow(): void;
    }, offset?: {
        x: number;
        y: number;
        z: number;
        parr: number;
        perp: number;
    }): void;
    unfollow(): void;
};
type Generic<E extends BaseGenericEvents = BaseGenericEvents> = InstanceType<typeof Generic<E>>;
type GameObject = Generic | Decal | Explosion | Projectile | ParticleEmitter;
declare const gamespace: {
    readonly VERSION: string;
    readonly PLAYER_SIZE: number;
    readonly "__#4@#cameraPosition": srvsdbx_Geometry.Point2D;
    readonly cameraPosition: {
        x: number;
        y: number;
    };
    "__#4@#currentLevel": SimpleLevel | undefined;
    readonly currentLevel: SimpleLevel | undefined;
    "__#4@#currentUpdate": number;
    readonly currentUpdate: number;
    readonly "__#4@#events": SandboxEventTarget<{
        ready: [number];
        fragmentLoaded: [srvsdbx_ErrorHandling.Result<Level | Ammo | DecalPrototype | EquipmentPrototype | ExplosionPrototype | GunPrototype | MeleePrototype | ObstaclePrototype<ObstacleTypes, ParticleEmitterState & {
            readonly obstacle: Obstacle<ObstacleTypes, any>;
        }> | ParticlePrototype | StatusEffectPrototype<{}>, {
            readonly internalName: string;
            readonly includePath: string;
            readonly namespace: string;
            readonly objectType: string;
            readonly err: srvsdbx_Errors.SandboxError[];
        }>];
    }>;
    readonly events: SandboxEventTarget<{
        ready: [number];
        fragmentLoaded: [srvsdbx_ErrorHandling.Result<Level | Ammo | DecalPrototype | EquipmentPrototype | ExplosionPrototype | GunPrototype | MeleePrototype | ObstaclePrototype<ObstacleTypes, ParticleEmitterState & {
            readonly obstacle: Obstacle<ObstacleTypes, any>;
        }> | ParticlePrototype | StatusEffectPrototype<{}>, {
            readonly internalName: string;
            readonly includePath: string;
            readonly namespace: string;
            readonly objectType: string;
            readonly err: srvsdbx_Errors.SandboxError[];
        }>];
    }>;
    "__#4@#isReady": boolean;
    readonly isReady: boolean;
    "__#4@#lastUpdate": number;
    readonly lastUpdate: number;
    readonly "__#4@#levels": Level[];
    readonly levels: Level[];
    readonly "__#4@#objects": {
        readonly decals: AugmentedEventMap<ObjectId, Decal>;
        readonly emitters: AugmentedEventMap<ObjectId, ParticleEmitter<any>>;
        readonly explosions: AugmentedEventMap<ObjectId, Explosion>;
        readonly obstacles: AugmentedEventMap<ObjectId, Obstacle<ObstacleTypes, any>>;
        readonly particles: AugmentedEventMap<ObjectId, Particle>;
        readonly players: AugmentedEventMap<ObjectId, PlayerLike>;
        readonly projectiles: AugmentedEventMap<ObjectId, Projectile>;
    };
    readonly objects: {
        readonly decals: AugmentedEventMap<ObjectId, Decal>;
        readonly emitters: AugmentedEventMap<ObjectId, ParticleEmitter<any>>;
        readonly explosions: AugmentedEventMap<ObjectId, Explosion>;
        readonly obstacles: AugmentedEventMap<ObjectId, Obstacle<ObstacleTypes, any>>;
        readonly particles: AugmentedEventMap<ObjectId, Particle>;
        readonly players: AugmentedEventMap<ObjectId, PlayerLike>;
        readonly projectiles: AugmentedEventMap<ObjectId, Projectile>;
    };
    readonly "__#4@#layeredObjects": Map<number, {
        readonly decals: Map<ObjectId, Decal>;
        readonly emitters: Map<ObjectId, ParticleEmitter<any>>;
        readonly explosions: Map<ObjectId, Explosion>;
        readonly obstaclesOver: Map<ObjectId, Obstacle>;
        readonly obstaclesUnder: Map<ObjectId, Obstacle>;
        readonly particlesOver: ReducibleMap<ObjectId, Particle, Array<Particle>>;
        readonly particlesUnder: ReducibleMap<ObjectId, Particle, Array<Particle>>;
        readonly players: Map<ObjectId, PlayerLike>;
        readonly projectilesUnder: ReducibleMap<ObjectId, Projectile, Array<Projectile>>;
        readonly projectilesOver: ReducibleMap<ObjectId, Projectile, Array<Projectile>>;
    }>;
    readonly "__#4@#objectPool": AugmentedMap<bigint, GameObject>;
    readonly "__#4@#prototypes": {
        readonly ammos: Omit<Map<string, Ammo>, "get"> & {
            get(key: string): Ammo;
        };
        readonly decals: Omit<Map<string, DecalPrototype>, "get"> & {
            get(key: string): DecalPrototype;
        };
        readonly equipments: Omit<Map<string, EquipmentPrototype>, "get"> & {
            get(key: string): EquipmentPrototype;
        };
        readonly explosions: Omit<Map<string, ExplosionPrototype>, "get"> & {
            get(key: string): ExplosionPrototype;
        };
        readonly firearms: Omit<Map<string, GunPrototype>, "get"> & {
            get(key: string): GunPrototype;
        };
        readonly melees: Omit<Map<string, MeleePrototype>, "get"> & {
            get(key: string): MeleePrototype;
        };
        readonly obstacles: Omit<Map<string, ObstaclePrototype<ObstacleTypes, ParticleEmitterState & {
            readonly obstacle: Obstacle<ObstacleTypes, any>;
        }>>, "get"> & {
            get(key: string): ObstaclePrototype<ObstacleTypes, ParticleEmitterState & {
                readonly obstacle: Obstacle<ObstacleTypes, any>;
            }>;
        };
        readonly particles: Omit<Map<string, ParticlePrototype>, "get"> & {
            get(key: string): ParticlePrototype;
        };
        readonly statusEffects: Omit<Map<string, StatusEffectPrototype<{}>>, "get"> & {
            get(key: string): StatusEffectPrototype<{}>;
        };
    };
    readonly prototypes: {
        readonly ammos: Omit<Map<string, Ammo>, "get"> & {
            get(key: string): Ammo;
        };
        readonly decals: Omit<Map<string, DecalPrototype>, "get"> & {
            get(key: string): DecalPrototype;
        };
        readonly equipments: Omit<Map<string, EquipmentPrototype>, "get"> & {
            get(key: string): EquipmentPrototype;
        };
        readonly explosions: Omit<Map<string, ExplosionPrototype>, "get"> & {
            get(key: string): ExplosionPrototype;
        };
        readonly firearms: Omit<Map<string, GunPrototype>, "get"> & {
            get(key: string): GunPrototype;
        };
        readonly melees: Omit<Map<string, MeleePrototype>, "get"> & {
            get(key: string): MeleePrototype;
        };
        readonly obstacles: Omit<Map<string, ObstaclePrototype<ObstacleTypes, ParticleEmitterState & {
            readonly obstacle: Obstacle<ObstacleTypes, any>;
        }>>, "get"> & {
            get(key: string): ObstaclePrototype<ObstacleTypes, ParticleEmitterState & {
                readonly obstacle: Obstacle<ObstacleTypes, any>;
            }>;
        };
        readonly particles: Omit<Map<string, ParticlePrototype>, "get"> & {
            get(key: string): ParticlePrototype;
        };
        readonly statusEffects: Omit<Map<string, StatusEffectPrototype<{}>>, "get"> & {
            get(key: string): StatusEffectPrototype<{}>;
        };
    };
    "__#4@#p5": srvsdbx_ErrorHandling.Maybe<import("p5")>;
    readonly p5: import("p5");
    "__#4@#player": srvsdbx_ErrorHandling.Maybe<Player>;
    readonly player: srvsdbx_ErrorHandling.Maybe<{
        readonly "__#25@#shakeIntensities": ReducibleMap<string, number, number>;
        readonly shakeIntensity: number;
        addShake(source: string, strength: number, origin: srvsdbx_Geometry.Point2D): void;
        removeShake(source: string): void;
        "__#25@#determineShakeIntensity"(origin: {
            x: number;
            y: number;
        }, strength: number): number;
        destroy(): void;
        readonly activeItem: ({
            readonly "__#28@#owner": PlayerLike;
            readonly owner: PlayerLike;
            readonly "__#28@#prototype": {
                readonly "__#27@#images": {
                    readonly loot: srvsdbx_AssetManagement.ImageSrcPair;
                    readonly world?: srvsdbx_AssetManagement.ImageSrcPair | undefined;
                };
                readonly images: {
                    readonly loot: srvsdbx_AssetManagement.ImageSrcPair;
                    readonly world?: srvsdbx_AssetManagement.ImageSrcPair | undefined;
                };
                readonly "__#27@#moveSpeedPenalties": {
                    readonly passive: number;
                };
                readonly moveSpeedPenalties: {
                    readonly passive: number;
                };
                create(owner: PlayerLike): {
                    readonly "__#28@#owner": PlayerLike;
                    readonly owner: PlayerLike;
                    readonly "__#28@#prototype": any;
                    readonly prototype: any;
                    "__#28@#destroyed": boolean;
                    readonly destroyed: boolean;
                    destroy(): void;
                };
                readonly "__#5@#name": string;
                readonly name: string;
                readonly "__#5@#displayName"?: string | undefined;
                readonly displayName: string | undefined;
                readonly "__#5@#targetVersion": string;
                readonly targetVersion: string;
                readonly "__#5@#objectType": string;
                readonly objectType: string;
                readonly "__#5@#namespace": string;
                readonly namespace: string;
                readonly internalName: string;
                readonly "__#5@#includePath": string;
                readonly includePath: string;
            } & EquipableItemPrototype;
            readonly prototype: {
                readonly "__#27@#images": {
                    readonly loot: srvsdbx_AssetManagement.ImageSrcPair;
                    readonly world?: srvsdbx_AssetManagement.ImageSrcPair | undefined;
                };
                readonly images: {
                    readonly loot: srvsdbx_AssetManagement.ImageSrcPair;
                    readonly world?: srvsdbx_AssetManagement.ImageSrcPair | undefined;
                };
                readonly "__#27@#moveSpeedPenalties": {
                    readonly passive: number;
                };
                readonly moveSpeedPenalties: {
                    readonly passive: number;
                };
                create(owner: PlayerLike): {
                    readonly "__#28@#owner": PlayerLike;
                    readonly owner: PlayerLike;
                    readonly "__#28@#prototype": any;
                    readonly prototype: any;
                    "__#28@#destroyed": boolean;
                    readonly destroyed: boolean;
                    destroy(): void;
                };
                readonly "__#5@#name": string;
                readonly name: string;
                readonly "__#5@#displayName"?: string | undefined;
                readonly displayName: string | undefined;
                readonly "__#5@#targetVersion": string;
                readonly targetVersion: string;
                readonly "__#5@#objectType": string;
                readonly objectType: string;
                readonly "__#5@#namespace": string;
                readonly namespace: string;
                readonly internalName: string;
                readonly "__#5@#includePath": string;
                readonly includePath: string;
            } & EquipableItemPrototype;
            "__#28@#destroyed": boolean;
            readonly destroyed: boolean;
            destroy(): void;
        } & EquipableItem<ItemAnimation, "idle" | "using">) | undefined;
        "__#24@#activeItemIndex": number;
        readonly activeItemIndex: number;
        "__#24@#aimPoint": srvsdbx_Geometry.Point2D;
        readonly aimPoint: srvsdbx_Geometry.Point2D;
        readonly "__#24@#hands": {
            leftHand: {
                parr: number;
                perp: number;
            };
            rightHand: {
                parr: number;
                perp: number;
            };
        };
        readonly hands: {
            leftHand: {
                parr: number;
                perp: number;
            };
            rightHand: {
                parr: number;
                perp: number;
            };
        };
        "__#24@#health": number;
        readonly health: number;
        readonly "__#24@#inventory": Inventory;
        readonly inventory: Inventory;
        "__#24@#maxHealth": number;
        maxHealth: number;
        "__#24@#modifiers": {
            readonly damage: ReducibleMap<string, number, number>;
            readonly protection: ReducibleMap<string, number, number>;
            readonly speedMultipliers: ReducibleMap<string, number, number>;
            readonly speedAdd: ReducibleMap<string, number, number>;
            readonly ergonomics: ReducibleMap<string, number, number>;
        };
        readonly modifiers: {
            readonly damage: ReducibleMap<string, number, number>;
            readonly protection: ReducibleMap<string, number, number>;
            readonly speedMultipliers: ReducibleMap<string, number, number>;
            readonly speedAdd: ReducibleMap<string, number, number>;
            readonly ergonomics: ReducibleMap<string, number, number>;
        };
        "__#24@#previousActiveIndex": number;
        readonly previousActiveIndex: number;
        "__#24@#radius": number;
        radius: number;
        readonly "__#24@#state": {
            attacking: boolean;
            effectiveSwitchDelay: number;
            firing: boolean;
            firingDelay: number;
            lastSwitch: number;
            lastFreeSwitch: number;
            noSlow: boolean;
            reloading: number | false;
        };
        readonly state: {
            attacking: boolean;
            effectiveSwitchDelay: number;
            firing: boolean;
            firingDelay: number;
            lastSwitch: number;
            lastFreeSwitch: number;
            noSlow: boolean;
            reloading: number | false;
        };
        readonly "__#24@#statusEffects": Set<StatusEffect<{}>>;
        readonly statusEffects: Set<StatusEffect<{}>>;
        readonly "__#24@#timers": {
            firing: number | false;
        };
        readonly timers: {
            firing: number | false;
        };
        "__#24@#view": number;
        readonly view: number;
        readonly "__#24@#intersections": ReducibleMap<number, srvsdbx_Geometry.Vector2D, srvsdbx_Geometry.Vector2D>;
        unintersect(): void;
        readonly "__#24@#restrictions": ReducibleMap<number, {
            left: number;
            up: number;
            right: number;
            down: number;
        }, {
            left: number;
            up: number;
            right: number;
            down: number;
        }>;
        readonly restrictions: ReducibleMap<number, {
            left: number;
            up: number;
            right: number;
            down: number;
        }, {
            left: number;
            up: number;
            right: number;
            down: number;
        }>;
        update(): void;
        canAttack(): boolean;
        swapWeapons(): void;
        setActiveItemIndex(slotId: number): void;
        applySwitchPenalties(): void;
        compileVelocities(): srvsdbx_Geometry.Vector3D;
        determineMoveSpeed(): number;
        lookAtMouse(p5: import("p5")): void;
        lookAtPoint(pt: srvsdbx_Geometry.Point2D): void;
        applyBulletDamage(bullet: Bullet): void;
        applyDamage(amount: number, source?: PlayerLike | undefined): srvsdbx_ErrorHandling.Result<undefined, string>;
        applyHealing(amount: number, source?: PlayerLike | undefined): srvsdbx_ErrorHandling.Result<undefined, string>;
        setHealth(amount: number, source?: PlayerLike | undefined): srvsdbx_ErrorHandling.Result<undefined, string>;
        readonly "__#3@#body": srvsdbx_Geometry.Shape;
        readonly body: srvsdbx_Geometry.Shape;
        collidable: CollisionLevel;
        readonly "__#3@#velocityMap": ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
        readonly velocityMap: ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
        readonly "__#3@#angularVelocityMap": ReducibleMap<string, number, number>;
        readonly angularVelocityMap: ReducibleMap<string, number, number>;
        "__#3@#angle": number;
        angle: number;
        "__#3@#layer": number;
        layer: number;
        readonly position: srvsdbx_Geometry.Point3D;
        readonly "__#3@#draw": (p5: import("p5")) => void;
        readonly "__#3@#events": SandboxEventTarget<{
            collision: [{
                readonly "__#3@#body": srvsdbx_Geometry.Shape;
                readonly body: srvsdbx_Geometry.Shape;
                collidable: CollisionLevel;
                readonly "__#3@#velocityMap": ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
                readonly velocityMap: ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
                readonly "__#3@#angularVelocityMap": ReducibleMap<string, number, number>;
                readonly angularVelocityMap: ReducibleMap<string, number, number>;
                "__#3@#angle": number;
                angle: number;
                "__#3@#layer": number;
                layer: number;
                readonly position: srvsdbx_Geometry.Point3D;
                readonly "__#3@#draw": (p5: import("p5")) => void;
                readonly "__#3@#events": SandboxEventTarget<BaseGenericEvents>;
                readonly events: SandboxEventTarget<BaseGenericEvents>;
                "__#3@#destroyed": boolean;
                readonly destroyed: boolean;
                readonly "__#3@#id": bigint;
                readonly id: bigint;
                "__#3@#parent": srvsdbx_ErrorHandling.Maybe<any>;
                readonly parent: srvsdbx_ErrorHandling.Maybe<any>;
                "__#3@#followOffset": {
                    x: number;
                    y: number;
                    z: number;
                    parr: number;
                    perp: number;
                };
                readonly followOffset: {
                    x: number;
                    y: number;
                    z: number;
                    parr: number;
                    perp: number;
                };
                readonly "__#3@#followers": Map<bigint, any>;
                readonly followers: Map<bigint, any>;
                update(): void;
                setPosition(position: srvsdbx_Geometry.Point2D): void;
                updateFollowers(): void;
                draw(p5: import("p5")): void;
                destroy(): void;
                compileVelocities(): srvsdbx_Geometry.Vector3D;
                compileAngularVelocities(): number;
                follow(object: any, offset?: {
                    x: number;
                    y: number;
                    z: number;
                    parr: number;
                    perp: number;
                }): void;
                unfollow(): void;
            }, srvsdbx_Geometry.Point2D[]];
            death: [PlayerLike | undefined];
            kill: [PlayerLike];
        }>;
        readonly events: SandboxEventTarget<{
            collision: [{
                readonly "__#3@#body": srvsdbx_Geometry.Shape;
                readonly body: srvsdbx_Geometry.Shape;
                collidable: CollisionLevel;
                readonly "__#3@#velocityMap": ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
                readonly velocityMap: ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
                readonly "__#3@#angularVelocityMap": ReducibleMap<string, number, number>;
                readonly angularVelocityMap: ReducibleMap<string, number, number>;
                "__#3@#angle": number;
                angle: number;
                "__#3@#layer": number;
                layer: number;
                readonly position: srvsdbx_Geometry.Point3D;
                readonly "__#3@#draw": (p5: import("p5")) => void;
                readonly "__#3@#events": SandboxEventTarget<BaseGenericEvents>;
                readonly events: SandboxEventTarget<BaseGenericEvents>;
                "__#3@#destroyed": boolean;
                readonly destroyed: boolean;
                readonly "__#3@#id": bigint;
                readonly id: bigint;
                "__#3@#parent": srvsdbx_ErrorHandling.Maybe<any>;
                readonly parent: srvsdbx_ErrorHandling.Maybe<any>;
                "__#3@#followOffset": {
                    x: number;
                    y: number;
                    z: number;
                    parr: number;
                    perp: number;
                };
                readonly followOffset: {
                    x: number;
                    y: number;
                    z: number;
                    parr: number;
                    perp: number;
                };
                readonly "__#3@#followers": Map<bigint, any>;
                readonly followers: Map<bigint, any>;
                update(): void;
                setPosition(position: srvsdbx_Geometry.Point2D): void;
                updateFollowers(): void;
                draw(p5: import("p5")): void;
                destroy(): void;
                compileVelocities(): srvsdbx_Geometry.Vector3D;
                compileAngularVelocities(): number;
                follow(object: any, offset?: {
                    x: number;
                    y: number;
                    z: number;
                    parr: number;
                    perp: number;
                }): void;
                unfollow(): void;
            }, srvsdbx_Geometry.Point2D[]];
            death: [PlayerLike | undefined];
            kill: [PlayerLike];
        }>;
        "__#3@#destroyed": boolean;
        readonly destroyed: boolean;
        readonly "__#3@#id": bigint;
        readonly id: bigint;
        "__#3@#parent": srvsdbx_ErrorHandling.Maybe<{
            readonly "__#3@#body": srvsdbx_Geometry.Shape;
            readonly body: srvsdbx_Geometry.Shape;
            collidable: CollisionLevel;
            readonly "__#3@#velocityMap": ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
            readonly velocityMap: ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
            readonly "__#3@#angularVelocityMap": ReducibleMap<string, number, number>;
            readonly angularVelocityMap: ReducibleMap<string, number, number>;
            "__#3@#angle": number;
            angle: number;
            "__#3@#layer": number;
            layer: number;
            readonly position: srvsdbx_Geometry.Point3D;
            readonly "__#3@#draw": (p5: import("p5")) => void;
            readonly "__#3@#events": SandboxEventTarget<BaseGenericEvents>;
            readonly events: SandboxEventTarget<BaseGenericEvents>;
            "__#3@#destroyed": boolean;
            readonly destroyed: boolean;
            readonly "__#3@#id": bigint;
            readonly id: bigint;
            "__#3@#parent": srvsdbx_ErrorHandling.Maybe<any>;
            readonly parent: srvsdbx_ErrorHandling.Maybe<any>;
            "__#3@#followOffset": {
                x: number;
                y: number;
                z: number;
                parr: number;
                perp: number;
            };
            readonly followOffset: {
                x: number;
                y: number;
                z: number;
                parr: number;
                perp: number;
            };
            readonly "__#3@#followers": Map<bigint, any>;
            readonly followers: Map<bigint, any>;
            update(): void;
            setPosition(position: srvsdbx_Geometry.Point2D): void;
            updateFollowers(): void;
            draw(p5: import("p5")): void;
            destroy(): void;
            compileVelocities(): srvsdbx_Geometry.Vector3D;
            compileAngularVelocities(): number;
            follow(object: any, offset?: {
                x: number;
                y: number;
                z: number;
                parr: number;
                perp: number;
            }): void;
            unfollow(): void;
        }>;
        readonly parent: srvsdbx_ErrorHandling.Maybe<{
            readonly "__#3@#body": srvsdbx_Geometry.Shape;
            readonly body: srvsdbx_Geometry.Shape;
            collidable: CollisionLevel;
            readonly "__#3@#velocityMap": ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
            readonly velocityMap: ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
            readonly "__#3@#angularVelocityMap": ReducibleMap<string, number, number>;
            readonly angularVelocityMap: ReducibleMap<string, number, number>;
            "__#3@#angle": number;
            angle: number;
            "__#3@#layer": number;
            layer: number;
            readonly position: srvsdbx_Geometry.Point3D;
            readonly "__#3@#draw": (p5: import("p5")) => void;
            readonly "__#3@#events": SandboxEventTarget<BaseGenericEvents>;
            readonly events: SandboxEventTarget<BaseGenericEvents>;
            "__#3@#destroyed": boolean;
            readonly destroyed: boolean;
            readonly "__#3@#id": bigint;
            readonly id: bigint;
            "__#3@#parent": srvsdbx_ErrorHandling.Maybe<any>;
            readonly parent: srvsdbx_ErrorHandling.Maybe<any>;
            "__#3@#followOffset": {
                x: number;
                y: number;
                z: number;
                parr: number;
                perp: number;
            };
            readonly followOffset: {
                x: number;
                y: number;
                z: number;
                parr: number;
                perp: number;
            };
            readonly "__#3@#followers": Map<bigint, any>;
            readonly followers: Map<bigint, any>;
            update(): void;
            setPosition(position: srvsdbx_Geometry.Point2D): void;
            updateFollowers(): void;
            draw(p5: import("p5")): void;
            destroy(): void;
            compileVelocities(): srvsdbx_Geometry.Vector3D;
            compileAngularVelocities(): number;
            follow(object: any, offset?: {
                x: number;
                y: number;
                z: number;
                parr: number;
                perp: number;
            }): void;
            unfollow(): void;
        }>;
        "__#3@#followOffset": {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        };
        readonly followOffset: {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        };
        readonly "__#3@#followers": Map<bigint, {
            readonly "__#3@#body": srvsdbx_Geometry.Shape;
            readonly body: srvsdbx_Geometry.Shape;
            collidable: CollisionLevel;
            readonly "__#3@#velocityMap": ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
            readonly velocityMap: ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
            readonly "__#3@#angularVelocityMap": ReducibleMap<string, number, number>;
            readonly angularVelocityMap: ReducibleMap<string, number, number>;
            "__#3@#angle": number;
            angle: number;
            "__#3@#layer": number;
            layer: number;
            readonly position: srvsdbx_Geometry.Point3D;
            readonly "__#3@#draw": (p5: import("p5")) => void;
            readonly "__#3@#events": SandboxEventTarget<BaseGenericEvents>;
            readonly events: SandboxEventTarget<BaseGenericEvents>;
            "__#3@#destroyed": boolean;
            readonly destroyed: boolean;
            readonly "__#3@#id": bigint;
            readonly id: bigint;
            "__#3@#parent": srvsdbx_ErrorHandling.Maybe<any>;
            readonly parent: srvsdbx_ErrorHandling.Maybe<any>;
            "__#3@#followOffset": {
                x: number;
                y: number;
                z: number;
                parr: number;
                perp: number;
            };
            readonly followOffset: {
                x: number;
                y: number;
                z: number;
                parr: number;
                perp: number;
            };
            readonly "__#3@#followers": Map<bigint, any>;
            readonly followers: Map<bigint, any>;
            update(): void;
            setPosition(position: srvsdbx_Geometry.Point2D): void;
            updateFollowers(): void;
            draw(p5: import("p5")): void;
            destroy(): void;
            compileVelocities(): srvsdbx_Geometry.Vector3D;
            compileAngularVelocities(): number;
            follow(object: any, offset?: {
                x: number;
                y: number;
                z: number;
                parr: number;
                perp: number;
            }): void;
            unfollow(): void;
        }>;
        readonly followers: Map<bigint, {
            readonly "__#3@#body": srvsdbx_Geometry.Shape;
            readonly body: srvsdbx_Geometry.Shape;
            collidable: CollisionLevel;
            readonly "__#3@#velocityMap": ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
            readonly velocityMap: ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
            readonly "__#3@#angularVelocityMap": ReducibleMap<string, number, number>;
            readonly angularVelocityMap: ReducibleMap<string, number, number>;
            "__#3@#angle": number;
            angle: number;
            "__#3@#layer": number;
            layer: number;
            readonly position: srvsdbx_Geometry.Point3D;
            readonly "__#3@#draw": (p5: import("p5")) => void;
            readonly "__#3@#events": SandboxEventTarget<BaseGenericEvents>;
            readonly events: SandboxEventTarget<BaseGenericEvents>;
            "__#3@#destroyed": boolean;
            readonly destroyed: boolean;
            readonly "__#3@#id": bigint;
            readonly id: bigint;
            "__#3@#parent": srvsdbx_ErrorHandling.Maybe<any>;
            readonly parent: srvsdbx_ErrorHandling.Maybe<any>;
            "__#3@#followOffset": {
                x: number;
                y: number;
                z: number;
                parr: number;
                perp: number;
            };
            readonly followOffset: {
                x: number;
                y: number;
                z: number;
                parr: number;
                perp: number;
            };
            readonly "__#3@#followers": Map<bigint, any>;
            readonly followers: Map<bigint, any>;
            update(): void;
            setPosition(position: srvsdbx_Geometry.Point2D): void;
            updateFollowers(): void;
            draw(p5: import("p5")): void;
            destroy(): void;
            compileVelocities(): srvsdbx_Geometry.Vector3D;
            compileAngularVelocities(): number;
            follow(object: any, offset?: {
                x: number;
                y: number;
                z: number;
                parr: number;
                perp: number;
            }): void;
            unfollow(): void;
        }>;
        setPosition(position: srvsdbx_Geometry.Point2D): void;
        updateFollowers(): void;
        draw(p5: import("p5")): void;
        compileAngularVelocities(): number;
        follow(object: {
            readonly "__#3@#body": srvsdbx_Geometry.Shape;
            readonly body: srvsdbx_Geometry.Shape;
            collidable: CollisionLevel;
            readonly "__#3@#velocityMap": ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
            readonly velocityMap: ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
            readonly "__#3@#angularVelocityMap": ReducibleMap<string, number, number>;
            readonly angularVelocityMap: ReducibleMap<string, number, number>;
            "__#3@#angle": number;
            angle: number;
            "__#3@#layer": number;
            layer: number;
            readonly position: srvsdbx_Geometry.Point3D;
            readonly "__#3@#draw": (p5: import("p5")) => void;
            readonly "__#3@#events": SandboxEventTarget<BaseGenericEvents>;
            readonly events: SandboxEventTarget<BaseGenericEvents>;
            "__#3@#destroyed": boolean;
            readonly destroyed: boolean;
            readonly "__#3@#id": bigint;
            readonly id: bigint;
            "__#3@#parent": srvsdbx_ErrorHandling.Maybe<any>;
            readonly parent: srvsdbx_ErrorHandling.Maybe<any>;
            "__#3@#followOffset": {
                x: number;
                y: number;
                z: number;
                parr: number;
                perp: number;
            };
            readonly followOffset: {
                x: number;
                y: number;
                z: number;
                parr: number;
                perp: number;
            };
            readonly "__#3@#followers": Map<bigint, any>;
            readonly followers: Map<bigint, any>;
            update(): void;
            setPosition(position: srvsdbx_Geometry.Point2D): void;
            updateFollowers(): void;
            draw(p5: import("p5")): void;
            destroy(): void;
            compileVelocities(): srvsdbx_Geometry.Vector3D;
            compileAngularVelocities(): number;
            follow(object: any, offset?: {
                x: number;
                y: number;
                z: number;
                parr: number;
                perp: number;
            }): void;
            unfollow(): void;
        }, offset?: {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        }): void;
        unfollow(): void;
    }>;
    readonly "__#4@#settings": {
        drawHitboxes: boolean;
        drawVelocities: boolean;
        hitboxStyle: "stroke" | "fill" | "both";
        visualQuality: number;
        readonly debugColors: {
            COLLIDABLE: string;
            SEMI_COLLIDABLE: string;
            GROUND: string;
            PARTICLE: string;
            DECAL: string;
            AREA_OF_EFFECT: string;
            REFLECTIVE: string;
            DEFAULT: string;
        };
    };
    readonly settings: {
        drawHitboxes: boolean;
        drawVelocities: boolean;
        hitboxStyle: "stroke" | "fill" | "both";
        visualQuality: number;
        readonly debugColors: {
            COLLIDABLE: string;
            SEMI_COLLIDABLE: string;
            GROUND: string;
            PARTICLE: string;
            DECAL: string;
            AREA_OF_EFFECT: string;
            REFLECTIVE: string;
            DEFAULT: string;
        };
    };
    readonly superCringeEmpiricallyDerivedPixelToUnitRatio: number;
    "__#4@#startup": number;
    readonly startup: number;
    invokeWhenReady(callback: (startupTime: number) => void): undefined;
    startLevel(id: number): void;
    drawDebug(p5: import("p5"), style: keyof typeof this.settings.debugColors, hitboxCallback: (p5: import("p5")) => void, transition: ((p5: import("p5")) => void) | undefined, object: Generic<BaseGenericEvents> | Projectile): void;
    drawHitboxIfEnabled(p5: import("p5"), style: keyof typeof this.settings.debugColors, callback: (p5: import("p5")) => void): void;
    drawVelocityIfEnabled(p5: import("p5"), object: Generic | Projectile): void;
    setup(p5: import("p5"), player: Player): void;
    update(): void;
};
type Gamespace = typeof gamespace;
interface SimpleImport {
    readonly name: string;
    readonly objectType: string;
    readonly displayName?: string;
    readonly targetVersion: string;
    readonly namespace: string;
    readonly includePath: string;
}
declare class ImportedObject {
    #private;
    get name(): string;
    get displayName(): string | undefined;
    get targetVersion(): string;
    get objectType(): string;
    get namespace(): string;
    get internalName(): string;
    get includePath(): string;
    constructor(name: ImportedObject["name"], displayName: ImportedObject["displayName"], objectType: ImportedObject["objectType"], targetVersion: ImportedObject["targetVersion"], namespace: ImportedObject["namespace"], includePath: ImportedObject["includePath"]);
}
interface SimpleLevel extends SimpleImport {
    readonly world: {
        readonly width: number;
        readonly height: number;
        readonly color: string;
        readonly gridColor: string;
    };
    initializer(): void;
}
declare class Level extends ImportedObject {
    #private;
    get world(): {
        readonly width: number;
        readonly height: number;
        readonly color: string;
        readonly gridColor: string;
    };
    get initializer(): () => void;
    static from(data: SimpleLevel): Level;
    constructor(name: ImportedObject["name"], displayName: ImportedObject["displayName"], objectType: ImportedObject["objectType"], targetVersion: ImportedObject["targetVersion"], namespace: ImportedObject["namespace"], includePath: ImportedObject["includePath"], world: SimpleLevel["world"], initializer: SimpleLevel["initializer"]);
}
