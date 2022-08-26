//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "AN-94",
    targetVersion: "0.8.2",
    summary: {
        class: "burst_ar",
        engagementDistance: {
            min: 15,
            max: 80
        },
        shouldNoslow: false,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-an94.svg",
        held: "../shared/gun-long.png",
        silhouette: "./an94-silhouette.png"
    },
    tint: "#2D2D2D",
    ballistics: {
        damage: 17.5,
        velocity: 110,
        range: 300,
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
        falloff: 0.9,
        projectiles: 1
    },
    suppressed: false,
    caliber: "7.62x39mm",
    firingDelay: 100,
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 1.5 }),
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
        height: 3.25,
        layer: 0
    },
    reload: {
        duration: 2350,
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 45,
        firepower: 60
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.3,
            parr: 1.875
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
            perp: () => +meanDevPM_random(-4.4, 2.2, true),
            parr: () => +meanDevPM_random(-1.2, 0.72, true),
            angular: () => +meanDevPM_random(toRad({ givenIn: "turns", value: 2 }), toRad({ givenIn: "turns", value: 1.2 }), true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.1
        },
        duration: 80
    },
    possibleFireModes: ["auto-burst-2"],
    burstProps: {
        shotDelay: 25,
        burstDelay: 240
    }
};