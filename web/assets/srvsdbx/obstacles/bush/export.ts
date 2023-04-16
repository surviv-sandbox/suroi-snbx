export default {
    name: "bush",
    targetVersion: "0.10.0",
    hitbox: {
        type: "circle",
        radius: () => srvsdbx_Math.bounds_random(1.6, 1.9)
    },
    scale() { return 1; },
    collidable: CollisionLevels.NO_PLAYER,
    skipProjectileHitIncrement: true,
    destroyable: true,
    armorPlated: false,
    stonePlated: false,
    reflective: false,
    hitParticle: {
        particle: "srvsdbx::leaf",
        count: 2
    },
    destroyParticle: {
        particle: "srvsdbx::leaf",
        count: () => srvsdbx_Math.bounds_random(8, 15)
    },
    residue: {
        decal: "srvsdbx::bushResidue"
    },
    baseHP: 100,
    images: ["./map-bush-01.svg"]
} satisfies ExportInterface<SimpleObstacle>;