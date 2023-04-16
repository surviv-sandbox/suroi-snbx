export default {
    name: "potatoCannon",
    targetVersion: "0.10.0",
    damage: 95,
    obstacleMultiplier: 1.3,
    radii: {
        min: 3.5,
        max: 6.5
    },
    particle: "srvsdbx::explosionPotato",
    shakeStrength: 0.12,
    shakeDuration: 250,
    decal: "srvsdbx::fragSmallExplosion",
    scatter: {
        count: 8,
        velocity: () => srvsdbx_Math.meanDevPM_random(4, 1.2, false),
        particleType: "srvsdbx::potatoImpact"
    }
} satisfies ExportInterface<SimpleExplosion>;