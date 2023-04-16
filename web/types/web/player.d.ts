/// <reference types="p5" />
declare class PlayerLike extends Generic<{
    collision: [Generic, srvsdbx_Geometry.Point2D[]];
    death: [PlayerLike | undefined];
    kill: [PlayerLike];
}> implements Destroyable {
    #private;
    static get DEFAULT_SPEED(): number;
    get activeItem(): ({
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
    get activeItemIndex(): number;
    get aimPoint(): srvsdbx_Geometry.Point2D;
    get hands(): {
        leftHand: {
            parr: number;
            perp: number;
        };
        rightHand: {
            parr: number;
            perp: number;
        };
    };
    get health(): number;
    get inventory(): Inventory;
    get maxHealth(): number;
    set maxHealth(v: number);
    get modifiers(): {
        readonly damage: ReducibleMap<string, number, number>;
        readonly protection: ReducibleMap<string, number, number>;
        readonly speedMultipliers: ReducibleMap<string, number, number>;
        readonly speedAdd: ReducibleMap<string, number, number>;
        readonly ergonomics: ReducibleMap<string, number, number>;
    };
    get previousActiveIndex(): number;
    get radius(): number;
    set radius(r: number);
    get state(): {
        attacking: boolean;
        effectiveSwitchDelay: number;
        firing: boolean;
        firingDelay: number;
        lastSwitch: number;
        lastFreeSwitch: number;
        noSlow: boolean;
        reloading: number | false;
    };
    get statusEffects(): Set<StatusEffect<{}>>;
    get timers(): {
        firing: number | false;
    };
    get view(): number;
    unintersect(): void;
    get restrictions(): ReducibleMap<number, {
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
    constructor(position: srvsdbx_Geometry.Point2D);
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
    applyDamage(amount: number, source?: PlayerLike): srvsdbx_ErrorHandling.Result<undefined, string>;
    applyHealing(amount: number, source?: PlayerLike): srvsdbx_ErrorHandling.Result<undefined, string>;
    setHealth(amount: number, source?: PlayerLike): srvsdbx_ErrorHandling.Result<undefined, string>;
    destroy(): void;
}
declare const Player: {
    new (position: srvsdbx_Geometry.Point2D): {
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
                    readonly world?: srvsdbx_AssetManagement.ImageSrcPair;
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
                    readonly world?: srvsdbx_AssetManagement.ImageSrcPair;
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
            reloading: false | number;
        };
        readonly state: {
            attacking: boolean;
            effectiveSwitchDelay: number;
            firing: boolean;
            firingDelay: number;
            lastSwitch: number;
            lastFreeSwitch: number;
            noSlow: boolean;
            reloading: false | number;
        };
        readonly "__#24@#statusEffects": Set<StatusEffect<{}>>;
        readonly statusEffects: Set<StatusEffect<{}>>;
        readonly "__#24@#timers": {
            firing: false | number;
        };
        readonly timers: {
            firing: false | number;
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
        applyDamage(amount: number, source?: PlayerLike): srvsdbx_ErrorHandling.Result<undefined, string>;
        applyHealing(amount: number, source?: PlayerLike): srvsdbx_ErrorHandling.Result<undefined, string>;
        setHealth(amount: number, source?: PlayerLike): srvsdbx_ErrorHandling.Result<undefined, string>;
        readonly "__#3@#body": srvsdbx_Geometry.Shape;
        readonly body: srvsdbx_Geometry.Shape;
        collidable: {
            getHitboxName(): "DEFAULT" | "COLLIDABLE" | "SEMI_COLLIDABLE" | "GROUND" | "PARTICLE" | "DECAL" | "AREA_OF_EFFECT" | "REFLECTIVE";
            getHitboxColor(): string;
        };
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
            collision: [Generic, srvsdbx_Geometry.Point2D[]];
            death: [PlayerLike | undefined];
            kill: [PlayerLike];
        }>;
        readonly events: SandboxEventTarget<{
            collision: [Generic, srvsdbx_Geometry.Point2D[]];
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
            collidable: {
                getHitboxName(): "DEFAULT" | "COLLIDABLE" | "SEMI_COLLIDABLE" | "GROUND" | "PARTICLE" | "DECAL" | "AREA_OF_EFFECT" | "REFLECTIVE";
                getHitboxColor(): string;
            };
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
            } | undefined): void;
            unfollow(): void;
        }>;
        readonly parent: srvsdbx_ErrorHandling.Maybe<{
            readonly "__#3@#body": srvsdbx_Geometry.Shape;
            readonly body: srvsdbx_Geometry.Shape;
            collidable: {
                getHitboxName(): "DEFAULT" | "COLLIDABLE" | "SEMI_COLLIDABLE" | "GROUND" | "PARTICLE" | "DECAL" | "AREA_OF_EFFECT" | "REFLECTIVE";
                getHitboxColor(): string;
            };
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
            } | undefined): void;
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
            collidable: {
                getHitboxName(): "DEFAULT" | "COLLIDABLE" | "SEMI_COLLIDABLE" | "GROUND" | "PARTICLE" | "DECAL" | "AREA_OF_EFFECT" | "REFLECTIVE";
                getHitboxColor(): string;
            };
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
            } | undefined): void;
            unfollow(): void;
        }>;
        readonly followers: Map<bigint, {
            readonly "__#3@#body": srvsdbx_Geometry.Shape;
            readonly body: srvsdbx_Geometry.Shape;
            collidable: {
                getHitboxName(): "DEFAULT" | "COLLIDABLE" | "SEMI_COLLIDABLE" | "GROUND" | "PARTICLE" | "DECAL" | "AREA_OF_EFFECT" | "REFLECTIVE";
                getHitboxColor(): string;
            };
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
            } | undefined): void;
            unfollow(): void;
        }>;
        setPosition(position: srvsdbx_Geometry.Point2D): void;
        updateFollowers(): void;
        draw(p5: import("p5")): void;
        compileAngularVelocities(): number;
        follow(object: {
            readonly "__#3@#body": srvsdbx_Geometry.Shape;
            readonly body: srvsdbx_Geometry.Shape;
            collidable: {
                getHitboxName(): "DEFAULT" | "COLLIDABLE" | "SEMI_COLLIDABLE" | "GROUND" | "PARTICLE" | "DECAL" | "AREA_OF_EFFECT" | "REFLECTIVE";
                getHitboxColor(): string;
            };
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
            } | undefined): void;
            unfollow(): void;
        }, offset?: {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        } | undefined): void;
        unfollow(): void;
    };
    readonly DEFAULT_SPEED: number;
};
type Player = InstanceType<typeof Player>;
declare class Inventory implements Destroyable {
    #private;
    get owner(): PlayerLike;
    static get MAIN_SLOTS(): number;
    get items(): Map<string, {
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
            create(owner: PlayerLike): any;
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
        };
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
            create(owner: PlayerLike): any;
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
        };
        "__#28@#destroyed": boolean;
        readonly destroyed: boolean;
        destroy(): void;
    }>;
    get destroyed(): boolean;
    get containers(): {
        main: Omit<AugmentedMap<number, {
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
        } & EquipableItem<ItemAnimation, "idle" | "using"> & EquipableItem<ItemAnimation, "idle" | "using">>, "set"> & {
            set<V extends ItemAnimation = ItemAnimation>(key: number, item: ({
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
            } & EquipableItemPrototype) | ({
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
            } & EquipableItem<ItemAnimation, "idle" | "using"> & EquipableItem<V, string>), destroyCurrent?: boolean | undefined): boolean;
        } & {
            set(key: number, item: {
                readonly "__#28@#owner": PlayerLike;
                readonly owner: PlayerLike;
                readonly "__#28@#prototype": any;
                readonly prototype: any;
                "__#28@#destroyed": boolean;
                readonly destroyed: boolean;
                destroy(): void;
            } & EquipableItem<ItemAnimation, "idle" | "using">, destroyCurrent?: boolean | undefined, applySwitchPenalties?: boolean | undefined): Omit<AugmentedMap<number, {
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
            } & EquipableItem<ItemAnimation, "idle" | "using"> & EquipableItem<ItemAnimation, "idle" | "using">>, "set"> & {
                set<V extends ItemAnimation = ItemAnimation>(key: number, item: ({
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
                } & EquipableItemPrototype) | ({
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
                } & EquipableItem<ItemAnimation, "idle" | "using"> & EquipableItem<V, string>), destroyCurrent?: boolean | undefined): boolean;
            };
        };
        equipment: Omit<AugmentedMap<EquipmentTypes, Equipment>, "set"> & {
            set<V_1 extends ItemAnimation = ItemAnimation>(key: EquipmentTypes, item: EquipmentPrototype | Equipment, destroyCurrent?: boolean | undefined): boolean;
        };
        consumables: Map<string, number>;
        ammo: Map<string, number>;
    };
    constructor(owner: PlayerLike);
    destroy(): void;
}
interface SimpleInventoryItem extends SimpleImport {
    readonly images: {
        readonly loot: string;
        readonly world?: string;
    };
    readonly moveSpeedPenalties: {
        readonly passive: number;
        readonly active: number;
        readonly using: number;
    };
}
declare const InventoryItemPrototype: abstract new (name: ImportedObject["name"], displayName: ImportedObject["displayName"], objectType: ImportedObject["objectType"], targetVersion: ImportedObject["targetVersion"], namespace: ImportedObject["namespace"], includePath: ImportedObject["includePath"], images: {
    readonly loot: srvsdbx_AssetManagement.ImageSrcPair;
    readonly world?: srvsdbx_AssetManagement.ImageSrcPair | undefined;
}, moveSpeedPenalties: {
    readonly passive: number;
}) => {
    readonly "__#27@#images": {
        readonly loot: srvsdbx_AssetManagement.ImageSrcPair;
        readonly world?: srvsdbx_AssetManagement.ImageSrcPair;
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
};
type InventoryItemPrototype = InstanceType<typeof InventoryItemPrototype>;
interface SimpleEquipableItem extends SimpleInventoryItem {
    readonly imageDeclaration?: string[];
    readonly useDelay: number;
    readonly handPositions?: HandPositions;
}
type HandPositions = {
    readonly leftHand?: {
        readonly parr: number;
        readonly perp: number;
        readonly layer?: 0 | 1;
    };
    readonly rightHand?: {
        readonly parr: number;
        readonly perp: number;
        readonly layer?: 0 | 1;
    };
};
type ItemAnimation = {
    readonly hands?: HandPositions;
    readonly item?: {
        readonly image?: string;
        readonly dimensions?: {
            readonly width?: number;
            readonly height?: number;
            readonly layer?: 0 | 1 | 2;
        };
        readonly offset?: {
            readonly parr?: number;
            readonly perp?: number;
            readonly angle?: number;
        };
    };
};
interface EquipableItemPrototype {
    readonly imageMap: Map<string, srvsdbx_AssetManagement.ImageSrcPair>;
    readonly useDelay: SimpleEquipableItem["useDelay"];
    readonly handPositions: SimpleEquipableItem["handPositions"];
    readonly images: {
        [K in keyof SimpleInventoryItem["images"]]: srvsdbx_AssetManagement.ImageSrcPair;
    };
    readonly moveSpeedPenalties: SimpleInventoryItem["moveSpeedPenalties"];
}
interface EquipableItem<T extends ItemAnimation = ItemAnimation, K extends string = "idle" | "using"> {
    readonly animationManager: srvsdbx_Animation.AnimationManager<T, K>;
    readonly lastUse: number;
    reset(): void;
    usePrimary(): void;
    getItemReference(): T["item"];
    getHandReference(): T["hands"];
    stopAnimations(): void;
    readonly cancelledAnimation: boolean;
}
declare const InventoryItem: abstract new <T extends {
    readonly "__#27@#images": {
        readonly loot: srvsdbx_AssetManagement.ImageSrcPair;
        readonly world?: srvsdbx_AssetManagement.ImageSrcPair;
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
} = {
    readonly "__#27@#images": {
        readonly loot: srvsdbx_AssetManagement.ImageSrcPair;
        readonly world?: srvsdbx_AssetManagement.ImageSrcPair;
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
}>(prototype: T, owner: PlayerLike) => {
    readonly "__#28@#owner": PlayerLike;
    readonly owner: PlayerLike;
    readonly "__#28@#prototype": T;
    readonly prototype: T;
    "__#28@#destroyed": boolean;
    readonly destroyed: boolean;
    destroy(): void;
};
type InventoryItem<T extends InventoryItemPrototype = InventoryItemPrototype> = InstanceType<typeof InventoryItem<T>>;
