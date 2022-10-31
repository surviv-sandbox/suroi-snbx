//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "Dual G18C",
    targetVersion: "0.9.0",
    summary: {
        class: "dual_pistol",
        engagementDistance: {
            min: 1,
            max: 15
        },
        shouldNoslow: false,
        role: "secondary"
    },
    dual: true,
    images: {
        loot: "./loot-weapon-glock-dual.svg",
        held: "../shared/gun-short.svg",
        silhouette: "./glock-dual-silhouette.png"
    },
    tint: "#1E1E1E",
    ballistics: {
        damage: 9,
        velocity: 70,
        range: 44,
        tracer: {
            width: 0.15,
            height: 10
        },
        hitboxLength: 2,
        obstacleMult: 1,
        headshotMult: 2,
        fsa: {
            enabled: false,
            rechargeTime: 10000000000000
        },
        falloff: 0.5,
        projectiles: 1
    },
    suppressed: false,
    caliber: "9x19mm",
    firingDelay: "30",
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 18 }),
        moving: toRad({ givenIn: "degrees", value: 16 })
    },
    moveSpeedPenalties: {
        active: 0,
        firing: 0
    },
    imageOffset: {
        perp: 0.525,
        parr: 1.3
    },
    dimensions: {
        width: 0.43359375,
        height: 1.5,
        layer: 0
    },
    reload: {
        duration: 3800,
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 34,
        firepower: 62
    },
    switchDelay: 250,
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
        duration: "50"
    },
    possibleFireModes: ["automatic"],
};