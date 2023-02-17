export default {
    name: "Dual P30L",
    displayName: "P30L",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-p30l-dual.svg",
        world: "./p30l.svg",
    },
    dual: true,
    tint: "#FFFFFF",
    ballistics: {
        damage: 21,
        velocity: 94,
        range: 100,
        tracer: {
            width: 0.2,
            height: 10
        },
        obstacleMult: 1,
        headshotMult: 2,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.75,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::9x19mm",
    useDelay: 90,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(3, "degrees"),
        moving: srvsdbx_Math.toRad(2, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        perp: 0.525,
        parr: 1.45
    },
    dimensions: {
        width: "auto",
        height: 1.8,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.65, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 30,
        firepower: 60
    },
    switchDelay: 250,
    handPositions: {
        leftHand: {
            perp: 0.525,
            parr: 0.95
        },
        rightHand: {
            perp: -0.525,
            parr: 0.95
        }
    },
    projectileSpawnOffset: {
        perp: 0.525,
        parr: 0
    },
    casings: {
        spawnOffset: {
            perp: 0.525,
            parr: 0.4
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.2, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.4, 0.5, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.08
        },
        duration: 90
    },
    fireMode: "semi",
} satisfies ExportInterface<SimpleGun>;