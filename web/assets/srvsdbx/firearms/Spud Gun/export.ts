export default {
    name: "Spud Gun",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-potato-smg.svg",
        world: "./potato-smg.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 12,
        velocity: 85,
        range: 60,
        tracer: {
            width: "auto",
            height: 1.2,
            trail: {
                image: "./tracer.svg",
                width: 0.4,
                maxLength: 3,
                tint: "#5A563666",
                offset: {
                    parr: 0,
                    perp: 0
                }
            }
        },
        effectsOnHit: ["srvsdbx::potato-smg-hit"],
        obstacleMult: 1.25,
        headshotMult: 2,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 1,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::Potato Spud",
    useDelay: 90,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(3, "degrees"),
        moving: srvsdbx_Math.toRad(4, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 2.2,
        perp: -0.15
    },
    dimensions: {
        width: "auto",
        height: 3.2,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 30,
        firepower: 40
    },
    switchDelay: 900,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            perp: 0.3,
            parr: 1.7,
            layer: 0
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.3,
            perp: -1.1
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(0, 1, true),
            perp: () => srvsdbx_Math.meanDevPM_random(1.2, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.13
        },
        duration: 80
    },
    fireMode: "automatic"
} satisfies ExportInterface<SimpleGun>;