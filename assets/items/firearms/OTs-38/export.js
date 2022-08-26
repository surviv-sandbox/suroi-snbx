//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "OTs-38",
    targetVersion: "0.8.2",
    summary: {
        class: "semi_pistol",
        engagementDistance: {
            min: 10,
            max: 40
        },
        shouldNoslow: false,
        role: "secondary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-ots38.svg",
        held: "./ots38.png",
        silhouette: "./ots38-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 32,
        velocity: 115,
        range: 135,
        tracer: {
            width: 0.15,
            height: 10
        },
        hitboxLength: 4,
        obstacleMult: 1,
        headshotMult: 2,
        fsa: {
            enabled: false,
            rechargeTime: 10000000000000
        },
        falloff: 0.77,
        projectiles: 1
    },
    suppressed: true,
    caliber: "7.62x41mm",
    firingDelay: 360,
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 1.2 }),
        moving: toRad({ givenIn: "degrees", value: 2.4 })
    },
    moveSpeedPenalties: {
        active: 0,
        firing: 0
    },
    imageOffset: {
        perp: 0,
        parr: 1.4
    },
    dimensions: {
        width: 0.4661458333333333,
        height: 1.5,
        layer: 0
    },
    reload: {
        duration: 2000,
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 5,
        firepower: 5
    },
    switchDelay: 300,
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
            parr: 0.2
        },
        velocity: {
            perp: () => +meanDevPM_random(0, -6, true),
            parr: () => +meanDevPM_random(-4, 2, true),
            angular: () => +meanDevPM_random(0, toRad({ givenIn: "turns", value: 3 }), true)
        },
        spawnOn: "reload",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.08
        },
        duration: 70
    },
    possibleFireModes: ["semi"],
};