export default {
    name: "Dual G18C",
    displayName: "G18C",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-glock-dual.svg",
        world: "./gun-short.svg"
    },
    dual: true,
    tint: "#1E1E1E",
    ballistics: {
        damage: 9,
        velocity: 70,
        range: 44,
        tracer: {
            width: 0.15,
            height: 10
        },
        obstacleMultiplier: 1,
        headshotMultiplier: 2,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.5,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::9x19mm",
    useDelay: 30,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(18, "degrees"),
        moving: srvsdbx_Math.toRad(16, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.3,
        perp: 0.525
    },
    dimensions: {
        width: 0.43,
        height: 1.5,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(3.8, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 34,
        firepower: 62
    },
    switchDelay: 250,
    handPositions: {
        leftHand: {
            parr: 0.95,
            perp: 0.525
        },
        rightHand: {
            parr: 0.95,
            perp: -0.525
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0.525
    },
    casings: {
        spawnOffset: {
            parr: 0.6,
            perp: 0.525
        },
        velocity: {
            perp: () => srvsdbx_Math.meanDevPM_random(-1, 0.3, true),
            parr: () => srvsdbx_Math.meanDevPM_random(-0.2, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.08,
            perp: 0
        },
        duration: 50
    },
    fireMode: "automatic"
} satisfies ExportInterface<SimpleGun>;