export default {
    name: "Small Pack",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-pack-01.svg",
        world: "./player-back-outfit-base.svg"
    },
    moveSpeedPenalties: {
        active: 0,
        passive: 0,
        using: 0
    },
    level: 1,
    type: "backpack",
    worldObject: {
        tint: "#FFFFFF",
        dimensions: {
            width: 1.8,
            height: "auto"
        },
        offset: {
            parr: -0.6,
            perp: 0,
            angle: 0
        }
    }
} satisfies ExportInterface<SimpleEquipment>;