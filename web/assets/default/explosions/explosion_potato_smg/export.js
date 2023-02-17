export default {
    name: "explosion_potato_smg",
    targetVersion: "0.10.0",
    damage: 12,
    obstacleMult: 1.25,
    radii: {
        min: 1.25,
        max: 1.75
    },
    shakeStrength: 0,
    shakeDuration: 0,
    scatter: {
        count: 2,
        velocity: () => srvsdbx_Math.meanDevPM_random(4, 1.2, false),
        particleType: "srvsdbx::potato_smg_impact"
    }
};
//# sourceMappingURL=export.js.map