export default {
    name: "Level 2 Helmet",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-helmet-02.svg",
        world: "./player-circle-base-01.svg"
    },
    moveSpeedPenalties: {
        active: 0,
        passive: 0,
        using: 0
    },
    level: 2,
    type: "helmet",
    protectionModifier: 0.6,
    worldObject: {
        tint: "#C6C6C6",
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