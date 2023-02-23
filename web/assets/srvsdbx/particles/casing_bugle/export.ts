export default {
    name: "casing_bugle",
    targetVersion: "0.10.0",
    images: ["./part-note-02.svg"],
    lifetime: () => srvsdbx_Math.bounds_random(1250, 1300),
    drag: () => 2 / srvsdbx_Math.bounds_random(3, 4),
    rotVel: srvsdbx_Math.toRad(0.5, "turns"),
    baseSize: {
        width: 1.7,
        height: "auto"
    },
    scale: {
        start: 1,
        end: 1.4
    },
    alpha: {
        start: 1,
        end: 0,
        interp: srvsdbx_Animation.easingFunctions.easeInCubic
    },
    tint: "#FFDA00"
} satisfies ExportInterface<SimpleParticle>;