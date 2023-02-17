export default {
    name: "Mosin-Nagant",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-mosin.svg",
        world: "./gun-long.svg"
    },
    dual: false,
    tint: "#331A00",
    ballistics: {
        damage: 72,
        velocity: 178,
        range: 500,
        tracer: {
            width: 0.32,
            height: 200 / 9
        },
        obstacleMult: 1,
        headshotMult: 1.5,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.95,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::7.62x54mmR",
    useDelay: srvsdbx_Math.toMS(1.75, "s"),
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1, "degrees"),
        moving: srvsdbx_Math.toRad(4, "degrees")
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
        width: 0.45,
        height: 4.1,
        layer: 0
    },
    reload: {
        duration: 900,
        ammoReloaded: 1,
        chain: true
    },
    altReload: {
        duration: srvsdbx_Math.toMS(3, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 5,
        firepower: 5
    },
    switchDelay: 1000,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.325,
            parr: 1.875
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            perp: 0,
            parr: 0.8
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.8, 0.2, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.4, 0.5, true)
        },
        spawnOn: "fire",
        spawnDelay: 1000
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.2
        },
        duration: 100
    },
    fireMode: "semi"
};
//# sourceMappingURL=export.js.map