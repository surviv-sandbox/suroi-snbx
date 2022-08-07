//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "M870",
    targetVersion: "0.8.1",
    summary: {
        class: "shotgun",
        engagementDistance: {
            min: 6,
            max: 20
        },
        shouldNoslow: true,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-m870.svg",
        held: "../shared/gun-long.png",
        silhouette: "./m870-silhouette.png"
    },
    tint: "#331A00",
    ballistics: {
        damage: 12.5,
        velocity: 66,
        range: 27,
        tracer: {
            width: 0.15,
            height: 160 / 9
        },
        hitboxLength: 3,
        obstacleMult: 1,
        headshotMult: 1.5,
        fsa: {
            enabled: false,
            rechargeTime: toMS({ givenIn: "s", value: 1e10 })
        },
        falloff: 0.3,
        projectiles: 9
    },
    suppressed: false,
    caliber: "12 gauge (buckshot)",
    firingDelay: toMS({ givenIn: "ms", value: 900 }),
    deployGroup: 1,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 10 }),
        moving: toRad({ givenIn: "degrees", value: 12 })
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
        width: 0.425,
        height: 3.15,
        layer: 0
    },
    reload: {
        duration: toMS({ givenIn: "ms", value: 750 }),
        ammoReloaded: 1,
        chain: true
    },
    magazineCapacity: {
        normal: 5,
        firepower: 10
    },
    switchDelay: toMS({ givenIn: "ms", value: 900 }),
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.325,
            parr: 2.14
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
        spawnDelay: toMS({ givenIn: "ms", value: 900 })
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.25
        },
        duration: toMS({ givenIn: "ms", value: 125 })
    },
    possibleFireModes: [
        "semi"
    ]
};