export default {
    name: "casing_308",
    targetVersion: "0.10.0",
    images: ["./shell-308.svg"],
    lifetime: () => srvsdbx_Math.meanDevPM_random(750, 250, false),
    drag: () => srvsdbx_Math.meanDevPM_random(1, 1, false),
    rotVel: srvsdbx_Math.toRad(1.5, "turns"),
    baseSize: {
        width: "auto",
        height: 1.2
    },
    scale: {
        start: 1,
        end: 2 / 9
    },
    alpha: {
        start: 0.95,
        end: 0.875
    },
    tint: "#FFFFFF"
};
//# sourceMappingURL=export.js.map