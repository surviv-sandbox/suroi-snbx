export default {
    name: "M1100",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-m1100.svg",
        world: "./gun-long.svg",
    },
    dual: false,
    tint: "#2E442E",
    ballistics: {
        damage: 4,
        velocity: 66,
        range: 25,
        tracer: {
            width: 0.15,
            height: 2
        },
        obstacleMultiplier: 1,
        headshotMultiplier: 1.5,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.25,
        projectiles: 18
    },
    suppressed: false,
    caliber: "srvsdbx::12gaugeBirdshot",
    useDelay: 300,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(25, "degrees"),
        moving: srvsdbx_Math.toRad(2, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.8,
        perp: 0
    },
    dimensions: {
        width: 0.425,
        height: 2.5,
        layer: 0
    },
    reload: {
        duration: 700,
        ammoReloaded: 1,
        chain: true
    },
    magazineCapacity: {
        normal: 4,
        firepower: 8
    },
    switchDelay: 900,
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
            parr: 0.6,
            perp: 0
        },
        velocity: {
            perp: () => srvsdbx_Math.meanDevPM_random(-2.1, 0.5, true),
            parr: () => srvsdbx_Math.meanDevPM_random(-0.6, 0.4, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.2,
            perp: 0
        },
        duration: 100
    },
    fireMode: "semi",
} satisfies ExportInterface<SimpleGun>;