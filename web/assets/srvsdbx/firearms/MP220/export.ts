export default {
    name: "MP220",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-mp220.svg",
        world: "./mp220.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 12.5,
        velocity: 66,
        range: 27,
        tracer: {
            width: 0.15,
            height: 160 / 9
        },
        obstacleMult: 1,
        headshotMult: 1.5,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.3,
        projectiles: 9
    },
    suppressed: false,
    caliber: "srvsdbx::12 gauge (buckshot)",
    useDelay: 200,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(10, "degrees"),
        moving: srvsdbx_Math.toRad(2, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.55,
        perp: 0
    },
    dimensions: {
        width: "auto",
        height: 2,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.7, "s"),
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
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 1.7,
            perp: 0.325
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.2,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-1.6, 0.4, true),
            perp: () => srvsdbx_Math.meanDevPM_random(0, 3, true)
        },
        spawnOn: "reload",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.25
        },
        duration: 100
    },
    fireMode: "semi"
} satisfies ExportInterface<SimpleGun>;