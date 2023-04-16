export default {
    name: "usas",
    targetVersion: "0.10.0",
    damage: 42,
    obstacleMultiplier: 4,
    radii: {
        min: 3.5,
        max: 6.5
    },
    particle: "srvsdbx::explosionUSAS",
    shakeStrength: 0.12,
    shakeDuration: 250,
    decal: "srvsdbx::fragSmallExplosion",
    shrapnel: {
        count: 9,
        damage: 5,
        velocity: 20,
        range: () => srvsdbx_Math.meanDevPM_random(5, 6, false),
        falloff: 1,
        tracer: {
            image: "./tracer.svg",
            color: "#333",
            width: 0.25,
            height: 10
        }
    }
} satisfies ExportInterface<SimpleExplosion>;