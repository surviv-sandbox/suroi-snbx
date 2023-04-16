export default {
    name: "L86A2",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-l86.svg",
        world: "./gun-long.svg"
    },
    dual: false,
    tint: "#DCC8A7",
    ballistics: {
        damage: 26.5,
        velocity: 134,
        range: 425,
        tracer: {
            width: 0.15,
            height: 20
        },
        obstacleMultiplier: 1.5,
        headshotMultiplier: 1.5,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.9,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::5.56x45mm",
    useDelay: 190,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1, "degrees"),
        moving: srvsdbx_Math.toRad(3.5, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        perp: 0,
        parr: 1.4
    },
    dimensions: {
        width: 0.45,
        height: 3.55,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.9, "s"),
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
            parr: 1.5,
            perp: 0.32
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.2,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.4, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-2, 0.4, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.15,
            perp: 0
        },
        duration: 80
    },
    fireMode: "semi",
} satisfies ExportInterface<SimpleGun>;