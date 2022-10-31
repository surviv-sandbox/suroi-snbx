// sndx_edtr_no_compat
//@ts-check
/**
 * @type {JSONGun}
 */
export default {
    name: "MP220",
    targetVersion: "0.9.0",
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
        loot: "./loot-weapon-mp220.svg",
        held: "./mp220.svg",
        silhouette: "./mp220-silhouette.png"
    },
    tint: "#FFFFFF",
    ballistics: {
        damage: 12.5,
        velocity: 66,
        range: 27,
        tracer: {
            width: 0.15,
            height: 17.77777777777778
        },
        hitboxLength: 4,
        obstacleMult: 1,
        headshotMult: 1.5,
        fsa: {
            enabled: false,
            rechargeTime: 10000000000000
        },
        falloff: 0.3,
        projectiles: 9
    },
    suppressed: false,
    caliber: "12 gauge (buckshot)",
    firingDelay: 200,
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
        width: 0.5908414976709039,
        height: 2,
        layer: 0
    },
    reload: {
        duration: 2700,
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 2,
        firepower: 2
    },
    switchDelay: 900,
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
        velocity: (() => { // Not technically acheivable with the editor but eh
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
        duration: 100
    },
    possibleFireModes: () => gamespace.settings.balanceChanges.weapons.mp220.pullBothTriggers ? ["auto-burst-2"] : ["automatic"],
    burstProps: {
        shotDelay: 0,
        burstDelay: 0
    }
};