export default {
    name: "casing_water",
    targetVersion: "0.10.0",
    images: ["./map-beach-wet-particle-01.svg", "./map-beach-wet-particle-02.svg", "./map-beach-wet-particle-03.svg"],
    lifetime: () => srvsdbx_Math.bounds_random(750, 250),
    drag: () => srvsdbx_Math.bounds_random(1.5, 2.5),
    rotVel: srvsdbx_Math.toRad(1.25, "turns"),
    baseSize: {
        width: "auto",
        height: 2
    },
    scale: {
        start: () => srvsdbx_Math.bounds_random(0.23, 0.33),
        end: 0.045
    },
    alpha: {
        start: 0.95,
        end: 0.875
    },
    tint: () => `hsl(0, 0%, ${srvsdbx_Math.bounds_random(90, 95)}%)`
} satisfies ExportInterface<SimpleParticle>;