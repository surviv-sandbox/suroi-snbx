export default {
    name: "explosion_heart_cannon",
    targetVersion: "0.10.0",
    damage: 95,
    obstacleMult: 1.3,
    radii: {
        min: 3.5,
        max: 6.5
    },
    particle: "srvsdbx::explosionHeart",
    shakeStrength: 0.12,
    shakeDuration: 250,
    decal: "srvsdbx::decal_heart_explosion",
    scatter: {
        count: 8,
        velocity: () => srvsdbx_Math.meanDevPM_random(4, 1.2, false),
        particleType: "srvsdbx::heart_impact"
    }
} satisfies ExportInterface<SimpleExplosion>;