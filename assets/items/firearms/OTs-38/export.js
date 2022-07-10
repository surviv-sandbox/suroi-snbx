//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "OTs-38",
    targetVersion: "0.8.0",
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
        loot: "assets/items/firearms/OTs-38/loot-weapon-ots38.svg",
        held: "assets/items/firearms/OTs-38/ots38.png",
        silhouette: "assets/items/firearms/OTs-38/ots38-silhouette.png"
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
            rechargeTime: toMS({ givenIn: "s", value: 1e10 })
        },
        falloff: 0.77,
        projectiles: 1
    },
    suppressed: true,
    caliber: "7.62x41mm",
    firingDelay: toMS({ givenIn: "ms", value: 360 }),
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
        width: 179 / 384,
        height: 1.5,
        layer: 0
    },
    reload: {
        duration: toMS({ givenIn: "s", value: 2 }),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 5,
        firepower: 5
    },
    switchDelay: toMS({ givenIn: "ms", value: 300 }),
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        }
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
        duration: toMS({ givenIn: "ms", value: 70 })
    },
    possibleFireModes: [
        "semi"
    ]
};