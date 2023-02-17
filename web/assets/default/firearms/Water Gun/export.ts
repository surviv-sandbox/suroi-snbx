export default {
    name: "Water Gun",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-water.svg",
        world: "./water-gun.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 5.5,
        velocity: 100,
        range: 200,
        tracer: {
            width: 0.15,
            height: 20
        },
        effectsOnHit: ["srvsdbx::wet"],
        obstacleMult: 1,
        headshotMult: 2,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.9,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::Water",
    useDelay: srvsdbx_Math.toMS(600, "RPM"),
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(2.5, "degrees"),
        moving: srvsdbx_Math.toRad(7.5, "degrees")
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
        height: "auto",
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.5, "s"),
        ammoReloaded: "all",
        chain: true
    },
    magazineCapacity: {
        normal: 30,
        firepower: 40
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 1.875,
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
            parr: () => srvsdbx_Math.meanDevPM_random(-0.9, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-2, 1.7, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.12,
            perp: 0
        },
        duration: 80
    },
    fireMode: "automatic"
} satisfies ExportInterface<SimpleGun>;