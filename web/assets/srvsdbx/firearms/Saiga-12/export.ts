export default {
    name: "Saiga-12",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-saiga.svg",
        world: "./saiga.svg",
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 12.5,
        velocity: 66,
        range: 27,
        tracer: {
            width: 0.15,
            height: 160 / 9
        },
        obstacleMult: 1,
        headshotMult: 1.5,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.3,
        projectiles: 9
    },
    suppressed: false,
    caliber: "srvsdbx::12 gauge (buckshot)",
    useDelay: 400,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(10, "degrees"),
        moving: srvsdbx_Math.toRad(2, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.95,
        perp: 0
    },
    dimensions: {
        width: "auto",
        height: 2.675,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.5, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 5,
        firepower: 8
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.3,
            parr: 2.05
        }
    },
    projectileSpawnOffset: {
        perp: 0,
        parr: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.6,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.5, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.4, 0.8, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.2,
            perp: 0
        },
        duration: 125
    },
    fireMode: "automatic"
} satisfies ExportInterface<SimpleGun>;