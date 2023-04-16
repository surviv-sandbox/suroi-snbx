export default {
    name: "Tsukuyomi no Kabuto",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-helmet-03.svg",
        world: "./player-helmet-moon.svg"
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
            height: 2.4
        },
        offset: {
            parr: -0.6,
            perp: 0,
            angle: srvsdbx_Math.toRad(-90, "degrees")
        }
    }
} satisfies ExportInterface<SimpleEquipment>;