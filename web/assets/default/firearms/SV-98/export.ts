export default {
    name: "SV-98",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-sv98.svg",
        world: "./gun-long.svg",
    },
    dual: false,
    tint: "#658947",
    ballistics: {
        damage: 80,
        velocity: 182,
        range: 520,
        tracer: {
            width: 0.32,
            height: 200 / 9
        },
        obstacleMult: 1.5,
        headshotMult: 1.5,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.96,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::7.62x54mmR",
    useDelay: srvsdbx_Math.toMS(1.5, "s"),
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1, "degrees"),
        moving: srvsdbx_Math.toRad(2.5, "degrees")
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
        height: 3.6,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.7, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 10,
        firepower: 15
    },
    switchDelay: srvsdbx_Math.toMS(1, "s"),
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 1.875,
            perp: 0.325
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.8,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.5, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.6, 0.9, true)
        },
        spawnOn: "fire",
        spawnDelay: 800
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.2
        },
        duration: 150
    },
    fireMode: "semi",
} satisfies ExportInterface<SimpleGun>;