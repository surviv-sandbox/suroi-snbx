//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "M1911",
    targetVersion: "0.8.2",
    summary: {
        class: "semi_pistol",
        engagementDistance: {
            min: 4,
            max: 30
        },
        shouldNoslow: false,
        role: "secondary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-m1911.svg",
        held: "../shared/gun-short.png",
        silhouette: "./m1911-silhouette.png"
    },
    tint: "#929292",
    ballistics: {
        damage: 14,
        velocity: 80,
        range: 88,
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
        falloff: 0.7,
        projectiles: 1
    },
    suppressed: false,
    caliber: ".45ACP",
    firingDelay: 100,
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 6 }),
        moving: toRad({ givenIn: "degrees", value: 7 })
    },
    moveSpeedPenalties: {
        active: 0,
        firing: 0
    },
    imageOffset: {
        perp: 0,
        parr: 1.35
    },
    dimensions: {
        width: 0.43359375,
        height: 1.5,
        layer: 0
    },
    reload: {
        duration: 2100,
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 7,
        firepower: 12
    },
    switchDelay: 250,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
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
            parr: 0.09
        },
        duration: 80
    },
    possibleFireModes: ["semi"],
};