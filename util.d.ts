/// <reference types="p5" />
declare type TOrArrayT<T> = T | T[];
declare type JSONObject = {
    [key: string]: TOrArrayT<string | number | boolean | JSONObject | null>;
};
declare type JSONLevel = {
    obstacles: (({
        type: "rectangle";
        width: number;
        height: number;
    } | {
        type: "circle";
        radius: number;
    } | {
        type: "polygon";
        sides: number;
        radius: number;
    } | {
        type: "fromVertices";
        vertexSets: {
            x: number;
            y: number;
        }[];
    } | {
        type: "trapezoid";
        width: number;
        height: number;
        slope: number;
    }) & {
        x: number;
        y: number;
        options: {
            isStatic: boolean;
            friction: number;
            restitution: number;
            density: number;
            angle: number;
        };
        details: {
            image: string;
            imageWidth: number;
            imageHeight: number;
            tint: `#${string}`;
            layer: number;
            xOffset: number;
            yOffset: number;
            angleOffset: number;
            imageMode: import("p5").IMAGE_MODE;
        };
    })[];
    players: {
        x: number;
        y: number;
        angle: number;
        size: number;
        options: {
            friction: number;
            restitution: number;
            inertia?: number;
            density: number;
        };
        loadout: {
            guns: string[];
            activeIndex: number;
        };
        health: number;
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
declare function loadImg(path: string): import("p5").Image;
declare function loadFnt(path: string): import("p5").Font;
declare function makeElement<K extends keyof HTMLElementTagNameMap>(tag: K, id?: string, className?: string): HTMLElementTagNameMap[K];
declare function sqauredDist(ptA: {
    x: number;
    y: number;
}, ptB: {
    x: number;
    y: number;
}): number;
declare function distance(ptA: {
    x: number;
    y: number;
}, ptB: {
    x: number;
    y: number;
}): number;
declare function RPMToMSDelay(rpm: number): number;
declare function parseLevelData(data: JSONLevel): {
    obstacles: obstacle[];
    players: playerLike[];
};
declare type scaleOrAbsolute = {
    givenIn: "scale" | "absolute";
    value: number;
};
declare type ratioOrAbsolute = {
    givenIn: "ratio" | "absolute";
    value: number;
};
declare type angleModes = {
    givenIn: "degrees" | "radians" | "gradians" | "turns";
    value: number;
};
declare type timeModes = {
    givenIn: "RPM" | "ms" | "s";
    value: number;
};
declare type offsetData = {
    perp: scaleOrAbsolute;
    parr: scaleOrAbsolute;
};
declare type variataion = {
    variation: ratioOrAbsolute & {
        plusOrMinus: boolean;
    };
};
declare type offsetDataVariation = offsetData & {
    parr: variataion;
    perp: variataion;
};
declare type JSONGun = {
    name: string;
    dual: boolean;
    images: {
        loot: false | string;
        held: false | string;
    };
    tint: string;
    ballistics: {
        damage: number;
        velocity: scaleOrAbsolute;
        range: scaleOrAbsolute;
        tracer: {
            width: scaleOrAbsolute;
            height: scaleOrAbsolute;
        };
        obstacleMult: number;
        headshotMult: number;
        fsa: {
            enabled: boolean;
            rechargeTime: timeModes;
        };
        falloff: number;
        projectiles: number;
    };
    suppressed: boolean;
    caliber: string;
    firingDelay: timeModes;
    accuracy: {
        default: angleModes;
        moving: angleModes;
    };
    imageOffset: offsetData;
    dimensions: {
        width: scaleOrAbsolute;
        height: scaleOrAbsolute;
    };
    reload: {
        duration: timeModes;
        ammoReloaded: number | "all";
        chain: boolean;
    };
    altReload?: {
        duration: timeModes;
        ammoReloaded: number | "all";
        chain: boolean;
    };
    magazineCapacity: {
        normal: number;
        firepower: number;
    };
    switchDelay: timeModes;
    handPositions: {
        leftHand: offsetData;
        rightHand?: offsetData;
    };
    projectileSpawnOffset: offsetData;
    casings: {
        spawnOffset: offsetData;
        velocity: offsetDataVariation & {
            angular: angleModes & variataion;
        };
        spawnOn: "fire" | "reload";
        spawnDelay: timeModes;
    };
    recoilImpulse: {
        direction: offsetData;
        duration: timeModes;
    };
    possibleFireModes: ("automatic" | "semi" | `burst-${number}`)[];
    burstProps?: {
        shotDelay: timeModes;
        burstDelay: timeModes;
    };
};
declare function parseGunData(gunData: JSONGun[]): gunPrototype[];
declare type ammoData = {
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
        img: string;
        despawnDist: {
            mean: number;
            variation: number;
            plusOrMinus: boolean;
        };
        width: number;
        height: number;
    };
};
declare function parseAmmoData(data: {
    [key: string]: ammoData;
}): {
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
declare function $(ele: string): HTMLElement | null;
declare function average(...args: number[]): number;
declare function stdDev(...arr: number[]): number;
declare function checkBounds(value: Decimal | number, lowerBound: Decimal | number | "-inf" | "inf", upperBound: Decimal | number | "-inf" | "inf", options?: {
    inclusion?: {
        lower?: boolean;
        upper?: boolean;
    };
    useNativeMath?: boolean;
}): boolean;
declare function clamp(value: Decimal.Value, min?: Decimal.Value, max?: Decimal.Value, options?: {
    useNativeMath?: boolean;
}): number | import("./libraries/decimaljs/decimal.global").default;
declare function normalizeAngle(a: Decimal.Value, options?: {
    useNativeMath?: boolean;
    normalizeTo?: "degrees" | "radians" | "π" | "gradians";
}): number | import("./libraries/decimaljs/decimal.global").default;
declare function meanDevPM_random(mean: number, deviation: number, plusOrMinus: boolean): number;
