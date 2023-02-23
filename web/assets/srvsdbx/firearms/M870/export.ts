export default {
    name: "M870",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-m870.svg",
        world: "./gun-long.svg",
    },
    dual: false,
    tint: "#331A00",
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
    useDelay: 900,
    deployGroup: 1,
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
        parr: 1.5,
        perp: 0
    },
    dimensions: {
        width: 0.425,
        height: 3.15,
        layer: 0
    },
    reload: {
        duration: 750,
        ammoReloaded: 1,
        chain: true
    },
    magazineCapacity: {
        normal: 5,
        firepower: 10
    },
    switchDelay: 900,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.325,
            parr: 2.14
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
            perp: () => srvsdbx_Math.meanDevPM_random(-2, 0.6, true),
            parr: () => srvsdbx_Math.meanDevPM_random(-0.5, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 900
    },
    recoilImpulse: {
        direction: {
            parr: -0.25,
            perp: 0
        },
        duration: 125
    },
    fireMode: "semi",
} satisfies ExportInterface<SimpleGun>;