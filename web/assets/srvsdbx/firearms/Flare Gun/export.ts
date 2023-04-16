export default {
    name: "Flare Gun",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-flare-gun.svg",
        world: "./gun-short.svg"
    },
    dual: false,
    tint: "#FF5400",
    ballistics: {
        damage: 0,
        noCollide: true,
        velocity: 4,
        range: 16,
        tracer: {
            width: 2,
            height: 2,
            drawAbovePlayer: true,
            forceMaximumLength: true,
            noShrink: true,
            trail: {
                image: "tracer.svg",
                width: 0.5,
                maxLength: 16,
                tint: "#E2E2E2",
                offset: {
                    parr: 0,
                    perp: 0
                }
            },
            offset: {
                parr: -1,
                perp: 0
            }
        },
        obstacleMultiplier: 1,
        headshotMultiplier: 2,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 10,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::flare",
    useDelay: srvsdbx_Math.toMS(400, "ms"),
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(3, "degrees"),
        moving: srvsdbx_Math.toRad(1.25, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.3,
        perp: 0
    },
    dimensions: {
        width: 0.43,
        height: 1.5,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 1,
        firepower: 1
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
    casings: {
        spawnOffset: {
            parr: 0.2,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(0.2, 0.1, true),
            perp: () => -srvsdbx_Math.bounds_random(0.2, 0.6)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.08,
            perp: 0
        },
        duration: 120
    },
    fireMode: "semi"
} satisfies ExportInterface<SimpleGun>;