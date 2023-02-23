export default {
    name: "M1 Garand",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-garand.svg",
        world: "./garand.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 35,
        velocity: 130,
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
        falloff: 0,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::.30-06",
    useDelay: 230,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1, "degrees"),
        moving: srvsdbx_Math.toRad(4, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 2,
        perp: 0
    },
    dimensions: {
        width: "auto",
        height: 3.5,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.1, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 8,
        firepower: 8
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 2.15,
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
            parr: () => srvsdbx_Math.meanDevPM_random(-0.4, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1, 0.4, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.14,
            perp: 0
        },
        duration: 120
    },
    fireMode: "semi"
} satisfies ExportInterface<SimpleGun>;