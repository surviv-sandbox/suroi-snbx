declare const _default: {
    name: string;
    targetVersion: string;
    damage: number;
    obstacleMult: number;
    radii: {
        min: number;
        max: number;
    };
    particle: string;
    shakeStrength: number;
    shakeDuration: number;
    decal: string;
    scatter: {
        count: number;
        velocity: () => number;
        particleType: string;
    };
};
export default _default;
