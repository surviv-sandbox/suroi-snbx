// @ts-check
/**
 * @type {ammoData}
 */
export default {
    name: "40mm",
    targetVersion: "0.9.0",
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
        img: "../shared/40mm.png",
        spinVel: () => gamespace.settings.balanceChanges.weapons.m79.grenadeSpin ? toRad({ givenIn: "turns", value: 2.5 }) : 0,
        heightPeak: 5,
        explodeOnContact: true,
        maxDist: 18
    },
    casing: {
        img: "../shared/shell-40mm.svg",
        lifetime: () => +meanDevPM_random(500, 250, false),
        width: 490 / 33,
        height: 20
    }
};