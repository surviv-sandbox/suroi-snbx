
const peak = 1;
export default {
    name: "40mm",
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
        explosionType: "srvsdbx::frag",
        images: ["./proj-40mm-01.svg"],
        spinVel: srvsdbx_Math.toRad(1, "turns"),
        scale(t) {
            return -4 * peak * t * (t - 1) + 1;
        },
        explodeOnContact: true
    },
    casing: "srvsdbx::casing40mm"
} satisfies ExportInterface<SimpleAmmo>;