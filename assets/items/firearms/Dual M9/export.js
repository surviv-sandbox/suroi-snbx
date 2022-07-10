//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "Dual M9",
    targetVersion: "0.8.0",
    summary: {
        class: "dual_semi_pistol",
        engagementDistance: {
            min: 5,
            max: 20
        },
        shouldNoslow: false,
        role: "secondary"
    },
    dual: true,
    images: {
        loot: "assets/items/firearms/Dual M9/loot-weapon-m9-dual.svg",
        held: "assets/items/firearms/shared/gun-short.png",
        silhouette: "assets/items/firearms/Dual M9/m9-dual-silhouette.png"
    },
    tint: "#1E1E1E",
    ballistics: {
        damage: 12,
        velocity: 85,
        range: 100,
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
    caliber: "9x19mm",
    firingDelay: toMS({ givenIn: "RPM", value: 750 }),
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 11 }),
        moving: toRad({ givenIn: "degrees", value: 9 })
    },
    moveSpeedPenalties: {
        active: 0,
        firing: 0
    },
    imageOffset: {
        perp: 0.525,
        parr: 1.35
    },
    dimensions: {
        width: 111 / 256,
        height: 1.5,
        layer: 0
    },
    reload: {
        duration: toMS({ givenIn: "s", value: 3.1 }),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 30,
        firepower: 40
    },
    switchDelay: toMS({ givenIn: "ms", value: 250 }),
    handPositions: {
        leftHand: {
            perp: 0.525,
            parr: 0.95
        },
        rightHand: {
            perp: -0.525,
            parr: 0.95
        }
    },
    projectileSpawnOffset: {
        perp: 0.525,
        parr: 0
    },
    casings: {
        spawnOffset: {
            perp: 0.525,
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
            parr: 0.08
        },
        duration: toMS({ givenIn: "ms", value: 90 })
    },
    possibleFireModes: [
        "semi"
    ]
};