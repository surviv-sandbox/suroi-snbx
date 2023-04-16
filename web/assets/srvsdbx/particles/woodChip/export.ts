export default {
    name: "woodChip",
    targetVersion: "0.10.0",
    images: ["./part-woodchip-01.svg"],
    lifetime: srvsdbx_Math.bounds_random(500, 1000),
    drag: srvsdbx_Math.bounds_random(1, 5),
    angularVelocity: srvsdbx_Math.toRad(1.5, "radians"),
    baseSize: {
        width: 0.5,
        height: "auto"
    },
    scale: {
        start: () => srvsdbx_Math.bounds_random(1, 2),
        end: () => srvsdbx_Math.bounds_random(0.25, 0.5)
    },
    alpha: {
        start: 0.9,
        end: 0
    },
    tint: () => `hsl(18, 100%, ${srvsdbx_Math.bounds_random(17.5, 22.5)}%)`
} satisfies ExportInterface<SimpleParticle>;