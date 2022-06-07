type TOrArrayT<T> = T | T[];
type JSONValue = string | number | boolean | null;
type JSONObject = { [key: string]: JSONContent; };
type JSONArray = JSONObject["string"][];
type JSONContent = JSONValue | JSONObject | JSONArray;
type timestamp = number;

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

const generateId = (function* () {
    let i = 0;
    while (true) {
        yield i++;
    }
})();

function loadImg(path: string): import("p5").Image { // Words cannot express how utterly fucking stupid this is
    return p5.prototype.loadImage.call({ _decrementPreload: () => { } }, path);
}

function loadFnt(path: string): import("p5").Font { // p5 serves as a good reminder as to why libraries are deisnged the way they are
    return p5.prototype.loadFont.call({ _decrementPreload: () => { } }, path);
}

function makeElement<K extends keyof HTMLElementTagNameMap>(tag: K, id: string = void 0, className: string = void 0): HTMLElementTagNameMap[K] {
    const ele = document.createElement(tag);
    id && (ele.id = id);
    className && (ele.className = className);
    return ele;
}

function sqauredDist(ptA: { x: number; y: number; }, ptB: { x: number; y: number; }, options?: { useNativeMath: boolean; }) {
    options = { useNativeMath: (options ?? gamespace.settings).useNativeMath };
    return options.useNativeMath ? (ptB.x - ptA.x) ** 2 + (ptB.y - ptA.y) ** 2 : Decimal.sub(ptB.x, ptA.x).pow(2).plus(Decimal.sub(ptB.y, ptA.y).pow(2));
}

function distance(ptA: { x: number; y: number; }, ptB: { x: number; y: number; }, options?: { useNativeMath: boolean; }) {
    options = { useNativeMath: (options ?? gamespace.settings).useNativeMath };
    return (options.useNativeMath ? Math : Decimal).sqrt(sqauredDist(ptA, ptB, options) as number);
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
                loadImg(d.image),
                { width: d.imageWidth, height: d.imageHeight },
                d.tint,
                d.layer,
                { x: d.xOffset, y: d.yOffset, angle: d.angleOffset * Math.PI / 180 },
                d.imageMode
            );
        }),
        players: data.players.map(
            p => new playerLike(
                (() => {
                    const body = Matter.Bodies.circle(p.x, p.y, 50, p.options);
                    body.mass = body.inverseMass = 1;
                    body.frictionAir = 1;

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
                })[p.scope],
                `BOT ${["Flavie", "Mathis", "Sarah", "Juliette", "Emma", "Lexie", "Oceane", "Maeva", "Sophia", "Charles", "Jeanne", "Laurent", "Theo", "Eli", "Edouard", "Axel", "Leonie", "Mayson", "Louis", "William", "Laurence", "Sophie", "Charlie", "Charlotte", "Beatrice", "Jayden", "Clara", "Felix", "Ellie", "James", "Ethan", "Milan", "Rosalie", "Hubert", "Lea", "Amelia", "Olivia", "Noah", "Emile", "Florence", "Simone", "Adele", "Mia", "Elizabeth", "Ophelie", "Flora", "Gabriel", "Victoria", "Logan", "Raphael", "Arnaud", "Victor", "Benjamin", "Livia", "Alicia", "Arthur", "Anna", "Lily", "Henri", "Nathan", "Romy", "Thomas", "Alice", "Lucas", "Theodore", "Liam", "Jules", "Chloe", "Camille", "Leonard", "Antoine", "Nolan", "Elliot", "Jackson", "Jake", "Zoe", "Samuel", "Eleonore", "Julia", "Maelie", "Alexis", "Mila", "Eloi", "Noelie", "Matheo", "Elena", "Jacob", "Jade", "Leo", "Jasmine", "Raphaelle", "Rose", "Adam", "Eva", "Olivier", "Xavier", "Loic", "Sofia", "Zachary", "Zack"][Math.floor(Math.random() * 100)]}`
            )
        )
    };
}

type scaleOrAbsolute = {
    givenIn: "scale" | "absolute",
    value: number;
};

type ratioOrAbsolute = {
    givenIn: "ratio" | "absolute",
    value: number;
};

type angleModes = {
    givenIn: "degrees" | "radians" | "gradians" | "turns",
    value: number;
};

