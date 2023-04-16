export default {
    name: "inspire",
    targetVersion: "0.10.0",
    images: ["./part-note-01.svg"],
    lifetime: () => srvsdbx_Math.toMS(srvsdbx_Math.bounds_random(4, 5), "s"),
    drag: 1,
    angularVelocity: () => srvsdbx_Math.toRad(srvsdbx_Math.bounds_random(0.125, 0.25), "turns"),
    baseSize: {
        width: 1.2,
        height: "auto"
    },
    scale: {
        start: () => srvsdbx_Math.bounds_random(0.6, 0.7),
        end: () => srvsdbx_Math.bounds_random(0.3, 0.4)
    },
    alpha: part => {
        const dt = (gamespace.currentUpdate - part.created) / part.lifetime;

        if (dt < 0.2) return srvsdbx_Animation.easingFunctions.easeOutCubic(0, 1, dt / 0.2);
        if (dt > 0.5) return srvsdbx_Animation.easingFunctions.easeInCubic(1, 0, (dt - 0.5) / 0.5);
        return 1;
    },
    tint: () => `hsl(47, 100%, ${srvsdbx_Math.bounds_random(48, 50)}%)`
} satisfies ExportInterface<SimpleParticle>;