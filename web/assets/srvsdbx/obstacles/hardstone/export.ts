export default {
    name: "hardstone",
    targetVersion: "0.10.0",
    hitbox: {
        type: "rectangle",
        dimensions: {
            width: 2,
            height: "auto"
        }
    },
    scale(hp) { return (hp + 3) / 4; },
    collidable: CollisionLevels.ALL,
    destroyable: true,
    armorPlated: false,
    stonePlated: true,
    reflective: false,
    hitParticle: {
        particle: "srvsdbx::rockEyeChip",
        count: 1
    },
    destroyParticle: {
        particle: "srvsdbx::rockEyeBreak",
        count: () => srvsdbx_Math.bounds_random(5, 10)
    },
    residue: {
        decal: "srvsdbx::hardstoneResidue",
        noRotate: true
    },
    baseHP: 250,
    images: ["./map-stone-04.svg"]
} satisfies ExportInterface<SimpleObstacle>;