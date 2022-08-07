type TOrArrayT<T> = T | T[];
type TOrFT<T, U extends any[]> = T | ((...args: U) => T);

type JSONValue = string | number | boolean | null;
type JSONObject = { [key: string]: JSONContent; };
type JSONArray = JSONObject["string"][];
type JSONContent = JSONValue | JSONObject | JSONArray;
type timestamp = number;
type badCodeDesign = any;

type hexColor = `#${string}`;
type RGBColor = [number, number, number];
type RGBAColor = [number, number, number, number];
type HSLColor = {
    hue: number;
    saturation: number;
    luminosity: number;
};
type HSBColor = {
    hue: number;
    saturation: number;
    brightness: number;
};
type HSLAColor = HSLColor & { alpha: number; };
type HSBAColor = HSBColor & { alpha: number; };
type colorModes = hexColor | RGBColor | RGBAColor | HSLColor | HSLAColor | HSBColor | HSBAColor;

type level = {
    name: string,
    jsonPath: string,
    description: string,
    targetVersion: string,
    color?: string,
    world: {
        width: number,
        height: number,
        color: string,
        gridColor: hexColor;
    };
    initializer(): void,
    thumbnail?: string,
};

/**
 * Make all properties in T optional, and if a given property holds an object, make all of its properties optional
 */
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
};

type JSONLevel = {
    obstacles: (
        (
            { type: "rectangle", width: number, height: number; } |
            { type: "circle", radius: number; } |
            { type: "polygon", sides: number, radius: number; } |
            { type: "fromVertices", vertexSets: { x: number, y: number; }[]; } |
            { type: "trapezoid", width: number, height: number, slope: number; }
        ) &
        {
            x: number,
            y: number,
            options: {
                isStatic: boolean,
                friction: number,
                restitution: number,
                density: number,
                angle: number;
            },
            details: {
                image: string,
                imageWidth: number,
                imageHeight: number,
                tint: `#${string}`,
                layer: number,
                xOffset: number,
                yOffset: number,
                angleOffset: number,
                imageMode: import("p5").IMAGE_MODE;
            },
        })[],
    players: {
        x: number,
        y: number,
        angle: number,
        size: number,
        options: {
            friction: number,
            restitution: number,
            inertia?: number,
            density: number;
        },
        loadout: {
            guns: string[],
            activeIndex: number;
        },
        health: number,
        scope: number;
    }[];
};

interface Math {
    cmp: (a: number, b: number) => -1 | 0 | 1;
    sec: (x: number) => number;
    csc: (x: number) => number;
    cot: (x: number) => number;
    asec: (x: number) => number;
    acsc: (x: number) => number;
    acot: (x: number) => number;
}

// Give code that runs before the console's initialization somewhere to dump data it wants logged to the console, then destroy the temporary wrapper
// The way that I've implemented this is to be as ephemeral as possible, but that means upsetting Typescript and using "@ts-expect-error"
Object.defineProperty(window, "cslData", {
    configurable: true,
    enumerable: false,
    writable: false,
    value: []
});

const generateId = (function* () {
    let i = 0;
    while (true) {
        yield i++;
    }
})();

function loadImg(path: string, failGracefully?: boolean): import("p5").Image | void { // Words cannot express how utterly fucking stupid this is
    try {
        return p5.prototype.loadImage.call({ _decrementPreload: () => { } }, path);
    } catch (e) {
        if (failGracefully) {
            return console.warn(`Failed to fetch image at path '${path}': ${e instanceof Error ? e.message : e}`);
        }
        throw e;
    }

}

function loadFnt(path: string, failGracefully?: boolean): import("p5").Font { // p5 serves as a good reminder as to why libraries are deisnged the way they are
    try {
        return p5.prototype.loadFont.call({ _decrementPreload: () => { } }, path);
    } catch (e) {
        if (failGracefully) {

        }
        throw e;
    }
}

function makeElement<K extends keyof HTMLElementTagNameMap>(tag: K, id?: string, className?: string): HTMLElementTagNameMap[K] {
    const ele = document.createElement(tag);
    id && (ele.id = id);
    className && (ele.className = className);
    return ele;
}

function squaredDist(ptA: { x: number; y: number; }, ptB: { x: number; y: number; }, options?: { useNativeMath: boolean; }) {
    options = { useNativeMath: (options ?? gamespace.settings).useNativeMath };
    return options.useNativeMath ? (ptB.x - ptA.x) ** 2 + (ptB.y - ptA.y) ** 2 : Decimal.sub(ptB.x, ptA.x).pow(2).plus(Decimal.sub(ptB.y, ptA.y).pow(2));
}

function distance(ptA: { x: number; y: number; }, ptB: { x: number; y: number; }, options?: { useNativeMath: boolean; }) {
    options = { useNativeMath: (options ?? gamespace.settings).useNativeMath };
    return (options.useNativeMath ? Math : Decimal).sqrt(squaredDist(ptA, ptB, options) as number);
}

function RPMToMSDelay(rpm: number, options?: { useNativeMath: boolean; }) {
    options = { useNativeMath: (options ?? gamespace.settings).useNativeMath };
    return options.useNativeMath ? 60000 / rpm : Decimal.div(60000, rpm);
}

function parseLevelData(data: JSONLevel): { obstacles: obstacle[]; players: playerLike[]; } {
    return {
        obstacles: data.obstacles.map(o => {
            let body: Matter.Body;

            try { o.options.angle *= Math.PI / 180; } catch { }

            switch (o.type) {
                case "rectangle":
                    body = Matter.Bodies.rectangle(o.x, o.y, o.width, o.height, o.options);
                    break;
                case "circle":
                    body = Matter.Bodies.circle(o.x, o.y, o.radius, o.options);
                    break;
                case "polygon":
                    body = Matter.Bodies.polygon(o.x, o.y, o.sides, o.radius, o.options);
                    break;
                case "fromVertices":
                    body = Matter.Bodies.fromVertices(o.x, o.y, [o.vertexSets], o.options);
                    break;
                case "trapezoid":
                    body = Matter.Bodies.trapezoid(o.x, o.y, o.width, o.height, o.slope, o.options);
                    break;
                default:
                    throw new SyntaxError(`Unknown type '${(o as any).type}'`);
            }

            body.mass = body.inverseMass = body.frictionAir = 1;

            const d = o.details;

            return new obstacle(
                body,
                o.options.angle,
                loadImg(d.image) as import("p5").Image,
                { width: d.imageWidth, height: d.imageHeight },
                d.tint,
                d.layer,
                { x: d.xOffset, y: d.yOffset, angle: d.angleOffset * Math.PI / 180 },
                d.imageMode
            );
        }),
        players: data.players.map(
            (p, i) => new (i ? playerLike : player)(
                (() => {
                    const body = Matter.Bodies.circle(p.x, p.y, 50, p.options);
                    body.mass = body.inverseMass = body.frictionAir = 1;

                    return body;
                })(),
                p.angle * Math.PI / 180,
                p.health,
                p.loadout,
                {
                    friction: 1,
                    restitution: 0,
                    inertia: 0,
                    density: 0.01
                },
                ({
                    1: 1330,
                    2: 1680,
                    4: 2359,
                    8: 3230,
                    15: 4940
                })[p.scope] as badCodeDesign,
                i
                    ? `BOT ${["Flavie", "Mathis", "Sarah", "Juliette", "Emma", "Lexie", "Oceane", "Maeva", "Sophia", "Charles", "Jeanne", "Laurent", "Theo", "Eli", "Edouard", "Axel", "Leonie", "Mayson", "Louis", "William", "Laurence", "Sophie", "Charlie", "Charlotte", "Beatrice", "Jayden", "Clara", "Felix", "Ellie", "James", "Ethan", "Milan", "Rosalie", "Hubert", "Lea", "Amelia", "Olivia", "Noah", "Emile", "Florence", "Simone", "Adele", "Mia", "Elizabeth", "Ophelie", "Flora", "Gabriel", "Victoria", "Logan", "Raphael", "Arnaud", "Victor", "Benjamin", "Livia", "Alicia", "Arthur", "Anna", "Lily", "Henri", "Nathan", "Romy", "Thomas", "Alice", "Lucas", "Theodore", "Liam", "Jules", "Chloe", "Camille", "Leonard", "Antoine", "Nolan", "Elliot", "Jackson", "Jake", "Zoe", "Samuel", "Eleonore", "Julia", "Maelie", "Alexis", "Mila", "Eloi", "Noelie", "Matheo", "Elena", "Jacob", "Jade", "Leo", "Jasmine", "Raphaelle", "Rose", "Adam", "Eva", "Olivier", "Xavier", "Loic", "Sofia", "Zachary", "Zack"][Math.floor(Math.random() * 100)]}`
                    : void 0 as badCodeDesign
            )
        )
    };
}

