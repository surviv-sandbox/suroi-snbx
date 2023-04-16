export default {
    name: "tree",
    targetVersion: "0.10.0",
    hitbox: {
        type: "circle",
        radius: () => srvsdbx_Math.bounds_random(1.4, 1.8)
    },
    scale(hp) { return (hp + 1) / 2; },
    collidable: CollisionLevels.ALL,
    destroyable: true,
    armorPlated: false,
    stonePlated: false,
    reflective: false,
    imageScale: 2.8,
    hitParticle: {
        particle: "srvsdbx::woodChip",
        count: 1
    },
    destroyParticle: {
        particle: "srvsdbx::woodLog",
        count: () => srvsdbx_Math.bounds_random(5, 10)
    },
    residue: {
        decal: "srvsdbx::treeResidue"
    },
    baseHP: 175,
    subLayer: 1,
    images: ["./map-tree-03.svg"]
} satisfies ExportInterface<SimpleObstacle>;