export default {
    name: "M9A17",
    displayName: "Flamethrower",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-m9a17.svg",
        world: "./m9a17.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 0,
        velocity: 50,
        range: 32,
        tracer: {
            width: "auto",
            height: 1.6,
            forceMaximumLength: true
        },
        effectsOnHit: ["srvsdbx::burn"],
        obstacleMult: 1.25,
        headshotMult: 1,
        firstShotAccuracy: {
            enabled: true,
            rechargeTime: 500
        },
        falloff: 0.75,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::Fire Shot",
    useDelay: 15,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(10, "degrees"),
        moving: srvsdbx_Math.toRad(10, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 2.55,
        perp: 0
    },
    dimensions: {
        width: "auto",
        height: 3.9,
        layer: 1
    },
    reload: {
        duration: srvsdbx_Math.toMS(4, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 60,
        firepower: 70
    },
    switchDelay: 300,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 2.6,
            perp: -0.275
        }
    },
    projectileSpawnOffset: {
        parr: -0.3,
        perp: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.07
        },
        duration: 80
    },
    fireMode: "automatic"
} satisfies ExportInterface<SimpleGun>;