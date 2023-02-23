declare const _default: {
    name: string;
    targetVersion: string;
    damage: number;
    obstacleMult: number;
    radii: {
        min: number;
        max: number;
    };
    shakeStrength: number;
    shakeDuration: number;
    scatter: {
        count: number;
        velocity: () => number;
        particleType: string;
    };
};
export default _default;
