export default {
    name: "Lone Survivr Helmet (red)",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-helmet-last-man-01.svg",
        world: "./player-helmet-last-man-01.svg"
    },
    moveSpeedPenalties: {
        active: 0,
        passive: 0,
        using: 0
    },
    level: 4,
    maxLevel: true,
    type: "helmet",
    protectionModifier: 0.3,
    worldObject: {
        tint: "#FFFFFF",
        dimensions: {
            width: "auto",
            height: 2.5
        },
        offset: {
            parr: -0.2,
            perp: 0,
            angle: srvsdbx_Math.toRad(-90, "degrees")
        }
    }
} satisfies ExportInterface<SimpleEquipment>;