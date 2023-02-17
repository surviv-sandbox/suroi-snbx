export default {
    name: "Dual Peacemaker",
    displayName: "Peacemaker",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-colt45-dual.svg",
        world: "./gun-short.svg"
    },
    dual: true,
    tint: "#C4C4C4",
    ballistics: {
        damage: 29,
        velocity: 106,
        range: 110,
        tracer: {
            width: 0.15,
            height: 10
        },
        obstacleMult: 1,
        headshotMult: 1.5,
        firstShotAccuracy: {
            enabled: true,
            rechargeTime: 350
        },
        falloff: 0.75,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::.45ACP",
    useDelay: 130,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(16, "degrees"),
        moving: srvsdbx_Math.toRad(3, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 1.4,
        perp: 0.525
    },
    dimensions: {
        width: 0.43,
        height: 1.4,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(6.1, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 12,
        firepower: 12
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
            parr: () => srvsdbx_Math.meanDevPM_random(-1.2, 0.2, true),
            perp: () => srvsdbx_Math.meanDevPM_random(0, 2.3, true)
        },
        spawnOn: "reload",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.07
        },
        duration: 70
    },
    fireMode: "automatic",
};
//# sourceMappingURL=export.js.map