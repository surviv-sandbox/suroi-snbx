//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "L86A2",
    targetVersion: "0.8.1",
    summary: {
        class: "dmr",
        engagementDistance: {
            min: 15,
            max: 80
        },
        shouldNoslow: false,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-l86.svg",
        held: "../shared/gun-long.png",
        silhouette: "./l86-silhouette.png"
    },
    tint: "#DCC8A7",
    ballistics: {
        damage: 26.5,
        velocity: 134,
        range: 425,
        tracer: {
            width: 0.15,
            height: 20
        },
        hitboxLength: 6,
        obstacleMult: 1.5,
        headshotMult: 1.5,
        fsa: {
            enabled: false,
            rechargeTime: toMS({ givenIn: "s", value: 1e10 })
        },
        falloff: 0.9,
        projectiles: 1
    },
    suppressed: false,
    caliber: "5.56x45mm",
    firingDelay: toMS({ givenIn: "ms", value: 190 }),
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 1 }),
        moving: toRad({ givenIn: "degrees", value: 3.5 })
    },
    moveSpeedPenalties: {
        active: 0,
        firing: 0
    },
    imageOffset: {
        perp: 0,
        parr: 1.4
    },
    dimensions: {
        width: 0.45,
        height: 3.55,
        layer: 0
    },
    reload: {
        duration: toMS({ givenIn: "s", value: 2.9 }),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 30,
        firepower: 40
    },
    switchDelay: toMS({ givenIn: "ms", value: 750 }),
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.32,
            parr: 1.5
        }
    },
    projectileSpawnOffset: {
        perp: 0,
        parr: 1
    },
    casings: {
        spawnOffset: {
            perp: 0,
            parr: 0.2
        },
        velocity: {
            perp: () => +meanDevPM_random(-4, 1.6, true),
            parr: () => +meanDevPM_random(-1, 0.5, true),
            angular: () => +meanDevPM_random(toRad({ givenIn: "turns", value: 1.7 }), toRad({ givenIn: "turns", value: 1 }), true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.15
        },
        duration: toMS({ givenIn: "ms", value: 80 })
    },
    possibleFireModes: [
        "semi"
    ]
};