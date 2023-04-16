export default {
    name: "rockEyeChip",
    targetVersion: "0.10.0",
    images: ["./map-stone-01.svg"],
    lifetime: 500,
    drag: srvsdbx_Math.bounds_random(1, 10),
    angularVelocity: 0,
    baseSize: {
        width: 0.4,
        height: "auto"
    },
    scale: {
        start: () => srvsdbx_Math.bounds_random(1, 1.5),
        end: () => srvsdbx_Math.bounds_random(0.25, 0.5)
    },
    alpha: {
        start: 0.95,
        end: 0
    },
    tint: "#292421"
} satisfies ExportInterface<SimpleParticle>;