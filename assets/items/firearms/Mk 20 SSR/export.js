//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "Mk 20 SSR",
    targetVersion: "0.9.0",
    summary: {
        class: "dmr",
        engagementDistance: {
            min: 8,
            max: 60
        },
        shouldNoslow: false,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-scarssr.svg",
        held: "./scarsrr.svg",
        silhouette: "./silhouette-scarssr.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 60,
        velocity: 108,
        range: 200,
        tracer: {
            width: 0.15,
            height: 20
        },
        hitboxLength: 4,
        obstacleMult: 2,
        headshotMult: 1.5,
        fsa: {
            enabled: false,
            rechargeTime: 10000000000
        },
        falloff: 0,
        projectiles: 1
    },
    suppressed: true,
    caliber: ".308 Subsonic",
    firingDelay: 300,
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 1.5 }),
        moving: toRad({ givenIn: "degrees", value: 5.5 })
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
        width: "auto",
        height: 3.35,
        layer: 0
    },
    reload: {
        duration: 2700,
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 10,
        firepower: 20
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.3,
            parr: 2.2
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
            perp: () => +meanDevPM_random(-4, 3.2, true),
            parr: () => +meanDevPM_random(-1, 0.6, true),
            angular: () => +meanDevPM_random(toRad({ givenIn: "turns", value: 1.7 }), toRad({ givenIn: "turns", value: 1 }), false)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.16
        },
        duration: 125
    },
    possibleFireModes: ["semi"],
};