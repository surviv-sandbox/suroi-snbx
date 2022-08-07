//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "PKP Pecheneg",
    targetVersion: "0.8.1",
    summary: {
        class: "lmg",
        engagementDistance: {
            min: 10,
            max: 80
        },
        shouldNoslow: false,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-pkp.svg",
        held: "./pkp.png",
        silhouette: "./pkp-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 18,
        velocity: 120,
        range: 200,
        tracer: {
            width: 0.15,
            height: 20
        },
        hitboxLength: 4,
        obstacleMult: 1,
        headshotMult: 2,
        fsa: {
            enabled: false,
            rechargeTime: toMS({ givenIn: "s", value: 1e10 })
        },
        falloff: 0.9,
        projectiles: 1
    },
    suppressed: false,
    caliber: "7.62x54mmR",
    firingDelay: toMS({ givenIn: "RPM", value: 600 }),
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 2.5 }),
        moving: toRad({ givenIn: "degrees", value: 7.5 })
    },
    moveSpeedPenalties: {
        active: 0,
        firing: -5
    },
    imageOffset: {
        perp: 0,
        parr: 1.9
    },
    dimensions: {
        width: 1221 / 1080,
        height: 3,
        layer: 0
    },
    reload: {
        duration: toMS({ givenIn: "s", value: 5 }),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 200,
        firepower: 250
    },
    switchDelay: toMS({ givenIn: "ms", value: 750 }),
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.3,
            parr: 2.2
        }
    },
    projectileSpawnOffset: {
        perp: 0,
        parr: 0
    },
    casings: {
        spawnOffset: {
            perp: 0,
            parr: 0.8
        },
        velocity: {
            perp: () => +meanDevPM_random(4.4, 3.1, true),
            parr: () => +meanDevPM_random(-1, 1, true),
            angular: () => +meanDevPM_random(toRad({ givenIn: "turns", value: -1.5 }), toRad({ givenIn: "turns", value: -1.5 }), false)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.1
        },
        duration: toMS({ givenIn: "ms", value: 90 })
    },
    possibleFireModes: [
        "automatic"
    ]
};