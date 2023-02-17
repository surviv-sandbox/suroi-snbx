export default {
    name: "M93R",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-m93r.svg",
        world: "./gun-short.svg"
    },
    dual: false,
    tint: "#2A381B",
    ballistics: {
        damage: 12,
        velocity: 85,
        range: 100,
        tracer: {
            width: 0.15,
            height: 10
        },
        obstacleMult: 1,
        headshotMult: 2,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.7,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::9x19mm",
    useDelay: 100,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(4, "degrees"),
        moving: srvsdbx_Math.toRad(4, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        perp: 0,
        parr: 1.35
    },
    dimensions: {
        width: 0.43,
        height: 1.5,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(1.6, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 20,
        firepower: 30
    },
    switchDelay: 250,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 1.73,
            perp: 0.32
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
            parr: () => srvsdbx_Math.meanDevPM_random(-0.2, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.08,
            perp: 0
        },
        duration: 90
    },
    fireMode: "auto-burst-3",
    burstProps: {
        shotDelay: 40,
        burstDelay: 280
    }
} satisfies ExportInterface<SimpleGun>;