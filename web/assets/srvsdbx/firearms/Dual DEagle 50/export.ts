export default {
    name: "Dual DEagle 50",
    displayName: "DEagle 50",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-deagle-dual.svg",
        world: "./deagle.svg",
    },
    dual: true,
    tint: "#FFFFFF",
    ballistics: {
        damage: 35,
        velocity: 115,
        range: 120,
        tracer: {
            width: 0.2,
            height: 10
        },
        obstacleMultiplier: 1,
        headshotMultiplier: 2,
        firstShotAccuracy: {
            enabled: true,
            rechargeTime: 500
        },
        falloff: 0.75,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::.50AE",
    useDelay: 120,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(3.5, "degrees"),
        moving: srvsdbx_Math.toRad(7.5, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.5,
        perp: 0.525
    },
    dimensions: {
        width: "auto",
        height: 2.15,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(4, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 14,
        firepower: 18
    },
    switchDelay: 350,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.525
        },
        rightHand: {
            parr: 0.85,
            perp: -0.525
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0.525
    },
    casings: {
        spawnOffset: {
            parr: 0.4,
            perp: 0.525
        },
        velocity: {
            perp: () => srvsdbx_Math.meanDevPM_random(-1, 0.2, true),
            parr: () => srvsdbx_Math.meanDevPM_random(-0.2, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.12,
            perp: 0
        },
        duration: 110
    },
    fireMode: "semi",
} satisfies ExportInterface<SimpleGun>;