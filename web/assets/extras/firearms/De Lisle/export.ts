export default {
    name: "De Lisle",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-delisle.svg",
        world: "./delisle.svg",
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 60,
        velocity: 126,
        range: 250,
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
        falloff: 0.8,
        projectiles: 1
    },
    suppressed: true,
    caliber: "srvsdbx::.45ACP",
    useDelay: 1100,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1.3, "degrees"),
        moving: srvsdbx_Math.toRad(2, "degrees")
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
        width: "auto",
        height: 2.8,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.4, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 7,
        firepower: 11
    },
    switchDelay: 1000,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 2.05,
            perp: 0.3
        }
    },
    projectileSpawnOffset: {
        perp: 0,
        parr: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.4,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.4, 0.2, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.2, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 900
    },
    recoilImpulse: {
        direction: {
            parr: -0.09,
            perp: 0
        },
        duration: 125
    },
    fireMode: "semi"
} satisfies ExportInterface<SimpleGun>;