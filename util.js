// Give code that runs before the console's initialization somewhere to dump data it wants logged to the console, then destroy the temporary wrapper
// The way that I've implemented this is to be as ephemeral as possible, but that means upsetting Typescript and using "@ts-expect-error"
Object.defineProperty(window, "cslData", {
    configurable: true,
    enumerable: false,
    writable: false,
    value: []
});
(() => {
    //@ts-expect-error
    "isElectron" in globalThis ? void 0 : cslData.push({ time: Date.now(), content: "Non-electron environment detected." });
})();
const generateId = (function* () {
    let i = 0;
    while (true) {
        yield i++;
    }
})();
function loadImg(path, failGracefully) {
    try {
        return p5.prototype.loadImage.call({ _decrementPreload: () => { } }, path);
    }
    catch (e) {
        if (failGracefully) {
            return console.warn(`Failed to fetch image at path '${path}': ${e instanceof Error ? e.message : e}`);
        }
        throw e;
    }
}
function loadFnt(path, failGracefully) {
    try {
        return p5.prototype.loadFont.call({ _decrementPreload: () => { } }, path);
    }
    catch (e) {
        if (failGracefully) {
        }
        throw e;
    }
}
function makeElement(tag, id, className) {
    const ele = document.createElement(tag);
    id && (ele.id = id);
    className && (ele.className = className);
    return ele;
}
function squaredDist(ptA, ptB, options) {
    options = { useNativeMath: (options ?? gamespace.settings).useNativeMath };
    return options.useNativeMath ? (ptB.x - ptA.x) ** 2 + (ptB.y - ptA.y) ** 2 : Decimal.sub(ptB.x, ptA.x).pow(2).plus(Decimal.sub(ptB.y, ptA.y).pow(2));
}
function distance(ptA, ptB, options) {
    options = { useNativeMath: (options ?? gamespace.settings).useNativeMath };
    return (options.useNativeMath ? Math : Decimal).sqrt(squaredDist(ptA, ptB, options));
}
function RPMToMSDelay(rpm, options) {
    options = { useNativeMath: (options ?? gamespace.settings).useNativeMath };
    return options.useNativeMath ? 60000 / rpm : Decimal.div(60000, rpm);
}
function parseLevelData(data) {
    return {
        obstacles: data.obstacles.map(o => {
            let body;
            try {
                o.options.angle *= Math.PI / 180;
            }
            catch { }
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
                    throw new SyntaxError(`Unknown type '${o.type}'`);
            }
            body.mass = body.inverseMass = body.frictionAir = 1;
            const d = o.details;
            return new obstacle(body, o.options.angle, loadImg(d.image), { width: d.imageWidth, height: d.imageHeight }, d.tint, d.layer, { x: d.xOffset, y: d.yOffset, angle: d.angleOffset * Math.PI / 180 }, d.imageMode);
        }),
        players: data.players.map((p, i) => new (i ? playerLike : player)((() => {
            const body = Matter.Bodies.circle(p.x, p.y, 50, p.options);
            body.mass = body.inverseMass = body.frictionAir = 1;
            return body;
        })(), p.angle * Math.PI / 180, p.health, p.loadout, {
            friction: 1,
            restitution: 0,
            inertia: 0,
            density: 0.01
        }, ({
            1: 1330,
            2: 1680,
            4: 2359,
            8: 3230,
            15: 4940
        })[p.scope], i
            ? `BOT ${["Flavie", "Mathis", "Sarah", "Juliette", "Emma", "Lexie", "Oceane", "Maeva", "Sophia", "Charles", "Jeanne", "Laurent", "Theo", "Eli", "Edouard", "Axel", "Leonie", "Mayson", "Louis", "William", "Laurence", "Sophie", "Charlie", "Charlotte", "Beatrice", "Jayden", "Clara", "Felix", "Ellie", "James", "Ethan", "Milan", "Rosalie", "Hubert", "Lea", "Amelia", "Olivia", "Noah", "Emile", "Florence", "Simone", "Adele", "Mia", "Elizabeth", "Ophelie", "Flora", "Gabriel", "Victoria", "Logan", "Raphael", "Arnaud", "Victor", "Benjamin", "Livia", "Alicia", "Arthur", "Anna", "Lily", "Henri", "Nathan", "Romy", "Thomas", "Alice", "Lucas", "Theodore", "Liam", "Jules", "Chloe", "Camille", "Leonard", "Antoine", "Nolan", "Elliot", "Jackson", "Jake", "Zoe", "Samuel", "Eleonore", "Julia", "Maelie", "Alexis", "Mila", "Eloi", "Noelie", "Matheo", "Elena", "Jacob", "Jade", "Leo", "Jasmine", "Raphaelle", "Rose", "Adam", "Eva", "Olivier", "Xavier", "Loic", "Sofia", "Zachary", "Zack"][Math.floor(Math.random() * 100)]}`
            : void 0))
    };
}
function checkLevelVersions(lvls) {
    return lvls.forEach(l => warnAboutVersionDiscrepencies(l, "level")), lvls;
}
function extractValue(x, args) {
    return typeof x == "function" ? x(...args) : x;
}
function imageLoadWrapper(path, basePath = "") {
    if (typeof path == "function") {
        const map = new Map;
        return (...args) => {
            let newSrc = extractValue(path, args);
            if (map.has(newSrc)) {
                return map.get(newSrc);
            }
            const img = loadImg(basePath + newSrc, true);
            map.set(newSrc, img);
            return img;
        };
    }
    const img = loadImg(basePath + path, true);
    return () => img;
}
function checkForVersionDiscrepencies(target, objectType = "") {
    const results = {
        INVALID_VERSION: "INVALID_VERSION",
        OK: "OK",
        PATCH: "PATCH",
        MINOR: "MINOR",
        MAJOR: "MAJOR",
        BETAS: "BETAS",
        FUTURE: "FUTURE",
        FAR_FUTURE: "FAR_FUTURE"
    };
    const v = target.targetVersion?.match?.(/^\d+\.\d+\.\d+$/g)?.map?.(v => v[0]);
    if (v === null || !("targetVersion" in target)) {
        return results.INVALID_VERSION;
    }
    else {
        if (gamespace.compatibilityData[gamespace.version]?.[objectType]?.includes?.(target.targetVersion)) {
            return results.OK;
        }
        const [gMaj, gMin, gPatch] = target.targetVersion.split(".").map(v => +v), [maj, min, patch] = gamespace.version.split(".").map(v => +v), r = ["PATCH", "MINOR", "MAJOR", "BETAS", "FUTURE", "FAR_FUTURE"];
        let i = 5;
        for (const c of `${+(gMaj > maj)}${+((gMaj == maj && gMin > min) || (gMaj == maj && gMin == min && gPatch > patch))}${+(maj != gMaj)}${+(min != gMin && +maj == 0)}${+(min != gMin)}${+(patch != gPatch)}`) {
            if (+c) {
                return results[r[i]];
            }
            i--;
        }
        return results.OK;
    }
}
function warnAboutVersionDiscrepencies(target, objectType) {
    const d = checkForVersionDiscrepencies(target, objectType), v = target.targetVersion, cmp = `(${objectType}: ${v}, game: ${gamespace.version})`, o = objectType[0].toUpperCase() + objectType.slice(1), message = (() => {
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
        MINOR: (message) => { gamespace.console.warn(message, true); },
        MAJOR: gamespace.console.error,
        BETAS: gamespace.console.error,
        FUTURE: gamespace.console.warn,
        FAR_FUTURE: gamespace.console.error
    })[d].call(gamespace.console, message);
}
function parseGunData(data) {
    const playerSize = 50;
    return data.map(dat => {
        const [g, basePath] = dat;
        warnAboutVersionDiscrepencies(g, "gun");
        return new gunPrototype(g.name, (() => {
            return {
                class: g.summary.class,
                engagementDistance: {
                    min: (...args) => extractValue(g.summary.engagementDistance.min, args) * playerSize,
                    max: (...args) => extractValue(g.summary.engagementDistance.max, args) * playerSize
                },
                shouldNoslow: g.summary.shouldNoslow,
                role: g.summary.role
            };
        })(), g.dual, (() => {
            const f = (p) => {
                const map = new Map, o = {
                    img: () => {
                        const path = extractValue(p, []);
                        o.src = basePath + path;
                        if (map.has(path)) {
                            return map.get(path);
                        }
                        const img = loadImg(basePath + path);
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
        })(), (...args) => toHex(extractValue(g.tint, args)), (() => {
            const b = g.ballistics, t = b.tracer;
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
        })(), g.caliber, g.firingDelay, (() => {
            return {
                default: (...args) => extractValue(g.accuracy.default, args),
                moving: (...args) => extractValue(g.accuracy.moving, args)
            };
        })(), (() => {
            const i = g.imageOffset;
            return {
                perp: (...args) => extractValue(i.perp, args) * playerSize,
                parr: (...args) => extractValue(i.parr, args) * playerSize
            };
        })(), (() => {
            const d = g.dimensions;
            return {
                width: (...args) => extractValue(d.width, args) * playerSize,
                height: (...args) => extractValue(d.height, args) * playerSize,
                layer: (...args) => extractValue(d.layer, args)
            };
        })(), (() => {
            const l = g.handPositions.leftHand, r = g.handPositions.rightHand;
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
        })(), (() => {
            const s = g.projectileSpawnOffset;
            return {
                perp: (...args) => extractValue(s.perp, args) * playerSize,
                parr: (...args) => extractValue(s.parr, args) * playerSize
            };
        })(), (...args) => extractValue(g.suppressed, args), (() => {
            const r = g.recoilImpulse, di = r.direction;
            return {
                perp: (...args) => extractValue(di.perp, args) * playerSize,
                parr: (...args) => extractValue(di.parr, args) * playerSize,
                duration: (...args) => extractValue(r.duration, args)
            };
        })(), g.possibleFireModes, (() => {
            const b = extractValue(g.burstProps, []);
            return {
                shotDelay: (...args) => b ? extractValue(b.shotDelay, args) : Infinity,
                burstDelay: (...args) => b ? extractValue(b.burstDelay, args) : Infinity
            };
        })(), {
            duration: g.reload.duration,
            ammoReloaded: g.reload.ammoReloaded,
            chain: g.reload.chain
        }, g.magazineCapacity, g.switchDelay, (() => {
            const c = g.casings, sO = c.spawnOffset, sOpe = sO.perp, sOpa = sO.parr, v = c.velocity, vA = c.velocity.angular, vAVal = vA;
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
                spawnOn: c.spawnOn
            };
        })(), {
            active: g.moveSpeedPenalties.active,
            firing: g.moveSpeedPenalties.firing
        }, g.deployGroup, (() => {
            const a = extractValue(g.altReload, []);
            return a && {
                duration: a.duration,
                ammoReloaded: a.ammoReloaded,
                chain: a.chain
            };
        })());
    });
}
function parseAmmoData(data) {
    const playerSize = 50;
    return data
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
                maxDist: (...args) => extractValue(a.projectileInfo.maxDist, args) * playerSize,
                heightPeak: a.projectileInfo.heightPeak
            } : {
                type: "bullet",
            }, {
                img: imageLoadWrapper(a.projectileInfo.img, basePath),
                spinVel: (...args) => extractValue(a.projectileInfo.spinVel, args) ?? 0
            }),
            casing: {
                img: imageLoadWrapper(a.casing.img, basePath),
                lifetime: a.casing.lifetime,
                width: a.casing.width,
                height: a.casing.height
            }
        };
    });
}
function parseExplosionData(data) {
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
        };
    });
}
function $(ele) { return document.getElementById(ele); }
function average(options, ...args) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    if (options.useNativeMath) {
        return args.reduce((p, c) => +p + +c, 0) / args.length;
    }
    return args.reduce((p, c) => p.add(c), new Decimal(0));
}
function toMS(val) {
    const nM = gamespace.settings.useNativeMath;
    switch (val.givenIn) {
        case "ms": return val.value;
        case "s": return nM ? val.value * 1000 : +Decimal.mul(val.value, 1000);
        case "RPM": return +RPMToMSDelay(val.value);
    }
}
function toRad(val) {
    const nM = gamespace.settings.useNativeMath;
    switch (val.givenIn) {
        case "radians": return val.value;
        case "degrees": return nM ? val.value * Math.PI / 180 : +Decimal.mul(val.value, Decimal.acos(-1)).div(180);
        case "gradians": return nM ? val.value * 0.9 : +Decimal.mul(val.value, 0.9);
        case "turns": return nM ? val.value * 2 * Math.PI : +Decimal.mul(val.value, 2);
    }
}
function stdDev(options, ...arr) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    const nM = options.useNativeMath, avg = average(options, ...arr), a = arr.map(e => (nM ? Math : Decimal).abs((nM ? +e - +avg : Decimal.sub(e, avg))));
    return average(options, ...a);
}
function checkBounds(value, lowerBound, upperBound, options = { inclusion: { lower: true, upper: true }, useNativeMath: true }) {
    options = { useNativeMath: options.useNativeMath ?? gamespace.settings.useNativeMath, inclusion: { lower: options.inclusion?.lower ?? true, upper: options.inclusion?.upper ?? true } };
    value = +value, lowerBound = typeof lowerBound != "string" ? +lowerBound : lowerBound, upperBound = typeof upperBound != "string" ? +upperBound : upperBound;
    if (Number.isNaN(value) ||
        !Number.isFinite(value) ||
        (lowerBound == upperBound &&
            !(options.inclusion.lower ||
                options.inclusion.upper)) ||
        lowerBound == "inf" ||
        upperBound == "-inf" ||
        lowerBound > upperBound) {
        return false;
    }
    if (lowerBound == "-inf" && upperBound == "inf") {
        return true;
    }
    if (options.useNativeMath) {
        return (lowerBound < value || (options.inclusion.lower && lowerBound == value)) && (value < upperBound || (options.inclusion.upper && upperBound == value));
    }
    return (new Decimal(lowerBound)[`lessThan${"OrEqualTo".repeat(+options.inclusion.lower)}`](value)) && (new Decimal(value)[`lessThan${"OrEqualTo".repeat(+options.inclusion.upper)}`](upperBound));
}
;
function clamp(value, min, max, options) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    min ??= -Infinity, max ??= Infinity;
    return options.useNativeMath ? Math.max(+min, Math.min(+value, +max)) : Decimal.clamp(value, min, max);
}
function normalizeAngle(a, options = { useNativeMath: true, normalizeTo: "radians" }) {
    options = { useNativeMath: options.useNativeMath ?? gamespace.settings.useNativeMath, normalizeTo: options.normalizeTo ?? "degrees" };
    const fullTurn = {
        degrees: 360,
        radians: options.useNativeMath ? 2 * Math.PI : Decimal.mul(2, Math.PI),
        π: Math.PI,
        gradians: 400
    }[options.normalizeTo];
    return options.useNativeMath ? +a - Math.floor(+a / fullTurn) * fullTurn : Decimal.sub(a, Decimal.div(a, fullTurn).floor().mul(fullTurn));
}
function meanDevPM_random(mean, deviation, plusOrMinus, options) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    return deviation
        ? options.useNativeMath
            ? +mean + +deviation * (plusOrMinus ? 2 * (Math.random() - 0.5) : Math.random())
            : Decimal.mul(deviation, plusOrMinus ? Decimal.mul(2, Math.random()).sub(0.5) : Math.random()).add(mean)
        : mean;
}
function clone(object) {
    if (typeof object != "object" || object === null) {
        return object;
    }
    if (Array.isArray(object)) {
        const copy = [];
        for (const key in object) {
            const value = object[key];
            if (typeof value == "object" && value !== null) {
                copy[key] = value === null ? value : clone(value);
                continue;
            }
            copy[key] = value;
        }
        return copy;
    }
    const copy = {};
    for (const key in object) {
        const value = object[key];
        if (typeof value == "object" && object !== null) {
            copy[key] = value === null ? value : clone(value);
            continue;
        }
        copy[key] = value;
    }
    return copy;
}
function overrideObject(o1, o2) {
    o1 = clone(o1);
    o2 = clone(o2);
    for (const key in o2) {
        if (typeof o2[key] == "object" && o2[key] !== null) {
            o1[key] = overrideObject(o1[key], o2[key]);
        }
        else {
            o1[key] = (o2[key] ?? o1[key]);
        }
    }
    return o1;
}
function linterp(a, b, t, options = { useNativeMath: gamespace.settings.useNativeMath }) {
    return options.useNativeMath ? (+a * (1 - +t) + +b * +t) : Decimal.mul(b, t).add(Decimal.mul(a, Decimal.sub(1, t)));
}
function getDecimalPlaces(n) {
    if (n instanceof Decimal) {
        return n.decimalPlaces();
    }
    const str = n.toString();
    return +!!str.match(/\./) && str.length - (str.indexOf(".") + 1);
}
function sliceToDecimalPlaces(number, decimalPlaces) {
    return +number
        .toString()
        .split(".")
        .map((v, i) => i
        ? (() => {
            const d = v.slice(0, decimalPlaces);
            return v[decimalPlaces] == "9" ? `${d.slice(0, -1)}${+d.slice(-1) + 1}` : d;
        })()
        : v)
        .join(".");
}
function sigFigIshMult(a, b) {
    return sliceToDecimalPlaces(a * b, getDecimalPlaces(a) + getDecimalPlaces(b));
}
const getRenderDistFromView = (() => {
    // Basically an implementation of a function cache, but very niche-ly done
    const map = new Map();
    function getRenderDistFromView(v) {
        /*
        √(642281v^2 + 34228610v + 714829400) / 722

        calculated as

        (((v * 642281 + 34228610)v + 714829400) ^ 0.5) / 722
        */
        return Decimal.mul((v + 720), 642281).add(34228610).mul((v + 720)).add(714829400).sqrt().div(722);
    }
    return (view) => {
        if (map.has(view)) {
            return +map.get(view);
        }
        const v = getRenderDistFromView(view);
        map.set(view, v);
        return +v;
    };
})();
function hexToRGB(hex, options) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    hex = hex.replace("#", "");
    const nM = options.useNativeMath, shorthand = hex.length < 6, r = new RegExp(`.{${shorthand ? 1 : 2}}`, "g");
    if (r.test(hex)) {
        return hex.match(r).map((v, i) => nM ? parseInt(v, 16) * (i == 3 ? 1 / 255 : shorthand ? 17 : 1) : +Decimal.mul(parseInt(v, 16), (i == 3 ? Decimal.div(1, 255) : shorthand ? 17 : 1)));
    }
    throw new SyntaxError(`Color '${hex} is not a valid hex color'`);
}
function RGBToHex(rgb, options) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    return `#${rgb.map((v, i) => (options?.useNativeMath ? (254 * +(i == 3) + 1) * v : i == 3 ? Decimal.mul(v, i == 3 ? 255 : 1).toNumber() : v).toString(16).slice(0, 2).replace(/\./, "").padStart(2, "0")).join("")}`;
}
function hexToHSL(hex, options) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    return RGBToHSL(hexToRGB(hex, { useNativeMath: options.useNativeMath }), { useNativeMath: options.useNativeMath });
}
function RGBToHSL(rgb, options) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    const nM = options.useNativeMath, [r, g, b, a] = rgb.map((v, i) => i == 3 ? v : (nM ? v / 255 : Decimal.div(v, 255))), max = (nM ? Math : Decimal).max(r, g, b), min = (nM ? Math : Decimal).min(r, g, b), l = nM ? (max + min) / 2 : Decimal.add(max, min).div(2);
    let h = 0, s = 0;
    if (+max != +min) {
        const d = nM ? max - min : Decimal.sub(max, min);
        s = (nM
            ? d / (l > 0.5 ? (2 - max - min) : (max + min))
            : Decimal.div(d, l > 0.5 ? Decimal.sub(2, max).sub(min) : Decimal.add(max, min)));
        const _h = (() => {
            switch (+max) {
                case +r:
                    return nM
                        ? (g - b) / d + (g < b ? 6 : 0)
                        : Decimal.sub(g, b).div(d).add(g < b ? 6 : 0);
                case +g:
                    return nM
                        ? (b - r) / d + 2
                        : Decimal.sub(b, r).div(d).add(2);
                case +b:
                    return nM
                        ? (r - g) / d + 4
                        : Decimal.sub(r, g).div(d).add(4);
            }
        })();
        h = (nM ? Math.PI * _h / 3 : Decimal.div(_h, 3).mul(Decimal.acos(-1)));
    }
    return { hue: +h, saturation: +s, luminosity: +l, alpha: a ?? 1 };
}
function HSLToRGB(hsl, options) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    const nM = options.useNativeMath;
    let r = hsl.luminosity, g = hsl.luminosity, b = hsl.luminosity;
    if (hsl.saturation) {
        function RGBCompFrHue(p, q, t) {
            if (t < 0) {
                t = nM ? t + 1 : Decimal.add(t, 1);
            }
            if (t > 1) {
                t = nM ? t - 1 : Decimal.sub(t, 1);
            }
            if (t < 1 / 6) {
                return nM ? p + (q - p) * 6 * t : Decimal.mul(p, 6).mul(t).neg().plus(q).plus(p);
            }
            if (t < 1 / 2) {
                return q;
            }
            if (t < 2 / 3) {
                return nM ? p + (q - p) * (2 / 3 - t) * 6 : Decimal.div(2, 3).sub(t).mul(6).mul(p).neg().plus(q).plus(p);
            }
            return p;
        }
        ;
        const q = nM
            ? hsl.luminosity < 0.5 ? hsl.luminosity * (1 + hsl.saturation) : hsl.luminosity + hsl.saturation - hsl.luminosity * hsl.saturation
            : hsl.luminosity < 0.5 ? Decimal.add(1, hsl.saturation).mul(hsl.luminosity) : Decimal.mul(hsl.luminosity, hsl.saturation).neg().plus(hsl.saturation).plus(hsl.luminosity), p = nM ? 2 * hsl.luminosity - q : Decimal.mul(2, hsl.luminosity).sub(q);
        r = RGBCompFrHue(p, q, hsl.hue + 1 / 3);
        g = RGBCompFrHue(p, q, hsl.hue);
        b = RGBCompFrHue(p, q, hsl.hue - 1 / 3);
    }
    return (nM ? [r * 255, g * 255, b * 255, hsl.alpha ?? 1] : [+Decimal.mul(r, 255), +Decimal.mul(g, 255), +Decimal.mul(b, 255), hsl.alpha ?? 1]);
}
function HSLToHex(hsl, options) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    return RGBToHex(HSLToRGB(hsl, options), options);
}
function HSBToRGB(hsb, options) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    return HSLToRGB(HSBToHSL(hsb, options), options);
}
function HSBToHex(hsb, options) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    return RGBToHex(HSBToRGB(hsb, options), options);
}
function HSLToHSB(hsl, options) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    const nM = options.useNativeMath, v = nM ? hsl.luminosity + hsl.saturation * Math.min(hsl.luminosity, 1 - hsl.luminosity) : Decimal.min(hsl.luminosity, Decimal.sub(1, hsl.luminosity)).mul(hsl.saturation).add(hsl.luminosity);
    return { hue: hsl.hue, saturation: v && nM ? 2 * (1 - hsl.luminosity / v) : +Decimal.div(hsl.luminosity, v).neg().add(1).mul(2), brightness: +v, alpha: hsl.alpha ?? 1 };
}
function HSBToHSL(hsb, options) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    const nM = options.useNativeMath, l = nM ? hsb.brightness * (1 - hsb.saturation / 2) : Decimal.div(hsb.saturation, 2).neg().add(1).mul(hsb.brightness);
    return { hue: hsb.hue, saturation: +!(+l == 0 || +l == 1) && nM ? ((hsb.brightness - l) / Math.min(l, 1 - l)) : (+Decimal.sub(hsb.brightness, l).div(Decimal.min(l, Decimal.sub(1, l)))), luminosity: +l, alpha: hsb.alpha ?? 1 };
}
function parseColor(color) {
    if (color.match(/^(rgb\((?:(\d{1,2}|[0-2]((?<!2)\d|[0-5])((?<!25)\d|[0-5]))(\.\d+)?((, ?)| )){2}((\d{1,2}|[0-2]((?<!2)\d|[0-5])((?<!25)\d|[0-5]))(\.\d+)?\)))|(rgba\((?:(\d{1,2}|[0-2]((?<!2)\d|[0-5])((?<!25)\d|[0-5]))(\.\d+)?((, ?)| )){3}((0|1|0\.\d+)|(\d{1,2}(\.\d+)?|100)%)\))$/)) {
        return {
            type: `rgb${color.startsWith("rgba") ? "a" : ""}`,
            value: color.replace(/rgba?\(|\)/g, "").replace(/, /g, ",").split(/,| /).map(v => +(v.match(/%/) ? +v.replace(/%/, "") / 100 : v))
        };
    }
    for (const a of ["hsl", "hsb"]) { // HSL and HSB have the same syntax so
        if (color.match(new RegExp(`^(${a}\\((-?\\d+(\\.\\d+)?((, ?)| ))(((\\d{1,2}(\\.\\d+)?|100)%)((, ?)| ))(((0\\.\\d+)|1|(\\d{1,2}(\\.\\d+)?|100)%))\\))|${a}a\\((-?\\d+(\\.\\d+)?((, ?)| ))(((\\d{1,2}(\\.\\d+)?|100)%)((, ?)| ))(((0\\.\\d+)|1|(\\d{1,2}(\\.\\d+)?|100)%)((, ?)| ))((0\\.\\d+)|1|(\\d{1,2}(\\.\\d+)?|100)%)\\)$`, "g"))) {
            const arr = color.replace(new RegExp(`${a}a?\(|\)`, "g"), "").replace(/, /g, ",").split(/,| /g), p = (n) => n && +(n.match(/%/) ? +n.replace(/%/, "") / 100 : n);
            return {
                type: `${a}${color.startsWith("hsla") ? "a" : ""}`,
                value: { hue: arr[0], saturation: p(arr[1]), [a == "hsl" ? "luminosity" : "brightness"]: p(arr[2]), opacity: p(arr[3]) }
            };
        }
        ;
    }
    if (color.match(/^#([0-9A-Fa-f]{3,4}){1,2}$/)) {
        return { type: "hex", value: color };
    }
    return {
        type: "keyword",
        value: {
            black: "#000", silver: "#C0C0C0", gray: "#808080", white: "#FFF", maroon: "#800000", red: "#F00", purple: "#800080", fuchsia: "#F0F", green: "#008000", lime: "#0F0", olive: "#808000", yellow: "#FF0", navy: "#000080", blue: "#00F", teal: "#008080", aqua: "#00FFF", orange: "#FFA500", aliceblue: "#F0F8FF", antiquewhite: "#FAEBD7", aquamarine: "#7FFFD4", azure: "#F0FFFF", beige: "#F5F5DC", bisque: "#FFE4C4", blanchedalmond: "#FFEBCD", blueviolet: "#8A2BE2", brown: "#A52A2A", burlywood: "#DEB887", cadetblue: "#5F9EA0", chartreuse: "#7FFF00", chocolate: "#D2691E", coral: "#FF7F50", cornflowerblue: "#6495ED", cornsilk: "#FFF8DC", crimson: "#DC143C", cyan: "#0FF", darkblue: "#00008B", darkcyan: "#008B8B", darkgoldenrod: "#B8860B", darkgray: "#A9A9A9", darkgreen: "#006400", darkgrey: "#A9A9A9", darkkhaki: "#BDB76B", darkmagenta: "#8B008B", darkolivegreen: "#556B2F", darkorange: "#FF8C00", darkorchid: "#9932CC", darkred: "#8B0000", darksalmon: "#E9967A", darkseagreen: "#8FBC8F", darkslateblue: "#483D8B", darkslategray: "#2F4F4F", darkslategrey: "#2F4F4F", darkturquoise: "#00CED1", darkviolet: "#9400D3", deeppink: "#FF1493", deepskyblue: "#00BFFF", dimgray: "#696969", dimgrey: "#696969", dodgerblue: "#1E90FF", firebrick: "#B22222", floralwhite: "#FFFAF0", forestgreen: "#228B22", gainsboro: "#DCDCDC", ghostwhite: "#F8F8FF", gold: "#FFD700", goldenrod: "#DAA520", greenyellow: "#ADFF2F", grey: "#808080", honeydew: "#F0FFF0", hotpink: "#FF69B4", indianred: "#CD5C5C", indigo: "#4B0082", ivory: "#FFFFF0", khaki: "#F0E68C", lavender: "#E6E6FA", lavenderblush: "#FFF0F5", lawngreen: "#7CFC00", lemonchiffon: "#FFFACD", lightblue: "#ADD8E6", lightcoral: "#F08080", lightcyan: "#E0FFFF", lightgoldenrodyellow: "#FAFAD2", lightgray: "#D3D3D3", lightgreen: "#90EE90", lightgrey: "#D3D3D3", lightpink: "#FFB6C1", lightsalmon: "#FFA07A", lightseagreen: "#20B2AA", lightskyblue: "#87CEFA", lightslategray: "#778899", lightslategrey: "#778899", lightsteelblue: "#B0C4DE", lightyellow: "#FFFFE0", limegreen: "#32CD32", linen: "#FAF0E6", magenta: "#F0F", mediumaquamarine: "#66CDAA", mediumblue: "#0000CD", mediumorchid: "#BA55D3", mediumpurple: "#9370DB", mediumseagreen: "#3CB371", mediumslateblue: "#7B68EE", mediumspringgreen: "#00FA9A", mediumturquoise: "#48D1CC", mediumvioletred: "#C71585", midnightblue: "#191970", mintcream: "#F5FFFA", mistyrose: "#FFE4E1", moccasin: "#FFE4B5", navajowhite: "#FFDEAD", oldlace: "#FDF5E6", olivedrab: "#6B8E23", orangered: "#FF4500", orchid: "#DA70D6", palegoldenrod: "#EEE8AA", palegreen: "#98FB98", paleturquoise: "#AFEEEE", palevioletred: "#DB7093", papayawhip: "#FFEFD5", peachpuff: "#FFDAB9", peru: "#CD853F", pink: "#FFC0CB", plum: "#DDA0DD", powderblue: "#B0E0E6", rosybrown: "#BC8F8F", royalblue: "#4169E1", saddlebrown: "#8B4513", salmon: "#FA8072", sandybrown: "#F4A460", seagreen: "#2E8B57", seashell: "#FFF5EE", sienna: "#A0522D", skyblue: "#87CEEB", slateblue: "#6A5ACD", slategray: "#708090", slategrey: "#708090", snow: "#FFFAFA", springgreen: "#00FF7F", steelblue: "#4682B4", tan: "#D2B48C", thistle: "#D8BFD8", tomato: "#FF6347", turquoise: "#40E0D0", violet: "#EE82EE", wheat: "#F5DEB3", whitesmoke: "#F5F5F5", yellowgreen: "#9ACD3", rebeccapurple: "#639", transparent: "#0000"
        }[color.toLowerCase()] ?? "#000"
    };
}
function toRGB(color, options) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    if (typeof color == "string" && color.startsWith("#")) {
        return hexToRGB(color, options);
    }
    if (color.luminosity) {
        return HSLToRGB(color, options);
    }
    if (color.brightness) {
        return HSBToRGB(color, options);
    }
    return color;
}
function toHex(color, options) {
    options = { useNativeMath: options?.useNativeMath ?? gamespace.settings.useNativeMath };
    if (typeof color == "string" && color.startsWith("#")) {
        return color;
    }
    if (color.luminosity) {
        return HSLToHex(color, options);
    }
    if (color.brightness) {
        return HSBToHex(color, options);
    }
    return "#000";
}
function createCSLEntry(content, type) {
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
function yeet(e) {
    throw e;
}
(() => {
    window.addEventListener("keydown", ev => {
        if ((ev.key == "-" || ev.key == "=") && (ev.metaKey || ev.ctrlKey)) {
            ev.preventDefault();
        }
    });
    Math.cmp = function (a, b) {
        if (a == b) {
            return 0;
        }
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
    const π = Math.PI, nativeSin = Math.sin, nativeCos = Math.cos, nativeTan = Math.tan, nativeArcSin = Math.asin, nativeArcCos = Math.acos, nativeArcTan = Math.atan, sin = {
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
    }, cos = {
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
    }, tan = {
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
    Math.sin = function (x) {
        const ang = normalizeAngle(x, { normalizeTo: "radians" }), a = normalizeAngle(x, { normalizeTo: "π" }), sign = [1, -1][+(ang != a)];
        return sign * (sin[+a] ?? nativeSin.call(Math, +a));
    };
    Math.cos = function (x) {
        const ang = normalizeAngle(x, { normalizeTo: "radians" }), a = normalizeAngle(x, { normalizeTo: "π" }), sign = [1, -1][+checkBounds(ang, π / 2, π * 1.5)];
        return sign * (cos[+a] ?? sign * nativeCos.call(Math, +ang));
    };
    Math.tan = function (x) {
        const ang = normalizeAngle(x, { normalizeTo: "π" }), a = ang.toString().replace(/-/, ""), sign = !!ang.toString().match(/-/) ? -1 : 1;
        return sign * (tan[+a] ?? nativeTan.call(Math, +a));
    };
    Math.sec = function (x) { return 1 / Math.cos(x); };
    Math.csc = function (x) { return 1 / Math.sin(x); };
    Math.cot = function (x) { return 1 / Math.tan(x); };
    Math.asin = function (x) {
        if (!checkBounds(x, -1, 1)) {
            return NaN;
        }
        const sign = Math.sign(x);
        x = Math.abs(x);
        for (const p in sin) {
            if (sin[p] == x) {
                return sign * +p;
            }
        }
        return sign * nativeArcSin.call(Math, x);
    };
    Math.acos = function (x) {
        if (!checkBounds(x, -1, 1)) {
            return NaN;
        }
        const sign = Math.sign(x);
        x = Math.abs(x);
        for (const p in cos) {
            if (cos[p] == x) {
                return sign == -1 ? π - +p : +p;
            }
        }
        const nac = nativeArcCos.call(Math, x);
        return sign == -1 ? +π - nac : nac;
    };
    Math.atan = function (x) {
        const sign = Math.sign(x);
        x = Math.abs(x);
        for (const p in tan) {
            if (tan[p] == x) {
                return sign * +p;
            }
        }
        return sign * nativeArcTan.call(Math, x);
    };
    Math.asec = function (x) { return x == 1 ? 0 : x == -1 ? +π : Math.acos(1 / x); };
    Math.acsc = function (x) { return x == 1 ? π / 2 : x == -1 ? -π / 2 : Math.asin(1 / x); };
    Math.acot = function (x) { return x == Infinity ? 0 : x == -Infinity ? +π : π / 2 - Math.atan(x); };
})();
