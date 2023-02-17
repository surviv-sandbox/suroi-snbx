export default {
    name: "water_balloon_impact",
    targetVersion: "0.10.0",
    images: ["./map-beach-wet-particle-01.svg", "./map-beach-wet-particle-02.svg", "./map-beach-wet-particle-03.svg"],
    lifetime: () => srvsdbx_Math.bounds_random(500, 1000),
    drag: 1,
    rotVel: () => srvsdbx_Math.toRad(srvsdbx_Math.bounds_random(0.125, 0.25), "turns"),
    baseSize: {
        width: "auto",
        height: 1
    },
    scale: {
        start: () => srvsdbx_Math.bounds_random(0.33, 0.43),
        end: () => srvsdbx_Math.bounds_random(0.07, 0.14)
    },
    alpha: {
        start: 1,
        end: 0.9
    },
    tint: "#03576C8"
} satisfies ExportInterface<SimpleParticle>;