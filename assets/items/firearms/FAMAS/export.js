//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "FAMAS",
    targetVersion: "0.8.2",
    summary: {
        class: "burst_ar",
        engagementDistance: {
            min: 10,
            max: 50
        },
        shouldNoslow: false,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-famas.svg",
        held: "./famas.png",
        silhouette: "./famas-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 17,
        velocity: 110,
        range: 150,
        tracer: {
            width: 0.15,
            height: 15
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
    suppressed: false,
    caliber: "5.56x45mm",
    firingDelay: 100,
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 1.1 }),
        moving: toRad({ givenIn: "degrees", value: 2 })
    },
    moveSpeedPenalties: {
        active: 0,
        firing: 0
    },
    imageOffset: {
        perp: 0,
        parr: 1.95
    },
    dimensions: {
        width: 0.5120481927710844,
        height: 2.5,
        layer: 1
    },
    reload: {
        duration: 2300,
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 25,
        firepower: 35
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            perp: 0.085,
            parr: 1.45
        },
        rightHand: {
            perp: 0.325,
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
            parr: 0.2
        },
        velocity: {
            perp: () => +meanDevPM_random(-4.4, 2.64, true),
            parr: () => +meanDevPM_random(-1.2, 0.72, true),
            angular: () => +meanDevPM_random(toRad({ givenIn: "turns", value: 2 }), toRad({ givenIn: "turns", value: 1.2 }), true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.08
        },
        duration: 100
    },
    possibleFireModes: ["auto-burst-3"],
    burstProps: {
        shotDelay: 70,
        burstDelay: 350
    }
};