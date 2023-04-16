export default {
    name: "Scout Elite",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-scout.svg",
        world: "./gun-long.svg"
    },
    dual: false,
    tint: "#32363B",
    ballistics: {
        damage: 56,
        velocity: 164,
        range: 450,
        tracer: {
            width: 0.15,
            height: 200 / 9
        },
        obstacleMultiplier: 1.5,
        headshotMultiplier: 1.5,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.92,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::5.56x45mm",
    useDelay: srvsdbx_Math.toMS(1, "s"),
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1, "degrees"),
        moving: srvsdbx_Math.toRad(1, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 5
    },
    imageOffset: {
        parr: 1.7,
        perp: 0
    },
    dimensions: {
        width: 0.45,
        height: 3.7,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.6, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 5,
        firepower: 10
    },
    switchDelay: 1000,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.325,
            parr: 1.875
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.7,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.7, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.3, 0.4, true)
        },
        spawnOn: "fire",
        spawnDelay: 1000
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.15
        },
        duration: 100
    },
    fireMode: "semi"
} satisfies ExportInterface<SimpleGun>;