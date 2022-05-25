type TOrArrayT<T> = T | T[];
type JSONObject = { [key: string]: TOrArrayT<string | number | boolean | JSONObject | null>; };

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
        view: number;
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
function sqauredDist(ptA: { x: number; y: number; }, ptB: { x: number; y: number; }): number {
    return (ptB.x - ptA.x) ** 2 + (ptB.y - ptA.y) ** 2;
}

function distance(ptA: { x: number; y: number; }, ptB: { x: number; y: number; }): number {
    return Math.sqrt(sqauredDist(ptA, ptB));
}

function RPMToMSDelay(rpm: number): number {
    return 60000 / rpm;
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
                    body = Matter.Bodies.fromVertices(o.x, o.y, o.vertexSets, o.options);
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
                    1: 2050,
                    2: 2400,
                    // 4: 3000,
                    8: 3950,
                    // 15: 104 / 68
                })[1]
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
    dual: boolean,
    images: {
        loot: false | string,
        held: false | string;
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
    imageOffset: offsetData,
    dimensions: {
        width: scaleOrAbsolute,
        height: scaleOrAbsolute;
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
        switch (val.givenIn) {
            case "ms": return val.value;
            case "s": return val.value * 1000;
            case "RPM": return RPMToMSDelay(val.value);
        }
    }

    function toRad(val: angleModes) {
        switch (val.givenIn) {
            case "radians": return val.value;
            case "degrees": return val.value * Math.PI / 180;
            case "gradians": return val.value * 0.9;
            case "turns": return val.value * 2 * Math.PI;
        }
    }

    return gunData.map(g => {
        return new gunPrototype(
            g.name,
            g.dual,
            (() => {
                return {
                    held: g.images.held && loadImg(g.images.held),
                    loot: g.images.loot && loadImg(g.images.loot)
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
                    height: d.height.givenIn == "scale" ? d.height.value : d.height.value / playerSize
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

function average(...args: number[]) {
    for (var i = 0, sum = 0; i < args.length; sum += +args[i++]);

    return sum / args.length;
}

function stdDev(...arr: number[]) {
    const avg = average(...arr),
        a = arr.map(e => Math.abs(+e - +avg));

    return average(...a);
}

function checkBounds(value: Decimal | number, lowerBound: Decimal | number | "-inf" | "inf", upperBound: Decimal | number | "-inf" | "inf", options: { inclusion?: { lower?: boolean, upper?: boolean; }, useNativeMath?: boolean; } = { inclusion: { lower: true, upper: true }, useNativeMath: true }): boolean {
    options = { useNativeMath: options?.useNativeMath ?? true, inclusion: { lower: options.inclusion?.lower ?? true, upper: options.inclusion?.upper ?? true } };
    // options = { useNativeMath: options.useNativeMath ?? window.settings.framework.defaults.useNativeMath, inclusion: { lower: options.inclusion?.lower ?? true, upper: options.inclusion?.upper ?? true } };

    value = +value, lowerBound = typeof lowerBound != "string" ? +lowerBound : lowerBound, upperBound = typeof upperBound != "string" ? +upperBound : upperBound;
    if (Number.isNaN(value) || !Number.isFinite(value) || (lowerBound == upperBound && !(options.inclusion.lower || options.inclusion.upper)) || lowerBound == "inf" || upperBound == "-inf" || lowerBound > upperBound) { return false; }
    if (lowerBound == "-inf" && upperBound == "inf") { return true; }
    if (options.useNativeMath) { return (lowerBound < value || (options.inclusion.lower && lowerBound == value)) && (value < upperBound || (options.inclusion.upper && upperBound == value)); }
    return (new Decimal(lowerBound)[`lessThan${"OrEqualTo".repeat(+options.inclusion.lower)}`](value)) && (new Decimal(value)[`lessThan${"OrEqualTo".repeat(+options.inclusion.upper)}`](upperBound));
};

function clamp(value: Decimal.Value, min?: Decimal.Value, max?: Decimal.Value, options?: { useNativeMath?: boolean; }) {
    options = { useNativeMath: options?.useNativeMath ?? true };
    // options = { useNativeMath: options?.useNativeMath ?? window.settings.framework.defaults.useNativeMath };

    min ??= -Infinity, max ??= Infinity;
    return options.useNativeMath ? Math.max(+min, Math.min(+value, +max)) : Decimal.clamp(value, min, max);
}

function normalizeAngle(a: Decimal.Value, options: { useNativeMath?: boolean, normalizeTo?: "degrees" | "radians" | "π" | "gradians"; } = { useNativeMath: true, normalizeTo: "radians" }) {
    options = { useNativeMath: options?.useNativeMath ?? true, normalizeTo: options?.normalizeTo ?? "degrees" };
    // options = { useNativeMath: options.useNativeMath ?? window.settings.framework.defaults.useNativeMath, normalizeTo: options.normalizeTo ?? "degrees" };

    const fullTurn: number | Decimal = {
        degrees: 360,
        radians: options.useNativeMath ? 2 * Math.PI : Decimal.mul(2, Math.PI),
        π: Math.PI,
        gradians: 400
    }[options.normalizeTo];
    return options.useNativeMath ? +a - Math.floor(+a / (fullTurn as number)) * (fullTurn as number) : Decimal.sub(a, Decimal.div(a, fullTurn).floor().mul(fullTurn));
}

function meanDevPM_random(mean: number, deviation: number, plusOrMinus: boolean) {
    return mean + (deviation && deviation * (plusOrMinus ? 2 * (Math.random() - 0.5) : Math.random()));
}

(() => {
    Math.cmp = function (a, b) {
        if (a == b) { return 0; }
        return a > b ? 1 : -1;
    };

    // Just adding short circuits, like sin(π) = 0, sec, csc and cot
    // source: https://en.wikipedia.org/wiki/Exact_trigonometric_values#Common_angles
    // Not covered: any of the hyperbolic trig functions
    const π = true ? Math.PI : Decimal.acos(-1),
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
        },
        nM = true;

    Math.sin = function (x: number): number {
        const ang = normalizeAngle(x, { normalizeTo: "radians" }),
            a = normalizeAngle(x, { normalizeTo: "π" }),
            sign: 1 | -1 = [1, -1][+(ang != a)] as 1 | -1;
        return sign * (sin[+a] ?? nativeSin.call(Math, +a));
    };

    Math.cos = function (x: number): number {
        const ang = normalizeAngle(x, { normalizeTo: "radians" }),
            a = normalizeAngle(x, { normalizeTo: "π" }),
            sign: 1 | -1 = [1, -1][+checkBounds(ang, nM ? π as number / 2 : (π as Decimal).div(2), nM ? π as number * 1.5 : (π as Decimal).mul(1.5))] as 1 | -1;
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
        for (const p in cos) { if (cos[p] == x) { return sign == -1 ? (nM ? π as number - +p : +((π as Decimal).sub(p))) : +p; } }
        const nac = nativeArcCos.call(Math, x);
        return sign == -1 ? +π - nac : +(π as Decimal).sub(nac);
    };

    Math.atan = function (x: number) {
        const sign = Math.sign(x);
        x = Math.abs(x);
        for (const p in tan) { if (tan[p] == x) { return sign * +p; } }
        return sign * nativeArcTan.call(Math, x);
    };

    Math.asec = function (x: number) { return x == 1 ? 0 : x == -1 ? +π : Math.acos(nM ? 1 / x : +Decimal.div(1, x)); };
    Math.acsc = function (x: number) { return x == 1 ? nM ? π as number / 2 : +(π as Decimal).div(2) : x == -1 ? nM ? -π as number / 2 : -+(π as Decimal).div(2) : Math.asin(nM ? 1 / x : +Decimal.div(1, x)); };
    Math.acot = function (x: number) { return x == Infinity ? 0 : x == -Infinity ? +π : nM ? π as number / 2 - Math.atan(x) : +((π as Decimal).div(2).sub(Math.atan(x))); };
})();