function checkLevelVersions(lvls: level[]) {
    return lvls.forEach(l => warnAboutVersionDiscrepencies(l, "level")), lvls;
}

function extractValue<T, U extends any[]>(x: TOrFT<T, U>, args: U): T {
    return typeof x == "function" ? (x as (...args: U[]) => T)(...args) : x;
}

function imageLoadWrapper<T extends any[]>(path: TOrFT<string, T>, basePath = "") {
    if (typeof path == "function") {
        const map = new Map<string, import("p5").Image>;

        return (...args: T) => {
            let newSrc = extractValue(path, args);

            if (map.has(newSrc)) {
                return map.get(newSrc)!;
            }

            const img = loadImg(basePath + newSrc, true) as import("p5").Image;

            map.set(newSrc, img);
            return img;
        };
    }
    const img = loadImg(basePath + path, true)!;

    return () => img;
}

function checkForVersionDiscrepencies(target: { targetVersion: string; }, objectType = ""): "INVALID_VERSION" | "OK" | "PATCH" | "MINOR" | "MAJOR" | "BETAS" | "FUTURE" | "FAR_FUTURE" {
    type a<T extends object> = {
        [key in keyof T]: key
    };
    const results: a<{
        INVALID_VERSION: string;
        OK: string;
        PATCH: string;
        MINOR: string;
        MAJOR: string;
        BETAS: string;
        FUTURE: string;
        FAR_FUTURE: string;
    }> = {
        INVALID_VERSION: "INVALID_VERSION",
        OK: "OK",
        PATCH: "PATCH",
        MINOR: "MINOR",
        MAJOR: "MAJOR",
        BETAS: "BETAS",
        FUTURE: "FUTURE",
        FAR_FUTURE: "FAR_FUTURE"
    };

    const v = target.targetVersion?.match?.(/^\d+\.\d+\.\d+$/g)?.map?.(v => v[0])!;

    if (v === null || !("targetVersion" in target)) {
        return results.INVALID_VERSION;
    } else {
        if (gamespace.compatibilityData[gamespace.version]?.[objectType]?.includes?.(target.targetVersion)) {
            return results.OK;
        }

        const [gMaj, gMin, gPatch] = target.targetVersion.split(".").map(v => +v),
            [maj, min, patch] = gamespace.version.split(".").map(v => +v),
            r = ["PATCH", "MINOR", "MAJOR", "BETAS", "FUTURE", "FAR_FUTURE"];

        let i = 5;

        for (const c of (`${+(gMaj > maj)}${+((gMaj == maj && gMin > min) || (gMaj == maj && gMin == min && gPatch > patch))}${+(maj != gMaj)}${+(min != gMin && +maj == 0)}${+(min != gMin)}${+(patch != gPatch)}` as badCodeDesign as string[])) {
            if (+c) {
                return results[r[i]];
            }
            i--;
        }
        return results.OK;
    }
}

function warnAboutVersionDiscrepencies(target: { targetVersion: string; }, objectType: string) {
    const d = checkForVersionDiscrepencies(target, objectType),
        v = target.targetVersion,
        cmp = `(${objectType}: ${v}, game: ${gamespace.version})`,
        o = objectType[0].toUpperCase() + objectType.slice(1),
        message = (() => {
            switch (d) {
                case "INVALID_VERSION": {
                    return `${o} has an invalid version string '${v}'.\nVersion numbers must follow the 'major.minor.patch' format.`;
                }
                case "OK": {
                    return `Nothing to say!`;
                }
                case "PATCH": {
                    return `${o} has a version that differs from the game's by one or multiple patches ${cmp}. Unexpected behvaiour may occur.`;
                }
                case "MINOR": {
                    return `${o} has a version that differs from the game's by one or multiple minor versions ${cmp}. It is therefore quite likely that this ${objectType} will not function properly.`;
                }
                case "MAJOR": {
                    return `${o} has a version that differs from the game's by one or multiple major versions ${cmp}. It is therefore overwhemingly likely that this ${objectType} will not function properly.`;
                }
                case "BETAS": {
                    return `${o} has a version that differs from the game's by one or multiple betas ${cmp}. It is therefore overwhemingly likely that this ${objectType} will not function properly.`;
                }
                case "FUTURE": {
                    return `${o} comes from the future and may therefore not be interpreted correctly by this inferior version of the sandbox.`;
                }
                case "FAR_FUTURE": {
                    return `${o} comes from the FAR future and will therefore probably not be interpreted correctly by this vastly inferior version of the sandbox.`;
                }
            }
        })();

    ({
        INVALID_VERSION: gamespace.console.error,
        OK: () => { },
        PATCH: gamespace.console.warn,
        MINOR: (message: Parameters<typeof gamespace.console.warn>[0]) => { gamespace.console.warn(message, true); },
        MAJOR: gamespace.console.error,
        BETAS: gamespace.console.error,
        FUTURE: gamespace.console.warn,
        FAR_FUTURE: gamespace.console.error
    })[d].call(gamespace.console, message);
}

type angleModes = {
    givenIn: "degrees" | "radians" | "gradians" | "turns",
    value: number;
};

type timeModes = {
    givenIn: "RPM" | "ms" | "s",
    value: number;
};

