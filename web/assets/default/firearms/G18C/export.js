export default {
    name: "G18C",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-glock.svg",
        world: "./gun-short.svg",
    },
    dual: false,
    tint: "#1E1E1E",
    ballistics: {
        damage: 9,
        velocity: 70,
        range: 44,
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
        falloff: 0.5,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::9x19mm",
    useDelay: 60,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(12, "degrees"),
        moving: srvsdbx_Math.toRad(10, "degrees")
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
        duration: srvsdbx_Math.toMS(1.95, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 17,
        firepower: 31
    },
    switchDelay: 250,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            perp: 0,
            parr: 0.4
        },
        velocity: {
            perp: () => srvsdbx_Math.meanDevPM_random(-1, 0.3, true),
            parr: () => srvsdbx_Math.meanDevPM_random(-0.2, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.08,
            perp: 0
        },
        duration: 50
    },
    fireMode: "automatic"
};
//# sourceMappingURL=export.js.map