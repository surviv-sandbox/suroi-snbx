//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "M134",
    targetVersion: "0.8.0",
    summary: {
        class: "lmg",
        engagementDistance: {
            min: 20,
            max: 110
        },
        shouldNoslow: false,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "assets/items/firearms/M134/loot-weapon-m134.svg",
        held: "assets/items/firearms/M134/m134.svg",
        silhouette: "assets/items/firearms/M134/m134-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 10,
        velocity: 130,
        range: 200,
        tracer: {
            width: 0.15,
            height: 30
        },
        hitboxLength: 4,
        obstacleMult: 5,
        headshotMult: 1.5,
        fsa: {
            enabled: false,
            rechargeTime: toMS({ givenIn: "s", value: 1e10 })
        },
        falloff: 0.5,
        projectiles: 1
    },
    suppressed: false,
    caliber: "7.62x51mm",
    firingDelay: toMS({ givenIn: "ms", value: 55 }),
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 1 }),
        moving: toRad({ givenIn: "degrees", value: 1 })
    },
    moveSpeedPenalties: {
        active: -3,
        firing: -6
    },
    imageOffset: {
        perp: 0.1,
        parr: 3
    },
    dimensions: {
        width: 20 / 11,
        height: 5,
        layer: 0
    },
    reload: {
        duration: toMS({ givenIn: "s", value: 8 }),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 200,
        firepower: 250
    },
    switchDelay: toMS({ givenIn: "ms", value: 900 }),
    handPositions: {
        leftHand: {
            perp: 0.35,
            parr: 0.85
        },
        rightHand: {
            perp: 0,
            parr: 3
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
            perp: () => +meanDevPM_random(4.8, 3.36, true),
            parr: () => +meanDevPM_random(-1.4, 0.84, true),
            angular: () => +meanDevPM_random(toRad({ givenIn: "turns", value: -2 }), toRad({ givenIn: "turns", value: 1.2 }), true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.1
        },
        duration: toMS({ givenIn: "ms", value: 170 })
    },
    possibleFireModes: [
        "automatic"
    ]
};