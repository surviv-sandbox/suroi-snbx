export default {
    name: "AWM-S",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-awc.svg",
        world: "./awc.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 180,
        velocity: 136,
        range: 300,
        tracer: {
            width: 0.25,
            height: 200 / 9
        },
        obstacleMult: 1.5,
        headshotMult: 1,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.94,
        projectiles: 1
    },
    suppressed: true,
    caliber: "srvsdbx::.308 Subsonic",
    useDelay: 1500,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(4, "degrees"),
        moving: srvsdbx_Math.toRad(0.5, "degrees"),
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 2.25,
        perp: 0
    },
    dimensions: {
        width: "auto",
        height: 3.55,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(3.6, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 5,
        firepower: 7
    },
    switchDelay: 1000,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 2.4,
            perp: 0.325
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
            perp: () => srvsdbx_Math.meanDevPM_random(-3.4, 0.5, true),
            parr: () => srvsdbx_Math.meanDevPM_random(-1, 0.6, true)
        },
        spawnOn: "fire",
        spawnDelay: 1400
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.25
        },
        duration: 150
    },
    fireMode: "semi"
} satisfies ExportInterface<SimpleGun>;