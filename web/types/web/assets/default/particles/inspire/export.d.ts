declare const _default: {
    name: string;
    targetVersion: string;
    images: string[];
    lifetime: () => number;
    drag: number;
    rotVel: () => number;
    baseSize: {
        width: number;
        height: "auto";
    };
    scale: {
        start: number;
        end: number;
    };
    alpha: (part: Particle) => number;
    tint: () => string;
};
export default _default;
