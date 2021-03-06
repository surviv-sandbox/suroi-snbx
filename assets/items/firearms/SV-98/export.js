//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "SV-98",
    targetVersion: "0.8.0",
    summary: {
        class: "sniper_rifle",
        engagementDistance: {
            min: 12,
            max: 120
        },
        shouldNoslow: true,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "assets/items/firearms/SV-98/loot-weapon-sv98.svg",
        held: "assets/items/firearms/shared/gun-long.png",
        silhouette: "assets/items/firearms/SV-98/sv98-silhouette.png"
    },
    tint: "#658947",
    ballistics: {
        damage: 80,
        velocity: 182,
        range: 520,
        tracer: {
            width: 0.32,
            height: 200 / 9
        },
        hitboxLength: 8,
        obstacleMult: 1.5,
        headshotMult: 1.5,
        fsa: {
            enabled: false,
            rechargeTime: toMS({ givenIn: "s", value: 1e10 })
        },
        falloff: 0.96,
        projectiles: 1
    },
    suppressed: false,
    caliber: "7.62x54mmR",
    firingDelay: toMS({ givenIn: "s", value: 1.5 }),
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 1 }),
        moving: toRad({ givenIn: "degrees", value: 2.5 })
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
        height: 3.6,
        layer: 0
    },
    reload: {
        duration: toMS({ givenIn: "s", value: 2.7 }),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 10,
        firepower: 15
    },
    switchDelay: toMS({ givenIn: "s", value: 1 }),
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.325,
            parr: 1.875
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
        spawnDelay: toMS({ givenIn: "ms", value: 800 })
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.2
        },
        duration: toMS({ givenIn: "ms", value: 150 })
    },
    possibleFireModes: [
        "semi"
    ]
};