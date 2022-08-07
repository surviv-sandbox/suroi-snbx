// @ts-check
/**
 * @type {ammoData[]}
 */
export default [
    {
        name: ".308 Subsonic",
        targetVersion: "0.8.1",
        tints: {
            normal: "#252B00",
            saturated: "#465000",
            chambered: "#131600"
        },
        alpha: {
            rate: 0.92,
            min: 0.07,
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
            img: "./shell-308.svg",
            lifetime: () => +meanDevPM_random(500, 250, false),
            width: 15,
            height: 1300 / 21
        }
    }
];