type JSONGun = {
    name: string,
    targetVersion: string,
    summary: {
        class: TOrFT<string, []>,
        engagementDistance: {
            min: TOrFT<number, []>,
            max: TOrFT<number, []>;
        },
        shouldNoslow: TOrFT<boolean, []>,
        role: TOrFT<"primary" | "secondary", []>;
    },
    dual: TOrFT<boolean, [gun, playerLike]>,
    images: {
        loot: TOrFT<string, []>,
        held: TOrFT<string, []>,
        silhouette: TOrFT<string, []>;
    },
    tint: TOrFT<colorModes, [gun, playerLike]>,
    ballistics: {
        damage: TOrFT<number, [gun, playerLike]>,
        velocity: TOrFT<number, [gun, playerLike]>,
        range: TOrFT<number, [gun, playerLike]>,
        tracer: {
            width: TOrFT<number, [gun, playerLike]>,
            height: TOrFT<number, [gun, playerLike]>;
        },
        hitboxLength: TOrFT<number, [gun, playerLike]>,
        obstacleMult: TOrFT<number, [gun, playerLike]>,
        headshotMult: TOrFT<number, [gun, playerLike]>,
        fsa: {
            enabled: TOrFT<boolean, [gun, playerLike]>,
            rechargeTime: TOrFT<number, [gun, playerLike]>;
        },
        falloff: TOrFT<number, [gun, playerLike]>,
        projectiles: TOrFT<number, [gun, playerLike]>;
    },
    suppressed: TOrFT<boolean, [gun, playerLike]>,
    caliber: TOrFT<string, [gun, playerLike]>,
    firingDelay: TOrFT<number, [gun, playerLike]>,
    deployGroup: TOrFT<number, [gun, playerLike]>,
    accuracy: {
        default: TOrFT<number, [gun, playerLike]>,
        moving: TOrFT<number, [gun, playerLike]>;
    },
    moveSpeedPenalties: {
        active: TOrFT<number, [gun, playerLike]>,
        firing: TOrFT<number, [gun, playerLike]>;
    },
    imageOffset: {
        perp: TOrFT<number, [gun, playerLike]>,
        parr: TOrFT<number, [gun, playerLike]>;
    },
    dimensions: {
        width: TOrFT<number, [gun, playerLike]>,
        height: TOrFT<number, [gun, playerLike]>,
        layer: TOrFT<0 | 1 | 2, [gun, playerLike]>;
    },
    reload: {
        duration: TOrFT<number, [gun, playerLike]>,
        ammoReloaded: TOrFT<number | "all", [gun, playerLike]>,
        chain: TOrFT<boolean, [gun, playerLike]>;
    },
    altReload?: {
        duration: TOrFT<number, [gun, playerLike]>,
        ammoReloaded: TOrFT<number | "all", [gun, playerLike]>,
        chain: TOrFT<boolean, [gun, playerLike]>;
    },
    magazineCapacity: {
        normal: TOrFT<number, []>,
        firepower: TOrFT<number, []>;
    },
    switchDelay: TOrFT<number, [gun, playerLike]>,
    handPositions: {
        leftHand: {
            perp: TOrFT<number, [gun, playerLike]>,
            parr: TOrFT<number, [gun, playerLike]>;
        },
        rightHand?: {
            perp: TOrFT<number, [gun, playerLike]>,
            parr: TOrFT<number, [gun, playerLike]>;
        };
    },
    projectileSpawnOffset: {
        perp: TOrFT<number, [gun, playerLike]>,
        parr: TOrFT<number, [gun, playerLike]>;
    },
    casings: {
        spawnOffset: {
            perp: TOrFT<number, [gun, playerLike]>,
            parr: TOrFT<number, [gun, playerLike]>;
        },
        velocity: {
            perp: TOrFT<number, [gun, playerLike]>,
            parr: TOrFT<number, [gun, playerLike]>,
            angular: TOrFT<number, [gun, playerLike]>;
        },
        spawnOn: TOrFT<"fire" | "reload", [gun, playerLike]>,
        spawnDelay: TOrFT<number, [gun, playerLike]>;
    },
    recoilImpulse: {
        direction: {
            perp: TOrFT<number, [gun, playerLike]>,
            parr: TOrFT<number, [gun, playerLike]>;
        },
        duration: TOrFT<number, [gun, playerLike]>;
    },
    possibleFireModes: TOrFT<("semi" | "automatic" | `${"auto-" | ""}burst-${number}`)[], []>,
    burstProps?: {
        shotDelay: TOrFT<number, [gun, playerLike]>,
        burstDelay: TOrFT<number, [gun, playerLike]>;
    };
};

function parseGunData(data: [JSONGun, string][]) {
    const playerSize = 50;

    return data.map(dat => {
        const [g, basePath] = dat;

        warnAboutVersionDiscrepencies(g, "gun");

        return new gunPrototype(
            g.name,
            (() => {
                return {
                    class: g.summary.class,
                    engagementDistance: {
                        min: (...args) => extractValue(g.summary.engagementDistance.min, args) * playerSize,
                        max: (...args) => extractValue(g.summary.engagementDistance.max, args) * playerSize
                    },
                    shouldNoslow: g.summary.shouldNoslow,
                    role: g.summary.role
                };
            })(),
            g.dual,
            (() => {
                const f = (p: TOrFT<string, []>) => {
                    const map = new Map<string, import("p5").Image>,
                        o = {
                            img: () => {
                                const path = extractValue(p, []);

                                o.src = basePath + path;

                                if (map.has(path)) {
                                    return map.get(path)!;
                                }

                                const img = loadImg(basePath + path) as import("p5").Image;
                                map.set(path, img);
                                return img;
                            },
                            src: typeof p == "string" ? basePath + p : ""
                        };

                    return o;
                };

                return {
                    loot: f(g.images.loot),
                    held: f(g.images.held),
                    silhouette: f(g.images.silhouette)
                };
            })(),
            (...args) => toHex(extractValue(g.tint, args)),
            (() => {
                const b = g.ballistics,
                    t = b.tracer;

                return {
                    damage: b.damage,
                    range: (...args) => extractValue(b.range, args) * playerSize,
                    velocity: (...args) => extractValue(b.velocity, args) * playerSize,
                    obstacleMult: b.obstacleMult,
                    headshotMult: b.headshotMult,
                    tracer: {
                        width: (...args) => extractValue(t.width, args) * playerSize,
                        height: (...args) => extractValue(t.height, args) * playerSize
                    },
                    hitboxLength: (...args) => extractValue(b.hitboxLength, args) * playerSize,
                    projectiles: b.projectiles,
                    falloff: b.falloff,
                    fsaCooldown: b.fsa.enabled ? b.fsa.rechargeTime : Infinity
                };
            })(),
            g.caliber,
            g.firingDelay,
            (() => {
                return {
                    default: (...args) => extractValue(g.accuracy.default, args),
                    moving: (...args) => extractValue(g.accuracy.moving, args)
                };
            })(),
            (() => {
                const i = g.imageOffset;
                return {
                    perp: (...args) => extractValue(i.perp, args) * playerSize,
                    parr: (...args) => extractValue(i.parr, args) * playerSize
                };
            })(),
            (() => {
                const d = g.dimensions;

                return {
                    width: (...args) => extractValue(d.width, args) * playerSize,
                    height: (...args) => extractValue(d.height, args) * playerSize,
                    layer: (...args) => extractValue(d.layer, args)
                };
            })(),
            (() => {
                const l = g.handPositions.leftHand,
                    r = g.handPositions.rightHand;

                return {
                    lefthand: {
                        perp: (...args) => extractValue(l.perp, args) * playerSize,
                        parr: (...args) => extractValue(l.parr, args) * playerSize
                    },
                    righthand: r && {
                        perp: (...args) => extractValue(r.perp, args) * playerSize,
                        parr: (...args) => extractValue(r.parr, args) * playerSize
                    }
                };
            })(),
            (() => {
                const s = g.projectileSpawnOffset;

                return {
                    perp: (...args) => extractValue(s.perp, args) * playerSize,
                    parr: (...args) => extractValue(s.parr, args) * playerSize
                };
            })(),
            (...args) => extractValue(g.suppressed, args),
            (() => {
                const r = g.recoilImpulse,
                    di = r.direction;

                return {
                    perp: (...args) => extractValue(di.perp, args) * playerSize,
                    parr: (...args) => extractValue(di.parr, args) * playerSize,
                    duration: (...args) => extractValue(r.duration, args)
                };
            })(),
            g.possibleFireModes,
            (() => {
                const b = extractValue(g.burstProps, []);

                return {
                    shotDelay: (...args) => b ? extractValue(b.shotDelay, args) : Infinity,
                    burstDelay: (...args) => b ? extractValue(b.burstDelay, args) : Infinity
                };
            })(),
            {
                duration: g.reload.duration,
                ammoReloaded: g.reload.ammoReloaded,
                chain: g.reload.chain
            },
            g.magazineCapacity,
            g.switchDelay,
            (() => {
                const c = g.casings,
                    sO = c.spawnOffset,
                    sOpe = sO.perp,
                    sOpa = sO.parr,
                    v = c.velocity,
                    vA = c.velocity.angular,
                    vAVal = vA;

                return {
                    spawnOffset: {
                        perp: (...args) => extractValue(sOpe, args) * playerSize,
                        parr: (...args) => extractValue(sOpa, args) * playerSize
                    },
                    velocity: {
                        perp: (...args) => extractValue(v.perp, args) * playerSize,
                        parr: (...args) => extractValue(v.parr, args) * playerSize,
                        angular: vAVal
                    },
                    spawnDelay: c.spawnDelay,
                    spawnOn: (...args) => extractValue(c.spawnOn, args)
                };
            })(),
            {
                active: g.moveSpeedPenalties.active,
                firing: g.moveSpeedPenalties.firing
            },
            g.deployGroup,
            (() => {
                const a = extractValue(g.altReload, []);

                return a && {
                    duration: a.duration,
                    ammoReloaded: a.ammoReloaded,
                    chain: a.chain
                };
            })()
        );
    });
}

