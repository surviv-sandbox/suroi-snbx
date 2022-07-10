//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "AWM-S",
    targetVersion: "0.8.0",
    summary: {
        class: "sniper_rifle",
        engagementDistance: {
            min: 10,
            max: 130
        },
        shouldNoslow: true,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "assets/items/firearms/AWM-S/loot-weapon-awc.svg",
        held: "assets/items/firearms/AWM-S/awc.svg",
        silhouette: "assets/items/firearms/AWM-S/awc-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 180,
        velocity: 136,
        range: 300,
        tracer: {
            width: 0.25,
            height: 200 / 9
        },
        hitboxLength: 8,
        obstacleMult: 1.5,
        headshotMult: 1,
        fsa: {
            enabled: false,
            rechargeTime: toMS({ givenIn: "s", value: 1e10 })
        },
        falloff: 0.94,
        projectiles: 1
    },
    suppressed: true,
    caliber: ".308 Subsonic",
    firingDelay: toMS({ givenIn: "s", value: 1.5 }),
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 4 }),
        moving: toRad({ givenIn: "degrees", value: 0.5 })
    },
    moveSpeedPenalties: {
        active: 0,
        firing: 0
    },
    imageOffset: {
        perp: 0,
        parr: 2.25
    },
    dimensions: {
        width: 44.388462 / 233.65001 * 3.55,
        height: 3.55,
        layer: 0
    },
    reload: {
        duration: toMS({ givenIn: "s", value: 3.6 }),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 5,
        firepower: 7
    },
    switchDelay: toMS({ givenIn: "s", value: 1 }),
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.325,
            parr: 2.4
        }
    },
    projectileSpawnOffset: {
        perp: 0,
        parr: 2
    },
    casings: {
        spawnOffset: {
            perp: 0,
            parr: 0.8
        },
        velocity: {
            perp: () => +meanDevPM_random(-4, 3.2, true),
            parr: () => +meanDevPM_random(-1, 0.6, true),
            angular: () => +meanDevPM_random(toRad({ givenIn: "turns", value: 1.7 }), toRad({ givenIn: "turns", value: 1 }), true)
        },
        spawnOn: "fire",
        spawnDelay: toMS({ givenIn: "s", value: 1.4 })
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.25
        },
        duration: toMS({ givenIn: "ms", value: 150 })
    },
    possibleFireModes: [
        "semi"
    ]
};