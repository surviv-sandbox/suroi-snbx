export default {
    name: "Dual OTs-38",
    displayName: "OTs-38",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-ots38-dual.svg",
        world: "./ots38.svg"
    },
    dual: true,
    tint: "#FFFFFF",
    ballistics: {
        damage: 32,
        velocity: 115,
        range: 135,
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
        falloff: 0.77,
        projectiles: 1
    },
    suppressed: true,
    caliber: "srvsdbx::7.62x41mm",
    useDelay: 180,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1.4, "degrees"),
        moving: srvsdbx_Math.toRad(2.8, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.4,
        perp: 0.525
    },
    dimensions: {
        width: "auto",
        height: 1.5,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(3.8, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 10,
        firepower: 10
    },
    switchDelay: 300,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.525
        },
        rightHand: {
            parr: 0.85,
            perp: -0.525
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0.525
    },
    casings: {
        spawnOffset: {
            parr: 0.2,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-2, 1, true),
            perp: () => srvsdbx_Math.meanDevPM_random(0, 3, true)
        },
        spawnOn: "reload",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.08
        },
        duration: 70
    },
    fireMode: "semi",
} satisfies ExportInterface<SimpleGun>;