export default {
    name: "explosion_frag",
    targetVersion: "0.10.0",
    damage: 125,
    obstacleMult: 1.1,
    radii: {
        min: 5,
        max: 12
    },
    particle: "srvsdbx::explosionBurst",
    shakeStrength: 0.2,
    shakeDuration: 350,
    decal: "srvsdbx::decal_frag_explosion",
    shrapnel: {
        count: 10,
        damage: 20,
        velocity: 20,
        range: () => srvsdbx_Math.meanDevPM_random(8, 12, false),
        falloff: 1,
        tracer: {
            image: "./tracer.svg",
            color: "#333",
            width: 0.25,
            height: 10
        }
    }
};
//# sourceMappingURL=export.js.map