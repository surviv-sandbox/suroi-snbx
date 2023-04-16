export default {
    name: "crate",
    targetVersion: "0.10.0",
    hitbox: {
        type: "rectangle",
        dimensions: {
            width: 4.2,
            height: "auto"
        }
    },
    scale(hp) { return (hp + 1) / 2; },
    collidable: CollisionLevels.ALL,
    destroyable: true,
    armorPlated: false,
    stonePlated: false,
    reflective: false,
    hitParticle: {
        particle: "srvsdbx::woodChip",
        count: 1
    },
    destroyParticle: {
        particle: "srvsdbx::woodPlank",
        count: () => srvsdbx_Math.bounds_random(5, 10)
    },
    residue: {
        decal: "srvsdbx::crateResidue"
    },
    baseHP: 75,
    images: ["./map-crate-01.svg"]
} satisfies ExportInterface<SimpleObstacle>;