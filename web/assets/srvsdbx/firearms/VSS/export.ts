export default {
    name: "VSS",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-vss.svg",
        world: "./vss.svg",
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 22,
        velocity: 95,
        range: 125,
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
        falloff: 0.8,
        projectiles: 1
    },
    suppressed: true,
    caliber: "srvsdbx::9x39mm",
    useDelay: 160,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(2, "degrees"),
        moving: srvsdbx_Math.toRad(3, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 2.05,
        perp: 0
    },
    dimensions: {
        width: "auto",
        height: 3.35,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.3, "s"),
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
            parr: 2.2,
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
            perp: 0,
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.6, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.1,
            perp: 0
        },
        duration: 100
    },
    fireMode: "semi"
} satisfies ExportInterface<SimpleGun>;