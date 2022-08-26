// @ts-check
/**
 * @type {ammoData}
 */
export default {
    name: "7.62x51mm",
    targetVersion: "0.8.3",
    tints: {
        normal: "#C5D6FE",
        saturated: "#ABC4FF",
        chambered: "#004CFF"
    },
    alpha: {
        rate: 0.94,
        min: 0.2,
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
        img: "./shell-762mm.png",
        lifetime: () => +meanDevPM_random(750, 250, false),
        width: 2240 / 169,
        height: 40
    }
};