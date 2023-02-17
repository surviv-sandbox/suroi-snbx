export default {
    name: "Dual OT-38",
    displayName: "OT-38",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-ot38-dual.svg",
        world: "./gun-short.svg"
    },
    dual: true,
    tint: "#707070",
    ballistics: {
        damage: 26,
        velocity: 112,
        range: 125,
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
        falloff: 0.75,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::7.62x41mm",
    useDelay: 200,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(1.75, "degrees"),
        moving: srvsdbx_Math.toRad(4, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.2,
        perp: 0.525
    },
    dimensions: {
        width: 0.43,
        height: 1.4,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(3.8, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 10,
        firepower: 10
    },
    switchDelay: 300,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.525
        },
        rightHand: {
            parr: 0.85,
            perp: -0.525
        },
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0.525
    },
    casings: {
        spawnOffset: {
            parr: 0.2,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-2, 1, true),
            perp: () => srvsdbx_Math.meanDevPM_random(0, 3, true)
        },
        spawnOn: "reload",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.08
        },
        duration: 70
    },
    fireMode: "semi",
};
//# sourceMappingURL=export.js.map