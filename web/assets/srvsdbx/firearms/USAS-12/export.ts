export default {
    name: "USAS-12",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-usas.svg",
        world: "./usas.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 12,
        velocity: 72,
        range: (gun, shooter) => Math.min(24, (() => {
            try { return Math.max(0, srvsdbx_Geometry.Vector2D.distanceBetweenPts(shooter.aimPoint, shooter.body.origin) / gamespace.PLAYER_SIZE - 3.15); }
            catch { return 24; }
        })()),
        tracer: {
            width: 0.15,
            height: 160 / 9
        },
        obstacleMultiplier: 1,
        headshotMultiplier: 1.5,
        firstShotAccuracy: {
            enabled: false,
            rechargeTime: 1e10
        },
        falloff: 0.3,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::frag12",
    useDelay: 500,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(3, "degrees"),
        moving: srvsdbx_Math.toRad(6, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: -1
    },
    imageOffset: {
        parr: 1.7,
        perp: 0
    },
    dimensions: {
        width: "auto",
        height: 3.15,
        layer: 0
    },
    reload: {
        duration: srvsdbx_Math.toMS(2.9, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 10,
        firepower: 20
    },
    switchDelay: 750,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            parr: 2.14,
            perp: 0.325
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        spawnOffset: {
            parr: 0.6,
            perp: 0
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(-0.6, 0.3, true),
            perp: () => srvsdbx_Math.meanDevPM_random(-2.1, 0.9, true)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.25
        },
        duration: 125
    },
    fireMode: "automatic",
} satisfies ExportInterface<SimpleGun>;