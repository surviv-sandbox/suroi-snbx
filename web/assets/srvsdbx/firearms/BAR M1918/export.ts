export default {
    name: "BAR M1918",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-bar.svg",
        world: "./gun-long.svg"
    },
    dual: false,
    tint: "#4D4C52",
    ballistics: {
        damage: 17.5,
        velocity: 114,
        range: 275,
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
    caliber: "srvsdbx::.30-06",
    useDelay: 120,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(2, "degrees"),
        moving: srvsdbx_Math.toRad(8, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: -1.5
    },
    imageOffset: {
        parr: 1.9,
        perp: 0
    },
    dimensions: {
        width: 0.45,
        height: 3,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.7, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 20,
        firepower: 40
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 2,
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
            parr: () => srvsdbx_Math.meanDevPM_random(-0.7, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.7, 0.8, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.13,
            perp: 0
        },
        duration: 100
    },
    fireMode: "automatic"
} satisfies ExportInterface<SimpleGun>;