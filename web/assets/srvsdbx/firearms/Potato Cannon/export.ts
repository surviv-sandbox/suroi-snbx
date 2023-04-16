export default {
    name: "Potato Cannon",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-potato-cannon.svg",
        world: "./potato-cannon.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 95,
        velocity: 65,
        range: 48,
        tracer: {
            width: "auto",
            height: 1.2,
            forceMaximumLength: true,
            noShrink: true,
            trail: {
                image: "./tracer.svg",
                width: 0.6,
                maxLength: 4,
                tint: "#5A463666",
                offset: {
                    parr: 0,
                    perp: 0
                }
            }
        },
        obstacleMultiplier: 1.3,
        headshotMultiplier: 1,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 1,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::potato",
    useDelay: srvsdbx_Math.toMS(1.2, "s"),
    deployGroup: 3,
    accuracy: {
        default: srvsdbx_Math.toRad(1, "degrees"),
        moving: srvsdbx_Math.toRad(2, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: -3,
        using: 0
    },
    imageOffset: {
        parr: 0.75,
        perp: 1
    },
    dimensions: {
        width: "auto",
        height: 3.7,
        layer: 2
    },
    reload: {
        duration: srvsdbx_Math.toMS(1, "s"),
        ammoReloaded: 1,
        chain: true
    },
    magazineCapacity: {
        normal: 4,
        firepower: 4
    },
    switchDelay: 900,
    handPositions: {
        leftHand: {
            parr: -0.25,
            perp: 1.35
        },
        rightHand: {
            perp: 0.75,
            parr: 1.25
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0.75
    },
    casings: {
        spawnOffset: {
            parr: -0.9,
            perp: 0.8
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.9, 0.4, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.3, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.3
        },
        duration: 300
    },
    fireMode: "semi"
} satisfies ExportInterface<SimpleGun>;