type explosiveProjData = {
    type: "explosive",
    explosionType: TOrFT<string, []>,
    explodeOnContact: TOrFT<boolean, [projectile]>,
    maxDist: TOrFT<number, [projectile]>,
    heightPeak: TOrFT<number, [projectile]>;
};

type ammoData = {
    name: string,
    targetVersion: string,
    tints: {
        normal: TOrFT<string, [projectile]>,
        saturated: TOrFT<string, [projectile]>,
        chambered: TOrFT<string, [projectile]>;
    },
    alpha: {
        rate: TOrFT<number, [projectile]>,
        min: TOrFT<number, [projectile]>,
        max: TOrFT<number, [projectile]>;
    },
    spawnVar: TOrFT<number, []>,
    imageOffset: {
        parr: TOrFT<number, [projectile]>,
        perp: TOrFT<number, [projectile]>;
    },
    projectileInfo: (explosiveProjData | { type: "bullet"; }) & {
        img: TOrFT<string, [projectile]>,
        spinVel?: TOrFT<number, [projectile]>;
    },
    casing: {
        img: TOrFT<string, [casing]>,
        lifetime: TOrFT<number, [casing]>,
        width: TOrFT<number, [casing]>,
        height: TOrFT<number, [casing]>;
    };
};

function parseAmmoData(data: [ammoData[], string][]) {
    const playerSize = 50;

    return data
        .map(v => v[0].map<[ammoData, string]>(a => { return [a, v[1]]; }))
        .flat()
        .map(dat => {
            const [a, basePath] = dat;

            warnAboutVersionDiscrepencies(a, "ammo");

            return {
                name: a.name,
                tints: a.tints,
                spawnVar: a.spawnVar,
                imageOffset: {
                    parr: (...args) => extractValue(a.imageOffset.parr, args) * playerSize,
                    perp: (...args) => extractValue(a.imageOffset.perp, args) * playerSize
                },
                alpha: a.alpha,
                projectileInfo: Object.assign(a.projectileInfo.type == "explosive" ? {
                    type: "explosive",
                    explosionType: a.projectileInfo.explosionType,
                    explodeOnContact: a.projectileInfo.explodeOnContact,
                    maxDist: (...args: [projectile]) => extractValue((a.projectileInfo as explosiveProjData).maxDist, args) * playerSize,
                    heightPeak: a.projectileInfo.heightPeak
                } : {
                    type: "bullet",
                }, {
                    img: imageLoadWrapper(a.projectileInfo.img, basePath),
                    spinVel: (...args: [projectile]) => extractValue(a.projectileInfo.spinVel, args) ?? 0
                }) as bulletInfo["projectileInfo"],
                casing: {
                    img: imageLoadWrapper(a.casing.img, basePath),
                    lifetime: a.casing.lifetime,
                    width: a.casing.width,
                    height: a.casing.height
                }
            } as bulletInfo;
        });
}

type explosionData = {
    name: string,
    targetVersion: string,
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
    shakeStrength: TOrFT<number, []>,
    shakeDuration: TOrFT<number, []>,
    color: colorModes;
    decal: {
        img: string;
        width: TOrFT<number, []>;
        height: TOrFT<number, []>;
        tint: hexColor;
    };
    shrapnel: {
        count: TOrFT<number, []>;
        damage: TOrFT<number, []>;
        color: colorModes;
        img: string;
        velocity: TOrFT<number, []>;
        range: TOrFT<number, []>;
        falloff: TOrFT<number, []>;
        tracer: {
            width: TOrFT<number, []>;
            height: TOrFT<number, []>;
        };
    };
};

function parseExplosionData(data: [explosionData, string][]) {
    const playerSize = 50;

    return data.map(dat => {
        const [e, basePath] = dat;

        warnAboutVersionDiscrepencies(e, "explosion");

        return {
            name: e.name,
            damage: e.damage,
            obstacleMult: e.obstacleMult,
            radii: {
                visual: {
                    min: () => extractValue(e.radii.visual.min, []) * playerSize,
                    max: () => extractValue(e.radii.visual.max, []) * playerSize
                },
                damage: {
                    min: () => extractValue(e.radii.damage.min, []) * playerSize,
                    max: () => extractValue(e.radii.damage.max, []) * playerSize
                }
            },
            lifetime: e.lifetime,
            shakeStrength: () => extractValue(e.shakeStrength, []) * playerSize,
            shakeDuration: e.shakeDuration,
            color: e.color,
            decal: (() => {
                const d = e.decal;

                return {
                    img: imageLoadWrapper(d.img, basePath),
                    tint: d.tint,
                    width: () => extractValue(d.width, []) * playerSize,
                    height: () => extractValue(d.height, []) * playerSize
                };
            })(),
            shrapnel: (() => {
                const s = e.shrapnel;

                return {
                    count: s.count,
                    damage: s.damage,
                    color: s.color,
                    img: imageLoadWrapper(s.img, basePath),
                    velocity: () => extractValue(s.velocity, []) * playerSize,
                    range: () => extractValue(s.range, []) * playerSize,
                    falloff: s.falloff,
                    tracer: {
                        width: () => extractValue(s.tracer.width, []) * playerSize,
                        height: () => extractValue(s.tracer.height, []) * playerSize
                    }
                };
            })()
        } as explosionInfo;
    });
}

function $(ele: string): HTMLElement | null { return document.getElementById(ele); }

function average(options: { useNativeMath: boolean; }, ...args: Decimal.Value[]) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    if (options.useNativeMath) {
        return args.reduce<number>((p, c) => +p + +c, 0) / args.length;
    }

    return args.reduce<Decimal>((p, c) => p.add(c), new Decimal(0));
}

function toMS(val: timeModes) {
    const nM = gamespace.settings.useNativeMath;

    switch (val.givenIn) {
        case "ms": return val.value;
        case "s": return nM ? val.value * 1000 : +Decimal.mul(val.value, 1000);
        case "RPM": return +RPMToMSDelay(val.value);
    }
}

