export default {
    name: "Super 90",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-m1014.svg",
        world: "./gun-long.svg",
    },
    dual: false,
    tint: "#565038",
    ballistics: {
        damage: 77,
        velocity: 118,
        range: 60,
        tracer: {
            width: 0.32,
            height: 200 / 9
        },
        obstacleMult: 1,
        headshotMult: 1.5,
        firstShotAccuracy: {
            enabled: true,
            rechargeTime: 500
        },
        falloff: 0.85,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::12 gauge (slug)",
    useDelay: 400,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(4, "degrees"),
        moving: srvsdbx_Math.toRad(4, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.9,
        perp: 0
    },
    dimensions: {
        width: 0.45,
        height: 2.4,
        layer: 0
    },
    reload: {
        duration: 520,
        ammoReloaded: 1,
        chain: true
    },
    magazineCapacity: {
        normal: 8,
        firepower: 10
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.3,
            parr: 2
        }
    },
    projectileSpawnOffset: {
        perp: 0,
        parr: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.6,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.5, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.3, 0.4, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.23,
            perp: 0
        },
        duration: 120
    },
    fireMode: "automatic"
} satisfies ExportInterface<SimpleGun>;