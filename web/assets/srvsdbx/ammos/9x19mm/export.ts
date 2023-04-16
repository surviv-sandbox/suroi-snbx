export default {
    name: "9x19mm",
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
        type: "bullet",
        images: ["./tracer.svg"]
    },
    casing: "srvsdbx::casing9mm"
} satisfies ExportInterface<SimpleAmmo>;