export default {
    name: "rock",
    targetVersion: "0.10.0",
    hitbox: {
        type: "circle",
        radius: () => srvsdbx_Math.bounds_random(1.6, 1.92)
    },
    scale(hp) { return (hp + 1) / 2; },
    collidable: CollisionLevels.ALL,
    destroyable: true,
    armorPlated: false,
    stonePlated: false,
    reflective: false,
    hitParticle: {
        particle: "srvsdbx::stoneHit",
        count: 1
    },
    destroyParticle: {
        particle: "srvsdbx::stoneBreak",
        count: () => srvsdbx_Math.bounds_random(5, 10)
    },
    residue: {
        decal: "srvsdbx::stoneResidue"
    },
    baseHP: 250,
    images: ["./map-stone-01.svg"]
} satisfies ExportInterface<SimpleObstacle>;