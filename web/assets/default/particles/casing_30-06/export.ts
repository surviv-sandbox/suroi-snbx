export default {
    name: "casing_30-06",
    targetVersion: "0.10.0",
    images: ["./shell-762mm.svg"],
    lifetime: () => srvsdbx_Math.meanDevPM_random(750, 250, false),
    drag: () => srvsdbx_Math.meanDevPM_random(1.5, 1, false),
    rotVel: srvsdbx_Math.toRad(1.25, "turns"),
    baseSize: {
        width: "auto",
        height: 0.8
    },
    scale: {
        start: 1,
        end: 0.6
    },
    alpha: {
        start: 0.925,
        end: 0.875
    },
    tint: () => `hsl(0, 100%, ${srvsdbx_Math.meanDevPM_random(90, 5, false)}%)`
} satisfies ExportInterface<SimpleParticle>;