export default {
    name: "M1A1",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-m1a1.svg",
        world: "./gun-med.svg",
    },
    dual: false,
    tint: "#381000",
    ballistics: {
        damage: 13,
        velocity: 80,
        range: 88,
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
    suppressed: false,
    caliber: "srvsdbx::.45ACP",
    useDelay: 95,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(6, "degrees"),
        moving: srvsdbx_Math.toRad(6, "degrees")
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
        height: 1.9,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.8, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 30,
        firepower: 50
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
            parr: () => srvsdbx_Math.meanDevPM_random(-0.5, 0.4, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.1, 0.2, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.08,
            perp: 0
        },
        duration: 80
    },
    fireMode: "automatic"
} satisfies ExportInterface<SimpleGun>;