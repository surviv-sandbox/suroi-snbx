// @ts-check
/**
 * @type {explosionData}
 */
export default {
    name: "explosion_usas",
    targetVersion: "0.8.0",
    damage: 42,
    obstacleMult: 4,
    radii: {
        visual: {
            min: 2.5,
            max: 6.5
        },
        damage: {
            min: 3.5,
            max: 6.5
        }
    },
    lifetime: 500,
    shakeStrength: 0.12,
    shakeDuration: 250,
    color: [130, 37, 0],
    decal: {
        img: "assets/decals/map-barrel-res-01.svg",
        width: 4,
        height: 4,
        tint: "#000000CC"
    },
    shrapnel: {
        count: 9,
        damage: 5,
        color: "#333",
        img: "assets/items/ammo/shared/tracer.png",
        velocity: 20,
        range: () => +meanDevPM_random(5, 6, false),
        falloff: 1,
        tracer: {
            width: 0.25,
            height: 10
        }
    }
};