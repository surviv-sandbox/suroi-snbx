//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "AWM-S",
    targetVersion: "0.8.2",
    summary: {
        class: "sniper_rifle",
        engagementDistance: {
            min: 10,
            max: 130
        },
        shouldNoslow: true,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-awc.svg",
        held: "./awc.svg",
        silhouette: "./awc-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 180,
        velocity: 136,
        range: 300,
        tracer: {
            width: 0.25,
            height: 22.22222222222222
        },
        hitboxLength: 8,
        obstacleMult: 1.5,
        headshotMult: 1,
        fsa: {
            enabled: false,
            rechargeTime: 10000000000000
        },
        falloff: 0.94,
        projectiles: 1
    },
    suppressed: true,
    caliber: ".308 Subsonic",
    firingDelay: 1500,
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 4 }),
        moving: toRad({ givenIn: "degrees", value: 0.5 })
    },
    moveSpeedPenalties: {
        active: 0,
        firing: 0
    },
    imageOffset: {
        perp: 0,
        parr: 2.25
    },
    dimensions: {
        width: 0.6744234254473174,
        height: 3.55,
        layer: 0
    },
    reload: {
        duration: 3600,
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 5,
        firepower: 7
    },
    switchDelay: 1000,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.325,
            parr: 2.4
        }
    },
    projectileSpawnOffset: {
        perp: 0,
        parr: 2
    },
    casings: {
        spawnOffset: {
            perp: 0,
            parr: 0.8
        },
        velocity: {
            perp: () => +meanDevPM_random(-4, 3.2, true),
            parr: () => +meanDevPM_random(-1, 0.6, true),
            angular: () => +meanDevPM_random(toRad({ givenIn: "turns", value: 1.7 }), toRad({ givenIn: "turns", value: 1 }), true)
        },
        spawnOn: "fire",
        spawnDelay: 1400
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.25
        },
        duration: 150
    },
    possibleFireModes: ["semi"],
};