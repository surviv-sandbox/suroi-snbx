export default {
    name: "Vector (.45ACP)",
    displayName: "Vector",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-vector45.svg",
        world: "./gun-med.svg",
    },
    dual: false,
    tint: "#897960",
    ballistics: {
        damage: 9.5,
        velocity: 82,
        range: 45,
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
        falloff: 0.6,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::.45ACP",
    useDelay: 44,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(4.5, "degrees"),
        moving: srvsdbx_Math.toRad(6.5, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.6,
        perp: 0
    },
    dimensions: {
        width: 0.45,
        height: 1.7,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(1.6, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 25,
        firepower: 32
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 2.05,
            perp: 0.3
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.5,
            perp: 0,
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.6, 0.2, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.2, 0.4, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.07,
            perp: 0
        },
        duration: 70
    },
    fireMode: "automatic"
} satisfies ExportInterface<SimpleGun>;