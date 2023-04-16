export default {
    name: "stoneBreak",
    targetVersion: "0.10.0",
    images: ["./map-stone-01.svg"],
    lifetime: srvsdbx_Math.bounds_random(800, 1000),
    drag: srvsdbx_Math.bounds_random(1, 5),
    angularVelocity: 0,
    baseSize: {
        width: 0.7,
        height: "auto"
    },
    scale: {
        start: () => srvsdbx_Math.bounds_random(1, 12 / 7),
        end: () => srvsdbx_Math.bounds_random(5 / 7, 5 / 6)
    },
    alpha: {
        start: 0.9,
        end: 0
    },
    tint: () => `hsl(0, 0%, ${srvsdbx_Math.bounds_random(50, 70)}%)`
} satisfies ExportInterface<SimpleParticle>;