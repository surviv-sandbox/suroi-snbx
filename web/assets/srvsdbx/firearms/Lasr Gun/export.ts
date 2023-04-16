export default {
    name: "Lasr Gun",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-lasr-gun.svg",
        world: "./lasr-gun.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 42,
        velocity: 115,
        range: 240,
        tracer: {
            width: 0.2,
            height: 9
        },
        obstacleMultiplier: 1,
        headshotMultiplier: 1.5,
        firstShotAccuracy: {
            enabled: true,
            rechargeTime: 500
        },
        falloff: 0.75,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::lasr",
    useDelay: 160,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(2.5, "degrees"),
        moving: srvsdbx_Math.toRad(6, "degrees")
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
        width: "auto",
        height: 1.8,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.3, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 7,
        firepower: 9
    },
    switchDelay: 300,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.09,
            perp: 0
        },
        duration: 100
    },
    fireMode: "semi"
} satisfies ExportInterface<SimpleGun>;