// @ts-check
/**
 * @type {ammoData[]}
 */
export default [
    {
        name: "12 gauge (buckshot)",
        targetVersion: "0.8.0",
        tints: {
            normal: "#FEDCDC",
            saturated: () => gamespace.settings.bonusFeatures.useInterpolatedSaturatedTracers ? "#FEC0C1" : "#FEDCDC",
            chambered: "#FF0000"
        },
        alpha: {
            rate: 0.92,
            min: 0.14,
            max: 1
        },
        spawnVar: () => gamespace.settings.balanceChanges.weapons.general.noBuckshotSpawnVar ? 0 : +meanDevPM_random(0, 50, true),
        imageOffset: {
            parr: 0,
            perp: 0
        },
        projectileInfo: {
            type: "bullet",
            img: "assets/items/ammo/shared/tracer.png"
        },
        casing: {
            img: "assets/items/ammo/12 gauge/shell-12gauge.png",
            lifetime: () => +meanDevPM_random(500, 250, false),
            width: 10.5,
            height: 30
        }
    },
    {
        name: "FRAG-12",
        targetVersion: "0.8.0",
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
            img: "assets/items/ammo/shared/tracer.png",
            heightPeak: 0,
            explodeOnContact: true,
            maxDist: 24
        },
        casing: {
            img: "assets/items/ammo/12 gauge/shell-12gauge.png",
            lifetime: () => +meanDevPM_random(500, 250, false),
            width: 10.5,
            height: 30
        }
    }
];