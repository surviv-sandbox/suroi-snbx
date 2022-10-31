// @ts-check
/**
 * @type {ammoData}
 */
export default {
    name: "FRAG-12",
    targetVersion: "0.9.0",
    tints: {
        normal: "#CB0000",
        saturated: () => gamespace.settings.bonusFeatures.useInterpolatedSaturatedTracers ? "#E50000" : "#CB000",
        chambered: "#FF0000"
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
        type: "explosive",
        explosionType: "explosion_usas",
        img: "../shared/tracer.png",
        heightPeak: 0,
        explodeOnContact: true,
        maxDist: 24
    },
    casing: {
        img: "../shared/shell-12gauge.svg",
        lifetime: () => +meanDevPM_random(500, 250, false),
        width: 10.5,
        height: 30
    }
};