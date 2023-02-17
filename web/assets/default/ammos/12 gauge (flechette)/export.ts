export default {
    name: "12 gauge (flechette)",
    targetVersion: "0.10.0",
    tints: {
        normal: "#FEDCDC",
        saturated: "#FEC0C1",
        chambered: "#FF0000"
    },
    alpha: {
        rate: 0.92,
        min: 0.14,
        max: 1
    },
    spawnVar: {
        radius: 0.2
    },
    imageOffset: {
        parr: 0,
        perp: 0
    },
    projectileInfo: {
        type: "bullet",
        images: ["./tracer.svg"]
    },
    casing: "srvsdbx::casing_12gauge_flechette"
} satisfies ExportInterface<SimpleAmmo>;