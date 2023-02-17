export default {
    name: "Heart Explosive",
    targetVersion: "0.10.0",
    tints: {
        normal: "#FEE2c6",
        saturated: "#FFD9b3",
        chambered: "#FF7000"
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
        explosionType: "srvsdbx::explosion_heart_cannon",
        images: ["./proj-heart-01.svg"],
        spinVel: srvsdbx_Math.toRad(1, "turns"),
        explodeOnContact: true,
        heightPeak: 0.8
    },
    casing: "srvsdbx::casing_heart"
} satisfies ExportInterface<SimpleAmmo>;