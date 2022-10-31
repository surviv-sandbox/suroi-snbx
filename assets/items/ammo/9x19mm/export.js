// @ts-check
/**
 * @type {ammoData}
 */
export default {
    name: "9x19mm",
    targetVersion: "0.9.0",
    tints: {
        normal: "#FEDCDC",
        saturated: () => gamespace.settings.bonusFeatures.useInterpolatedSaturatedTracers ? "#FEBEAD" : "#FEDCDC",
        chambered: "#FF8000"
    },
    alpha: {
        rate: 0.92,
        min: 0.14,
        max: 1
    },
    spawnVar: 0,
    imageOffset: {
        parr: 0,
        perp: 0
    },
    projectileInfo: {
        type: "bullet",
        img: "../shared/tracer.png"
    },
    casing: {
        img: "../shared/shell-9mm.svg",
        lifetime: () => +meanDevPM_random(500, 250, false),
        width: 185 / 22,
        height: 20
    }
};