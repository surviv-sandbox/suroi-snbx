export default {
    name: "lasr",
    targetVersion: "0.10.0",
    tints: {
        normal: "#FF0000",
        saturated: "#FF0000",
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
        type: "bullet",
        images: ["./tracer.svg"]
    }
} satisfies ExportInterface<SimpleAmmo>;