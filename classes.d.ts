/// <reference types="p5" />
/// <reference types="p5" />
/// <reference types="p5" />
/// <reference types="p5" />
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
    tint: colorModes;
    angle: number;
    position: {
        x: number;
        y: number;
    };
    constructor(angle: number, image: import("p5").Image, dimensions: {
        width: number;
        height: number;
    }, tint: colorModes, position: {
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
    aimTarget: {
        x: number;
        y: number;
    };
    get renderDist(): number;
    state: {
        attacking: boolean;
        eSwitchDelay: number;
        fired: number;
        firing: boolean;
        frozen: boolean;
        hitsGiven: Map<string, {
            hits: number;
            amount: number;
        }>;
        hitsTaken: Map<string, {
            hits: number;
            amount: number;
        }>;
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
    get velocity(): number;
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
    #private;
    get shakeInt(): number;
    constructor(body: Matter.Body, angle: number, health: number, loadout: {
        guns: string[];
        activeIndex: number;
    }, options: {
        friction: number;
        restitution: number;
        inertia?: number;
        density: number;
    }, view: number);
    addShake(source: string, origin: {
        x: number;
        y: number;
    }, strength: number): void;
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
    name: string;
    tints: {
        normal: TOrFT<string, [projectile]>;
        saturated: TOrFT<string, [projectile]>;
        chambered: TOrFT<string, [projectile]>;
    };
    alpha: {
        rate: TOrFT<number, [projectile]>;
        min: TOrFT<number, [projectile]>;
        max: TOrFT<number, [projectile]>;
    };
    spawnVar: TOrFT<number, []>;
    imageOffset: {
        parr: TOrFT<number, [projectile]>;
        perp: TOrFT<number, [projectile]>;
    };
    projectileInfo: ({
        type: "explosive";
        explosionType: TOrFT<string, [projectile]>;
        explodeOnContact: TOrFT<boolean, [projectile]>;
        maxDist: TOrFT<number, [projectile]>;
        heightPeak: TOrFT<number, [projectile]>;
    } | {
        type: "bullet";
    }) & {
        img: TOrFT<import("p5").Image, [projectile]>;
        spinVel: TOrFT<number, [projectile]>;
    };
    casing: {
        img: TOrFT<import("p5").Image, [casing]>;
        lifetime: TOrFT<number, [casing]>;
        width: TOrFT<number, [casing]>;
        height: TOrFT<number, [casing]>;
    };
};
declare type explosionInfo = {
    name: string;
    damage: TOrFT<number, []>;
    obstacleMult: TOrFT<number, []>;
    radii: {
        visual: {
            min: TOrFT<number, []>;
            max: TOrFT<number, []>;
        };
        damage: {
            min: TOrFT<number, []>;
            max: TOrFT<number, []>;
        };
    };
    lifetime: TOrFT<number, []>;
    shakeStrength: TOrFT<number, []>;
    shakeDuration: TOrFT<number, []>;
    color: TOrFT<colorModes, []>;
    decal: {
        img: TOrFT<import("p5").Image, []>;
        width: TOrFT<number, []>;
        height: TOrFT<number, []>;
        tint: TOrFT<colorModes, []>;
    };
    shrapnel: {
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
};
declare class gsp {
    #private;
    get version(): string;
    get bots(): import("./assets/scripts/std_ai").default[];
    get bulletInfo(): Map<string, bulletInfo>;
    get camera(): import("p5").Camera;
    get compatibilityData(): {
        [key: string]: {
            [key: string]: string[];
        };
    };
    get console(): csl;
    get currentLevel(): level;
    get currentUpdate(): number;
    get created(): number;
    get deltaTime(): number;
    get engine(): Matter.Engine;
    get events(): customEvent;
    get explosionInfo(): Map<string, explosionInfo>;
    get fonts(): Map<string, import("p5").Font>;
    get frozen(): boolean;
    get guns(): Map<string, gunPrototype>;
    get images(): Map<string, import("p5").Image>;
    get keys(): {
        [key: number]: boolean;
    };
    get kills(): {
        crit: boolean;
        killed: string;
        killer: string;
        timestamp: number;
        weapon: string;
        id: number;
    }[];
    get levels(): Map<string, level>;
    get objects(): {
        bullets: (bullet | shrapnel)[];
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
        decals: decal[];
        explosions: explosion[];
        obstacles: obstacle[];
        players: playerLike[];
    };
    get player(): player;
    get p5(): import("p5");
    get ready(): boolean;
    get settings(): {
        visual: {
            graphicsQuality: number;
            debug: boolean;
            monitors: [0 | 2 | 1, 0 | 2 | 1];
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
                    quickswitch: 0 | 2 | 1;
                    headshots: boolean;
                    noBuckshotSpawnVar: boolean;
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
    get world(): Matter.Composite;
    constructor();
    cleanUp(options: {
        reloadFontsAndImages?: boolean;
        clearEvents?: boolean;
    }): void;
    exitLevel(): void;
    freeze(): void;
    update(): void;
    makeMenu(first: boolean): void;
    _removePlayer(): void;
    _overrideKills(val: typeof gsp.prototype.kills): void;
    _overrideSettings(val: typeof gsp.prototype.settings): void;
    stdLevelSetup(engine: Matter.Engine, world: Matter.World, p5: import("p5"), level: level, levelData: ReturnType<typeof parseLevelData>, AI: typeof import("./assets/scripts/std_ai").default, font?: {
        font: string | import("p5").Font;
        size?: number;
    }): void;
}
declare const gamespace: gsp;
