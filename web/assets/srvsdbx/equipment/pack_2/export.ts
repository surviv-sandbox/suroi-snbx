export default {
    name: "Regular Pack",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-pack-02.svg",
        world: "./player-back-outfit-base.svg"
    },
    moveSpeedPenalties: {
        active: 0,
        passive: 0,
        using: 0
    },
    level: 2,
    type: "backpack",
    worldObject: {
        tint: "#FFFFFF",
        dimensions: {
            width: 1.9,
            height: "auto"
        },
        offset: {
            parr: -0.7,
            perp: 0,
            angle: 0
        }
    }
} satisfies ExportInterface<SimpleEquipment>;