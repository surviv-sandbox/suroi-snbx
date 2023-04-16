export default {
    name: "bugle",
    targetVersion: "0.10.0",
    tints: {
        normal: "#FFF0",
        saturated: "#FFF0",
        chambered: "#FFF0"
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
        images: "none",
    },
    casing: "srvsdbx::casingBugle"
} satisfies ExportInterface<SimpleAmmo>;