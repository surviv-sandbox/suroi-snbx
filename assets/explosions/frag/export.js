// @ts-check
/**
 * @type {explosionData}
 */
export default {
    name: "explosion_frag",
    targetVersion: "0.8.1",
    damage: 125,
    obstacleMult: 1.1,
    radii: {
        visual: {
            min: 2.5,
            max: 6.5
        },
        damage: {
            min: 5,
            max: 12
        }
    },
    lifetime: 500,
    shakeStrength: 0.2,
    shakeDuration: 350,
    color: [130, 37, 0],
    decal: {
        img: "../../decals/map-barrel-res-01.svg",
        width: 4,
        height: 4,
        tint: "#000000CC"
    },
    shrapnel: {
        count: 12,
        damage: 20,
        color: "#333",
        img: "../../items/ammo/shared/tracer.png",
        velocity: 20,
        range: () => +meanDevPM_random(8, 12, false),
        falloff: 1,
        tracer: {
            width: 0.25,
            height: 10
        }
    }
};