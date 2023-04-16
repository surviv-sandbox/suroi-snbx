export default {
    name: "M134",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-m134.svg",
        world: "./m134.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 10,
        velocity: 130,
        range: 200,
        tracer: {
            width: 0.15,
            height: 30
        },
        obstacleMultiplier: 5,
        headshotMultiplier: 1.5,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.5,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::7.62x51mm",
    useDelay: 55,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1, "degrees"),
        moving: srvsdbx_Math.toRad(1, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: -3,
        using: -6
    },
    imageOffset: {
        parr: 2.85,
        perp: 0.1
    },
    dimensions: {
        width: "auto",
        height: 3.9,
        layer: 1
    },
    reload: {
        duration: srvsdbx_Math.toMS(8, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 200,
        firepower: 250
    },
    switchDelay: 900,
    handPositions: {
        leftHand: {
            parr: 1.1,
            perp: 0.45
        },
        rightHand: {
            parr: 2.5,
            perp: 0.05
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
            parr: () => srvsdbx_Math.meanDevPM_random(-0.6, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(2, 1.7, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.1,
            perp: 0
        },
        duration: 170
    },
    fireMode: "automatic",
} satisfies ExportInterface<SimpleGun>;