type timeModes = {
    givenIn: "RPM" | "ms" | "s",
    value: number;
};

type offsetData = {
    perp: scaleOrAbsolute,
    parr: scaleOrAbsolute;
};

type variataion = { variation: ratioOrAbsolute & { plusOrMinus: boolean; }; };

type offsetDataVariation = offsetData & { parr: variataion, perp: variataion; };

type JSONGun = {
    name: string,
    summary: {
        class: string,
        engagementDistance: {
            min: scaleOrAbsolute,
            max: scaleOrAbsolute;
        },
        shouldNoslow: boolean,
        role: "primary" | "secondary";
    },
    dual: boolean,
    images: {
        loot: false | string,
        held: false | string,
        silhouette: false | string;
    },
    tint: string,
    ballistics: {
        damage: number,
        velocity: scaleOrAbsolute,
        range: scaleOrAbsolute,
        tracer: {
            width: scaleOrAbsolute,
            height: scaleOrAbsolute;
        },
        obstacleMult: number,
        headshotMult: number,
        fsa: {
            enabled: boolean,
            rechargeTime: timeModes;
        },
        falloff: number,
        projectiles: number;
    },
    suppressed: boolean,
    caliber: string,
    firingDelay: timeModes,
    accuracy: {
        default: angleModes,
        moving: angleModes;
    },
    moveSpeedPenalties: {
        active: scaleOrAbsolute,
        firing: scaleOrAbsolute;
    },
    imageOffset: offsetData,
    dimensions: {
        width: scaleOrAbsolute,
        height: scaleOrAbsolute,
        above: boolean;
    },
    reload: {
        duration: timeModes,
        ammoReloaded: number | "all",
        chain: boolean;
    },
    altReload?: {
        duration: timeModes,
        ammoReloaded: number | "all",
        chain: boolean;
    },
    magazineCapacity: {
        normal: number,
        firepower: number;
    },
    switchDelay: timeModes,
    handPositions: {
        leftHand: offsetData,
        rightHand?: offsetData;
    },
    projectileSpawnOffset: offsetData,
    casings: {
        spawnOffset: offsetData,
        velocity: offsetDataVariation & { angular: angleModes & variataion; },
        spawnOn: "fire" | "reload",
        spawnDelay: timeModes;
    },
    recoilImpulse: {
        direction: offsetData,
        duration: timeModes;
    },
    possibleFireModes: ("automatic" | "semi" | `burst-${number}`)[],
    burstProps?: {
        shotDelay: timeModes,
        burstDelay: timeModes;
    };
};

