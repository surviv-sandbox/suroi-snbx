export default {
    name: "5.56x45mm",
    targetVersion: "0.10.0",
    tints: {
        normal: "#A9FF92",
        saturated: "#7EFF5C",
        chambered: "#36FF00"
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
    casing: "srvsdbx::casing556mm"
} satisfies ExportInterface<SimpleAmmo>;