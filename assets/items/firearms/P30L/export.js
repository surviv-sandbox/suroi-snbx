//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "P30L",
    targetVersion: "0.8.0",
    summary: {
        class: "semi_pistol_move",
        engagementDistance: {
            min: 4,
            max: 50
        },
        shouldNoslow: false,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "assets/items/firearms/P30L/loot-weapon-p30l.svg",
        held: "assets/items/firearms/P30L/p30l.png",
        silhouette: "assets/items/firearms/P30L/p30l-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 21,
        velocity: 94,
        range: 100,
        tracer: {
            width: 0.2,
            height: 10
        },
        hitboxLength: 2,
        obstacleMult: 1,
        headshotMult: 2,
        fsa: {
            enabled: false,
            rechargeTime: toMS({ givenIn: "s", value: 1e10 })
        },
        falloff: 0.75,
        projectiles: 1
    },
    suppressed: false,
    caliber: "9x19mm",
    firingDelay: toMS({ givenIn: "ms", value: 140 }),
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 2 }),
        moving: toRad({ givenIn: "degrees", value: 1 })
    },
    moveSpeedPenalties: {
        active: 1,
        firing: 1
    },
    imageOffset: {
        perp: 0,
        parr: 1.45
    },
    dimensions: {
        width: 111 / 256,
        height: 24309 / 13568,
        layer: 0
    },
    reload: {
        duration: toMS({ givenIn: "s", value: 1.2 }),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 15,
        firepower: 30
    },
    switchDelay: toMS({ givenIn: "ms", value: 250 }),
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
            parr: 0.08
        },
        duration: toMS({ givenIn: "ms", value: 90 })
    },
    possibleFireModes: [
        "semi"
    ]
};