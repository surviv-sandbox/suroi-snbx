//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "SPAS-12",
    targetVersion: "0.9.0",
    summary: {
        class: "shotgun",
        engagementDistance: {
            min: 7,
            max: 40
        },
        shouldNoslow: true,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-spas12.svg",
        held: "../shared/gun-long.svg",
        silhouette: "./spas-silhouette.png"
    },
    tint: "#2D4251",
    ballistics: {
        damage: 8.75,
        velocity: 88,
        range: 45,
        tracer: {
            width: 0.075,
            height: 9
        },
        hitboxLength: 3,
        obstacleMult: 1,
        headshotMult: 1.5,
        fsa: {
            enabled: false,
            rechargeTime: 10000000000
        },
        falloff: 0.85,
        projectiles: 9
    },
    suppressed: false,
    caliber: "12 gauge (flechette)",
    firingDelay: 750,
    deployGroup: 1,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 3 }),
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
        height: 2.6,
        layer: 0
    },
    reload: {
        duration: 550,
        ammoReloaded: 1,
        chain: true
    },
    magazineCapacity: {
        normal: 9,
        firepower: 12
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.32,
            parr: 1.95
        }
    },
    projectileSpawnOffset: {
        perp: 0,
        parr: 0
    },
    casings: {
        spawnOffset: {
            perp: 0,
            parr: 0.6
        },
        velocity: {
            perp: () => +meanDevPM_random(-5, 1.5, true),
            parr: () => +meanDevPM_random(-1.4, 0.4, true),
            angular: () => +meanDevPM_random(toRad({ givenIn: "turns", value: 1 }), toRad({ givenIn: "turns", value: 1.5 }), false)
        },
        spawnOn: "fire",
        spawnDelay: 750
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.25
        },
        duration: 100
    },
    possibleFireModes: ["semi"],
};