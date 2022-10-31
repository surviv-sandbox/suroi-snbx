//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "VSS",
    targetVersion: "0.9.0",
    summary: {
        class: "dmr",
        engagementDistance: {
            min: 10,
            max: 90
        },
        shouldNoslow: false,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-vss.svg",
        held: "./vss.svg",
        silhouette: "./vss-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 22,
        velocity: 95,
        range: 125,
        tracer: {
            width: 0.15,
            height: 20
        },
        hitboxLength: 4,
        obstacleMult: 1,
        headshotMult: 2,
        fsa: {
            enabled: false,
            rechargeTime: 10000000000000
        },
        falloff: 0.8,
        projectiles: 1
    },
    suppressed: true,
    caliber: "9x39mm",
    firingDelay: 160,
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 2 }),
        moving: toRad({ givenIn: "degrees", value: 3 })
    },
    moveSpeedPenalties: {
        active: 0,
        firing: 0
    },
    imageOffset: {
        perp: 0,
        parr: 1.8
    },
    dimensions: {
        width: 0.6328202358,
        height: 3.7,
        layer: 0
    },
    reload: {
        duration: 2300,
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 20,
        firepower: 30
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.3,
            parr: 2.15
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
            perp: () => +meanDevPM_random(-3, -1.7, false),
            parr: () => +meanDevPM_random(-1.2, -0.84, false),
            angular: () => +meanDevPM_random(toRad({ givenIn: "turns", value: 2 }), toRad({ givenIn: "turns", value: 1 }), false)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.1
        },
        duration: 55
    },
    possibleFireModes: ["semi"],
};