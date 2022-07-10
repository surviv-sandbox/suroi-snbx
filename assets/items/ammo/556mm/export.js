// @ts-check
/**
 * @type {ammoData[]}
 */
export default [
    {
        name: "5.56x45mm",
        targetVersion: "0.8.0",
        tints: {
            normal: "#A9FF92",
            saturated: () => gamespace.settings.bonusFeatures.useInterpolatedSaturatedTracers ? "#7EFF5C" : "#A9FF92",
            chambered: "#36FF00"
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
            img: "assets/items/ammo/shared/tracer.png"
        },
        casing: {
            img: "assets/items/ammo/556mm/shell-556mm.png",
            lifetime: () => +meanDevPM_random(750, 250, false),
            width: 6762 / 437,
            height: 46
        }
    }
];