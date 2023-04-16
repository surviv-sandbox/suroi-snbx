export default {
    name: "rainbow",
    targetVersion: "0.10.0",
    tints: {
        normal: "#FFFFFF",
        saturated: "#FFFFFF",
        chambered: "#FFFFFF"
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
        images: ["./player-rainbow-trail.svg"],
        explosionType: "srvsdbx::rainbowBlaster",
        explodeOnContact: true
    },
    casing: "srvsdbx::casingRainbow"
} satisfies ExportInterface<SimpleAmmo>;