export default {
    name: "Hawk 12G",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-hawk12g.svg",
        world: "./hawk12g.svg",
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
    useDelay: 700,
    deployGroup: 1,
    accuracy: {
        default: srvsdbx_Math.toRad(5, "degrees"),
        moving: srvsdbx_Math.toRad(2, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 2,
        perp: 0
    },
    dimensions: {
        width: "auto",
        height: 3.95,
        layer: 1
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.5, "s"),
        ammoReloaded: "all",
        chain: false
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
            perp: 0.13,
            parr: 2.38
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
            perp: () => srvsdbx_Math.meanDevPM_random(-2.3, 0.7, true),
            parr: () => srvsdbx_Math.meanDevPM_random(-0.5, 0.4, true)
        },
        spawnOn: "fire",
        spawnDelay: 1000
    },
    recoilImpulse: {
        direction: {
            parr: -0.25,
            perp: 0
        },
        duration: 125
    },
    fireMode: "semi"
} satisfies ExportInterface<SimpleGun>;