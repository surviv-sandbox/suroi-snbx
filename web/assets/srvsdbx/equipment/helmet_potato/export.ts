export default {
    name: "K-pot-ato",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-helmet-potato.svg",
        world: "./player-helmet-potato.svg"
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
            width: 1.6,
            height: "auto"
        },
        offset: {
            parr: -0.5,
            perp: 0,
            angle: srvsdbx_Math.toRad(-90, "degrees")
        }
    }
} satisfies ExportInterface<SimpleEquipment>;