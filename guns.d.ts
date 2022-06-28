/// <reference types="p5" />
declare class gunPrototype {
    name: string;
    summary: {
        class: string;
        engagementDistance: {
            min: number;
            max: number;
        };
        shouldNoslow: boolean;
        role: "primary" | "secondary";
    };
    dual: boolean;
    images: {
        loot: {
            img: import("p5").Image | void;
            src: string | false;
        } | void;
        held: {
            img: import("p5").Image | void;
            src: string | false;
        } | void;
        silhouette: {
            img: import("p5").Image | void;
            src: string | false;
        } | void;
    };
    ballistics: {
        damage: number;
        velocity: number;
        range: number;
        obstacleMult: number;
        headshotMult: number;
        tracer: {
            width: number;
            height: number;
        };
        projectiles: number;
        falloff: number;
        fsaCooldown: number;
    };
    caliber: string;
    delay: number;
    accuracy: {
        default: number;
        moving: number;
    };
    imageOffset: {
        x: number;
        y: number;
    };
    dimensions: {
        width: number;
        height: number;
        layer: 0 | 1 | 2;
    };
    switchDelay: number;
    hands: {
        lefthand: {
            x: number;
            y: number;
        };
        righthand?: {
            x: number;
            y: number;
        };
    };
    tint: string;
    spawnOffset: {
        x: number;
        y: number;
    };
    suppressed: boolean;
    casing: {
        spawnOffset: {
            perp: number;
            parr: number;
        };
        velocity: {
            perp: {
                value: number;
                variation: {
                    value: number;
                    plusOrMinus: boolean;
                };
            };
            parr: {
                value: number;
                variation: {
                    value: number;
                    plusOrMinus: boolean;
                };
            };
            angular: {
                value: number;
                variation: {
                    value: number;
                    plusOrMinus: boolean;
                };
            };
        };
        spawnOn: "fire" | "reload";
        spawnDelay: number;
    };
    recoilImpulse: {
        x: number;
        y: number;
        duration: number;
    };
    fireModes: ("automatic" | "semi" | `${"auto-" | ""}burst-${number}`)[];
    burstProps: {
        shotDelay: number;
        burstDelay: number;
    };
    reload: {
        duration: number;
        ammoReloaded: number | "all";
        chain: boolean;
    };
    altReload?: {
        duration: number;
        ammoReloaded: number | "all";
        chain: boolean;
    };
    magazineCapacity: {
        normal: number;
        firepower: number;
    };
    moveSpeedPenalties: {
        active: number;
        firing: number;
    };
    deployGroup: number;
    constructor(name: string, summary: typeof gunPrototype.prototype.summary, dual: boolean, images: typeof gunPrototype.prototype.images, tint: string, ballistics: typeof gunPrototype.prototype.ballistics, caliber: string, delay: number, accuracy: typeof gunPrototype.prototype.accuracy, imageOffset: typeof gunPrototype.prototype.imageOffset, dimensions: typeof gunPrototype.prototype.dimensions, hands: typeof gunPrototype.prototype.hands, spawnOffset: typeof gunPrototype.prototype.spawnOffset, suppressed: boolean, recoilImpulse: typeof gunPrototype.prototype.recoilImpulse, fireMode: typeof gunPrototype.prototype.fireModes, burstProps: typeof gunPrototype.prototype.burstProps, reload: typeof gunPrototype.prototype.reload, capacity: typeof gunPrototype.prototype.magazineCapacity, switchDelay: number, casing: typeof gunPrototype.prototype.casing, moveSpeedPenalties: typeof gunPrototype.prototype.moveSpeedPenalties, deployGroup: number, altReload?: typeof gunPrototype.prototype.altReload);
}
declare class gun {
    #private;
    get proto(): gunPrototype;
    get activeFireModeIndex(): number;
    set activeFireModeIndex(v: number);
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
    constructor(body: Matter.Body, shooter: playerLike, emitter: gunPrototype, angle: number, start: {
        x: number;
        y: number;
    }, end: {
        x: number;
        y: number;
    }, created: number, crit: boolean, damage: number, isShrapnel: boolean);
    update(lifetime: number, spinVel: number, type: typeof gamespace.bulletInfo[string]["projectileInfo"]["type"], explosionInfo: {
        explosionType: string;
        explodeOnContact: boolean;
        maxDist: number;
        heightPeak: number;
    }): void;
    draw(info: {
        tints: {
            normal: string;
            saturated: string;
            saturated_alt?: string;
            chambered: string;
        };
        alpha: {
            rate: number;
            min: number;
            max: number;
        };
        imageOffset: {
            parr: number;
            perp: number;
        };
        dimensions: {
            width: number;
            height: number;
        };
        projectileInfo: ({
            type: "explosive";
            explosionType: string;
            explodeOnContact: boolean;
            maxDist: number;
            heightPeak: number;
        } | {
            type: "bullet";
        }) & {
            img: import("p5").Image;
            spinVel: number;
        };
    }, lifetime: number): void;
    destroy(): void;
}
declare class bullet extends projectile {
    #private;
    get lifetime(): number;
    get info(): {
        tints: {
            normal: string;
            saturated: string;
            saturated_alt?: string;
            chambered: string;
        };
        alpha: {
            rate: number;
            min: number;
            max: number;
        };
        spawnVar: {
            mean: number;
            variation: number;
            plusOrMinus: boolean;
        };
        imageOffset: {
            parr: number;
            perp: number;
        };
        projectileInfo: ({
            type: "explosive";
            explosionType: string;
            explodeOnContact: boolean;
            maxDist: number;
            heightPeak: number;
        } | {
            type: "bullet";
        }) & {
            img: import("p5").Image;
            spinVel: number;
        };
        casing: {
            img: import("p5").Image;
            lifetime: {
                value: number;
                variation: number;
                plusOrMinus: boolean;
            };
            width: number;
            height: number;
        };
    };
    get type(): "explosive" | "bullet";
    get sqauredDistance(): number;
    constructor(body: Matter.Body, shooter: playerLike, emitter: gunPrototype, angle: number, start: {
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
        count: number;
        damage: number;
        color: `#${string}`;
        img: import("p5").Image;
        velocity: number;
        range: {
            value: number;
            variation: {
                value: number;
                plusOrMinus: boolean;
            };
        };
        falloff: number;
        tracer: {
            width: number;
            height: number;
        };
    };
    constructor(body: Matter.Body, shooter: playerLike, emitter: gunPrototype, angle: number, start: {
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
    get crit(): boolean;
    get damage(): number;
    get id(): number;
    get info(): {
        damage: number;
        obstacleMult: number;
        radii: {
            visual: {
                min: number;
                max: number;
            };
            damage: {
                min: number;
                max: number;
            };
        };
        lifetime: number;
        color: [number, number, number];
        decal: {
            img: import("p5").Image;
            width: number;
            height: number;
            tint: `#${string}`;
        };
        shrapnel: {
            count: number;
            damage: number;
            color: `#${string}`;
            img: import("p5").Image;
            velocity: number;
            range: {
                value: number;
                variation: {
                    value: number;
                    plusOrMinus: boolean;
                };
            };
            falloff: number;
            tracer: {
                width: number;
                height: number;
            };
        };
    };
    get steps(): number;
    get alpha(): number;
    constructor(origin: {
        x: number;
        y: number;
    }, shooter: playerLike, emitter: gunPrototype, crit: boolean);
    update(): void;
    draw(): void;
}
declare class casing {
    #private;
    get body(): Matter.Body;
    get emitter(): gunPrototype;
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
    constructor(body: Matter.Body, emitter: gunPrototype, angle: number, start: {
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
