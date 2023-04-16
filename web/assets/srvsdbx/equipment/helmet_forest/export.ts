export default {
    name: "Shishigami no Kabuto",
    targetVersion: "0.10.0",
    images: {
        loot: "loot-helmet-forest.svg",
        world: "./player-helmet-forest.svg"
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
            width: "auto",
            height: 2.8
        },
        offset: {
            parr: -0.3,
            perp: 0,
            angle: srvsdbx_Math.toRad(-90, "degrees")
        }
    }
} satisfies ExportInterface<SimpleEquipment>;