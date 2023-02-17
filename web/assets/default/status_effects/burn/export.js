export default {
    name: "burn",
    targetVersion: "0.10.0",
    init() {
        return {
            lastDamageTick: 0,
            lastParticleTick: 0,
            nextParticleSpawn: 0
        };
    },
    update(target, afflictionTime, lastUpdate, prototype, state) {
        if (gamespace.currentUpdate - state.lastDamageTick >= 500) {
            state.lastDamageTick = gamespace.currentUpdate;
            target.applyDamage(4);
        }
        if (gamespace.currentUpdate - state.lastParticleTick >= state.nextParticleSpawn) {
            state.nextParticleSpawn = srvsdbx_Math.bounds_random(300, 100);
            state.lastParticleTick = gamespace.currentUpdate;
            new Particle(gamespace.prototypes.particles.get("srvsdbx::fire_effect"), srvsdbx_Geometry.Vector2D.fromPoint2D(target.position)
                .plus({ direction: srvsdbx_Math.randomAngle(), magnitude: Math.random() * 30 + 30 }), 0);
        }
    },
    lifetime: 5000
};
//# sourceMappingURL=export.js.map