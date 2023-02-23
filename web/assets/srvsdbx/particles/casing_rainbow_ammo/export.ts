export default {
    name: "casing_rainbow_ammo",
    targetVersion: "0.10.0",
    images: [
        "./part-rainbow-1.svg",
        "./part-rainbow-2.svg",
        "./part-rainbow-3.svg",
        "./part-rainbow-4.svg",
        "./part-rainbow-5.svg",
        "./part-rainbow-6.svg",
    ],
    lifetime: () => srvsdbx_Math.meanDevPM_random(750, 250, false),
    drag: () => srvsdbx_Math.meanDevPM_random(1, 1, false),
    rotVel: srvsdbx_Math.toRad(1.5, "turns"),
    baseSize: {
        width: "auto",
        height: 0.4
    },
    scale: {
        start: 1,
        end: 2 / 9
    },
    alpha: {
        start: 0.95,
        end: 0.875
    },
    tint: "#FFFFFF"
} satisfies ExportInterface<SimpleParticle>;