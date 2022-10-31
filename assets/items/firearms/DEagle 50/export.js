//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "DEagle 50",
    targetVersion: "0.9.0",
    summary: {
        class: "semi_pistol",
        engagementDistance: {
            min: 6,
            max: 80
        },
        shouldNoslow: false,
        role: "secondary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-deagle.svg",
        held: "./deagle.svg",
        silhouette: "./deagle-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 35,
        velocity: 115,
        range: 120,
        tracer: {
            width: 0.2,
            height: 10
        },
        hitboxLength: 2,
        obstacleMult: 1,
        headshotMult: 2,
        fsa: {
            enabled: true,
            rechargeTime: 500
        },
        falloff: 0.75,
        projectiles: 1
    },
    suppressed: false,
    caliber: ".50AE",
    firingDelay: 160,
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 2.5 }),
        moving: toRad({ givenIn: "degrees", value: 6 })
    },
    moveSpeedPenalties: {
        active: 0,
        firing: 0
    },
    imageOffset: {
        perp: 0,
        parr: 1.5
    },
    dimensions: {
        width: "auto",
        height: 2.15,
        layer: 0
    },
    reload: {
        duration: 2300,
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 7,
        firepower: 9
    },
    switchDelay: 350,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
    },
    projectileSpawnOffset: {
        perp: 0,
        parr: 0
    },
    casings: {
        spawnOffset: {
            perp: 0,
            parr: 0.4
        },
        velocity: {
            perp: () => +meanDevPM_random(-2, 0.8, true),
            parr: () => +meanDevPM_random(0, 0.8, true),
            angular: () => +meanDevPM_random(toRad({ givenIn: "turns", value: 1 }), toRad({ givenIn: "turns", value: 0.6 }), true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.12
        },
        duration: 110
    },
    possibleFireModes: ["semi"],
};