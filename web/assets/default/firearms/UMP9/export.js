export default {
    name: "UMP9",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-ump9.svg",
        world: "./gun-med.svg",
    },
    dual: false,
    tint: "#121212",
    ballistics: {
        damage: 15,
        velocity: 100,
        range: 100,
        tracer: {
            width: 0.15,
            height: 20
        },
        obstacleMult: 1,
        headshotMult: 2,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.75,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::9x19mm",
    useDelay: 100,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1.5, "degrees"),
        moving: srvsdbx_Math.toRad(3, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.45,
        perp: 0
    },
    dimensions: {
        width: 0.45,
        height: 2,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(1.9, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 30,
        firepower: 40
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 1.9,
            perp: 0.3
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.5,
            perp: 0,
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.6, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.4, 0.4, true),
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.08,
            perp: 0
        },
        duration: 75
    },
    fireMode: "auto-burst-3",
    burstProps: {
        burstDelay: 350,
        shotDelay: 70
    }
};
//# sourceMappingURL=export.js.map