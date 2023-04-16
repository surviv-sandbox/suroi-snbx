const peak = 0.8;

export default {
    name: "heart",
    targetVersion: "0.10.0",
    tints: {
        normal: "#FEE2C6",
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
        explosionType: "srvsdbx::heartCannon",
        images: ["./proj-heart-01.svg"],
        spinVel: srvsdbx_Math.toRad(1, "turns"),
        explodeOnContact: true,
        scale(t) {
            return -4 * peak * t * (t - 1) + 1;
        },
    },
    casing: "srvsdbx::casingHeart"
} satisfies ExportInterface<SimpleAmmo>;