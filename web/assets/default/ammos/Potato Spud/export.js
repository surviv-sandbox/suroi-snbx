export default {
    name: "Potato Spud",
    targetVersion: "0.10.0",
    tints: {
        normal: "#FEDCDC",
        saturated: "#FEBEAD",
        chambered: "#FF8000"
    },
    alpha: {
        rate: 0.92,
        min: 0.14,
        max: 1
    },
    imageOffset: {
        parr: 0,
        perp: 0
    },
    projectileInfo: {
        type: "explosive",
        explosionType: "srvsdbx::explosion_potato_smg",
        images: ["./proj-wedge-01.svg"],
        spinVel: () => srvsdbx_Math.toRad(srvsdbx_Math.meanDevPM_random(1, 0.4, true), "turns"),
        explodeOnContact: true,
        heightPeak: 0.2
    },
    casing: "srvsdbx::casing_potato"
};
//# sourceMappingURL=export.js.map