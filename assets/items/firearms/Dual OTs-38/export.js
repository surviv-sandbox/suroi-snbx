//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "Dual OTs-38",
    targetVersion: "0.8.0",
    summary: {
        class: "semi_pistol",
        engagementDistance: {
            min: 5,
            max: 80
        },
        shouldNoslow: false,
        role: "secondary"
    },
    dual: true,
    images: {
        loot: "assets/items/firearms/Dual OTs-38/loot-weapon-ots38-dual.svg",
        held: "assets/items/firearms/OTs-38/ots38.png",
        silhouette: "assets/items/firearms/Dual OTs-38/ots38-dual-silhouette.png"
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
        hitboxLength: 2,
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
    firingDelay: toMS({ givenIn: "ms", value: 180 }),
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 1.4 }),
        moving: toRad({ givenIn: "degrees", value: 2.8 })
    },
    moveSpeedPenalties: {
        active: 0,
        firing: 0
    },
    imageOffset: {
        perp: 0.525,
        parr: 1.4
    },
    dimensions: {
        width: 179 / 384,
        height: 1.5,
        layer: 0
    },
    reload: {
        duration: toMS({ givenIn: "s", value: 3.8 }),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 10,
        firepower: 10
    },
    switchDelay: toMS({ givenIn: "ms", value: 300 }),
    handPositions: {
        leftHand: {
            perp: 0.525,
            parr: 0.85
        },
        rightHand: {
            perp: -0.525,
            parr: 0.85
        }
    },
    projectileSpawnOffset: {
        perp: 0.525,
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