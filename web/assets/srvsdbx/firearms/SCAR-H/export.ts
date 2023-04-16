export default {
    name: "SCAR-H",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-scar.svg",
        world: "./gun-long.svg"
    },
    dual: false,
    tint: "#9B7B48",
    ballistics: {
        damage: 15,
        velocity: 108,
        range: 175,
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
        falloff: 0.85,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::7.62x51mm",
    useDelay: 90,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(2, "degrees"),
        moving: srvsdbx_Math.toRad(5, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.7,
        perp: 0
    },
    dimensions: {
        width: 0.45,
        height: 2.7,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.7, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 20,
        firepower: 30
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 1.85,
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
            parr: () => srvsdbx_Math.meanDevPM_random(-0.6, 0.2, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.3, 0.4, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.1,
            perp: 0
        },
        duration: 90
    },
    fireMode: "automatic"
} satisfies ExportInterface<SimpleGun>;