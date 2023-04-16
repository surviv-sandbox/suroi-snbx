export default {
    name: "SIX12",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-six12.svg",
        world: "./six12.svg",
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 12.5,
        velocity: 73,
        range: 27,
        tracer: {
            width: 0.15,
            height: 160 / 9
        },
        obstacleMultiplier: 1,
        headshotMultiplier: 1.5,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.3,
        projectiles: 9
    },
    suppressed: true,
    caliber: "srvsdbx::12gaugeBuckshot",
    useDelay: 480,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(7, "degrees"),
        moving: srvsdbx_Math.toRad(3, "degrees")
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
        height: 2.675,
        layer: 1
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.9, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 6,
        firepower: 6
    },
    switchDelay: 900,
    handPositions: {
        leftHand: {
            parr: 1.65,
            perp: 0.1
        },
        rightHand: {
            parr: 2.6,
            perp: 0.3
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
            parr: () => srvsdbx_Math.meanDevPM_random(-0.9, 0.6, true),
            perp: () => srvsdbx_Math.meanDevPM_random(0, 1.4, true)
        },
        spawnOn: "reload",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.2,
            perp: 0
        },
        duration: 125
    },
    fireMode: "semi"
} satisfies ExportInterface<SimpleGun>;