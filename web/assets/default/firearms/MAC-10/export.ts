export default {
    name: "MAC-10",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-mac10.svg",
        world: "./gun-med.svg",
    },
    dual: false,
    tint: "#383838",
    ballistics: {
        damage: 9.25,
        velocity: 75,
        range: 50,
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
        falloff: 0.6,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::9x19mm",
    useDelay: 45,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(10, "degrees"),
        moving: srvsdbx_Math.toRad(11, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.5,
        perp: 0
    },
    dimensions: {
        width: 0.45,
        height: 1.5,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(1.8, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 32,
        firepower: 50
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 1.7,
            perp: 0.3
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.3,
            perp: 0,
        },
        velocity: {
            perp: () => srvsdbx_Math.meanDevPM_random(-1.4, 0.3, true),
            parr: () => srvsdbx_Math.meanDevPM_random(-0.5, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.08,
            perp: 0
        },
        duration: 70
    },
    fireMode: "automatic"
} satisfies ExportInterface<SimpleGun>;