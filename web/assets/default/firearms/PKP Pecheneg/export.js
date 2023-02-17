export default {
    name: "PKP Pecheneg",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-pkp.svg",
        world: "./pkp.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 18,
        velocity: 120,
        range: 200,
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
        falloff: 0.9,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::7.62x54mmR",
    useDelay: 100,
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
        parr: 1.9,
        perp: 0
    },
    dimensions: {
        width: "auto",
        height: 3,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(5, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 200,
        firepower: 250
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            perp: 0.1,
            parr: 0.85
        },
        rightHand: {
            perp: 0.3,
            parr: 2.2
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
            parr: () => srvsdbx_Math.meanDevPM_random(-0.4, 0.2, true),
            perp: () => srvsdbx_Math.meanDevPM_random(1.5, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.1
        },
        duration: 90
    },
    fireMode: "automatic",
};
//# sourceMappingURL=export.js.map