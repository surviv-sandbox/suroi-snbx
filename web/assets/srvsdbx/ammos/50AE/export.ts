export default {
    name: ".50AE",
    targetVersion: "0.10.0",
    tints: {
        normal: "#FFF088",
        saturated: "#FFEC66",
        chambered: "#FFDF00"
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