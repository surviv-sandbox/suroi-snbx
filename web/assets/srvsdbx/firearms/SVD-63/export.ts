export default {
    name: "SVD-63",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-svd.svg",
        world: "./gun-long.svg"
    },
    dual: false,
    tint: "#333333",
    ballistics: {
        damage: 36,
        velocity: 127,
        range: 425,
        tracer: {
            width: 0.15,
            height: 20
        },
        obstacleMultiplier: 1,
        headshotMultiplier: 2,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.9,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::7.62x54mmR",
    useDelay: 230,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1, "degrees"),
        moving: srvsdbx_Math.toRad(4.5, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        perp: 0,
        parr: 1.8
    },
    dimensions: {
        width: 0.45,
        height: 3.6,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.5, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 10,
        firepower: 20
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 2,
            perp: 0.3
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.6,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.5, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.2, 0.4, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.13,
            perp: 0
        },
        duration: 100
    },
    fireMode: "semi",
} satisfies ExportInterface<SimpleGun>;