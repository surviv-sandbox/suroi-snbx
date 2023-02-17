export default {
    name: "Mk 20 SSR",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-scarssr.svg",
        world: "./scarssr.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 60,
        velocity: 108,
        range: 200,
        tracer: {
            width: 0.15,
            height: 20
        },
        obstacleMult: 1,
        headshotMult: 1.5,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.85,
        projectiles: 1
    },
    suppressed: true,
    caliber: "srvsdbx::.308 Subsonic",
    useDelay: 300,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1.5, "degrees"),
        moving: srvsdbx_Math.toRad(5.5, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        perp: 0,
        parr: 2.3
    },
    dimensions: {
        width: "auto",
        height: 4,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.7, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 10,
        firepower: 20
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 2.2,
            perp: 0.3
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.9,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.6, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.4, 0.5, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.18,
            perp: 0
        },
        duration: 100
    },
    fireMode: "semi",
} satisfies ExportInterface<SimpleGun>;