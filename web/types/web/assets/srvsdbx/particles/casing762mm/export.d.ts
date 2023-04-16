declare const _default: {
    name: string;
    targetVersion: string;
    images: string[];
    lifetime: () => number;
    drag: () => number;
    angularVelocity: number;
    baseSize: {
        width: "auto";
        height: number;
    };
    scale: {
        start: number;
        end: number;
    };
    alpha: {
        start: number;
        end: number;
    };
    tint: () => string;
};
export default _default;
