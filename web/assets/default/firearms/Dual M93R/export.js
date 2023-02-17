export default {
    name: "Dual M93R",
    displayName: "M93R",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-m93r-dual.svg",
        world: "./gun-short.svg"
    },
    dual: true,
    tint: "#2A381B",
    ballistics: {
        damage: 12,
        velocity: 85,
        range: 100,
        tracer: {
            width: 0.15,
            height: 10
        },
        obstacleMult: 1,
        headshotMult: 2,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.7,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::9x19mm",
    useDelay: 100,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(7, "degrees"),
        moving: srvsdbx_Math.toRad(6, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        perp: 0.525,
        parr: 1.35
    },
    dimensions: {
        width: 0.43,
        height: 1.5,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(3.3, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 40,
        firepower: 60
    },
    switchDelay: 250,
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
        perp: 0.525,
    },
    casings: {
        spawnOffset: {
            parr: 0.4,
            perp: 0.525
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.2, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.08,
            perp: 0
        },
        duration: 90
    },
    fireMode: "auto-burst-3",
    burstProps: {
        shotDelay: 40,
        burstDelay: 180
    }
};
//# sourceMappingURL=export.js.map