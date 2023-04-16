export default {
    name: "BLR 81",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-blr.svg",
        world: "./gun-long.svg"
    },
    dual: false,
    tint: "#472706",
    ballistics: {
        damage: 56,
        velocity: 160,
        range: 400,
        tracer: {
            width: 0.15,
            height: 200 / 9
        },
        obstacleMultiplier: 1,
        headshotMultiplier: 1.5,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.9,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::7.62x51mm",
    useDelay: 800,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1.5, "degrees"),
        moving: srvsdbx_Math.toRad(3, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 2,
        perp: 0
    },
    dimensions: {
        width: 0.45,
        height: 3.1,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(1.7, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 3,
        firepower: 5
    },
    switchDelay: srvsdbx_Math.toMS(1, "s"),
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.325,
            parr: 2.1
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.5,
            perp: 0
        },
        velocity: {
            perp: () => srvsdbx_Math.meanDevPM_random(-2.5, 0.6, true),
            parr: () => srvsdbx_Math.meanDevPM_random(-0.8, 0.3, true),
        },
        spawnOn: "fire",
        spawnDelay: 1000
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.1
        },
        duration: 90
    },
    fireMode: "semi"
} satisfies ExportInterface<SimpleGun>;