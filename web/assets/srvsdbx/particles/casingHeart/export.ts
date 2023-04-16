export default {
    name: "casingHeart",
    targetVersion: "0.10.0",
    images: ["./part-heart-01.svg"],
    lifetime: () => srvsdbx_Math.meanDevPM_random(750, 250, false),
    drag: () => srvsdbx_Math.meanDevPM_random(1, 1, false),
    angularVelocity: srvsdbx_Math.toRad(1.5, "turns"),
    baseSize: {
        width: "auto",
        height: 0.6
    },
    scale: {
        start: 1,
        end: 0.45
    },
    alpha: {
        start: 0.95,
        end: 0.875
    },
    tint: "#FFFFFF"
} satisfies ExportInterface<SimpleParticle>;