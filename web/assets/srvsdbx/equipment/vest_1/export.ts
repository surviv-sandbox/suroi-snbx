export default {
    name: "Level 1 Vest",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-chest-01.svg",
        world: "./player-armor-base-01.svg"
    },
    moveSpeedPenalties: {
        active: 0,
        passive: 0,
        using: 0
    },
    level: 1,
    type: "vest",
    protectionModifier: 0.75,
    worldObject: {
        tint: "#B4B4B4",
        dimensions: {
            width: 2.2,
            height: "auto"
        },
        offset: {
            parr: 0,
            perp: 0,
            angle: 0
        }
    }
} satisfies ExportInterface<SimpleEquipment>;