export default {
    name: "ammoCrate",
    targetVersion: "0.10.0",
    hitbox: {
        type: "rectangle",
        dimensions: {
            width: 4.9,
            height: "auto"
        }
    },
    scale(hp) { return (hp + 1) / 2; },
    collidable: CollisionLevels.ALL,
    destroyable: true,
    armorPlated: true,
    stonePlated: false,
    reflective: false,
    hitParticle: {
        particle: "srvsdbx::greenChip",
        count: 1
    },
    destroyParticle: {
        particle: "srvsdbx::woodPlank",
        count: () => srvsdbx_Math.bounds_random(5, 10)
    },
    residue: {
        decal: "srvsdbx::crateResidue"
    },
    baseHP: 225,
    images: ["./map-crate-04.svg"]
} satisfies ExportInterface<SimpleObstacle>;