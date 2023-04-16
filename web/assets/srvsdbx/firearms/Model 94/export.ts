export default {
    name: "Model 94",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-model94.svg",
        world: "./gun-long.svg"
    },
    dual: false,
    tint: "#A06120",
    ballistics: {
        damage: 44,
        velocity: 156,
        range: 175,
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
        falloff: 0.72,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::.45ACP",
    useDelay: 700,
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
        parr: 1.7,
        perp: 0
    },
    dimensions: {
        width: 0.45,
        height: 3.7,
        layer: 0
    },
    reload: {
        duration: 500,
        ammoReloaded: 1,
        chain: true
    },
    magazineCapacity: {
        normal: 8,
        firepower: 8
    },
    switchDelay: srvsdbx_Math.toMS(1, "s"),
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.325,
            parr: 1.875
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
            parr: () => srvsdbx_Math.meanDevPM_random(-0.7, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.3, 0.4, true)
        },
        spawnOn: "fire",
        spawnDelay: 1000
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.09
        },
        duration: 80
    },
    fireMode: "semi"
} satisfies ExportInterface<SimpleGun>;