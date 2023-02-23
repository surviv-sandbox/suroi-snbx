type FrenemtInfoMap = {
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
    name: "frenemy",
    targetVersion: "0.10.0",
    init() {
        return {
            lastParticleTick: 0,
            nextParticleSpawn: 0
        };
    },
    update(target, afflictionTime, lastUpdate, prototype, state) {
        target.modifiers.damage.set("frenemy", 0.7);
        // Since this effect doesn't stack, it's fine to use the same key

        if (gamespace.currentUpdate - state.lastParticleTick >= state.nextParticleSpawn) {
            state.nextParticleSpawn = srvsdbx_Math.meanDevPM_random(300, 150, true);
            state.lastParticleTick = gamespace.currentUpdate;

            new Particle(
                gamespace.prototypes.particles.get("srvsdbx::frenemy")!,
                srvsdbx_Geometry.Vector2D.fromPoint2D(target.position)
                    .plus({ direction: srvsdbx_Math.randomAngle(), magnitude: Math.random() * 30 + 30 }),
                0
            );
        }
    },
    tearDown() { },
    lifetime: 20 * 1000
} satisfies ExportInterface<SimpleStatusEffect<FrenemtInfoMap>>;