function toRad(val: angleModes) {
    const nM = gamespace.settings.useNativeMath;

    switch (val.givenIn) {
        case "radians": return val.value;
        case "degrees": return nM ? val.value * Math.PI / 180 : +Decimal.mul(val.value, Decimal.acos(-1)).div(180);
        case "gradians": return nM ? val.value * 0.9 : +Decimal.mul(val.value, 0.9);
        case "turns": return nM ? val.value * 2 * Math.PI : +Decimal.mul(val.value, 2);
    }
}

function stdDev(options: { useNativeMath: boolean; }, ...arr: Decimal.Value[]) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };

    const nM = options.useNativeMath,
        avg = average(options, ...arr),
        a = arr.map(e => (nM ? Math : Decimal).abs((nM ? +e - +avg : Decimal.sub(e, avg)) as number));

    return average(options, ...a);
}

function checkBounds(value: Decimal | number, lowerBound: Decimal | number | "-inf" | "inf", upperBound: Decimal | number | "-inf" | "inf", options: { inclusion?: { lower?: boolean, upper?: boolean; }, useNativeMath?: boolean; } = { inclusion: { lower: true, upper: true }, useNativeMath: true }): boolean {
    options = { useNativeMath: options.useNativeMath ?? gamespace.settings.useNativeMath, inclusion: { lower: options.inclusion?.lower ?? true, upper: options.inclusion?.upper ?? true } };

    value = +value, lowerBound = typeof lowerBound != "string" ? +lowerBound : lowerBound, upperBound = typeof upperBound != "string" ? +upperBound : upperBound;

    if (Number.isNaN(value) ||
        !Number.isFinite(value) ||
        (lowerBound == upperBound &&
            !(
                (options as badCodeDesign).inclusion.lower ||
                (options as badCodeDesign).inclusion.upper
            )
        ) ||
        lowerBound == "inf" ||
        upperBound == "-inf" ||
        lowerBound > upperBound
    ) {
        return false;
    }

    if (lowerBound == "-inf" && upperBound == "inf") { return true; }

    if (options.useNativeMath) {
        return (lowerBound < value || ((options as badCodeDesign).inclusion.lower && lowerBound == value)) && (value < upperBound || ((options as badCodeDesign).inclusion.upper && upperBound == value));
    }
    return (new Decimal(lowerBound)[`lessThan${"OrEqualTo".repeat(+(options as badCodeDesign).inclusion.lower)}`](value)) && (new Decimal(value)[`lessThan${"OrEqualTo".repeat(+(options as badCodeDesign).inclusion.upper)}`](upperBound));
};

function clamp(value: Decimal.Value, min?: Decimal.Value, max?: Decimal.Value, options?: { useNativeMath: boolean; }) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };

    min ??= -Infinity, max ??= Infinity;
    return options.useNativeMath ? Math.max(+min, Math.min(+value, +max)) : Decimal.clamp(value, min, max);
}

function normalizeAngle(a: Decimal.Value, options: { useNativeMath?: boolean, normalizeTo?: "degrees" | "radians" | "π" | "gradians"; } = { useNativeMath: true, normalizeTo: "radians" }) {
    options = { useNativeMath: options.useNativeMath ?? gamespace.settings.useNativeMath, normalizeTo: options.normalizeTo ?? "degrees" };

    const fullTurn: number | Decimal = {
        degrees: 360,
        radians: options.useNativeMath ? 2 * Math.PI : Decimal.mul(2, Math.PI),
        π: Math.PI,
        gradians: 400
    }[(options as badCodeDesign).normalizeTo];
    return options.useNativeMath ? +a - Math.floor(+a / (fullTurn as number)) * (fullTurn as number) : Decimal.sub(a, Decimal.div(a, fullTurn).floor().mul(fullTurn));
}

function meanDevPM_random(mean: Decimal.Value, deviation: Decimal.Value, plusOrMinus: boolean, options?: { useNativeMath: boolean; }) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };

    return deviation
        ? options.useNativeMath
            ? +mean + +deviation * (plusOrMinus ? 2 * (Math.random() - 0.5) : Math.random())
            : Decimal.mul(deviation, plusOrMinus ? Decimal.mul(2, Math.random()).sub(0.5) : Math.random()).add(mean)
        : mean;
}

function clone<T extends JSONContent>(object: T): T {
    if (typeof object != "object" || object === null) {
        return object;
    }

    if (Array.isArray(object)) {
        const copy: JSONArray = [] as JSONArray;

        for (const key in (object as JSONArray)) {
            const value = (object as JSONArray)[key];

            if (typeof value == "object" && value !== null) {
                (copy as JSONArray)[key] = value === null ? value : clone(value);
                continue;
            }
            copy[key] = value;
        }

        return copy as T;
    }

    const copy: JSONObject = {} as JSONObject;

    for (const key in (object as JSONObject)) {
        const value = (object as JSONObject)[key] as JSONObject[string];
        if (typeof value == "object" && object !== null) {
            copy[key] = value === null ? value : clone(value);
            continue;
        }
        copy[key] = value;
    }

    return copy as T;
}

function overrideObject<T extends JSONObject, U extends JSONObject>(o1: Extract<T, U> & Partial<T>, o2: Extract<T, U> & Partial<U>) {
    o1 = clone(o1);
    o2 = clone(o2);

    type keyT = keyof (Extract<T, U> & Partial<T>);

    for (const key in o2) {
        if (typeof o2[key] == "object" && o2[key] !== null) {
            o1[key as keyT] = overrideObject(o1[key] as any, o2[key] as any);
        } else {
            o1[key as keyT] = ((o2[key] as JSONContent | void) ?? o1[key as keyT] as JSONValue) as any;
        }
    }

    return o1;
}

function linterp(a: Decimal.Value, b: Decimal.Value, t: Decimal.Value, options: { useNativeMath: boolean; } = { useNativeMath: gamespace.settings.useNativeMath }) {
    return options.useNativeMath ? (+a * (1 - +t) + +b * +t) : Decimal.mul(b, t).add(Decimal.mul(a, Decimal.sub(1, t)));
}

function getDecimalPlaces(n: number | Decimal) {
    if (n instanceof Decimal) { return n.decimalPlaces(); }
    const str = n.toString();
    return +!!str.match(/\./) && str.length - (str.indexOf(".") + 1);
}

function sliceToDecimalPlaces(number: number | Decimal, decimalPlaces: number) {
    return +number
        .toString()
        .split(".")
        .map((v, i) =>
            i
                ? (() => {
                    const d = v.slice(0, decimalPlaces);
                    return v[decimalPlaces] == "9" ? `${d.slice(0, -1)}${+d.slice(-1) + 1}` : d;
                })()
                : v)
        .join(".");
}

function sigFigIshMult(a: number, b: number) {
    return sliceToDecimalPlaces(a * b, getDecimalPlaces(a) + getDecimalPlaces(b));
}

const getRenderDistFromView = (() => {
    // Basically an implementation of a function cache, but very niche-ly done

    const map = new Map<number, Decimal>();

    function getRenderDistFromView(v: number) {
        /*
        √(642281v^2 + 34228610v + 714829400) / 722

        calculated as

        (((v * 642281 + 34228610)v + 714829400) ^ 0.5) / 722
        */

        return Decimal.mul((v + 720), 642281).add(34228610).mul((v + 720)).add(714829400).sqrt().div(722);
    }

    return (view: number) => {
        if (map.has(view)) {
            return +(map.get(view) as badCodeDesign);
        }

        const v = getRenderDistFromView(view);

        map.set(view, v);

        return +v;
    };
})();

