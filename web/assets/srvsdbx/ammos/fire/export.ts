export default {
    name: "fire",
    targetVersion: "0.10.0",
    tints: {
        normal: "#FFFFFF",
        saturated: "#FFFFFF",
        chambered: "#FFFFFF"
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
        images: ["./part-fire-01.svg", "./part-fire-02.svg", "./part-fire-03.svg"],
        spinVel: srvsdbx_Math.toRad(4.5, "turns"),
        explosionType: "srvsdbx::fire",
        explodeOnContact: true
    }
} satisfies ExportInterface<SimpleAmmo>;