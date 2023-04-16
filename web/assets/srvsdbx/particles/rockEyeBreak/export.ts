export default {
    name: "rockEyeBreak",
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
        start: () => srvsdbx_Math.bounds_random(1, 2),
        end: () => srvsdbx_Math.bounds_random(0.6, 1.2)
    },
    alpha: {
        start: 0.9,
        end: 0
    },
    tint: "#292421"
} satisfies ExportInterface<SimpleParticle>;