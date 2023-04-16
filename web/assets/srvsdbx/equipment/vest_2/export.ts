export default {
    name: "Level 2 Vest",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-chest-02.svg",
        world: "./player-armor-base-01.svg"
    },
    moveSpeedPenalties: {
        active: 0,
        passive: 0,
        using: 0
    },
    level: 2,
    type: "vest",
    protectionModifier: 0.62,
    worldObject: {
        tint: "#4B4B4B",
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