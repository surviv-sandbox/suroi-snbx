export default {
    name: "Level 4 Vest",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-chest-03.svg",
        world: "./player-armor-base-01.svg"
    },
    moveSpeedPenalties: {
        active: 0,
        passive: 0,
        using: 0
    },
    level: 4,
    maxLevel: true,
    type: "vest",
    protectionModifier: 0.4,
    worldObject: {
        tint: "#1C2e06",
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