function hexToRGB(hex: hexColor, options?: { useNativeMath: boolean; }) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };

    hex = hex.replace("#", "") as badCodeDesign;
    const nM = options.useNativeMath,
        shorthand = hex.length < 6,
        r = new RegExp(`.{${shorthand ? 1 : 2}}`, "g");

    if (r.test(hex)) {
        return (hex.match(r) as RegExpMatchArray).map((v, i) => nM ? parseInt(v, 16) * (i == 3 ? 1 / 255 : shorthand ? 17 : 1) : +Decimal.mul(parseInt(v, 16), (i == 3 ? Decimal.div(1, 255) : shorthand ? 17 : 1))) as RGBAColor;
    }

    throw new SyntaxError(`Color '${hex} is not a valid hex color'`);
}

function RGBToHex(rgb: RGBAColor, options?: { useNativeMath: boolean; }): hexColor {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };

    return `#${rgb.map((v, i) => (options?.useNativeMath ? (254 * +(i == 3) + 1) * v : i == 3 ? Decimal.mul(v, i == 3 ? 255 : 1).toNumber() : v).toString(16).slice(0, 2).replace(/\./, "").padStart(2, "0")).join("")}`;
}

function hexToHSL(hex: hexColor, options?: { useNativeMath: boolean; }) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };

    return RGBToHSL(hexToRGB(hex, { useNativeMath: options.useNativeMath }), { useNativeMath: options.useNativeMath });
}

function RGBToHSL(rgb: RGBAColor, options?: { useNativeMath: boolean; }) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };

    const nM = options.useNativeMath,
        [r, g, b, a] = rgb.map((v, i) => i == 3 ? v : (nM ? v / 255 : Decimal.div(v, 255))) as [number | Decimal, number | Decimal, number | Decimal, number?],
        max = (nM ? Math : Decimal).max(r as number, g as number, b as number),
        min = (nM ? Math : Decimal).min(r as number, g as number, b as number),
        l = nM ? ((max as number) + (min as number)) / 2 : Decimal.add(max, min).div(2);

    let h: number | Decimal = 0,
        s: number | Decimal = 0;

    if (+max != +min) {
        const d = nM ? (max as number) - (min as number) : Decimal.sub(max, min);

        s = (
            nM
                ? (d as number) / (l > 0.5 ? (2 - (max as number) - (min as number)) : ((max as number) + (min as number)))
                : Decimal.div(d, l > 0.5 ? Decimal.sub(2, max).sub(min) : Decimal.add(max, min))
        );

        const _h = (() => {
            switch (+max) {
                case +r:
                    return nM
                        ? ((g as number) - (b as number)) / (d as number) + (g < b ? 6 : 0)
                        : Decimal.sub(g, b).div(d).add(g < b ? 6 : 0);
                case +g:
                    return nM
                        ? ((b as number) - (r as number)) / (d as number) + 2
                        : Decimal.sub(b, r).div(d).add(2);
                case +b:
                    return nM
                        ? ((r as number) - (g as number)) / (d as number) + 4
                        : Decimal.sub(r, g).div(d).add(4);
            }
        })() as number | Decimal;

        h = (nM ? (Math.PI as number) * (_h as number) / 3 : Decimal.div(_h, 3).mul(Decimal.acos(-1)));
    }

    return { hue: +h, saturation: +s, luminosity: +l, alpha: a ?? 1 };
}

function HSLToRGB(hsl: { hue: number, saturation: number, luminosity: number, alpha?: number; }, options: { useNativeMath: boolean; }) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };

    const nM = options.useNativeMath;

    let r: number | Decimal = hsl.luminosity,
        g: number | Decimal = hsl.luminosity,
        b: number | Decimal = hsl.luminosity;

    if (hsl.saturation) {
        function RGBCompFrHue(p: number | Decimal, q: number | Decimal, t: number | Decimal) {
            if (t < 0) { t = nM ? (t as number) + 1 : Decimal.add(t, 1); }
            if (t > 1) { t = nM ? (t as number) - 1 : Decimal.sub(t, 1); }
            if (t < 1 / 6) { return nM ? (p as number) + ((q as number) - (p as number)) * 6 * (t as number) : Decimal.mul(p, 6).mul(t).neg().plus(q).plus(p); }
            if (t < 1 / 2) { return q; }
            if (t < 2 / 3) { return nM ? (p as number) + ((q as number) - (p as number)) * (2 / 3 - (t as number)) * 6 : Decimal.div(2, 3).sub(t).mul(6).mul(p).neg().plus(q).plus(p); }
            return p;
        };

        const q =
            nM
                ? hsl.luminosity < 0.5 ? hsl.luminosity * (1 + hsl.saturation) : hsl.luminosity + hsl.saturation - hsl.luminosity * hsl.saturation
                : hsl.luminosity < 0.5 ? Decimal.add(1, hsl.saturation).mul(hsl.luminosity) : Decimal.mul(hsl.luminosity, hsl.saturation).neg().plus(hsl.saturation).plus(hsl.luminosity),
            p = nM ? 2 * hsl.luminosity - (q as number) : Decimal.mul(2, hsl.luminosity).sub(q);

        r = RGBCompFrHue(p, q, hsl.hue + 1 / 3);
        g = RGBCompFrHue(p, q, hsl.hue);
        b = RGBCompFrHue(p, q, hsl.hue - 1 / 3);
    }

    return (nM ? [r as number * 255, g as number * 255, b as number * 255, hsl.alpha ?? 1] : [+Decimal.mul(r, 255), +Decimal.mul(g, 255), +Decimal.mul(b, 255), hsl.alpha ?? 1]) as RGBAColor;
}

function HSLToHex(hsl: HSLAColor, options?: { useNativeMath: boolean; }) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };

    return RGBToHex(HSLToRGB(hsl, options), options);
}

function HSBToRGB(hsb: HSBAColor, options?: { useNativeMath: boolean; }) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };

    return HSLToRGB(HSBToHSL(hsb, options), options);
}

function HSBToHex(hsb: HSBAColor, options?: { useNativeMath: boolean; }) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };

    return RGBToHex(HSBToRGB(hsb, options), options);
}

function HSLToHSB(hsl: HSLAColor, options?: { useNativeMath: boolean; }) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };

    const nM = options.useNativeMath,
        v = nM ? hsl.luminosity + hsl.saturation * Math.min(hsl.luminosity, 1 - hsl.luminosity) : Decimal.min(hsl.luminosity, Decimal.sub(1, hsl.luminosity)).mul(hsl.saturation).add(hsl.luminosity);
    return { hue: hsl.hue, saturation: v && nM ? 2 * (1 - hsl.luminosity / (v as number)) : +Decimal.div(hsl.luminosity, v).neg().add(1).mul(2), brightness: +v, alpha: hsl.alpha ?? 1 } as HSBAColor;
}

function HSBToHSL(hsb: HSBAColor, options?: { useNativeMath: boolean; }) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };

    const nM = options.useNativeMath,
        l = nM ? hsb.brightness * (1 - hsb.saturation / 2) : Decimal.div(hsb.saturation, 2).neg().add(1).mul(hsb.brightness);
    return { hue: hsb.hue, saturation: +!(+l == 0 || +l == 1) && nM ? ((hsb.brightness - (l as number)) / Math.min((l as number), 1 - (l as number))) : (+Decimal.sub(hsb.brightness, l).div(Decimal.min(l, Decimal.sub(1, l)))), luminosity: +l, alpha: hsb.alpha ?? 1 } as HSLAColor;
}

