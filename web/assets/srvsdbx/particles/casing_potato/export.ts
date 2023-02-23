export default {
    name: "casing_potato",
    targetVersion: "0.10.0",
    images: ["./part-wedge-01.svg"],
    lifetime: () => srvsdbx_Math.meanDevPM_random(750, 250, false),
    drag: () => srvsdbx_Math.meanDevPM_random(1, 1, false),
    rotVel: srvsdbx_Math.toRad(1.5, "turns"),
    baseSize: {
        width: "auto",
        height: 0.7
    },
    scale: {
        start: 1,
        end: 4 / 7
    },
    alpha: {
        start: 0.95,
        end: 0.875
    },
    tint: "#FFFFFF"
} satisfies ExportInterface<SimpleParticle>;