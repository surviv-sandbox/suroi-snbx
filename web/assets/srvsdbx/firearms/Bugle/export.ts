export default {
    name: "Bugle",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-bugle.svg",
        world: "./bugle.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 0,
        velocity: 100,
        range: 1,
        tracer: {
            width: 0.15,
            height: 20
        },
        obstacleMult: 1,
        headshotMult: 1,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 1,
        projectiles: 1
    },
    effectsOnFire: [
        {
            radius: 10,
            effects: ["srvsdbx::inspire"]
        }
    ],
    suppressed: false,
    caliber: "srvsdbx::Bugle",
    useDelay: srvsdbx_Math.toMS(1, "s"),
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1, "degrees"),
        moving: srvsdbx_Math.toRad(1, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.65,
        perp: -0.1
    },
    dimensions: {
        width: "auto",
        height: 2.1,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(10, "ms"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 1,
        firepower: 4
    },
    switchDelay: 300,
    handPositions: {
        leftHand: {
            parr: 0.9,
            perp: 0.15
        },
        rightHand: {
            parr: 1.6,
            perp: 0.15
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 2.5,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(0.2, 0.1, true),
            perp: () => srvsdbx_Math.bounds_random(0, 0.3)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.08,
            perp: 0
        },
        duration: 120
    },
    fireMode: "semi"
} satisfies ExportInterface<SimpleGun>;