function parseColor(color: string): {
    type: `rgb${"a" | ""}`,
    value: RGBAColor;
} | {
    type: `hsl${"a" | ""}`,
    value: HSLAColor;
} | {
    type: `hsb${"a" | ""}`,
    value: HSBAColor;
} | {
    type: "hex",
    value: hexColor;
} | {
    type: "keyword",
    value: string;
} {
    if (color.match(/^(rgb\((?:(\d{1,2}|[0-2]((?<!2)\d|[0-5])((?<!25)\d|[0-5]))(\.\d+)?((, ?)| )){2}((\d{1,2}|[0-2]((?<!2)\d|[0-5])((?<!25)\d|[0-5]))(\.\d+)?\)))|(rgba\((?:(\d{1,2}|[0-2]((?<!2)\d|[0-5])((?<!25)\d|[0-5]))(\.\d+)?((, ?)| )){3}((0|1|0\.\d+)|(\d{1,2}(\.\d+)?|100)%)\))$/)) {
        return {
            type: `rgb${color.startsWith("rgba") ? "a" : ""}`,
            value: color.replace(/rgba?\(|\)/g, "").replace(/, /g, ",").split(/,| /).map(v => +(v.match(/%/) ? +v.replace(/%/, "") / 100 : v)) as RGBAColor
        };
    }

    for (const a of ["hsl", "hsb"]) { // HSL and HSB have the same syntax so
        if (color.match(new RegExp(`^(${a}\\((-?\\d+(\\.\\d+)?((, ?)| ))(((\\d{1,2}(\\.\\d+)?|100)%)((, ?)| ))(((0\\.\\d+)|1|(\\d{1,2}(\\.\\d+)?|100)%))\\))|${a}a\\((-?\\d+(\\.\\d+)?((, ?)| ))(((\\d{1,2}(\\.\\d+)?|100)%)((, ?)| ))(((0\\.\\d+)|1|(\\d{1,2}(\\.\\d+)?|100)%)((, ?)| ))((0\\.\\d+)|1|(\\d{1,2}(\\.\\d+)?|100)%)\\)$`, "g"))) {
            const arr = color.replace(new RegExp(`${a}a?\(|\)`, "g"), "").replace(/, /g, ",").split(/,| /g),
                p = (n: string) => n && +(n.match(/%/) ? +n.replace(/%/, "") / 100 : n);

            return {
                type: `${a as `hs${"l" | "b"}`}${color.startsWith("hsla") ? "a" : ""}` as `hs${"l" | "b"}${"a" | ""}`,
                value: { hue: arr[0], saturation: p(arr[1]), [a == "hsl" ? "luminosity" : "brightness"]: p(arr[2]), opacity: p(arr[3]) } as unknown as HSLAColor | HSBAColor
            } as {
                type: `hsl${"a" | ""}`,
                value: HSLAColor;
            } | {
                type: `hsb${"a" | ""}`,
                value: HSBAColor;
            };
        };
    }

    if (color.match(/^#([0-9A-Fa-f]{3,4}){1,2}$/)) {
        return { type: "hex", value: color as hexColor };
    }

    return {
        type: "keyword",
        value: {
            black: "#000", silver: "#C0C0C0", gray: "#808080", white: "#FFF", maroon: "#800000", red: "#F00", purple: "#800080", fuchsia: "#F0F", green: "#008000", lime: "#0F0", olive: "#808000", yellow: "#FF0", navy: "#000080", blue: "#00F", teal: "#008080", aqua: "#00FFF", orange: "#FFA500", aliceblue: "#F0F8FF", antiquewhite: "#FAEBD7", aquamarine: "#7FFFD4", azure: "#F0FFFF", beige: "#F5F5DC", bisque: "#FFE4C4", blanchedalmond: "#FFEBCD", blueviolet: "#8A2BE2", brown: "#A52A2A", burlywood: "#DEB887", cadetblue: "#5F9EA0", chartreuse: "#7FFF00", chocolate: "#D2691E", coral: "#FF7F50", cornflowerblue: "#6495ED", cornsilk: "#FFF8DC", crimson: "#DC143C", cyan: "#0FF", darkblue: "#00008B", darkcyan: "#008B8B", darkgoldenrod: "#B8860B", darkgray: "#A9A9A9", darkgreen: "#006400", darkgrey: "#A9A9A9", darkkhaki: "#BDB76B", darkmagenta: "#8B008B", darkolivegreen: "#556B2F", darkorange: "#FF8C00", darkorchid: "#9932CC", darkred: "#8B0000", darksalmon: "#E9967A", darkseagreen: "#8FBC8F", darkslateblue: "#483D8B", darkslategray: "#2F4F4F", darkslategrey: "#2F4F4F", darkturquoise: "#00CED1", darkviolet: "#9400D3", deeppink: "#FF1493", deepskyblue: "#00BFFF", dimgray: "#696969", dimgrey: "#696969", dodgerblue: "#1E90FF", firebrick: "#B22222", floralwhite: "#FFFAF0", forestgreen: "#228B22", gainsboro: "#DCDCDC", ghostwhite: "#F8F8FF", gold: "#FFD700", goldenrod: "#DAA520", greenyellow: "#ADFF2F", grey: "#808080", honeydew: "#F0FFF0", hotpink: "#FF69B4", indianred: "#CD5C5C", indigo: "#4B0082", ivory: "#FFFFF0", khaki: "#F0E68C", lavender: "#E6E6FA", lavenderblush: "#FFF0F5", lawngreen: "#7CFC00", lemonchiffon: "#FFFACD", lightblue: "#ADD8E6", lightcoral: "#F08080", lightcyan: "#E0FFFF", lightgoldenrodyellow: "#FAFAD2", lightgray: "#D3D3D3", lightgreen: "#90EE90", lightgrey: "#D3D3D3", lightpink: "#FFB6C1", lightsalmon: "#FFA07A", lightseagreen: "#20B2AA", lightskyblue: "#87CEFA", lightslategray: "#778899", lightslategrey: "#778899", lightsteelblue: "#B0C4DE", lightyellow: "#FFFFE0", limegreen: "#32CD32", linen: "#FAF0E6", magenta: "#F0F", mediumaquamarine: "#66CDAA", mediumblue: "#0000CD", mediumorchid: "#BA55D3", mediumpurple: "#9370DB", mediumseagreen: "#3CB371", mediumslateblue: "#7B68EE", mediumspringgreen: "#00FA9A", mediumturquoise: "#48D1CC", mediumvioletred: "#C71585", midnightblue: "#191970", mintcream: "#F5FFFA", mistyrose: "#FFE4E1", moccasin: "#FFE4B5", navajowhite: "#FFDEAD", oldlace: "#FDF5E6", olivedrab: "#6B8E23", orangered: "#FF4500", orchid: "#DA70D6", palegoldenrod: "#EEE8AA", palegreen: "#98FB98", paleturquoise: "#AFEEEE", palevioletred: "#DB7093", papayawhip: "#FFEFD5", peachpuff: "#FFDAB9", peru: "#CD853F", pink: "#FFC0CB", plum: "#DDA0DD", powderblue: "#B0E0E6", rosybrown: "#BC8F8F", royalblue: "#4169E1", saddlebrown: "#8B4513", salmon: "#FA8072", sandybrown: "#F4A460", seagreen: "#2E8B57", seashell: "#FFF5EE", sienna: "#A0522D", skyblue: "#87CEEB", slateblue: "#6A5ACD", slategray: "#708090", slategrey: "#708090", snow: "#FFFAFA", springgreen: "#00FF7F", steelblue: "#4682B4", tan: "#D2B48C", thistle: "#D8BFD8", tomato: "#FF6347", turquoise: "#40E0D0", violet: "#EE82EE", wheat: "#F5DEB3", whitesmoke: "#F5F5F5", yellowgreen: "#9ACD3", rebeccapurple: "#639", transparent: "#0000"
        }[color.toLowerCase()] ?? "#000"
    };
}

function toRGB(color: colorModes, options?: { useNativeMath: boolean; }) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };

    if (typeof color == "string" && color.startsWith("#")) { return hexToRGB(color, options); }
    if ((color as HSLAColor).luminosity) { return HSLToRGB(color as HSLAColor, options); }
    if ((color as HSBAColor).brightness) { return HSBToRGB(color as HSBAColor, options); }
    return color as RGBAColor;
}

