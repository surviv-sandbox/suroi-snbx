export default {
    name: "explosionHeart",
    targetVersion: "0.10.0",
    images: ["./part-frag-burst-01.svg"],
    lifetime: 500,
    drag: 1,
    angularVelocity: 0,
    baseSize: {
        width: 2.5,
        height: "auto"
    },
    scale: {
        start: 1,
        end: 4
    },
    alpha: {
        start: 0.75,
        end: 0
    },
    tint: "#FD6BA5"
} satisfies ExportInterface<SimpleParticle>;