export default {
    name: "frag12",
    targetVersion: "0.10.0",
    tints: {
        normal: "#CB0000",
        saturated: "#E50000",
        chambered: "#FF0000"
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
        explosionType: "srvsdbx::usas",
        images: ["./tracer.svg"],
        explodeOnContact: true
    },
    casing: "srvsdbx::casing12gauge"
} satisfies ExportInterface<SimpleAmmo>;