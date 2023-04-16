export default {
    name: "Level 3 Helmet",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-helmet-03.svg",
        world: "./player-circle-base-01.svg"
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
        tint: "#252525",
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