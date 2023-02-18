export default {
    name: "Dual TBD",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-dual-tbd.png",
        world: "./TBD.png"
    },
    dual: true,
    tint: "#FFFFFF",
    ballistics: {
        damage: 11,
        velocity: 100,
        range: 200,
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
        falloff: 0.78,
        projectiles: 1
    },
    suppressed: true,
    caliber: "srvsdbx::5.56x45mm",
    useDelay: srvsdbx_Math.toMS(41, "ms"),
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(12, "degrees"),
        moving: srvsdbx_Math.toRad(28, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: -1,
        using: -3
    },
    imageOffset: {
        parr: 1.9,
        perp: 0.525
    },
    dimensions: {
        width: "auto",
        height: 3.15,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(8, "s"),
        ammoReloaded: "all",
        chain: true
    },
    magazineCapacity: {
        normal: 120,
        firepower: 200
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.95,
            perp: 0.525
        },
        rightHand: {
            parr: 0.95,
            perp: -0.525
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0.525
    },
    casings: {
        spawnOffset: {
            parr: 0.8,
            perp: 0.525
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.5, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.5, 0.5, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.15,
            perp: 0
        },
        duration: 150
    },
    fireMode: "automatic"
} satisfies ExportInterface<SimpleGun>;