export default {
    name: "Mk 12 SPR",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-mk12.svg",
        world: "./gun-long.svg"
    },
    dual: false,
    tint: "#A79C8A",
    ballistics: {
        damage: 22.5,
        velocity: 132,
        range: 400,
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
    caliber: "srvsdbx::5.56x45mm",
    useDelay: 180,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1, "degrees"),
        moving: srvsdbx_Math.toRad(3, "degrees")
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
        height: 3.6,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.4, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 20,
        firepower: 30
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 1.8,
            perp: 0.3
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.6,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.5, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.6, 0.4, true)
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