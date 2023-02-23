export default {
    name: "Dual Lasr Gun",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-double-lasr-gun.svg",
        world: "./lasr-gun.svg"
    },
    dual: true,
    tint: "#FFFFFF",
    ballistics: {
        damage: 42,
        velocity: 115,
        range: 240,
        tracer: {
            width: 0.2,
            height: 9
        },
        obstacleMult: 1,
        headshotMult: 1.5,
        firstShotAccuracy: {
            enabled: true,
            rechargeTime: 500
        },
        falloff: 0.75,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::Lasr ammo",
    useDelay: 120,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(3.5, "degrees"),
        moving: srvsdbx_Math.toRad(7.5, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.5,
        perp: 0.525
    },
    dimensions: {
        width: "auto",
        height: 1.8,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(4, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 14,
        firepower: 18
    },
    switchDelay: 300,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.525
        },
        rightHand: {
            parr: 0.85,
            perp: -0.525
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0.525
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