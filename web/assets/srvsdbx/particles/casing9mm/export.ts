export default {
    name: "casing9mm",
    targetVersion: "0.10.0",
    images: ["./shell-9mm.svg"],
    lifetime: () => srvsdbx_Math.meanDevPM_random(500, 250, false),
    drag: () => srvsdbx_Math.meanDevPM_random(3, 1, false),
    angularVelocity: srvsdbx_Math.toRad(1.5, "turns"),
    baseSize: {
        width: "auto",
        height: 0.5
    },
    scale: {
        start: 1,
        end: 0.52
    },
    alpha: {
        start: 0.95,
        end: 0.875
    },
    tint: () => `hsl(0, 100%, ${srvsdbx_Math.meanDevPM_random(90, 5, false)}%)`
} satisfies ExportInterface<SimpleParticle>;