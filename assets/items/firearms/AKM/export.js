//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "AKM",
    targetVersion: "0.8.1",
    summary: {
        class: "assault_rifle",
        engagementDistance: {
            min: 8,
            max: 60
        },
        shouldNoslow: false,
        role: "primary"
    },
    dual: false,
    images: {
        loot: "./loot-weapon-akm.png",
        held: "./akm.png",
        silhouette: "./akm-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 36,
        velocity: 150,
        range: 325.12,
        tracer: {
            width: 0.15,
            height: 20
        },
        hitboxLength: 4,
        obstacleMult: 1,
        headshotMult: 4,
        fsa: {
            enabled: false,
            rechargeTime: toMS({ givenIn: "s", value: 1e10 })
        },
        falloff: 0.98 ** (100 / /* 500Hu = */ 19.84375/* surviv units */),
        projectiles: 1
    },
    suppressed: false,
    caliber: "7.62x39mm",
    firingDelay: toMS({ givenIn: "RPM", value: 600 }),
    deployGroup: 0,
    accuracy: {
        default: (() => {
            let s = 0;

            return (...args) => {
                const p = args[1];

                p.state.custom.spray = (gamespace.currentUpdate - p.state.lastShot[p.inventory.activeIndex] < 368) ? (+(p.state.custom.spray ?? 0)) + (s != p.state.fired ? 1 : 0) : 0;
                s = p.state.fired;

                return Math.atan(3 / 217) +
                    [
                        0,
                        7.01,
                        11.18,
                        13.41,
                        15.15,
                        16.68,
                        18.09,
                        18.99,
                        19.56,
                        19.92,
                        20.15,
                        20.29,
                        20.39,
                        20.44,
                        20.48,
                        20.50,
                        20.52,
                        20.53,
                        20.54,
                        20.54,
                        20.54,
                        20.54,
                        20.54,
                        20.54,
                        20.54,
                        20.55
                    ][+clamp(+(p.state.custom.spray ?? 0), 0, 25)] * 0.005;
            };
        })(),
        moving: toRad({ givenIn: "degrees", value: 8 })
    },
    moveSpeedPenalties: {
        active: -1.68,
        firing: -2
    },
    imageOffset: {
        perp: 0.05,
        parr: 1.65
    },
    dimensions: {
        width: 3.15 * 428 / 3188,
        height: 3.15,
        layer: 0
    },
    reload: {
        duration: toMS({ givenIn: "s", value: 2.4 }),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 30,
        firepower: 40
    },
    switchDelay: toMS({ givenIn: "s", value: 1 }),
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.3,
            parr: 2
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