export default {
    name: "potatoImpact",
    targetVersion: "0.10.0",
    images: ["./part-potato-01.svg"],
    lifetime: () => srvsdbx_Math.meanDevPM_random(500, 500, false),
    drag: 1,
    angularVelocity: () => srvsdbx_Math.toRad(srvsdbx_Math.meanDevPM_random(0.5, 0.5, false), "turns"),
    baseSize: {
        width: 3,
        height: "auto"
    },
    scale: {
        start: () => srvsdbx_Math.meanDevPM_random(0.13, 0.1, false),
        end: () => srvsdbx_Math.meanDevPM_random(0.07, 0.07, false)
    },
    alpha: {
        start: 1,
        end: 0.9
    },
    tint: () => `hsl(0, 100%, ${srvsdbx_Math.meanDevPM_random(99.5, 0.5, true)}%)`
} satisfies ExportInterface<SimpleParticle>;