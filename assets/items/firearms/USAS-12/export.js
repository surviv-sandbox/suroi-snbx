//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "USAS-12",
    targetVersion: "0.8.0",
    summary: {
        class: "shotgun",
        engagementDistance: {
            min: 7,
            max: 20
        },
        shouldNoslow: true,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "assets/items/firearms/USAS-12/loot-weapon-usas.svg",
        held: "assets/items/firearms/USAS-12/usas.svg",
        silhouette: "assets/items/firearms/USAS-12/usas-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 12,
        velocity: 72,
        range: (gun, shooter) => Math.min(24, (() => {
            try {
                return +distance(shooter.aimTarget, shooter.body.position) / 50;
            } catch {
                return 24;
            }
        })()),
        tracer: {
            width: 0.15,
            height: 160 / 9
        },
        hitboxLength: 4,
        obstacleMult: 1,
        headshotMult: 1.5,
        fsa: {
            enabled: false,
            rechargeTime: toMS({ givenIn: "s", value: 1e10 })
        },
        falloff: 0.3,
        projectiles: 1
    },
    suppressed: false,
    caliber: "FRAG-12",
    firingDelay: toMS({ givenIn: "ms", value: 500 }),
    deployGroup: 0,
    accuracy: {
        default: toRad({ givenIn: "degrees", value: 7 }),
        moving: toRad({ givenIn: "degrees", value: 6 })
    },
    moveSpeedPenalties: {
        active: 0,
        firing: -1
    },
    imageOffset: {
        perp: 0,
        parr: 1.7
    },
    dimensions: {
        width: 3.15 * 40.452766 / 232,
        height: 3.15,
        layer: 0
    },
    reload: {
        duration: toMS({ givenIn: "s", value: 2.9 }),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 10,
        firepower: 20
    },
    switchDelay: toMS({ givenIn: "ms", value: 750 }),
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
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.25
        },
        duration: toMS({ givenIn: "ms", value: 125 })
    },
    possibleFireModes: [
        "automatic"
    ]
};