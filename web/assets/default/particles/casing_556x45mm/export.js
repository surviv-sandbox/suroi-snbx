export default {
    name: "casing_5.56x45mm",
    targetVersion: "0.10.0",
    images: ["./shell-556mm.svg"],
    lifetime: () => srvsdbx_Math.meanDevPM_random(750, 250, false),
    drag: () => srvsdbx_Math.meanDevPM_random(1.5, 1, false),
    rotVel: srvsdbx_Math.toRad(1.25, "turns"),
    baseSize: {
        width: "auto",
        height: 0.7
    },
    scale: {
        start: 1,
        end: 0.6
    },
    alpha: {
        start: 0.925,
        end: 0.86
    },
    tint: () => `hsl(0, 100%, ${srvsdbx_Math.meanDevPM_random(90, 5, false)}%)`
};
//# sourceMappingURL=export.js.map