//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "M1 Garand",
    targetVersion: "0.9.0",
    summary: {
        class: "dmr",
        engagementDistance: {
            min: 15,
            max: 130
        },
        shouldNoslow: false,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-garand.svg",
        held: "./gun-garand-01.svg",
        silhouette: "./garand-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 35,
        velocity: 130,
        range: 400,
        tracer: {
            width: 0.15,
            height: 20
        },
        hitboxLength: 4,
        obstacleMult: 1,
        headshotMult: 2,
        fsa: {
            enabled: false,
            rechargeTime: 10000000000
        },
        falloff: 0,
        projectiles: 1
    },
    suppressed: false,
    caliber: ".30-06",
    firingDelay: 230,
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
        parr: 2
    },
    dimensions: {
        width: "auto",
        height: 3.5,
        layer: 0
    },
    reload: {
        duration: 2100,
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 8,
        firepower: 8
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
            parr: 0.14
        },
        duration: 120
    },
    possibleFireModes: ["semi"],
};