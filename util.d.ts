/// <reference types="p5" />
declare type TOrArrayT<T> = T | T[];
declare type TOrFT<T, U extends any[]> = T | ((...args: U) => T);
declare type JSONValue = string | number | boolean | null;
declare type JSONObject = {
    [key: string]: JSONContent;
};
declare type JSONArray = JSONObject["string"][];
declare type JSONContent = JSONValue | JSONObject | JSONArray;
declare type timestamp = number;
declare type badCodeDesign = any;
declare type hexColor = `#${string}`;
declare type RGBColor = [number, number, number];
declare type RGBAColor = [number, number, number, number];
declare type HSLColor = {
    hue: number;
    saturation: number;
    luminosity: number;
};
declare type HSBColor = {
    hue: number;
    saturation: number;
    brightness: number;
};
declare type HSLAColor = HSLColor & {
    alpha: number;
};
declare type HSBAColor = HSBColor & {
    alpha: number;
};
declare type colorModes = hexColor | RGBColor | RGBAColor | HSLColor | HSLAColor | HSBColor | HSBAColor;
declare type level = {
    name: string;
    jsonPath: string;
    description: string;
    targetVersion: string;
    color?: string;
    world: {
        width: number;
        height: number;
        color: string;
        gridColor: hexColor;
    };
    initializer(): void;
    thumbnail?: string;
};
/**
 * Make all properties in T optional, and if a given property holds an object, make all of its properties optional
 */
