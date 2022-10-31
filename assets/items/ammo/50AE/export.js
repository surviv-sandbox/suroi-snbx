//@ts-check
/**
 * @type {ammoData}
 */

export default {
    name: ".50AE",
    targetVersion: "0.9.0",
    tints: {
        normal: "#FFF088",
        saturated: () => gamespace.settings.bonusFeatures.useInterpolatedSaturatedTracers ? "#FFEC66" : "#FFF800",
        chambered: "#FFDF00"
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
        width: 8.409090909090908,
        height: 20
    }
};