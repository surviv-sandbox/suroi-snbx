export default {
    name: "Groza",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-groza.svg",
        world: "./groza.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 12.5,
        velocity: 104,
        range: 175,
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
        falloff: 0.85,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::7.62x39mm",
    useDelay: 78,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(5, "degrees"),
        moving: srvsdbx_Math.toRad(9, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.8,
        perp: 0
    },
    dimensions: {
        width: "auto",
        height: 2.2,
        layer: 1
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.5, "s"),
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
            parr: 1.45,
            perp: 0.1
        },
        rightHand: {
            parr: 2.4,
            perp: 0.3
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.4,
            perp: 0
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
            parr: -0.09,
            perp: 0
        },
        duration: 80
    },
    fireMode: "automatic"
} satisfies ExportInterface<SimpleGun>;