declare type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
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
declare const generateId: Generator<number, never, unknown>;
declare function loadImg(path: string, failGracefully?: boolean): import("p5").Image | void;
declare function loadFnt(path: string, failGracefully?: boolean): import("p5").Font;
declare function makeElement<K extends keyof HTMLElementTagNameMap>(tag: K, id?: string, className?: string): HTMLElementTagNameMap[K];
declare function squaredDist(ptA: {
    x: number;
    y: number;
}, ptB: {
    x: number;
    y: number;
}, options?: {
    useNativeMath: boolean;
}): number | import("./libraries/decimaljs/decimal.global").default;
declare function distance(ptA: {
    x: number;
    y: number;
}, ptB: {
    x: number;
    y: number;
}, options?: {
    useNativeMath: boolean;
}): number | import("./libraries/decimaljs/decimal.global").default;
declare function RPMToMSDelay(rpm: number, options?: {
    useNativeMath: boolean;
}): number | import("./libraries/decimaljs/decimal.global").default;
declare function parseLevelData(data: JSONLevel): {
    obstacles: obstacle[];
    players: playerLike[];
};
declare function checkLevelVersions(lvls: level[]): level[];
declare function extractValue<T, U extends any[]>(x: TOrFT<T, U>, args: U): T;
declare function imageLoadWrapper<T extends any[]>(path: TOrFT<string, T>, basePath?: string): ((...args: T) => import("p5").Image) | (() => void | import("p5").Image);
declare function checkForVersionDiscrepencies(target: {
    targetVersion: string;
}, objectType?: string): "INVALID_VERSION" | "OK" | "PATCH" | "MINOR" | "MAJOR" | "BETAS" | "FUTURE" | "FAR_FUTURE";
declare function warnAboutVersionDiscrepencies(target: {
    targetVersion: string;
}, objectType: string): void;
declare type angleModes = {
    givenIn: "degrees" | "radians" | "gradians" | "turns";
    value: number;
};
declare type timeModes = {
    givenIn: "RPM" | "ms" | "s";
    value: number;
};
declare type JSONGun = {
    name: string;
    targetVersion: string;
    summary: {
        class: TOrFT<string, []>;
        engagementDistance: {
            min: TOrFT<number, []>;
            max: TOrFT<number, []>;
        };
        shouldNoslow: TOrFT<boolean, []>;
        role: TOrFT<"primary" | "secondary", []>;
    };
    dual: TOrFT<boolean, [gun, playerLike]>;
    images: {
        loot: TOrFT<string, []>;
        held: TOrFT<string, []>;
        silhouette: TOrFT<string, []>;
    };
    tint: TOrFT<colorModes, [gun, playerLike]>;
    ballistics: {
        damage: TOrFT<number, [gun, playerLike]>;
        velocity: TOrFT<number, [gun, playerLike]>;
        range: TOrFT<number, [gun, playerLike]>;
        tracer: {
            width: TOrFT<number, [gun, playerLike]>;
            height: TOrFT<number, [gun, playerLike]>;
        };
        hitboxLength: TOrFT<number, [gun, playerLike]>;
        obstacleMult: TOrFT<number, [gun, playerLike]>;
        headshotMult: TOrFT<number, [gun, playerLike]>;
        fsa: {
            enabled: TOrFT<boolean, [gun, playerLike]>;
            rechargeTime: TOrFT<number, [gun, playerLike]>;
        };
        falloff: TOrFT<number, [gun, playerLike]>;
        projectiles: TOrFT<number, [gun, playerLike]>;
    };
    suppressed: TOrFT<boolean, [gun, playerLike]>;
    caliber: TOrFT<string, [gun, playerLike]>;
    firingDelay: TOrFT<number, [gun, playerLike]>;
    deployGroup: TOrFT<number, [gun, playerLike]>;
    accuracy: {
        default: TOrFT<number, [gun, playerLike]>;
        moving: TOrFT<number, [gun, playerLike]>;
    };
    moveSpeedPenalties: {
        active: TOrFT<number, [gun, playerLike]>;
        firing: TOrFT<number, [gun, playerLike]>;
    };
    imageOffset: {
        perp: TOrFT<number, [gun, playerLike]>;
        parr: TOrFT<number, [gun, playerLike]>;
    };
    dimensions: {
        width: TOrFT<number, [gun, playerLike]>;
        height: TOrFT<number, [gun, playerLike]>;
        layer: TOrFT<0 | 1 | 2, [gun, playerLike]>;
    };
    reload: {
        duration: TOrFT<number, [gun, playerLike]>;
        ammoReloaded: TOrFT<number | "all", [gun, playerLike]>;
        chain: TOrFT<boolean, [gun, playerLike]>;
    };
    altReload?: {
        duration: TOrFT<number, [gun, playerLike]>;
        ammoReloaded: TOrFT<number | "all", [gun, playerLike]>;
        chain: TOrFT<boolean, [gun, playerLike]>;
    };
    magazineCapacity: {
        normal: TOrFT<number, []>;
        firepower: TOrFT<number, []>;
    };
    switchDelay: TOrFT<number, [gun, playerLike]>;
    handPositions: {
        leftHand: {
            perp: TOrFT<number, [gun, playerLike]>;
            parr: TOrFT<number, [gun, playerLike]>;
        };
        rightHand?: {
            perp: TOrFT<number, [gun, playerLike]>;
            parr: TOrFT<number, [gun, playerLike]>;
        };
    };
    projectileSpawnOffset: {
        perp: TOrFT<number, [gun, playerLike]>;
        parr: TOrFT<number, [gun, playerLike]>;
    };
    casings: {
        spawnOffset: {
            perp: TOrFT<number, [gun, playerLike]>;
            parr: TOrFT<number, [gun, playerLike]>;
        };
        velocity: {
            perp: TOrFT<number, [gun, playerLike]>;
            parr: TOrFT<number, [gun, playerLike]>;
            angular: TOrFT<number, [gun, playerLike]>;
        };
        spawnOn: TOrFT<"fire" | "reload", [gun, playerLike]>;
        spawnDelay: TOrFT<number, [gun, playerLike]>;
    };
    recoilImpulse: {
        direction: {
            perp: TOrFT<number, [gun, playerLike]>;
            parr: TOrFT<number, [gun, playerLike]>;
        };
        duration: TOrFT<number, [gun, playerLike]>;
    };
    possibleFireModes: TOrFT<("semi" | "automatic" | `${"auto-" | ""}burst-${number}`)[], []>;
    burstProps?: {
        shotDelay: TOrFT<number, [gun, playerLike]>;
        burstDelay: TOrFT<number, [gun, playerLike]>;
    };
};
declare function parseGunData(data: [JSONGun, string][]): gunPrototype[];
declare type explosiveProjData = {
    type: "explosive";
    explosionType: TOrFT<string, []>;
    explodeOnContact: TOrFT<boolean, [projectile]>;
    maxDist: TOrFT<number, [projectile]>;
    heightPeak: TOrFT<number, [projectile]>;
};
declare type ammoData = {
    name: string;
    targetVersion: string;
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
    projectileInfo: (explosiveProjData | {
        type: "bullet";
    }) & {
        img: TOrFT<string, [projectile]>;
        spinVel?: TOrFT<number, [projectile]>;
    };
    casing: {
        img: TOrFT<string, [casing]>;
        lifetime: TOrFT<number, [casing]>;
        width: TOrFT<number, [casing]>;
        height: TOrFT<number, [casing]>;
    };
};
declare function parseAmmoData(data: [ammoData[], string][]): bulletInfo[];
declare type explosionData = {
    name: string;
    targetVersion: string;
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
declare function parseExplosionData(data: [explosionData, string][]): explosionInfo[];
declare function $(ele: string): HTMLElement | null;
declare function average(options: {
    useNativeMath: boolean;
}, ...args: Decimal.Value[]): number | import("./libraries/decimaljs/decimal.global").default;
declare function toMS(val: timeModes): number;
declare function toRad(val: angleModes): number;
declare function stdDev(options: {
    useNativeMath: boolean;
}, ...arr: Decimal.Value[]): number | import("./libraries/decimaljs/decimal.global").default;
declare function checkBounds(value: Decimal | number, lowerBound: Decimal | number | "-inf" | "inf", upperBound: Decimal | number | "-inf" | "inf", options?: {
    inclusion?: {
        lower?: boolean;
        upper?: boolean;
    };
    useNativeMath?: boolean;
}): boolean;
declare function clamp(value: Decimal.Value, min?: Decimal.Value, max?: Decimal.Value, options?: {
    useNativeMath: boolean;
}): number | import("./libraries/decimaljs/decimal.global").default;
declare function normalizeAngle(a: Decimal.Value, options?: {
    useNativeMath?: boolean;
    normalizeTo?: "degrees" | "radians" | "π" | "gradians";
}): number | import("./libraries/decimaljs/decimal.global").default;
declare function meanDevPM_random(mean: Decimal.Value, deviation: Decimal.Value, plusOrMinus: boolean, options?: {
    useNativeMath: boolean;
}): string | number | import("./libraries/decimaljs/decimal.global").default;
declare function clone<T extends JSONContent>(object: T): T;
declare function overrideObject<T extends JSONObject, U extends JSONObject>(o1: Extract<T, U> & Partial<T>, o2: Extract<T, U> & Partial<U>): Extract<T, U> & Partial<T>;
declare function linterp(a: Decimal.Value, b: Decimal.Value, t: Decimal.Value, options?: {
    useNativeMath: boolean;
}): number | import("./libraries/decimaljs/decimal.global").default;
declare function getDecimalPlaces(n: number | Decimal): number;
declare function sliceToDecimalPlaces(number: number | Decimal, decimalPlaces: number): number;
declare function sigFigIshMult(a: number, b: number): number;
declare const getRenderDistFromView: (view: number) => number;
declare function hexToRGB(hex: hexColor, options?: {
    useNativeMath: boolean;
}): RGBAColor;
declare function RGBToHex(rgb: RGBAColor, options?: {
    useNativeMath: boolean;
}): hexColor;
declare function hexToHSL(hex: hexColor, options?: {
    useNativeMath: boolean;
}): {
    hue: number;
    saturation: number;
    luminosity: number;
    alpha: number;
};
declare function RGBToHSL(rgb: RGBAColor, options?: {
    useNativeMath: boolean;
}): {
    hue: number;
    saturation: number;
    luminosity: number;
    alpha: number;
};
declare function HSLToRGB(hsl: {
    hue: number;
    saturation: number;
    luminosity: number;
    alpha?: number;
}, options: {
    useNativeMath: boolean;
}): RGBAColor;
declare function HSLToHex(hsl: HSLAColor, options?: {
    useNativeMath: boolean;
}): `#${string}`;
declare function HSBToRGB(hsb: HSBAColor, options?: {
    useNativeMath: boolean;
}): RGBAColor;
declare function HSBToHex(hsb: HSBAColor, options?: {
    useNativeMath: boolean;
}): `#${string}`;
declare function HSLToHSB(hsl: HSLAColor, options?: {
    useNativeMath: boolean;
}): HSBAColor;
declare function HSBToHSL(hsb: HSBAColor, options?: {
    useNativeMath: boolean;
}): HSLAColor;
declare function parseColor(color: string): {
    type: `rgb${"a" | ""}`;
    value: RGBAColor;
} | {
    type: `hsl${"a" | ""}`;
    value: HSLAColor;
} | {
    type: `hsb${"a" | ""}`;
    value: HSBAColor;
} | {
    type: "hex";
    value: hexColor;
} | {
    type: "keyword";
    value: string;
};
declare function toRGB(color: colorModes, options?: {
    useNativeMath: boolean;
}): RGBAColor;
declare function toHex(color: colorModes, options?: {
    useNativeMath: boolean;
}): `#${string}`;
declare function createCSLEntry(content: cslData["content"] | string, type?: cslData["type"]): cslData;
/**
 * Literally the best function in this entire project.
 * @link https://areweyeetyet.rs
 * Rust is pretty cool
 */
declare function yeet(e: any): never;
