//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "M1911",
    targetVersion: "0.8.0",
    summary: {
        class: "semi_pistol",
        engagementDistance: {
            min: 4,
            max: 30
        },
        shouldNoslow: false,
        role: "secondary"
    },
    dual: false,
    images: {
        loot: "assets/items/firearms/M1911/loot-weapon-m1911.svg",
        held: "assets/items/firearms/shared/gun-short.png",
        silhouette: "assets/items/firearms/M1911/m1911-silhouette.png"
    },
    tint: "#929292",
    ballistics: {
        damage: 14,
        velocity: 80,
        range: 88,
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
        falloff: 0.7,
        projectiles: 1
    },
    suppressed: false,
    caliber: ".45ACP",
    firingDelay: toMS({ givenIn: "ms", value: 100 }),
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 6 }),
        moving: toRad({ givenIn: "degrees", value: 7 })
    },
    moveSpeedPenalties: {
        active: 0,
        firing: 0
    },
    imageOffset: {
        perp: 0,
        parr: 1.35
    },
    dimensions: {
        width: 111 / 256,
        height: 1.5,
        layer: 0
    },
    reload: {
        duration: toMS({ givenIn: "s", value: 2.1 }),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 7,
        firepower: 12
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
            angular: () => +meanDevPM_random(toRad({ givenIn: "turns", value: 2 }), toRad({ givenIn: "turns", value: 2 }), false)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.09
        },
        duration: toMS({ givenIn: "ms", value: 80 })
    },
    possibleFireModes: [
        "semi"
    ]
};