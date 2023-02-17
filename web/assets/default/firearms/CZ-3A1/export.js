export default {
    name: "CZ-3A1",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-scorpion.svg",
        world: "./cz3a1.svg",
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 10.75,
        velocity: 90,
        range: 120,
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
        falloff: 0.77,
        projectiles: 1
    },
    suppressed: true,
    caliber: "srvsdbx::9x19mm",
    useDelay: 55,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(4, "degrees"),
        moving: srvsdbx_Math.toRad(5, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.8,
        perp: 0
    },
    dimensions: {
        width: "auto",
        height: 3,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.2, "s"),
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
            parr: 2.15,
            perp: 0.3
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.8,
            perp: 0
        },
        velocity: {
            perp: () => srvsdbx_Math.meanDevPM_random(-1.2, -0.5, false),
            parr: () => srvsdbx_Math.meanDevPM_random(-0.4, -0.2, false),
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.1,
            perp: 0
        },
        duration: 55
    },
    fireMode: "automatic"
};
//# sourceMappingURL=export.js.map