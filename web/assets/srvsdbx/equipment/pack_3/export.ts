export default {
    name: "Military Pack",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-pack-03.svg",
        world: "./player-back-outfit-base.svg"
    },
    moveSpeedPenalties: {
        active: 0,
        passive: 0,
        using: 0
    },
    level: 3,
    maxLevel: true,
    type: "backpack",
    worldObject: {
        tint: "#FFFFFF",
        dimensions: {
            width: 2.1,
            height: "auto"
        },
        offset: {
            parr: -0.8,
            perp: 0,
            angle: 0
        }
    }
} satisfies ExportInterface<SimpleEquipment>;