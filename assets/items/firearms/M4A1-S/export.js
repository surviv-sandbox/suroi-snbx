//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "M4A1-S",
    targetVersion: "0.8.0",
    summary: {
        class: "assault_rifle",
        engagementDistance: {
            min: 4,
            max: 50
        },
        shouldNoslow: false,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "assets/items/firearms/M4A1-S/loot-weapon-m4a1.svg",
        held: "assets/items/firearms/M4A1-S/m4a1s.png",
        silhouette: "assets/items/firearms/M4A1-S/m4a1-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 14,
        velocity: 95,
        range: 165,
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
        falloff: 0.82,
        projectiles: 1
    },
    suppressed: true,
    caliber: "5.56x45mm",
    firingDelay: toMS({ givenIn: "s", value: 0.082 }),
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 2 }),
        moving: toRad({ givenIn: "degrees", value: 4 })
    },
    moveSpeedPenalties: {
        active: 0,
        firing: 0
    },
    imageOffset: {
        perp: 0,
        parr: 1.9
    },
    dimensions: {
        width: 385 / 488,
        height: 3.5,
        layer: 0
    },
    reload: {
        duration: toMS({ givenIn: "s", value: 3.1 }),
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
            perp: () => +meanDevPM_random(-5, 3.5, true),
            parr: () => +meanDevPM_random(-1, 0.5, true),
            angular: () => +meanDevPM_random(toRad({ givenIn: "turns", value: 2 }), toRad({ givenIn: "turns", value: 1.4 }), true),
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.1
        },
        duration: toMS({ givenIn: "ms", value: 70 })
    },
    possibleFireModes: [
        "automatic"
    ]
};