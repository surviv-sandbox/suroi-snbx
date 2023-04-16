export default {
    name: "barrelBreak",
    targetVersion: "0.10.0",
    images: ["./part-spark-02.svg"],
    lifetime: srvsdbx_Math.bounds_random(800, 1000),
    drag: srvsdbx_Math.bounds_random(1, 5),
    angularVelocity: srvsdbx_Math.toRad(1.5, "radians"),
    baseSize: {
        width: 0.6,
        height: "auto"
    },
    scale: {
        start: () => srvsdbx_Math.bounds_random(1, 12 / 7),
        end: () => srvsdbx_Math.bounds_random(5 / 7, 10 / 7)
    },
    alpha: {
        start: 0.09,
        end: 0
    },
    tint: () => `hsl(4, 2%, ${srvsdbx_Math.bounds_random(19, 20.5)}%)`
} satisfies ExportInterface<SimpleParticle>;