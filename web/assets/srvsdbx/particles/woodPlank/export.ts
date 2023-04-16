export default {
    name: "woodPlank",
    targetVersion: "0.10.0",
    images: ["./part-plank-01.svg"],
    lifetime: srvsdbx_Math.bounds_random(1000, 1500),
    drag: srvsdbx_Math.bounds_random(1, 5),
    angularVelocity: srvsdbx_Math.toRad(1.5, "radians"),
    baseSize: {
        width: 0.8,
        height: "auto"
    },
    scale: {
        start: () => srvsdbx_Math.bounds_random(1, 1.5),
        end: () => srvsdbx_Math.bounds_random(0.4, 0.9)
    },
    alpha: {
        start: 0.9,
        end: 0
    },
    tint: () => `hsl(18, 100%, ${srvsdbx_Math.bounds_random(12.5, 17.5)}%)`
} satisfies ExportInterface<SimpleParticle>;