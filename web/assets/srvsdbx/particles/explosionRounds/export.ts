export default {
    name: "explosionRounds",
    targetVersion: "0.10.0",
    images: ["./part-frag-burst-03.svg"],
    lifetime: 500,
    drag: 1,
    angularVelocity: 0,
    baseSize: {
        width: 2,
        height: "auto"
    },
    scale: {
        start: 1,
        end: 3
    },
    alpha: {
        start: 0.75,
        end: 0
    },
    tint: () => `hsl(28.8, 58%, ${srvsdbx_Math.meanDevPM_random(49, 3, false)}%)`
} satisfies ExportInterface<SimpleParticle>;