function parseGunData(gunData: JSONGun[]) {
    const playerSize = 50;

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

    return gunData.map(g => {
        return new gunPrototype(
            g.name,
            (() => {
                return {
                    class: g.summary.class,
                    engagementDistance: {
                        min: g.summary.engagementDistance.min.givenIn == "absolute" ? g.summary.engagementDistance.min.value : g.summary.engagementDistance.min.value * playerSize,
                        max: g.summary.engagementDistance.max.givenIn == "absolute" ? g.summary.engagementDistance.max.value : g.summary.engagementDistance.max.value * playerSize
                    },
                    shouldNoslow: g.summary.shouldNoslow,
                    role: g.summary.role
                };
            })(),
            g.dual,
            (() => {
                return {
                    loot: {
                        img: g.images.loot && loadImg(g.images.loot),
                        src: g.images.loot
                    },
                    held: {
                        img: g.images.held && loadImg(g.images.held),
                        src: g.images.held
                    },
                    silhouette: {
                        img: g.images.silhouette && loadImg(g.images.silhouette),
                        src: g.images.silhouette
                    }
                };
            })(),
            g.tint,
            (() => {
                const b = g.ballistics,
                    t = b.tracer;
                return {
                    damage: b.damage,
                    range: b.range.givenIn == "scale" ? b.range.value * playerSize : b.range.value,
                    velocity: b.velocity.givenIn == "scale" ? b.velocity.value * playerSize : b.velocity.value,
                    obstacleMult: b.obstacleMult,
                    headshotMult: b.headshotMult,
                    tracer: {
                        width: t.width.givenIn == "scale" ? t.width.value : t.width.value / playerSize,
                        height: t.height.givenIn == "scale" ? t.height.value : t.height.value / playerSize
                    },
                    projectiles: b.projectiles,
                    falloff: b.falloff,
                    fsaCooldown: b.fsa.enabled ? toMS(b.fsa.rechargeTime) : Infinity
                };
            })(),
            g.caliber,
            toMS(g.firingDelay),
            (() => {
                const def = g.accuracy.default,
                    mov = g.accuracy.moving;

                return {
                    default: toRad(def),
                    moving: toRad(mov)
                };
            })(),
            (() => {
                const i = g.imageOffset;
                return {
                    x: i.perp.givenIn == "scale" ? i.perp.value : i.perp.value / playerSize,
                    y: i.parr.givenIn == "scale" ? i.parr.value : i.parr.value / playerSize
                };
            })(),
            (() => {
                const d = g.dimensions;
                return {
                    width: d.width.givenIn == "scale" ? d.width.value : d.width.value / playerSize,
                    height: d.height.givenIn == "scale" ? d.height.value : d.height.value / playerSize,
                    above: d.above
                };
            })(),
            (() => {
                const l = g.handPositions.leftHand,
                    r = g.handPositions.rightHand;

                return {
                    lefthand: {
                        x: l.perp.givenIn == "scale" ? l.perp.value : l.perp.value / playerSize,
                        y: l.parr.givenIn == "scale" ? l.parr.value : l.parr.value / playerSize
                    },
                    righthand: r && {
                        x: r.perp.givenIn == "scale" ? r.perp.value : r.perp.value / playerSize,
                        y: r.parr.givenIn == "scale" ? r.parr.value : r.parr.value / playerSize
                    }
                };
            })(),
            (() => {
                const s = g.projectileSpawnOffset;
                return {
                    x: s.perp.givenIn == "scale" ? s.perp.value * playerSize : s.perp.value,
                    y: s.parr.givenIn == "scale" ? s.parr.value * playerSize : s.parr.value
                };
            })(),
            g.suppressed,
            (() => {
                const r = g.recoilImpulse,
                    di = r.direction,
                    du = r.duration;
                return {
                    x: di.perp.givenIn == "scale" ? di.perp.value : di.perp.value * playerSize,
                    y: di.parr.givenIn == "scale" ? di.parr.value : di.parr.value * playerSize,
                    duration: toMS(du)
                };
            })(),
            g.possibleFireModes,
            (() => {
                const b = g.burstProps;
                return {
                    shotDelay: toMS(b.shotDelay),
                    burstDelay: toMS(b.burstDelay)
                };
            })(),
            {
                duration: toMS(g.reload.duration),
                ammoReloaded: g.reload.ammoReloaded,
                chain: g.reload.chain
            },
            g.magazineCapacity,
            toMS(g.switchDelay),
            (() => {
                const c = g.casings,
                    sO = c.spawnOffset,
                    sOpe = sO.perp,
                    sOpa = sO.parr,
                    v = c.velocity,
                    vPe = v.perp,
                    vPeV = v.perp.variation,
                    vPa = v.parr,
                    vPaV = v.parr.variation,
                    vA = c.velocity.angular,
                    vAv = vA.variation;

                return {
                    spawnOffset: {
                        perp: sOpe.givenIn == "absolute" ? sOpe.value : sOpe.value * playerSize,
                        parr: sOpa.givenIn == "absolute" ? sOpa.value : sOpa.value * playerSize
                    },
                    velocity: {
                        perp: {
                            value: vPe.givenIn == "absolute" ? vPe.value : vPe.value * playerSize,
                            variation: {
                                value: vPeV.givenIn == "absolute" ? vPeV.value : vPeV.value * (vPe.givenIn == "absolute" ? vPe.value : vPe.value * playerSize),
                                plusOrMinus: vPeV.plusOrMinus
                            }
                        },
                        parr: {
                            value: vPa.givenIn == "absolute" ? vPa.value : vPa.value * playerSize,
                            variation: {
                                value: vPaV.givenIn == "absolute" ? vPaV.value : vPaV.value * (vPa.givenIn == "absolute" ? vPa.value : vPa.value * playerSize),
                                plusOrMinus: vPaV.plusOrMinus
                            }
                        },
                        angular: {
                            value: toRad(vA),
                            variation: {
                                value: vAv.givenIn == "absolute" ? vAv.value : vAv.value * toRad(vA),
                                plusOrMinus: vAv.plusOrMinus
                            }
                        }
                    },
                    spawnDelay: toMS(c.spawnDelay),
                    spawnOn: c.spawnOn
                };
            })(),
            {
                active: g.moveSpeedPenalties.active.givenIn == "absolute" ? g.moveSpeedPenalties.active.value / playerSize : g.moveSpeedPenalties.active.value,
                firing: g.moveSpeedPenalties.firing.givenIn == "absolute" ? g.moveSpeedPenalties.firing.value / playerSize : g.moveSpeedPenalties.firing.value
            },
            g.altReload && {
                duration: toMS(g.altReload?.duration),
                ammoReloaded: g.altReload?.ammoReloaded,
                chain: g.altReload?.chain
            },
        );
    });
}

