export default {
    name: "M416",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-hk416.svg",
        world: "./gun-med.svg"
    },
    dual: false,
    tint: "#DBC49A",
    ballistics: {
        damage: 11,
        velocity: 105,
        range: 175,
        tracer: {
            width: 0.15,
            height: 20
        },
        obstacleMult: 1,
        headshotMult: 2,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.85,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::5.56x45mm",
    useDelay: srvsdbx_Math.toMS(800, "RPM"),
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(4, "degrees"),
        moving: srvsdbx_Math.toRad(8, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        perp: 0,
        parr: 1.45
    },
    dimensions: {
        width: 0.43,
        height: 2.1,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.3, "s"),
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
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.3,
            parr: 1.9
        }
    },
    projectileSpawnOffset: {
        perp: 0,
        parr: 0
    },
    casings: {
        spawnOffset: {
            perp: 0,
            parr: 0.4
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.4, 0.2, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.1, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.12
        },
        duration: 80
    },
    fireMode: "automatic",
} satisfies ExportInterface<SimpleGun>;