export default {
    name: "barrel",
    targetVersion: "0.10.0",
    damage: 125,
    obstacleMultiplier: 1,
    radii: {
        min: 5,
        max: 12
    },
    particle: "srvsdbx::explosionBurst",
    shakeStrength: 0.2,
    shakeDuration: 350,
    decal: "srvsdbx::barrelExplosion",
    shrapnel: {
        count: 12,
        damage: 2,
        velocity: 20,
        range: () => srvsdbx_Math.meanDevPM_random(8, 12, false),
        falloff: 1,
        tracer: {
            image: "./tracer.svg",
            color: "#333",
            width: 0.25,
            height: 10
        }
    }
} satisfies ExportInterface<SimpleExplosion>;