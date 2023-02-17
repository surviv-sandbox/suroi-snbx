export default {
    name: "M1911",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-m1911.svg",
        world: "./gun-short.svg"
    },
    dual: false,
    tint: "#929292",
    ballistics: {
        damage: 14,
        velocity: 80,
        range: 88,
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
    caliber: "srvsdbx::.45ACP",
    useDelay: 100,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(6, "degrees"),
        moving: srvsdbx_Math.toRad(7, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.35,
        perp: 0
    },
    dimensions: {
        width: "auto",
        height: 1.5,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.1, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 7,
        firepower: 12
    },
    switchDelay: 250,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.4,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.3, 0.4, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-0.9, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.09
        },
        duration: 80
    },
    fireMode: "semi",
};
//# sourceMappingURL=export.js.map