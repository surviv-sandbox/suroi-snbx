export default {
    name: "barrel",
    targetVersion: "0.10.0",
    hitbox: {
        type: "circle",
        radius: 1.5
    },
    scale(hp) { return (2 * hp + 3) / 5; },
    emitters: [{
        spawnDelay: 300,
        spawnCount: 1,
        area: { x: 0, y: 0 },
        particleProperties: {
            scale: () => srvsdbx_Math.bounds_random(0.1, 0.25),
            velocity: () => srvsdbx_Geometry.Vector2D.fromPolarToPt(
                srvsdbx_Math.toRad(-srvsdbx_Math.bounds_random(45, 70), "degrees"),
                srvsdbx_Math.bounds_random(0.05, 0.2)
            )
        },
        shouldSpawn: state => state.obstacle.health / state.obstacle.prototype.baseHP < 0.5,
        particleTypes: ["srvsdbx::explosionSmoke"],
        initialState: {
            obstacle: void 0 as any
        }
    }],
    collidable: CollisionLevels.ALL,
    destroyable: true,
    armorPlated: false,
    stonePlated: false,
    reflective: true,
    hitParticle: {
        particle: "srvsdbx::barrelChip",
        count: 1
    },
    destroyParticle: {
        particle: "srvsdbx::barrelBreak",
        count: () => srvsdbx_Math.bounds_random(2, 5)
    },
    destructionExplosion: "srvsdbx::barrel",
    baseHP: 150,
    images: ["./map-barrel-01.svg"]
} satisfies ExportInterface<SimpleObstacle>;