//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "CZ-3A1",
    targetVersion: "0.8.2",
    summary: {
        class: "smg",
        engagementDistance: {
            min: 5,
            max: 60
        },
        shouldNoslow: false,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-scorpion.svg",
        held: "./cz3a1.svg",
        silhouette: "./cz3a1-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 10.75,
        velocity: 90,
        range: 120,
        tracer: {
            width: 0.15,
            height: 20
        },
        hitboxLength: 4,
        obstacleMult: 1,
        headshotMult: 2,
        fsa: {
            enabled: false,
            rechargeTime: "10000000000000"
        },
        falloff: 0.77,
        projectiles: 1
    },
    suppressed: true,
    caliber: "9x19mm",
    firingDelay: toMS({ givenIn: "s", value: 0.055 }),
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 4 }),
        moving: toRad({ givenIn: "degrees", value: 5 })
    },
    moveSpeedPenalties: {
        active: 0,
        firing: 0
    },
    imageOffset: {
        perp: 0,
        parr: 2.2
    },
    dimensions: {
        width: 0.6923076923,
        height: 3,
        layer: 0
    },
    reload: {
        duration: 2200,
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 30,
        firepower: 40
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
    possibleFireModes: ["automatic"],
};