function toHex(color: colorModes, options?: { useNativeMath: boolean; }) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };

    if (typeof color == "string" && color.startsWith("#")) { return color; }
    if ((color as HSLAColor).luminosity) { return HSLToHex(color as HSLAColor, options); }
    if ((color as HSBAColor).brightness) { return HSBToHex(color as HSBAColor, options); }
    return "#000";
}

function createCSLEntry(content: cslData["content"] | string, type?: cslData["type"]): cslData {
    return {
        timestamp: Date.now(),
        content,
        type: type ?? "log"
    };
}

/**
 * Literally the best function in this entire project.
 * @link https://areweyeetyet.rs
 * Rust is pretty cool
 */
function yeet(e: any): never {
    throw e;
}

(() => {
    window.addEventListener("keydown", ev => {
        if ((ev.key == "-" || ev.key == "=") && (ev.metaKey || ev.ctrlKey)) {
            ev.preventDefault();
        }
    });

    Math.cmp = function (a, b) {
        if (a == b) { return 0; }
        return a > b ? 1 : -1;
    };

    window.addEventListener("error", err => {
        if (err.filename) {
            gamespace.console.error({
                main: `Javascript ${Object.getPrototypeOf(err.error).constructor.name} occured at ${err.filename.replace(location.origin + location.pathname, "./")}:${err.lineno}:${err.colno}`,
                detail: err.error
            }, true);
        }
    });

    // Just adding short circuits, like sin(π) = 0, sec, csc and cot
    // source: https://en.wikipedia.org/wiki/Exact_trigonometric_values#Common_angles
    // Not covered: any of the hyperbolic trig functions
    const π = Math.PI,
        nativeSin = Math.sin,
        nativeCos = Math.cos,
        nativeTan = Math.tan,
        nativeArcSin = Math.asin,
        nativeArcCos = Math.acos,
        nativeArcTan = Math.atan,
        sin: { [key: number]: number; } = {
            0: 0,
            [+π / 12]: 0.25881904510252076,
            [+π / 10]: 0.30901699437494742,
            [+π / 8]: 0.3826834323650898,
            [+π / 6]: 0.5,
            [+π / 5]: 0.5877852522924731,
            [+π / 4]: 0.7071067811865475,
            [3 * +π / 10]: 0.8090169943749474,
            [+π / 3]: 0.8660254037844386,
            [3 * +π / 8]: 0.9238795325112868,
            [2 * +π / 5]: 0.9510565162951536,
            [5 * +π / 12]: 0.9659258262890683,
            [+π / 2]: 1
        },
        cos = {
            0: 1,
            [+π / 12]: 0.9659258262890683,
            [+π / 10]: 0.9510565162951536,
            [+π / 8]: 0.9238795325112868,
            [+π / 6]: 0.8660254037844386,
            [+π / 5]: 0.8090169943749474,
            [+π / 4]: 0.7071067811865475,
            [3 * +π / 10]: 0.5877852522924731,
            [+π / 3]: 0.5,
            [3 * +π / 8]: 0.3826834323650898,
            [2 * +π / 5]: 0.30901699437494742,
            [5 * +π / 12]: 0.25881904510252076,
            [+π / 2]: 0
        },
        tan = {
            0: 0,
            [+π / 12]: 0.2679491924311227,
            [+π / 10]: 0.3249196962329063,
            [+π / 8]: 0.4142135623730950,
            [+π / 6]: 0.5773502691896258,
            [+π / 5]: 0.7265425280053609,
            [+π / 4]: 1,
            [3 * +π / 10]: 1.3763819204711735,
            [+π / 3]: 1.7320508075688773,
            [3 * +π / 8]: 2.4142135623730950,
            [2 * +π / 5]: 3.0776835371752534,
            [5 * +π / 12]: 3.7320508075688773,
            [+π / 2]: Infinity
        };

    Math.sin = function (x: number): number {
        const ang = normalizeAngle(x, { normalizeTo: "radians" }),
            a = normalizeAngle(x, { normalizeTo: "π" }),
            sign: 1 | -1 = [1, -1][+(ang != a)] as 1 | -1;
        return sign * (sin[+a] ?? nativeSin.call(Math, +a));
    };

    Math.cos = function (x: number): number {
        const ang = normalizeAngle(x, { normalizeTo: "radians" }),
            a = normalizeAngle(x, { normalizeTo: "π" }),
            sign: 1 | -1 = [1, -1][+checkBounds(ang, π / 2, π as number * 1.5)] as 1 | -1;
        return sign * (cos[+a] ?? sign * nativeCos.call(Math, +ang));
    };

    Math.tan = function (x: number) {
        const ang = normalizeAngle(x, { normalizeTo: "π" }),
            a = ang.toString().replace(/-/, ""),
            sign: 1 | -1 = !!ang.toString().match(/-/) ? -1 : 1;
        return sign * (tan[+a] ?? nativeTan.call(Math, +a));
    };

    Math.sec = function (x: number): number { return 1 / Math.cos(x); };
    Math.csc = function (x: number): number { return 1 / Math.sin(x); };
    Math.cot = function (x: number): number { return 1 / Math.tan(x); };

    Math.asin = function (x: number) {
        if (!checkBounds(x, -1, 1)) { return NaN; }
        const sign = Math.sign(x);
        x = Math.abs(x);
        for (const p in sin) { if (sin[p] == x) { return sign * +p; } }
        return sign * nativeArcSin.call(Math, x);
    };

    Math.acos = function (x: number) {
        if (!checkBounds(x, -1, 1)) { return NaN; }
        const sign = Math.sign(x);
        x = Math.abs(x);
        for (const p in cos) { if (cos[p] == x) { return sign == -1 ? π - +p : +p; } }
        const nac = nativeArcCos.call(Math, x);
        return sign == -1 ? +π - nac : nac;
    };

    Math.atan = function (x: number) {
        const sign = Math.sign(x);
        x = Math.abs(x);
        for (const p in tan) { if (tan[p] == x) { return sign * +p; } }
        return sign * nativeArcTan.call(Math, x);
    };

    Math.asec = function (x: number) { return x == 1 ? 0 : x == -1 ? +π : Math.acos(1 / x); };
    Math.acsc = function (x: number) { return x == 1 ? π / 2 : x == -1 ? -π / 2 : Math.asin(1 / x); };
    Math.acot = function (x: number) { return x == Infinity ? 0 : x == -Infinity ? +π : π as number / 2 - Math.atan(x); };
})();