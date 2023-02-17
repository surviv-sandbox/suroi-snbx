export default {
    name: "Groza-S",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-grozas.svg",
        world: "./grozas.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 13,
        velocity: 106,
        range: 185,
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
        falloff: 0.87,
        projectiles: 1
    },
    suppressed: true,
    caliber: "srvsdbx::7.62x39mm",
    useDelay: 78,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(3.5, "degrees"),
        moving: srvsdbx_Math.toRad(7.5, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 2.1,
        perp: 0
    },
    dimensions: {
        width: 0.55,
        height: "auto",
        layer: 1
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.5, "s"),
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
            parr: 1.45,
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
            parr: 0.4,
            perp: 0
        },
        velocity: {
            perp: () => srvsdbx_Math.meanDevPM_random(-1.5, 0.3, true),
            parr: () => srvsdbx_Math.meanDevPM_random(-0.4, 0.3, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.09,
            perp: 0
        },
        duration: 80
    },
    fireMode: "automatic"
};
//# sourceMappingURL=export.js.map