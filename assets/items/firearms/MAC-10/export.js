//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "MAC-10",
    targetVersion: "0.9.0",
    summary: {
        class: "smg",
        engagementDistance: {
            min: 2,
            max: 30
        },
        shouldNoslow: false,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-mac10.svg",
        held: "../shared/gun-med.svg",
        silhouette: "./mac10-silhouette.png"
    },
    tint: "#383838",
    ballistics: {
        damage: 9.25,
        velocity: 75,
        range: 50,
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
        falloff: 0.6,
        projectiles: 1
    },
    suppressed: false,
    caliber: "9x19mm",
    firingDelay: 45,
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 10 }),
        moving: toRad({ givenIn: "degrees", value: 11 })
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
        height: 1.5,
        layer: 0
    },
    reload: {
        duration: 1800,
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 32,
        firepower: 50
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.3,
            parr: 1.7
        }
    },
    projectileSpawnOffset: {
        perp: 0,
        parr: 0
    },
    casings: {
        spawnOffset: {
            perp: 0,
            parr: 0.5
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
            parr: 0.08
        },
        duration: 70
    },
    possibleFireModes: ["automatic"],
};