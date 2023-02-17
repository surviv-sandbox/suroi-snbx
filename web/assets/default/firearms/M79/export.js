export default {
    name: "M79",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-m79.svg",
        world: "./m79.svg",
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 125,
        velocity: 20,
        range: 18,
        tracer: {
            width: "auto",
            height: 0.8
        },
        obstacleMult: 1.3,
        headshotMult: 1,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 1,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::40mm",
    useDelay: 0,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(0, "degrees"),
        moving: srvsdbx_Math.toRad(7.5, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: -3,
        using: 0
    },
    imageOffset: {
        perp: 0.95,
        parr: 0.625
    },
    dimensions: {
        width: "auto",
        height: 2.75,
        layer: 2
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.3, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 1,
        firepower: 1
    },
    switchDelay: 900,
    handPositions: {
        leftHand: {
            parr: 0.13,
            perp: 1.35
        },
        rightHand: {
            parr: 1.6,
            perp: 0.75
        }
    },
    projectileSpawnOffset: {
        parr: -0.8,
        perp: 0.95
    },
    casings: {
        spawnOffset: {
            parr: -0.8,
            perp: 0.95
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(0, 0.4, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1, -0.8, false)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.3,
            perp: 0
        },
        duration: 150
    },
    fireMode: "semi",
};
//# sourceMappingURL=export.js.map