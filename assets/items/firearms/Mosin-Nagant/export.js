//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "Mosin-Nagant",
    targetVersion: "0.8.1",
    summary: {
        class: "sniper_rifle",
        engagementDistance: {
            min: 15,
            max: 100
        },
        shouldNoslow: true,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-mosin.svg",
        held: "../shared/gun-long.png",
        silhouette: "./mosin-silhouette.png"
    },
    tint: "#331A00",
    ballistics: {
        damage: 72,
        velocity: 178,
        range: 500,
        tracer: {
            width: 0.32,
            height: 200 / 9
        },
        hitboxLength: 8,
        obstacleMult: 1.5,
        headshotMult: 1.5,
        fsa: {
            enabled: false,
            rechargeTime: toMS({ givenIn: "s", value: 1e10 })
        },
        falloff: 0.95,
        projectiles: 1
    },
    suppressed: false,
    caliber: "7.62x54mmR",
    firingDelay: toMS({ givenIn: "s", value: 1.75 }),
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 1 }),
        moving: toRad({ givenIn: "degrees", value: 4 })
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
        width: 0.45,
        height: 4.1,
        layer: 0
    },
    reload: {
        duration: toMS({ givenIn: "ms", value: 900 }),
        ammoReloaded: 1,
        chain: true
    },
    altReload: {
        duration: toMS({ givenIn: "s", value: 3 }),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 5,
        firepower: 5
    },
    switchDelay: toMS({ givenIn: "s", value: 1 }),
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.325,
            parr: 1.875
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
            perp: () => +meanDevPM_random(-4, 3.6, true),
            parr: () => +meanDevPM_random(-1, 0.6, true),
            angular: () => +meanDevPM_random(toRad({ givenIn: "turns", value: 1.5 }), toRad({ givenIn: "turns", value: 1.5 }), false)
        },
        spawnOn: "fire",
        spawnDelay: toMS({ givenIn: "s", value: 1 })
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.2
        },
        duration: toMS({ givenIn: "ms", value: 100 })
    },
    possibleFireModes: [
        "semi"
    ]
}; 