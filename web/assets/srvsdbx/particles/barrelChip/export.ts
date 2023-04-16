export default {
    name: "barrelChip",
    targetVersion: "0.10.0",
    images: ["./part-spark-02.svg"],
    lifetime: 500,
    drag: srvsdbx_Math.bounds_random(1, 10),
    angularVelocity: 0,
    baseSize: {
        width: 0.4,
        height: "auto"
    },
    scale: {
        start: () => srvsdbx_Math.bounds_random(1, 2),
        end: () => srvsdbx_Math.bounds_random(0.25, 0.5)
    },
    alpha: {
        start: 0.95,
        end: 0
    },
    tint: () => `hsl(4, 2%, ${srvsdbx_Math.bounds_random(19, 20.5)}%)`
} satisfies ExportInterface<SimpleParticle>;