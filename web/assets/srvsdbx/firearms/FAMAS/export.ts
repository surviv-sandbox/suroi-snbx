export default {
    name: "FAMAS",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-famas.svg",
        world: "./famas.svg",
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 17,
        velocity: 110,
        range: 150,
        tracer: {
            width: 0.15,
            height: 15
        },
        obstacleMultiplier: 1,
        headshotMultiplier: 2,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.8,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::5.56x45mm",
    useDelay: 100,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1.1, "degrees"),
        moving: srvsdbx_Math.toRad(2, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.95,
        perp: 0
    },
    dimensions: {
        width: "auto",
        height: 2.5,
        layer: 1
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.3, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 25,
        firepower: 35
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 1.45,
            perp: 0.085
        },
        rightHand: {
            parr: 2.4,
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
            parr: () => srvsdbx_Math.meanDevPM_random(-0.4, 0.2, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-2.2, 0.4, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.08
        },
        duration: 100
    },
    fireMode: "auto-burst-3",
    burstProps: {
        shotDelay: 70,
        burstDelay: 350
    }
} satisfies ExportInterface<SimpleGun>;