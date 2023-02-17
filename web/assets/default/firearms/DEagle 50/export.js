export default {
    name: "DEagle 50",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-deagle.svg",
        world: "./deagle.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 35,
        velocity: 115,
        range: 120,
        tracer: {
            width: 0.2,
            height: 10
        },
        obstacleMult: 1,
        headshotMult: 2,
        firstShotAccuracy: {
            enabled: true,
            rechargeTime: 500
        },
        falloff: 0.75,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::.50AE",
    useDelay: 160,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(2.5, "degrees"),
        moving: srvsdbx_Math.toRad(6, "degrees")
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
        width: "auto",
        height: 2.15,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.3, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 7,
        firepower: 9
    },
    switchDelay: 350,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
    },
    projectileSpawnOffset: {
        perp: 0,
        parr: 0
    },
    casings: {
        spawnOffset: {
            perp: 0,
            parr: 0.4
        },
        velocity: {
            perp: () => srvsdbx_Math.meanDevPM_random(-1, 0.2, true),
            parr: () => srvsdbx_Math.meanDevPM_random(-0.2, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.12,
            perp: 0
        },
        duration: 110
    },
    fireMode: "semi",
};
//# sourceMappingURL=export.js.map