export default {
    name: ".45ACP",
    targetVersion: "0.10.0",
    tints: {
        normal: "#ECBEFF",
        saturated: "#E7ACFF",
        chambered: "#B500FF"
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
        images: ["./tracer.svg"]
    },
    casing: "srvsdbx::casing_45acp"
};
//# sourceMappingURL=export.js.map