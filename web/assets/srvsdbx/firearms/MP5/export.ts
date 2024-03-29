export default {
    name: "MP5",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-mp5.svg",
        world: "./gun-med.svg",
    },
    dual: false,
    tint: "#121212",
    ballistics: {
        damage: 11,
        velocity: 85,
        range: 100,
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
        falloff: 0.8,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::9x19mm",
    useDelay: 90,
    deployGroup: 0,
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
        parr: 1.45,
        perp: 0
    },
    dimensions: {
        width: 0.45,
        height: 1.9,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 30,
        firepower: 40
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 1.65,
            perp: 0.3
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.4,
            perp: 0,
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.4, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.3, 0.5, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.08,
            perp: 0
        },
        duration: 75
    },
    fireMode: "automatic"
} satisfies ExportInterface<SimpleGun>;