type WetInfoMap = {
    /**
     * The last time a particle was spawned
     */
    lastParticleTick: number,
    /**
     * When the next particle will be spawned
     */
    nextParticleSpawn: number;
};

export default {
    name: "wet",
    targetVersion: "0.10.0",
    healthBarDecoration: "./wet_status.png",
    init() {
        return {
            lastParticleTick: 0,
            nextParticleSpawn: 0
        };
    },
    update(target, afflictionTime, lastUpdate, prototype, state) {
        if (gamespace.currentUpdate - state.lastParticleTick >= state.nextParticleSpawn) {
            state.nextParticleSpawn = srvsdbx_Math.bounds_random(300, 400);
            state.lastParticleTick = gamespace.currentUpdate;

            gamespace.prototypes.particles.get("srvsdbx::wetEffect")
                .create(
                    srvsdbx_Geometry.Vector2D.fromPoint2D(target.position)
                        .plus({ direction: srvsdbx_Math.randomAngle(), magnitude: Math.random() * 75 }),
                    0
                );
        }

        target.modifiers.ergonomics.set("srvsdbx::wet", 1 / 0.7);
        target.modifiers.speedMultipliers.set("srvsdbx::wet", 0.7);
    },
    tearDown(target) {
        target.modifiers.ergonomics.delete("srvsdbx::wet");
        target.modifiers.speedMultipliers.delete("srvsdbx::wet");
    },
    lifetime: 3000
} satisfies ExportInterface<SimpleStatusEffect<WetInfoMap>>;