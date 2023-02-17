export default {
    name: "DP-28",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-dp28.svg",
        world: "./dp28.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 14,
        velocity: 110,
        range: 225,
        tracer: {
            width: 0.15,
            height: 20
        },
        obstacleMult: 1.5,
        headshotMult: 2,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.9,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::7.62x54mmR",
    useDelay: 115,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(11, "degrees"),
        moving: srvsdbx_Math.toRad(0.75, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: -2
    },
    imageOffset: {
        parr: 2,
        perp: 0
    },
    dimensions: {
        width: "auto",
        height: 3.1,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(3.3, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 60,
        firepower: 80
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.3,
            parr: 2.2,
            layer: 0
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            perp: 0,
            parr: 0.8
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.4, 0.2, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.3, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.12
        },
        duration: 90
    },
    fireMode: "automatic",
} satisfies ExportInterface<SimpleGun>;