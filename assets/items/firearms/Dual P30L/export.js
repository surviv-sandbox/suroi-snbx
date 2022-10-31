//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "Dual P30L",
    targetVersion: "0.9.0",
    summary: {
        class: "semi_pistol_move",
        engagementDistance: {
            min: 4,
            max: 50
        },
        shouldNoslow: false,
        role: "primary"
    },
    dual: true,
    images: {
        loot: "./loot-weapon-p30l-dual.svg",
        held: "../P30L/p30l.svg",
        silhouette: "./p30l-dual-silhouette.png"
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
            rechargeTime: 10000000000000
        },
        falloff: 0.75,
        projectiles: 1
    },
    suppressed: false,
    caliber: "9x19mm",
    firingDelay: 90,
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 3 }),
        moving: toRad({ givenIn: "degrees", value: 2 })
    },
    moveSpeedPenalties: {
        active: 0,
        firing: 0
    },
    imageOffset: {
        perp: 0.525,
        parr: 1.45
    },
    dimensions: {
        width: "auto",
        height: 1.8,
        layer: 0
    },
    reload: {
        duration: 2650,
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 30,
        firepower: 60
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
        duration: 90
    },
    possibleFireModes: ["semi"],
};