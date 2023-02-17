export default {
    name: "Potato Explosive",
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
        explosionType: "srvsdbx::explosion_potato_cannon",
        images: ["./proj-potato-02.svg"],
        spinVel: srvsdbx_Math.toRad(1, "turns"),
        explodeOnContact: true,
        heightPeak: 0.8
    },
    casing: "srvsdbx::casing_potato"
};
//# sourceMappingURL=export.js.map