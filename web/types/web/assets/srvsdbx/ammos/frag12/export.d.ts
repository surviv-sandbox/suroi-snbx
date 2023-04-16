declare const _default: {
    name: string;
    targetVersion: string;
    tints: {
        normal: string;
        saturated: string;
        chambered: string;
    };
    alpha: {
        rate: number;
        min: number;
        max: number;
    };
    imageOffset: {
        parr: number;
        perp: number;
    };
    projectileInfo: {
        type: "explosive";
        explosionType: string;
        images: string[];
        explodeOnContact: true;
    };
    casing: string;
};
export default _default;
