export default {
    name: "explosion_fire",
    targetVersion: "0.10.0",
    damage: 4,
    obstacleMult: 1.1,
    radii: {
        min: 1.25,
        max: 1.75
    },
    scatter: {
        count: 2,
        velocity: () => srvsdbx_Math.meanDevPM_random(5, 2, true),
        particleType: "srvsdbx::fire_impact"
    }
};
//# sourceMappingURL=export.js.map