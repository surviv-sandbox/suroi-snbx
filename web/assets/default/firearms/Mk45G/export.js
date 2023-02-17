export default {
    name: "Mk45G",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-mkg45.svg",
        world: "./gun-long.svg"
    },
    dual: false,
    tint: "#353535",
    ballistics: {
        damage: 28,
        velocity: 126,
        range: 145,
        tracer: {
            width: 0.15,
            height: 20
        },
        obstacleMult: 1,
        headshotMult: 2,
        firstShotAccuracy: {
            enabled: true,
            rechargeTime: 200
        },
        falloff: 0.75,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::.45ACP",
    useDelay: 170,
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
        perp: 0,
        parr: 1.7
    },
    dimensions: {
        width: 0.45,
        height: 3,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.1, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 13,
        firepower: 26
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 1.95,
            perp: 0.3
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.55,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.5, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-1.2, 0.4, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            parr: -0.09,
            perp: 0
        },
        duration: 90
    },
    fireMode: "semi",
};
//# sourceMappingURL=export.js.map