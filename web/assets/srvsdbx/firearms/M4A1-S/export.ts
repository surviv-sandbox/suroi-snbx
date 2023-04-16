export default {
    name: "M4A1-S",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-m4a1.svg",
        world: "./m4a1s.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 14,
        velocity: 95,
        range: 165,
        tracer: {
            width: 0.15,
            height: 20
        },
        obstacleMultiplier: 1,
        headshotMultiplier: 2,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.82,
        projectiles: 1
    },
    suppressed: true,
    caliber: "srvsdbx::5.56x45mm",
    useDelay: 82,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(2, "degrees"),
        moving: srvsdbx_Math.toRad(4, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        perp: 0,
        parr: 1.9
    },
    dimensions: {
        width: "auto",
        height: 3.5,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(3.1, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 30,
        firepower: 40
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.3,
            parr: 2.2
        }
    },
    projectileSpawnOffset: {
        perp: 0,
        parr: 0
    },
    casings: {
        spawnOffset: {
            perp: 0,
            parr: 0.8
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.6, 0.3, true),
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
        duration: 70
    },
    fireMode: "automatic",
} satisfies ExportInterface<SimpleGun>;