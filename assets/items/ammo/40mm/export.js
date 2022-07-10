// @ts-check
/**
 * @type {ammoData[]}
 */
export default [
    {
        name: "40mm",
        targetVersion: "0.8.0",
        tints: {
            normal: "#FFFFFF",
            saturated: "#FFFFFF",
            chambered: "#FFFFFF"
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
            explosionType: "explosion_frag",
            img: "assets/items/ammo/40mm/40mm.png",
            spinVel: () => gamespace.settings.balanceChanges.weapons.m79.grenadeSpin ? toRad({ givenIn: "turns", value: 2.5 }) : 0,
            heightPeak: 5,
            explodeOnContact: true,
            maxDist: 18
        },
        casing: {
            img: "assets/items/ammo/40mm/shell-40mm.png",
            lifetime: () => +meanDevPM_random(500, 250, false),
            width: 490 / 33,
            height: 20
        }
    }
];