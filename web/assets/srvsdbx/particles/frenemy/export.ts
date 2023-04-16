export default {
    name: "frenemy",
    targetVersion: "0.10.0",
    images: ["./part-heart-02.svg"],
    lifetime: srvsdbx_Math.bounds_random(750, 1000),
    drag: 0.25,
    angularVelocity: 0,
    baseSize: {
        width: "auto",
        height: 6
    },
    scale: {
        start: () => srvsdbx_Math.bounds_random(0.1, 0.12),
        end: () => srvsdbx_Math.bounds_random(0.05, 0.07)
    },
    alpha: {
        start: 1,
        end: 0.3
    },
    tint: () => `hsl(0, 100%, ${srvsdbx_Math.bounds_random(37.5, 50)}%)`
} satisfies ExportInterface<SimpleParticle>;