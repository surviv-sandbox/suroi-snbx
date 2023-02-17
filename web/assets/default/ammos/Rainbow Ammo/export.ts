export default {
    name: "Rainbow Ammo",
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
        explosionType: "srvsdbx::explosion_rainbow_blaster",
        explodeOnContact: true
    },
    casing: "srvsdbx::casing_rainbow_ammo"
} satisfies ExportInterface<SimpleAmmo>;