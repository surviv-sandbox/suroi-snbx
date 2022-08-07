//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "Dual M1911",
    targetVersion: "0.8.1",
    summary: {
        class: "semi_pistol",
        engagementDistance: {
            min: 5,
            max: 20
        },
        shouldNoslow: false,
        role: "secondary"
    },
    dual: true,
    images: {
        loot: "./loot-weapon-m1911-dual.svg",
        held: "../shared/gun-short.png",
        silhouette: "./m1911-dual-silhouette.png"
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
    firingDelay: toMS({ givenIn: "ms", value: 85 }),
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 9.5 }),
        moving: toRad({ givenIn: "degrees", value: 8 })
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
        duration: toMS({ givenIn: "s", value: 4.1 }),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 14,
        firepower: 24
    },
    switchDelay: toMS({ givenIn: "ms", value: 250 }),
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
            parr: 0.09
        },
        duration: toMS({ givenIn: "ms", value: 80 })
    },
    possibleFireModes: [
        "semi"
    ]
};