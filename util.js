const generateId = (function* () {
    let i = 0;
    while (true) {
        yield i++;
    }
})();
function loadImg(path) {
    return p5.prototype.loadImage.call({ _decrementPreload: () => { } }, path);
}
function loadFnt(path) {
    return p5.prototype.loadFont.call({ _decrementPreload: () => { } }, path);
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
            body.mass = body.inverseMass = 1;
            body.frictionAir = 1;
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
function parseGunData(gunData) {
    const playerSize = 50;
    return gunData.map(g => {
        return new gunPrototype(g.name, (() => {
            return {
                class: g.summary.class,
                engagementDistance: {
                    min: g.summary.engagementDistance.min.givenIn == "absolute" ? g.summary.engagementDistance.min.value : g.summary.engagementDistance.min.value * playerSize,
                    max: g.summary.engagementDistance.max.givenIn == "absolute" ? g.summary.engagementDistance.max.value : g.summary.engagementDistance.max.value * playerSize
                },
                shouldNoslow: g.summary.shouldNoslow,
                role: g.summary.role
            };
        })(), g.dual, (() => {
            return {
                loot: g.images.loot != false ? {
                    img: loadImg(g.images.loot),
                    src: g.images.loot
                } : void 0,
                held: g.images.held != false ? {
                    img: loadImg(g.images.held),
                    src: g.images.held
                } : void 0,
                silhouette: g.images.silhouette != false ? {
                    img: loadImg(g.images.silhouette),
                    src: g.images.silhouette
                } : void 0
            };
        })(), g.tint, (() => {
            const b = g.ballistics, t = b.tracer;
            return {
                damage: b.damage,
                range: b.range.value * (b.range.givenIn == "scale" ? playerSize : 1),
                velocity: b.velocity.value * (b.velocity.givenIn == "scale" ? playerSize : 1),
                obstacleMult: b.obstacleMult,
                headshotMult: b.headshotMult,
                tracer: {
                    width: t.width.value * (t.width.givenIn == "absolute" ? 1 : playerSize),
                    height: t.height.value * (t.height.givenIn == "absolute" ? 1 : playerSize)
                },
                projectiles: b.projectiles,
                falloff: b.falloff,
                fsaCooldown: b.fsa.enabled ? toMS(b.fsa.rechargeTime) : Infinity
            };
        })(), g.caliber, toMS(g.firingDelay), (() => {
            const def = g.accuracy.default, mov = g.accuracy.moving;
            return {
                default: toRad(def),
                moving: toRad(mov)
            };
        })(), (() => {
            const i = g.imageOffset;
            return {
                x: i.perp.value / (i.perp.givenIn == "scale" ? 1 : playerSize),
                y: i.parr.value / (i.parr.givenIn == "scale" ? 1 : playerSize)
            };
        })(), (() => {
            const d = g.dimensions;
            return {
                width: d.width.value / (d.width.givenIn == "scale" ? 1 : playerSize),
                height: d.height.value / (d.height.givenIn == "scale" ? 1 : playerSize),
                layer: d.layer
            };
        })(), (() => {
            const l = g.handPositions.leftHand, r = g.handPositions.rightHand;
            return {
                lefthand: {
                    x: l.perp.value / (l.perp.givenIn == "scale" ? 1 : playerSize),
                    y: l.parr.value / (l.parr.givenIn == "scale" ? 1 : playerSize)
                },
                righthand: r && {
                    x: r.perp.value / (r.perp.givenIn == "scale" ? 1 : playerSize),
                    y: r.parr.value / (r.parr.givenIn == "scale" ? 1 : playerSize)
                }
            };
        })(), (() => {
            const s = g.projectileSpawnOffset;
            return {
                x: s.perp.value * (s.perp.givenIn == "scale" ? playerSize : 1),
                y: s.parr.value * (s.parr.givenIn == "scale" ? playerSize : 1)
            };
        })(), g.suppressed, (() => {
            const r = g.recoilImpulse, di = r.direction, du = r.duration;
            return {
                x: di.perp.value * (di.perp.givenIn == "scale" ? 1 : playerSize),
                y: di.parr.value * (di.parr.givenIn == "scale" ? 1 : playerSize),
                duration: toMS(du)
            };
        })(), g.possibleFireModes, (() => {
            const b = g.burstProps;
            return {
                shotDelay: b ? toMS(b.shotDelay) : Infinity,
                burstDelay: b ? toMS(b.burstDelay) : Infinity
            };
        })(), {
            duration: toMS(g.reload.duration),
            ammoReloaded: g.reload.ammoReloaded,
            chain: g.reload.chain
        }, g.magazineCapacity, toMS(g.switchDelay), (() => {
            const c = g.casings, sO = c.spawnOffset, sOpe = sO.perp, sOpa = sO.parr, v = c.velocity, vPe = v.perp, vPeV = v.perp.variation, vPa = v.parr, vPaV = v.parr.variation, vA = c.velocity.angular, vAv = vA.variation, vPeVal = vPe.givenIn == "absolute" ? vPe.value : vPe.value * playerSize, vPaVal = vPa.givenIn == "absolute" ? vPa.value : vPa.value * playerSize, vAVal = toRad(vA);
            return {
                spawnOffset: {
                    perp: sOpe.givenIn == "absolute" ? sOpe.value : sOpe.value * playerSize,
                    parr: sOpa.givenIn == "absolute" ? sOpa.value : sOpa.value * playerSize
                },
                velocity: {
                    perp: {
                        value: vPeVal,
                        variation: {
                            value: vPeV.givenIn == "absolute" ? vPeV.value : vPeV.value * vPeVal,
                            plusOrMinus: vPeV.plusOrMinus
                        }
                    },
                    parr: {
                        value: vPaVal,
                        variation: {
                            value: vPaV.givenIn == "absolute" ? vPaV.value : vPaV.value * vPaVal,
                            plusOrMinus: vPaV.plusOrMinus
                        }
                    },
                    angular: {
                        value: vAVal,
                        variation: {
                            value: vAv.givenIn == "absolute" ? vAv.value : vAv.value * vAVal,
                            plusOrMinus: vAv.plusOrMinus
                        }
                    }
                },
                spawnDelay: toMS(c.spawnDelay),
                spawnOn: c.spawnOn
            };
        })(), {
            active: g.moveSpeedPenalties.active.givenIn == "absolute" ? g.moveSpeedPenalties.active.value / playerSize : g.moveSpeedPenalties.active.value,
            firing: g.moveSpeedPenalties.firing.givenIn == "absolute" ? g.moveSpeedPenalties.firing.value / playerSize : g.moveSpeedPenalties.firing.value
        }, g.deployGroup, g.altReload && {
            duration: toMS(g.altReload?.duration),
            ammoReloaded: g.altReload?.ammoReloaded,
            chain: g.altReload?.chain
        });
    });
}
function parseAmmoData(data) {
    const final = {};
    for (const key in data) {
        const a = data[key];
        final[key] = {
            tints: a.tints,
            spawnVar: a.spawnVar,
            imageOffset: a.imageOffset,
            alpha: a.alpha,
            projectileInfo: Object.assign(a.projectileInfo.type == "explosive" ? {
                type: "explosive",
                explosionType: a.projectileInfo.explosionType,
                explodeOnContact: a.projectileInfo.explodeOnContact,
                maxDist: a.projectileInfo.maxDist.value * (a.projectileInfo.maxDist.givenIn == "absolute" ? 1 : 50),
                heightPeak: a.projectileInfo.heightPeak
            } : {
                type: "bullet",
            }, {
                img: loadImg(a.projectileInfo.img),
                spinVel: a.projectileInfo.spinVel ? toRad(a.projectileInfo.spinVel) : 0
            }),
            casing: {
                img: loadImg(a.casing.img),
                lifetime: (() => {
                    const l = a.casing.lifetime, v = l.variation, t = toMS(l);
                    return {
                        value: t,
                        variation: v.value * (v.givenIn == "ratio" ? t : 1),
                        plusOrMinus: v.plusOrMinus
                    };
                })(),
                width: a.casing.width,
                height: a.casing.height
            }
        };
    }
    return final;
}
function parseExplosionData(data) {
    const final = {}, playerSize = 50;
    for (const key in data) {
        const e = data[key];
        final[key] = {
            damage: e.damage,
            obstacleMult: e.obstacleMult,
            radii: {
                visual: {
                    min: e.radii.visual.min.value * (e.radii.visual.min.givenIn == "scale" ? playerSize : 1),
                    max: e.radii.visual.max.value * (e.radii.visual.max.givenIn == "scale" ? playerSize : 1)
                },
                damage: {
                    min: e.radii.damage.min.value * (e.radii.damage.min.givenIn == "scale" ? playerSize : 1),
                    max: e.radii.damage.max.value * (e.radii.damage.max.givenIn == "scale" ? playerSize : 1)
                }
            },
            lifetime: toMS(e.lifetime),
            color: toRGB(e.color),
            decal: (() => {
                const d = e.decal;
                return {
                    img: loadImg(d.img),
                    tint: toHex(d.tint),
                    width: d.width.value * (d.width.givenIn == "scale" ? playerSize : 1),
                    height: d.height.value * (d.height.givenIn == "scale" ? playerSize : 1)
                };
            })(),
            shrapnel: (() => {
                const s = e.shrapnel, sRVal = s.range.value * (s.range.givenIn == "scale" ? playerSize : 1);
                return {
                    count: s.count,
                    damage: s.damage,
                    color: toHex(s.color),
                    img: loadImg(s.img),
                    velocity: s.velocity.value * (s.velocity.givenIn == "scale" ? playerSize : 1),
                    range: {
                        value: sRVal,
                        variation: {
                            value: s.range.variation.value * (s.range.variation.givenIn == "ratio" ? sRVal : 1),
                            plusOrMinus: s.range.variation.plusOrMinus
                        }
                    },
                    falloff: s.falloff,
                    tracer: {
                        width: s.tracer.width.value * (s.tracer.width.givenIn == "scale" ? playerSize : 1),
                        height: s.tracer.height.value * (s.tracer.height.givenIn == "scale" ? playerSize : 1)
                    }
                };
            })()
        };
    }
    return final;
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
    
        (((v * 642281 34228610)v + 714829400) ^ 0.5) / 722
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
async function loadJSONBasedGamespaceFields() {
    gamespace.guns = parseGunData((await (await fetch("assets/json/guns.json")).json()));
    gamespace.bulletInfo = parseAmmoData((await (await fetch("assets/json/ammo.json")).json()));
    gamespace.explosionInfo = parseExplosionData((await (await fetch("assets/json/explosions.json")).json()));
}
(() => {
    Math.cmp = function (a, b) {
        if (a == b) {
            return 0;
        }
        return a > b ? 1 : -1;
    };
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
