//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "MP220",
    targetVersion: "0.8.0",
    summary: {
        class: "shotgun",
        engagementDistance: {
            min: 6,
            max: 18
        },
        shouldNoslow: true,
        role: "secondary"
    },
    dual: false,
    images: {
        loot: "assets/items/firearms/MP220/loot-weapon-mp220.svg",
        held: "assets/items/firearms/MP220/mp220.svg",
        silhouette: "assets/items/firearms/MP220/mp220-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 12.5,
        velocity: 66,
        range: 27,
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
        projectiles: 9
    },
    suppressed: false,
    caliber: "12 gauge (buckshot)",
    firingDelay: toMS({ givenIn: "ms", value: 200 }),
    deployGroup: 0,
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
        parr: 1.55
    },
    dimensions: {
        width: 7526513 / 12738633,
        height: 2,
        layer: 0
    },
    reload: {
        duration: toMS({ givenIn: "s", value: 2.7 }),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 2,
        firepower: 2
    },
    switchDelay: toMS({ givenIn: "ms", value: 900 }),
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.325,
            parr: 1.7
        }
    },
    projectileSpawnOffset: {
        perp: 0,
        parr: 0
    },
    casings: {
        spawnOffset: {
            perp: 0,
            parr: 0.2
        },
        velocity: (() => { // Ensures that one shell goes "left" and that the other goes "right" every time
            let i = 1,
                j = 1,
                f = () => void (i == j ? i *= -1 : j *= -1);

            return {
                perp: () => (f(), +meanDevPM_random(0, 6 * -i, false)),
                parr: () => +meanDevPM_random(-2, 0.5, true),
                angular: () => (f(), +meanDevPM_random(toRad({ givenIn: "turns", value: 0 }), toRad({ givenIn: "turns", value: 2 * -i }), false))
            };
        })(),
        spawnOn: "reload",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: 0.25
        },
        duration: toMS({ givenIn: "ms", value: 100 })
    },
    possibleFireModes: () => gamespace.settings.balanceChanges.weapons.mp220.pullBothTriggers ? ["auto-burst-2"] : ["automatic"],
    burstProps: {
        burstDelay: 0,
        shotDelay: 0
    }
};