// @ts-check
/**
 * @type {ammoData[]}
 */
export default [
    {
        name: ".45ACP",
        targetVersion: "0.8.1",
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
            img: "../9mm/shell-9mm.png",
            lifetime: () => +meanDevPM_random(500, 250, false),
            width: 185 / 22,
            height: 20
        }
    }
];