export default {
    name: "Medic Helmet",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-helmet-medic.svg",
        world: "./player-helmet-medic.svg"
    },
    moveSpeedPenalties: {
        active: 0,
        passive: 0,
        using: 0
    },
    level: 3,
    maxLevel: true,
    type: "helmet",
    protectionModifier: 0.45,
    worldObject: {
        tint: "#FFFFFF",
        dimensions: {
            width: 1.6,
            height: "auto"
        },
        offset: {
            parr: -0.5,
            perp: 0,
            angle: srvsdbx_Math.toRad(-90, "degrees")
        }
    }
} satisfies ExportInterface<SimpleEquipment>;