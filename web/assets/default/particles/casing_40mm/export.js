export default {
    name: "casing_40mm",
    targetVersion: "0.10.0",
    images: ["./shell-40mm.svg"],
    lifetime: () => srvsdbx_Math.meanDevPM_random(500, 250, false),
    drag: () => srvsdbx_Math.meanDevPM_random(3, 1, false),
    rotVel: srvsdbx_Math.toRad(1.5, "turns"),
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
};
//# sourceMappingURL=export.js.map