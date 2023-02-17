export default {
    name: "AN-94",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-an94.svg",
        world: "./gun-long.svg"
    },
    dual: false,
    tint: "#2D2D2D",
    ballistics: {
        damage: 17.5,
        velocity: 110,
        range: 300,
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
        falloff: 0.9,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::7.62x39mm",
    useDelay: 100,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1.5, "degrees"),
        moving: srvsdbx_Math.toRad(4, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.5,
        perp: 0
    },
    dimensions: {
        width: 0.45,
        height: 3.25,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.35, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 45,
        firepower: 60
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 1.875,
            perp: 0.3
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
            parr: () => srvsdbx_Math.meanDevPM_random(-0.5, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-2.2, 0.8, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.1,
            perp: 0
        },
        duration: 80
    },
    fireMode: "auto-burst-2",
    burstProps: {
        shotDelay: 25,
        burstDelay: 240
    }
} satisfies ExportInterface<SimpleGun>;