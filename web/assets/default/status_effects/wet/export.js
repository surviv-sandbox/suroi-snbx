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
            new Particle(gamespace.prototypes.particles.get("srvsdbx::wet_effect"), srvsdbx_Geometry.Vector2D.fromPoint2D(target.position)
                .plus({ direction: srvsdbx_Math.randomAngle(), magnitude: Math.random() * 75 }), 0);
        }
        target.modifiers.ergonomics.set("wet", 1 / 0.7);
        target.modifiers.speed.set("wet", 0.7);
    },
    lifetime: 3000
};
//# sourceMappingURL=export.js.map