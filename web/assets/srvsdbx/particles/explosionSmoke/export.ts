export default {
    name: "explosionSmoke",
    targetVersion: "0.10.0",
    images: ["./part-smoke-01.svg"],
    lifetime: srvsdbx_Math.bounds_random(2000, 3000),
    drag: 1,
    angularVelocity: () => srvsdbx_Math.toRad(srvsdbx_Math.bounds_random(0.125, 0.25), "turns"),
    baseSize: {
        width: 2.5,
        height: "auto"
    },
    scale: {
        start: () => srvsdbx_Math.bounds_random(1, 12 / 7),
        end: () => srvsdbx_Math.bounds_random(5 / 7, 10 / 7)
    },
    alpha: {
        start: 0.9,
        end: 0,
        interp: srvsdbx_Animation.easingFunctions.easeInExpo
    },
    tint: () => `hsl(0, 0%, ${srvsdbx_Math.bounds_random(60, 65)}%)`
} satisfies ExportInterface<SimpleParticle>;