export default {
    name: "explosionUSAS",
    targetVersion: "0.10.0",
    images: ["./part-frag-burst-01.svg"],
    lifetime: 500,
    drag: 1,
    angularVelocity: 0,
    baseSize: {
        width: 2.5,
        height: "auto"
    },
    scale: {
        start: 0.75,
        end: 3
    },
    alpha: {
        start: 1,
        end: 0
    },
    tint: () => `hsl(16, 100%, ${srvsdbx_Math.meanDevPM_random(26.9, 0.5, true)}%)`
} satisfies ExportInterface<SimpleParticle>;