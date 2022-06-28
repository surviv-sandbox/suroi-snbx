/**
 * @deprecated This class hasn't really been touched since… ever. Use of this class may or may not yield expected results.
 */
declare class obstacle {
    #private;
    get body(): Matter.Body;
    events: customEvent;
    image: import("p5").Image;
    width: number;
    height: number;
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
    draw(): void;
}
declare class decal {
    image: import("p5").Image;
    width: number;
    height: number;
    tint: string;
    angle: number;
    position: {
        x: number;
        y: number;
    };
    constructor(angle: number, image: import("p5").Image, dimensions: {
        width: number;
        height: number;
    }, tint: string, position: {
        x: number;
        y: number;
    });
    draw(): void;
}
declare class playerLike {
    #private;
    get body(): Matter.Body;
    aiIgnore: boolean;
    angle: number;
    events: customEvent;
    health: number;
    maxHealth: number;
    name: string;
    inventory: inventory;
    options: {
        friction: number;
        restitution: number;
        inertia?: number;
        density: number;
    };
    get renderDist(): number;
    state: {
        attacking: boolean;
        eSwitchDelay: number;
        fired: number;
        firing: boolean;
        frozen: boolean;
        invuln: boolean;
        lastShot: [number, number, number, number];
        lastFreeSwitch: number;
        lastSwitch: number;
        moving: boolean;
        noSlow: boolean;
        reloading: false | number;
        custom: {
            [key: string]: unknown;
        };
    };
    speed: {
        base: number;
    };
    timers: {
        anticipatedReload: false | number;
        firing: false | number;
        reloading: {
            timer: false | number;
            all: boolean;
        };
    };
    get view(): number;
    set view(v: number);
    constructor(body: Matter.Body, angle: number, health: number, loadout: {
        guns: string[];
        activeIndex: number;
    }, options: {
        friction: number;
        restitution: number;
        inertia?: number;
        density: number;
    }, view: number, name: string);
    draw(): void;
    destroy(): void;
    move(w: boolean, a: boolean, s: boolean, d: boolean): void;
    switchSlots(index: 0 | 1): void;
    damage(amount: number, source: projectile | explosion): void;
}
declare class player extends playerLike {
    constructor(body: Matter.Body, angle: number, health: number, loadout: {
        guns: string[];
        activeIndex: number;
    }, options: {
        friction: number;
        restitution: number;
        inertia?: number;
        density: number;
    }, view: number);
}
declare class inventory {
    #private;
    get parent(): playerLike;
    get activeIndex(): 0 | 1;
    set activeIndex(v: 0 | 1);
    slot0: gun | void;
    slot1: gun | void;
    get activeItem(): gun;
    constructor(parent: playerLike);
}
interface listener {
    event: string;
    callback: (this: customEvent, event: Event, ...args: any[]) => any;
    name: string;
    once?: boolean;
}
declare class customEvent {
    #private;
    get listenerCount(): number;
    get listeners(): {
        event: string;
        callback: (this: customEvent, event: Event, ...args: any[]) => any;
        name: string;
        once?: boolean;
    }[];
    on(event: string, callback: listener["callback"]): this;
    once(event: string, callback: listener["callback"]): this;
    removeListener(event: string, name: string): boolean;
    addEventListener(event: string, callback: listener["callback"], options?: {
        once: boolean;
    }): this;
    removeListenersByType(event: string): void;
    removeAllListeners(): void;
    dispatchEvent(event: string | Event, ...args: Parameters<listener["callback"]>[1][]): boolean;
}
declare type bulletInfo = {
    [key: string]: {
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
};
declare type explosionInfo = {
    [key: string]: {
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
            tint: hexColor;
        };
        shrapnel: {
            count: number;
            damage: number;
            color: hexColor;
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
};
declare const gamespace: {
    readonly version: string;
    bots: InstanceType<typeof import("./assets/scripts/std_ai").default>[];
    bulletInfo: bulletInfo;
    camera: import("p5").Camera;
    cleanUp(options?: {
        reloadJSONBasedFields?: boolean;
        reloadFontsAndImages?: boolean;
        clearEvents?: boolean;
    }): void;
    _currentLevel: {
        color?: string;
        description: string;
        initializer: () => void;
        jsonPath: string;
        levelData: ReturnType<typeof parseLevelData>;
        name: string;
        thumbnail?: string;
        world: {
            width: number;
            height: number;
            color: string;
            gridColor: hexColor;
        };
    };
    created: timestamp;
    _currentUpdate: timestamp;
    currentUpdate: timestamp;
    deltaTime: number;
    engine: Matter.Engine;
    events: customEvent;
    explosionInfo: explosionInfo;
    exitLevel(): void;
    fonts: {
        [key: string]: {
            src: string;
            font: import("p5").Font;
        };
    };
    freeze(): void;
    _frozen: boolean;
    readonly frozen: boolean;
    guns: gunPrototype[];
    images: {
        [key: string]: {
            src: string;
            img: import("p5").Image;
        };
    };
    keys: {
        [key: number]: boolean;
    };
    kills: {
        crit: boolean;
        killed: string;
        killer: string;
        timestamp: timestamp;
        weapon: string;
        id: number;
    }[];
    lastUpdate: timestamp;
    levels: {
        color?: string;
        description: string;
        initializer(): void;
        jsonPath: string;
        levelData: ReturnType<typeof parseLevelData>;
        name: string;
        thumbnail?: string;
        world: {
            width: number;
            height: number;
            color: string;
            gridColor: hexColor;
        };
    }[];
    objects: {
        bullets: (bullet | shrapnel)[];
        casings: casing[];
        damageNumbers: {
            amount: number;
            createdTimestamp: timestamp;
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
        decals: decal[];
        explosions: explosion[];
        obstacles: obstacle[];
        players: playerLike[];
    };
    _oldStats: {
        ammo: DeepPartial<bulletInfo>;
        explosions: DeepPartial<explosionInfo>;
        guns: DeepPartial<gunPrototype>[];
    };
    player: player;
    p5: import("p5");
    settings: {
        visual: {
            graphicsQuality: number;
            debug: boolean;
            monitors: [0 | 1 | 2, 0 | 1 | 2];
            hud: boolean;
            maxDecals: number;
        };
        useNativeMath: boolean;
        name: string;
        bonusFeatures: {
            botDebug: boolean;
            csgoStyleKillfeed: boolean;
            damageNumbersStack: boolean;
            headshotsUseSaturatedTracers: boolean;
            showDamageNumbers: boolean;
            useInterpolatedSaturatedTracers: boolean;
        };
        balanceChanges: {
            weapons: {
                general: {
                    noslow: boolean;
                    quickswitch: boolean;
                    headshots: boolean;
                };
                m79: {
                    grenadeSpin: boolean;
                    moveSpeedPenalty: boolean;
                    spawnCasingOnReload: boolean;
                };
                mp220: {
                    pullBothTriggers: boolean;
                };
            };
        };
    };
    update(p5: import("p5")): void;
    world: Matter.Composite;
};
