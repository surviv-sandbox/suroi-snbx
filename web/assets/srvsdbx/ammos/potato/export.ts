const peak = 0.8;

export default {
    name: "potato",
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
        explosionType: "srvsdbx::potatoCannon",
        images: ["./proj-potato-02.svg"],
        spinVel: srvsdbx_Math.toRad(1, "turns"),
        explodeOnContact: true,
        scale(t) {
            return -4 * peak * t * (t - 1) + 1;
        },
    },
    casing: "srvsdbx::casingPotato"
} satisfies ExportInterface<SimpleAmmo>;