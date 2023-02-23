export default {
    name: "7.62x54mmR",
    targetVersion: "0.10.0",
    tints: {
        normal: "#C5D6FE",
        saturated: "#ABC4FF",
        chambered: "#004CFF"
    },
    alpha: {
        rate: 0.94,
        min: 0.2,
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
    casing: "srvsdbx::casing_7.62x54mmR"
} satisfies ExportInterface<SimpleAmmo>;