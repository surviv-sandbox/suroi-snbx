export default {
    name: "Pouch",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-pack-00.svg"
    },
    noShow: true,
    moveSpeedPenalties: {
        active: 0,
        passive: 0,
        using: 0
    },
    level: 0,
    type: "backpack"
} satisfies ExportInterface<SimpleEquipment>;