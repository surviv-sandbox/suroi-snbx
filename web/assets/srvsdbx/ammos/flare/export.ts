const peak = 3;

export default {
    name: "flare",
    targetVersion: "0.10.0",
    tints: {
        normal: "#FF540080",
        saturated: "#FF540080",
        chambered: "#FF540080"
    },
    alpha: {
        rate: 0.92,
        min: 0.14,
        max: 1
    },
    imageOffset: {
        parr: 0,
        perp: 0
    },
    projectileInfo: {
        type: "bullet",
        images: ["./part-flare-01.svg"],
        scale(t) {
            return srvsdbx_Animation.easingFunctions.easeOutExpo(1, 6, t);
        },
        alpha(t) {
            return srvsdbx_Animation.easingFunctions.easeInExpo(0.75, 0, t ** 2);
        },
    },
    casing: "srvsdbx::casing12gauge"
} satisfies ExportInterface<SimpleAmmo>;