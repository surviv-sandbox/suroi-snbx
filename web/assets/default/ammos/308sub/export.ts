export default {
    name: ".308 Subsonic",
    targetVersion: "0.10.0",
    tints: {
        normal: "#252B00",
        saturated: "#465000",
        chambered: "#131600"
    },
    alpha: {
        rate: 0.92,
        min: 0.07,
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
    casing: "srvsdbx::casing_308"
} satisfies ExportInterface<SimpleAmmo>;