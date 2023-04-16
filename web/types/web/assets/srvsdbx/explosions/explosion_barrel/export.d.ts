declare const _default: {
    name: string;
    targetVersion: string;
    damage: number;
    obstacleMultiplier: number;
    radii: {
        min: number;
        max: number;
    };
    particle: string;
    shakeStrength: number;
    shakeDuration: number;
    decal: string;
    shrapnel: {
        count: number;
        damage: number;
        velocity: number;
        range: () => number;
        falloff: number;
        tracer: {
            image: string;
            color: string;
            width: number;
            height: number;
        };
    };
};
export default _default;
