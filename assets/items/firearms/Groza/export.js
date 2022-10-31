//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "Groza",
    targetVersion: "0.9.0",
    summary: {
        class: "assault_rifle",
        engagementDistance: {
            min: 10,
            max: 40
        },
        shouldNoslow: false,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-groza.svg",
        held: "./groza.svg",
        silhouette: "./groza-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 12.5,
        velocity: 104,
        range: 175,
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
        falloff: 0.85,
        projectiles: 1
    },
    suppressed: false,
    caliber: "7.62x39mm",
    firingDelay: 78,
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 5 }),
        moving: toRad({ givenIn: "degrees", value: 9 })
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
        width: "auto",
        height: 2.2,
        layer: 1
    },
    reload: {
        duration: 2500,
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
            parr: 1.45
        },
        rightHand: {
            perp: 0.3,
            parr: 2.4
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
            parr: 0.09
        },
        duration: 80
    },
    possibleFireModes: ["automatic"],
};