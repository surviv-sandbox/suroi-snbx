//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "AK-47",
    targetVersion: "0.8.0",
    summary: {
        class: "assault_rifle",
        engagementDistance: {
            min: 8,
            max: 40
        },
        shouldNoslow: false,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "assets/items/firearms/AK-47/loot-weapon-ak.svg",
        held: "assets/items/firearms/shared/gun-long.png",
        silhouette: "assets/items/firearms/AK-47/ak-silhouette.png"
    },
    tint: "#622A12",
    ballistics: {
        damage: 13.5,
        velocity: 100,
        range: 200,
        tracer: {
            width: 0.15,
            height: 20
        },
        hitboxLength: 4,
        obstacleMult: 1,
        headshotMult: 2,
        fsa: {
            enabled: false,
            rechargeTime: toMS({ givenIn: "s", value: 1e10 })
        },
        falloff: 0.9,
        projectiles: 1
    },
    suppressed: false,
    caliber: "7.62x39mm",
    firingDelay: toMS({ givenIn: "RPM", value: 600 }),
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 2.5 }),
        moving: toRad({ givenIn: "degrees", value: 7.5 })
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
        height: 3.15,
        layer: 0
    },
    reload: {
        duration: toMS({ givenIn: "s", value: 2.5 }),
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
            parr: 0.12
        },
        duration: toMS({ givenIn: "ms", value: 80 })
    },
    possibleFireModes: [
        "automatic"
    ]
};