export default {
    name: "PKM",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-pkm-lmg.svg",
        world: "./pkm.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 15,
        velocity: 130,
        range: 200,
        tracer: {
            width: 0.15,
            height: 20
        },
        obstacleMult: 2,
        headshotMult: 2,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.9,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::7.62x54mmR",
    useDelay: srvsdbx_Math.toMS(600, "RPM"),
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(2.5, "degrees"),
        moving: srvsdbx_Math.toRad(7.5, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: -5
    },
    imageOffset: {
        parr: 2.55,
        perp: -0.02
    },
    dimensions: {
        width: "auto",
        height: 3.9,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(6, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 100,
        firepower: 200
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 2.4,
            perp: 0.3
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.7,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.4, 0.2, true),
            perp: () => srvsdbx_Math.meanDevPM_random(1.2, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.13,
            perp: 0
        },
        duration: 100
    },
    fireMode: "automatic"
};
//# sourceMappingURL=export.js.map