type ammoData = {
    tints: {
        normal: string,
        saturated: string,
        chambered: string;
    },
    spawnVar: {
        mean: number,
        variation: number,
        plusOrMinus: boolean;
    },
    casing: {
        img: string,
        despawnDist: {
            mean: number,
            variation: number,
            plusOrMinus: boolean;
        },
        width: number,
        height: number;
    };
};

function parseAmmoData(data: { [key: string]: ammoData; }) {
    const final: typeof gamespace.bulletInfo = {};

    for (const key in data) {
        const a = data[key];

        final[key] = {
            tints: a.tints,
            spawnVar: a.spawnVar,
            casing: {
                img: loadImg(a.casing.img),
                despawnDist: a.casing.despawnDist,
                width: a.casing.width,
                height: a.casing.height
            }
        };
    }
    return final;
}

function $(ele: string): HTMLElement | null { return document.getElementById(ele); }

function average(options: { useNativeMath: boolean; }, ...args: Decimal.Value[]) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    if (options.useNativeMath) {
        return args.reduce<number>((p, c) => +p + +c, 0) / args.length;
    }

    return args.reduce<Decimal>((p, c) => Decimal.add(p, c), 0 as any);
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
    if (Number.isNaN(value) || !Number.isFinite(value) || (lowerBound == upperBound && !(options.inclusion.lower || options.inclusion.upper)) || lowerBound == "inf" || upperBound == "-inf" || lowerBound > upperBound) { return false; }
    if (lowerBound == "-inf" && upperBound == "inf") { return true; }
    if (options.useNativeMath) { return (lowerBound < value || (options.inclusion.lower && lowerBound == value)) && (value < upperBound || (options.inclusion.upper && upperBound == value)); }
    return (new Decimal(lowerBound)[`lessThan${"OrEqualTo".repeat(+options.inclusion.lower)}`](value)) && (new Decimal(value)[`lessThan${"OrEqualTo".repeat(+options.inclusion.upper)}`](upperBound));
};

function clamp(value: Decimal.Value, min?: Decimal.Value, max?: Decimal.Value, options?: { useNativeMath?: boolean; }) {
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
    }[options.normalizeTo];
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

const getRenderDistFromView = (() => {
    // Basically an implementation of a function cache, but very niche-ly done

    const map = new Map<number, Decimal>();

    function getRenderDistFromView(v: number) {
        /* 
        √(642281v^2 + 34228610v + 714829400) / 722
    
        calculated as
    
        (((v * 642281 34228610)v + 714829400) ^ 0.5) / 722
        */

        return Decimal.mul((v + 720), 642281).add(34228610).mul((v + 720)).add(714829400).sqrt().div(722);
    }

    return (view: number) => {
        if (map.has(view)) {
            return +map.get(view);
        }

        const v = getRenderDistFromView(view);

        map.set(view, v);

        return +v;
    };
})();

async function loadJSONBasedGamespaceFields() {
    gamespace.guns = parseGunData((await (await fetch("assets/json/guns.json")).json()) as JSONGun[]);
    gamespace.bulletInfo = parseAmmoData((await (await fetch("assets/json/ammo.json")).json()) as { [key: string]: ammoData; });
}

(() => {
    Math.cmp = function (a, b) {
        if (a == b) { return 0; }
        return a > b ? 1 : -1;
    };

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