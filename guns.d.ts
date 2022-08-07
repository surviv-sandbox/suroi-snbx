/// <reference types="p5" />
declare class gunPrototype {
    name: string;
    summary: {
        class: TOrFT<string, []>;
        engagementDistance: {
            min: TOrFT<number, []>;
            max: TOrFT<number, []>;
        };
        shouldNoslow: TOrFT<boolean, []>;
        role: TOrFT<"primary" | "secondary", []>;
    };
    dual: TOrFT<boolean, [gun, playerLike]>;
    images: {
        loot: {
            img: TOrFT<import("p5").Image, [gun, playerLike]>;
            src: TOrFT<string, []>;
        };
        held: {
            img: TOrFT<import("p5").Image, [gun, playerLike]>;
            src: TOrFT<string, []>;
        };
        silhouette: {
            img: TOrFT<import("p5").Image, [gun, playerLike]>;
            src: TOrFT<string, []>;
        };
    };
    ballistics: {
        damage: TOrFT<number, [gun, playerLike]>;
        velocity: TOrFT<number, [gun, playerLike]>;
        range: TOrFT<number, [gun, playerLike]>;
        obstacleMult: TOrFT<number, [gun, playerLike]>;
        headshotMult: TOrFT<number, [gun, playerLike]>;
        tracer: {
            width: TOrFT<number, [gun, playerLike]>;
            height: TOrFT<number, [gun, playerLike]>;
        };
        hitboxLength: TOrFT<number, [gun, playerLike]>;
        projectiles: TOrFT<number, [gun, playerLike]>;
        falloff: TOrFT<number, [gun, playerLike]>;
        fsaCooldown: TOrFT<number, [gun, playerLike]>;
    };
    caliber: TOrFT<string, [gun, playerLike]>;
    delay: TOrFT<number, [gun, playerLike]>;
    accuracy: {
        default: TOrFT<number, [gun, playerLike]>;
        moving: TOrFT<number, [gun, playerLike]>;
    };
    imageOffset: {
        perp: TOrFT<number, [gun, playerLike]>;
        parr: TOrFT<number, [gun, playerLike]>;
    };
    dimensions: {
        width: TOrFT<number, [gun, playerLike]>;
        height: TOrFT<number, [gun, playerLike]>;
        layer: TOrFT<0 | 1 | 2, [gun, playerLike]>;
    };
    switchDelay: TOrFT<number, [gun, playerLike]>;
    hands: {
        lefthand: {
            perp: TOrFT<number, [gun, playerLike]>;
            parr: TOrFT<number, [gun, playerLike]>;
        };
        righthand?: {
            perp: TOrFT<number, [gun, playerLike]>;
            parr: TOrFT<number, [gun, playerLike]>;
        };
    };
    tint: TOrFT<hexColor, [gun, playerLike]>;
    spawnOffset: {
        perp: TOrFT<number, [gun, playerLike]>;
        parr: TOrFT<number, [gun, playerLike]>;
    };
    suppressed: TOrFT<boolean, [gun, playerLike]>;
    casing: {
        spawnOffset: {
            perp: TOrFT<number, [gun, playerLike]>;
            parr: TOrFT<number, [gun, playerLike]>;
        };
        velocity: {
            perp: TOrFT<number, [gun, playerLike]>;
            parr: TOrFT<number, [gun, playerLike]>;
            angular: TOrFT<number, [gun, playerLike]>;
        };
        spawnOn: TOrFT<"fire" | "reload", [gun, playerLike]>;
        spawnDelay: TOrFT<number, [gun, playerLike]>;
    };
    recoilImpulse: {
        perp: TOrFT<number, [gun, playerLike]>;
        parr: TOrFT<number, [gun, playerLike]>;
        duration: TOrFT<number, [gun, playerLike]>;
    };
    fireModes: TOrFT<("automatic" | "semi" | `${"auto-" | ""}burst-${number}`)[], []>;
    burstProps: {
        shotDelay: TOrFT<number, [gun, playerLike]>;
        burstDelay: TOrFT<number, [gun, playerLike]>;
    };
    reload: {
        duration: TOrFT<number, [gun, playerLike]>;
        ammoReloaded: TOrFT<number | "all", [gun, playerLike]>;
        chain: TOrFT<boolean, [gun, playerLike]>;
    };
    altReload?: {
        duration: TOrFT<number, [gun, playerLike]>;
        ammoReloaded: TOrFT<number | "all", [gun, playerLike]>;
        chain: TOrFT<boolean, [gun, playerLike]>;
    };
    magazineCapacity: {
        normal: TOrFT<number, []>;
        firepower: TOrFT<number, []>;
    };
    moveSpeedPenalties: {
        active: TOrFT<number, [gun, playerLike]>;
        firing: TOrFT<number, [gun, playerLike]>;
    };
    deployGroup: TOrFT<number, [gun, playerLike]>;
    constructor(name: typeof gunPrototype.prototype.name, summary: typeof gunPrototype.prototype.summary, dual: typeof gunPrototype.prototype.dual, images: typeof gunPrototype.prototype.images, tint: typeof gunPrototype.prototype.tint, ballistics: typeof gunPrototype.prototype.ballistics, caliber: typeof gunPrototype.prototype.caliber, delay: typeof gunPrototype.prototype.delay, accuracy: typeof gunPrototype.prototype.accuracy, imageOffset: typeof gunPrototype.prototype.imageOffset, dimensions: typeof gunPrototype.prototype.dimensions, hands: typeof gunPrototype.prototype.hands, spawnOffset: typeof gunPrototype.prototype.spawnOffset, suppressed: typeof gunPrototype.prototype.suppressed, recoilImpulse: typeof gunPrototype.prototype.recoilImpulse, fireMode: typeof gunPrototype.prototype.fireModes, burstProps: typeof gunPrototype.prototype.burstProps, reload: typeof gunPrototype.prototype.reload, capacity: typeof gunPrototype.prototype.magazineCapacity, switchDelay: typeof gunPrototype.prototype.switchDelay, casing: typeof gunPrototype.prototype.casing, moveSpeedPenalties: typeof gunPrototype.prototype.moveSpeedPenalties, deployGroup: typeof gunPrototype.prototype.deployGroup, altReload?: typeof gunPrototype.prototype.altReload);
}
declare class gun {
    #private;
    get proto(): gunPrototype;
    activeFireModeIndex: number;
    get activeFireMode(): "automatic" | "semi" | `burst-${number}` | `auto-burst-${number}`;
    get ammo(): number;
    set ammo(v: number);
    recoilImpulseParity: -1 | 1;
    constructor(proto: gunPrototype);
    primary(shooter: playerLike): void;
    reload(shooter: playerLike): void;
    stopReload(shooter: playerLike): void;
    makeCasing(shooter: playerLike): void;
}
declare abstract class projectile {
    #private;
    get body(): Matter.Body;
    get shooter(): playerLike;
    get emitter(): gunPrototype;
    get emitterInst(): gun;
    get angle(): number;
    get trajectory(): number;
    get start(): {
        x: number;
        y: number;
    };
    get end(): {
        x: number;
        y: number;
    };
    get created(): number;
    get crit(): boolean;
    get alpha(): number;
    get damage(): number;
    get sqauredDistance(): number;
    get shrapnel(): boolean;
    constructor(body: Matter.Body, shooter: playerLike, emitterInst: gun, angle: number, start: {
        x: number;
        y: number;
    }, end: {
        x: number;
        y: number;
    }, created: number, crit: boolean, damage: number, isShrapnel: boolean);
    update(lifetime: number, spinVel: number, type: bulletInfo["projectileInfo"]["type"], explosionInfo: {
        explosionType: TOrFT<string, [projectile]>;
        explodeOnContact: TOrFT<boolean, [projectile]>;
        maxDist: TOrFT<number, [projectile]>;
        heightPeak: TOrFT<number, [projectile]>;
    }): void;
    draw(info: {
        alpha: {
            min: TOrFT<number, [gun, playerLike]>;
            max: TOrFT<number, [gun, playerLike]>;
            rate: TOrFT<number, [gun, playerLike]>;
        };
        imageOffset: {
            perp: TOrFT<number, [gun, playerLike]>;
            parr: TOrFT<number, [gun, playerLike]>;
        };
        dimensions: {
            width: TOrFT<number, [gun, playerLike]>;
            height: TOrFT<number, [gun, playerLike]>;
        };
        projectileInfo: {
            type: TOrFT<string, [gun, playerLike]>;
            heightPeak: TOrFT<number, [gun, playerLike]>;
            img: TOrFT<import("p5").Image, [gun, playerLike]>;
        };
        tints: {
            normal: TOrFT<hexColor, [gun, playerLike]>;
            saturated: TOrFT<hexColor, [gun, playerLike]>;
            chambered: TOrFT<hexColor, [gun, playerLike]>;
        };
    }, lifetime: number): void;
    destroy(): void;
}
declare class bullet extends projectile {
    #private;
    get lifetime(): number;
    get info(): bulletInfo;
    get type(): "explosive" | "bullet";
    get sqauredDistance(): number;
    constructor(body: Matter.Body, shooter: playerLike, emitterInst: gun, angle: number, start: {
        x: number;
        y: number;
    }, created: number, crit: boolean, type: typeof bullet.prototype.type);
    update(): void;
    draw(): void;
}
declare class shrapnel extends projectile {
    #private;
    get lifetime(): number;
    get range(): number;
    get info(): {
        count: TOrFT<number, []>;
        damage: TOrFT<number, []>;
        color: TOrFT<colorModes, []>;
        img: TOrFT<import("p5").Image, []>;
        velocity: TOrFT<number, []>;
        range: TOrFT<number, []>;
        falloff: TOrFT<number, []>;
        tracer: {
            width: TOrFT<number, []>;
            height: TOrFT<number, []>;
        };
    };
    constructor(body: Matter.Body, shooter: playerLike, emitterInst: gun, angle: number, start: {
        x: number;
        y: number;
    }, created: number, crit: boolean);
    update(): void;
    draw(): void;
}
declare class explosion {
    #private;
    get origin(): {
        x: number;
        y: number;
    };
    get createdAt(): number;
    get shooter(): playerLike;
    get emitter(): gunPrototype;
    get emitterInst(): gun;
    get crit(): boolean;
    get damage(): number;
    get id(): number;
    get info(): explosionInfo;
    get steps(): number;
    get alpha(): number;
    constructor(origin: {
        x: number;
        y: number;
    }, shooter: playerLike, emitterInst: gun, crit: boolean);
    update(): void;
    draw(): void;
}
declare class casing {
    #private;
    get body(): Matter.Body;
    get emitter(): gunPrototype;
    get emitterInst(): gun;
    get angle(): number;
    get trajectory(): number;
    get lifetime(): number;
    get start(): {
        x: number;
        y: number;
    };
    get end(): {
        x: number;
        y: number;
    };
    get created(): number;
    get velocities(): {
        parr: number;
        perp: number;
        angular: number;
    };
    constructor(body: Matter.Body, emitterInst: gun, shooter: playerLike, start: {
        x: number;
        y: number;
    }, created: number, vel: {
        parr: number;
        perp: number;
        angular: number;
    });
    update(): void;
    draw(): void;
    destroy(): void;
}
