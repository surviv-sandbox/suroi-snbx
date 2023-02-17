export default {
    name: "Water",
    targetVersion: "0.10.0",
    tints: {
        normal: "#3771FA",
        saturated: "#3771FA",
        chambered: "#3771FA"
    },
    alpha: {
        rate: 0.94,
        min: 0.2,
        max: 1
    },
    imageOffset: {
        parr: 0,
        perp: 0
    },
    projectileInfo: {
        type: "explosive",
        images: ["./tracer.svg"],
        explodeOnContact: true,
        explosionType: "srvsdbx::explosion_water"
    },
    casing: "srvsdbx::casing_water"
};
//# sourceMappingURL=export.js.map