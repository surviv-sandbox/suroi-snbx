export default {
    name: "TBD",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-tbd.png",
        world: "./tbd.png"
    },
    dual: false,
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
    useDelay: srvsdbx_Math.toMS(82, "ms"),
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(5, "degrees"),
        moving: srvsdbx_Math.toRad(13, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.9,
        perp: 0
    },
    dimensions: {
        width: "auto",
        height: 3.15,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(3.5, "s"),
        ammoReloaded: "all",
        chain: true
    },
    magazineCapacity: {
        normal: 60,
        firepower: 100
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 2.1,
            perp: 0.3
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
            perp: () => srvsdbx_Math.meanDevPM_random(-1.5, 0.5, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.14,
            perp: 0
        },
        duration: 80
    },
    fireMode: "automatic"
} satisfies ExportInterface<SimpleGun>;