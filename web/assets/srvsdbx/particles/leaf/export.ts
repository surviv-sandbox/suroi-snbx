export default {
    name: "leaf",
    targetVersion: "0.10.0",
    images: ["./part-leaf-01.svg"],
    lifetime: srvsdbx_Math.bounds_random(500, 1000),
    drag: srvsdbx_Math.bounds_random(1, 5),
    angularVelocity: srvsdbx_Math.toRad(1.5, "radians"),
    baseSize: {
        width: 0.3,
        height: "auto"
    },
    scale: {
        start: () => srvsdbx_Math.bounds_random(1, 1.5),
        end: () => srvsdbx_Math.bounds_random(0.25, 0.5)
    },
    alpha: {
        start: 0.9,
        end: 0
    },
    tint: () => `hsl(0, 0, ${srvsdbx_Math.bounds_random(0.5, 0.75)}%)`
} satisfies ExportInterface<SimpleParticle>;