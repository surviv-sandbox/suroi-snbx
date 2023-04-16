export default {
    name: "SPAS-12",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-spas12.svg",
        world: "./gun-long.svg"
    },
    dual: false,
    tint: "#2D4251",
    ballistics: {
        damage: 8.75,
        velocity: 88,
        range: 45,
        tracer: {
            width: 0.1,
            height: 9
        },
        obstacleMultiplier: 1,
        headshotMultiplier: 1.5,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.85,
        projectiles: 9
    },
    suppressed: false,
    caliber: "srvsdbx::12gaugeFlechette",
    useDelay: 750,
    deployGroup: 1,
    accuracy: {
        default: srvsdbx_Math.toRad(3, "degrees"),
        moving: srvsdbx_Math.toRad(4, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.5,
        perp: 0
    },
    dimensions: {
        width: 0.45,
        height: 2.6,
        layer: 0
    },
    reload: {
        duration: 550,
        ammoReloaded: 1,
        chain: true
    },
    magazineCapacity: {
        normal: 9,
        firepower: 12
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 1.95,
            perp: 0.32
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
            parr: () => srvsdbx_Math.meanDevPM_random(-0.5, 0.2, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-2.3, 0.8, true)
        },
        spawnOn: "fire",
        spawnDelay: 750
    },
    recoilImpulse: {
        direction: {
            parr: -0.18,
            perp: 0
        },
        duration: 100
    },
    fireMode: "semi"
} satisfies ExportInterface<SimpleGun>;