//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "M79",
    targetVersion: "0.8.2",
    summary: {
        class: "grenade_launcher",
        engagementDistance: {
            min: 20,
            max: 30
        },
        shouldNoslow: false,
        role: "secondary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-m79.svg",
        held: "./m79.svg",
        silhouette: "./m79-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 125,
        velocity: 20,
        range: 18,
        tracer: {
            width: 0.4307692307692308,
            height: 0.8
        },
        hitboxLength: 1,
        obstacleMult: 1.3,
        headshotMult: 1,
        fsa: {
            enabled: false,
            rechargeTime: 10000000000000
        },
        falloff: 1,
        projectiles: 1
    },
    suppressed: false,
    caliber: "40mm",
    firingDelay: 0,
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 1 }),
        moving: toRad({ givenIn: "degrees", value: 2 })
    },
    moveSpeedPenalties: {
        active: () => gamespace.settings.balanceChanges.weapons.m79.moveSpeedPenalty ? -3 : 0,
        firing: 0
    },
    imageOffset: {
        perp: 0.95,
        parr: 0.625
    },
    dimensions: {
        width: 0.5766129032258065,
        height: 2.75,
        layer: 2
    },
    reload: {
        duration: 2300,
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 1,
        firepower: 1
    },
    switchDelay: 900,
    handPositions: {
        leftHand: {
            perp: 1.35,
            parr: 0.13
        },
        rightHand: {
            perp: 0.75,
            parr: 1.6
        }
    },
    projectileSpawnOffset: {
        perp: 0.95,
        parr: -0.8
    },
    casings: {
        spawnOffset: {
            perp: 0.95,
            parr: -0.8
        },
        velocity: {
            perp: () => +meanDevPM_random(-2, -0.8, false),
            parr: () => +meanDevPM_random(0, 0.4, true),
            angular: () => +meanDevPM_random(toRad({ givenIn: "turns", value: 1 }), toRad({ givenIn: "turns", value: 0.4 }), true)
        },
        spawnOn: () => gamespace.settings.balanceChanges.weapons.m79.spawnCasingOnReload ? "reload" : "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.3
        },
        duration: 150
    },
    possibleFireModes: ["semi"],
};
