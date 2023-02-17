export default {
    name: "blood_splat",
    targetVersion: "0.10.0",
    images: ["./part-splat-01.svg", "./part-splat-02.svg", "./part-splat-03.svg"],
    lifetime: 500,
    drag: 1,
    rotVel: 0,
    baseSize: {
        width: "auto",
        height: 6
    },
    scale: {
        start: 0.04,
        end: srvsdbx_Math.meanDevPM_random(0.15, 0.05, false)
    },
    alpha: {
        start: 1,
        end: 0.75
    },
    tint: () => `hsl(0, 100%, ${srvsdbx_Math.bounds_random(22.5, 40)}%)`
};
//# sourceMappingURL=export.js.map