export default {
    name: "M249",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-m249.svg",
        world: "./m249.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 14,
        velocity: 125,
        range: 220,
        tracer: {
            width: 0.15,
            height: 20
        },
        obstacleMultiplier: 1.75,
        headshotMultiplier: 2,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.9,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::5.56x45mm",
    useDelay: 80,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1.5, "degrees"),
        moving: srvsdbx_Math.toRad(6, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: -4
    },
    imageOffset: {
        parr: 2,
        perp: 0
    },
    dimensions: {
        width: "auto",
        height: 3.6,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(6.7, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 100,
        firepower: 200
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.3,
            parr: 2.45
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            perp: 0,
            parr: 0.7
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.5, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.4, 0.4, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.1
        },
        duration: 90
    },
    fireMode: "automatic",
} satisfies ExportInterface<SimpleGun>;