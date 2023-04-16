export default {
    name: "Level 1 Helmet",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-helmet-01.svg",
        world: "./player-circle-base-01.svg"
    },
    moveSpeedPenalties: {
        active: 0,
        passive: 0,
        using: 0
    },
    level: 1,
    type: "helmet",
    protectionModifier: 0.75,
    worldObject: {
        tint: "#317FFF",
        dimensions: {
            width: 1.3,
            height: "auto"
        },
        offset: {
            parr: -0.2,
            perp: 0,
            angle: 0
        }
    }
} satisfies ExportInterface<SimpleEquipment>;