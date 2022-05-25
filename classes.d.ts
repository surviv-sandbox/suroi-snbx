declare class obstacle {
    #private;
    get body(): Matter.Body;
    image: import("p5").Image;
    imageWidth: number;
    imageHeight: number;
    tint: string;
    angle: number;
    layer: number;
    offset: {
        x: number;
        y: number;
        angle: number;
    };
    imageMode: import("p5").IMAGE_MODE;
    constructor(body: Matter.Body, angle: number, image: import("p5").Image, imageDimensions: {
        width: number;
        height: number;
    }, tint: string, layer: number, offset: {
        x: number;
        y: number;
        angle: number;
    }, imageMode: import("p5").IMAGE_MODE);
    draw(p5: import("p5")): void;
}
declare class playerLike {
    #private;
    get body(): Matter.Body;
    angle: number;
    health: number;
    maxHealth: number;
    inventory: inventory;
    options: {
        friction: number;
        restitution: number;
        inertia?: number;
        density: number;
    };
    state: {
        attacking: boolean;
        firing: boolean;
        lastShot: number;
        fired: number;
        lastBurst: number;
        moving: boolean;
        reloading: false | number;
        custom: {
            [key: string]: any;
        };
    };
    speed: {
        base: number;
    };
    view: number;
    constructor(body: Matter.Body, angle: number, health: number, loadout: {
        guns: string[];
        activeIndex: number;
    }, options: {
        friction: number;
        restitution: number;
        inertia?: number;
        density: number;
    }, view: number);
    draw(p5: import("p5")): void;
    destroy(): void;
    move(w: boolean, a: boolean, s: boolean, d: boolean): void;
}
declare class inventory {
    #private;
    get parent(): playerLike;
    guns: gun[];
    get activeIndex(): number;
    set activeIndex(v: number);
    get activeItem(): gun;
    constructor(parent: playerLike, ...items: gunPrototype[]);
}
declare class gunPrototype {
    name: string;
    dual: boolean;
    images: {
        loot: import("p5").Image;
        held: import("p5").Image;
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
    offset: {
        x: number;
        y: number;
    };
    width: number;
    height: number;
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
    fireMode: ("automatic" | "semi" | `burst-${number}`)[];
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
    constructor(name: string, dual: boolean, images: {
        loot: import("p5").Image;
        held: import("p5").Image;
    }, tint: string, ballistics: {
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
    }, caliber: string, delay: number, accuracy: {
        default: number;
        moving: number;
    }, offset: {
        x: number;
        y: number;
    }, dimensions: {
        width: number;
        height: number;
    }, hands: {
        lefthand: {
            x: number;
            y: number;
        };
        righthand?: {
            x: number;
            y: number;
        };
    }, spawnOffset: {
        x: number;
        y: number;
    }, suppressed: boolean, recoilImpulse: {
        x: number;
        y: number;
        duration: number;
    }, fireMode: ("automatic" | "semi" | `burst-${number}`)[], burstProps: {
        shotDelay: number;
        burstDelay: number;
    }, reload: {
        duration: number;
        ammoReloaded: number | "all";
        chain: boolean;
    }, capacity: {
        normal: number;
        firepower: number;
    }, casing: typeof gunPrototype.prototype.casing, altReload?: {
        duration: number;
        ammoReloaded: number | "all";
        chain: boolean;
    });
}
declare class gun {
    #private;
    get proto(): gunPrototype;
    get activeFireModeIndex(): number;
    set activeFireModeIndex(v: number);
    get activeFireMode(): `burst-${number}` | "automatic" | "semi";
    get ammo(): number;
    set ammo(v: number);
    recoilImpulseParity: -1 | 1;
    constructor(proto: gunPrototype);
    primary(shooter: playerLike): void;
    reload(shooter: playerLike): void;
}
declare class bullet {
    #private;
    get body(): Matter.Body;
    get shooter(): playerLike;
    get emitter(): gunPrototype;
    get angle(): number;
    get start(): {
        x: number;
        y: number;
    };
    get created(): number;
    get length(): number;
    get crit(): boolean;
    squaredDistance: number;
    constructor(body: Matter.Body, shooter: playerLike, emitter: gunPrototype, angle: number, start: {
        x: number;
        y: number;
    }, created: number, length: number, crit: boolean);
    update(): void;
    draw(p5: import("p5")): void;
    destroy(): void;
}
declare class casing {
    #private;
    get body(): Matter.Body;
    get emitter(): gunPrototype;
    get angle(): number;
    get trajectory(): number;
    get start(): {
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
    draw(p5: import("p5")): void;
    destroy(): void;
}
declare const gamespace: {
    readonly version: string;
    bulletInfo: {
        [key: string]: {
            tints: {
                normal: string;
                saturated: string;
                chambered: string;
            };
            spawnVar: {
                mean: number;
                variation: number;
                plusOrMinus: boolean;
            };
            casing: {
                img: import("p5").Image;
                despawnDist: {
                    mean: number;
                    variation: number;
                    plusOrMinus: boolean;
                };
                width: number;
                height: number;
            };
        };
    };
    _currentLevel: {
        name: string;
        world: {
            width: number;
            height: number;
            colour: string;
            gridColor: `#${string}`;
        };
        initializer: () => void;
    };
    _currentUpdate: number;
    currentUpdate: number;
    deltaTime: number;
    engine: Matter.Engine;
    fonts: {
        [key: string]: import("p5").Font;
    };
    freeze: () => void;
    _frozen: boolean;
    readonly frozen: boolean;
    guns: gunPrototype[];
    images: {
        [key: string]: import("p5").Image;
    };
    keys: {
        [key: number]: boolean;
    };
    lastUpdate: number;
    levels: {
        name: string;
        world: {
            width: number;
            height: number;
            colour: string;
            gridColor: `#${string}`;
        };
        initializer: () => void;
    }[];
    objects: {
        bullets: bullet[];
        casings: casing[];
        damageNumbers: {
            amount: number;
            createdTimestamp: number;
            crit: boolean;
            lethal: boolean;
            position: {
                x: number;
                y: number;
            };
            rngOffset: {
                x: number;
                y: number;
            };
            targetId: number;
        }[];
        obstacles: obstacle[];
        players: playerLike[];
    };
    player: playerLike;
    settings: {
        graphicsQuality: number;
        debug: boolean;
        bonus_features: {
            headshots_use_saturated_tracers: boolean;
            show_damage_numbers: boolean;
            damage_numbers_stack: boolean;
        };
    };
    update: (p5: import("p5")) => void;
    world: Matter.Composite;
};
