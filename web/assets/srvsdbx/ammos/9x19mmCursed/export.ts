export default {
    name: "9x19mmCursed",
    targetVersion: "0.10.0",
    tints: {
        normal: "#000000",
        saturated: "#000000",
        chambered: "#000000"
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
        type: "bullet",
        images: ["./tracer.svg"]
    },
    casing: "srvsdbx::casing9mm"
} satisfies ExportInterface<SimpleAmmo>;