export default {
    name: "QBB-97",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-qbb97.svg",
        world: "./qbb97.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 14,
        velocity: 118,
        range: 200,
        tracer: {
            width: 0.15,
            height: 20
        },
        obstacleMult: 1.5,
        headshotMult: 2,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.9,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::5.56x45mm",
    useDelay: srvsdbx_Math.toMS(600, "RPM"),
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(4, "degrees"),
        moving: srvsdbx_Math.toRad(0.5, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: -2
    },
    imageOffset: {
        parr: 1.75,
        perp: -0.1
    },
    dimensions: {
        width: "auto",
        height: 2.4,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(3.9, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 75,
        firepower: 95
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.3,
            parr: 2.15
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            perp: 0,
            parr: 0.5
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.6, 0.2, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.2, 0.7, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.1
        },
        duration: 90
    },
    fireMode: "automatic",
} satisfies ExportInterface<SimpleGun>;