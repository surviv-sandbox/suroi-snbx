export default {
    name: "potatoSmg",
    targetVersion: "0.10.0",
    damage: 12,
    obstacleMultiplier: 1.25,
    radii: {
        min: 1.25,
        max: 1.75
    },
    shakeStrength: 0,
    shakeDuration: 0,
    scatter: {
        count: 2,
        velocity: () => srvsdbx_Math.meanDevPM_random(4, 1.2, false),
        particleType: "srvsdbx::potatoSmgImpact"
    }
} satisfies ExportInterface<SimpleExplosion>;