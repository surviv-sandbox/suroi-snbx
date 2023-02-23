type InspireInfoMap = {
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
    name: "inspire",
    targetVersion: "0.10.0",
    init() {
        return {
            lastParticleTick: 0,
            nextParticleSpawn: 0
        };
    },
    update(target, afflictionTime, lastUpdate, prototype, state) {
        if (gamespace.currentUpdate - state.lastParticleTick >= state.nextParticleSpawn) {
            state.nextParticleSpawn = srvsdbx_Math.bounds_random(300, 350);
            state.lastParticleTick = gamespace.currentUpdate;

            new Particle(
                gamespace.prototypes.particles.get("srvsdbx::inspire")!,
                srvsdbx_Geometry.Vector2D.fromPoint2D(target.position)
                    .plus({ direction: srvsdbx_Math.randomAngle(), magnitude: Math.random() * 75 }),
                0
            ).velocityMap.set("intrinsic", {
                x: 0,
                y: -srvsdbx_Math.bounds_random(0.05, 0.075),
                z: 0
            });
        }

        target.modifiers.speedAdd.set("inspire", 4.8);
    },
    tearDown(target) {
        target.modifiers.speedAdd.delete("inspire");
    },
    lifetime: 3000
} satisfies ExportInterface<SimpleStatusEffect<InspireInfoMap>>;