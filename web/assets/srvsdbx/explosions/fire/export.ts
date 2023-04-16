export default {
    name: "fire",
    targetVersion: "0.10.0",
    damage: 4,
    obstacleMultiplier: 1.1,
    radii: {
        min: 1.25,
        max: 1.75
    },
    scatter: {
        count: 2,
        velocity: () => srvsdbx_Math.meanDevPM_random(5, 2, true),
        particleType: "srvsdbx::fireImpact"
    }
} satisfies ExportInterface<SimpleExplosion>;