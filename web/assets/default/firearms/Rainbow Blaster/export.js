export default {
    name: "Rainbow Blaster",
    displayName: "R. Blaster",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-weapon-rainbow-blaster.svg",
        world: "./rainbow-blaster.svg"
    },
    dual: false,
    tint: "#FFFFFF",
    ballistics: {
        damage: 0,
        velocity: 85,
        range: 250,
        tracer: {
            width: 0.4,
            height: 20,
            drawAbovePlayer: true,
            forceMaximumLength: true
        },
        obstacleMult: 1000,
        headshotMult: 1,
        firstShotAccuracy: {
            enabled: true,
            rechargeTime: 500
        },
        falloff: 0.75,
        projectiles: 1
    },
    suppressed: false,
    caliber: "srvsdbx::Rainbow Ammo",
    useDelay: 160,
    deployGroup: 0,
    accuracy: {
        default: srvsdbx_Math.toRad(2.5, "degrees"),
        moving: srvsdbx_Math.toRad(6, "degrees")
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 0,
        using: 0
    },
    imageOffset: {
        parr: 2.55,
        perp: 0
    },
    dimensions: {
        width: "auto",
        height: 3.9,
        layer: 2
    },
    reload: {
        duration: srvsdbx_Math.toMS(0, "s"),
        ammoReloaded: "all",
        chain: false
    },
    magazineCapacity: {
        normal: 1,
        firepower: 1
    },
    switchDelay: 300,
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: 0.1
        },
        rightHand: {
            perp: 0.275,
            parr: 1.7
        }
    },
    projectileSpawnOffset: {
        parr: 0,
        perp: 0
    },
    casings: {
        count: 10,
        spawnOffset: {
            parr: 0.4,
            perp: -0.3
        },
        velocity: {
            parr: () => srvsdbx_Math.meanDevPM_random(0, 0.9, true),
            perp: () => srvsdbx_Math.meanDevPM_random(0, 1.3, false)
        },
        spawnOn: "fire",
        spawnDelay: 0
    },
    recoilImpulse: {
        direction: {
            perp: 0,
            parr: -0.13
        },
        duration: 80
    },
    fireMode: "release-charge",
    chargeProps: {
        chargeTime: srvsdbx_Math.toMS(1.5, "s"),
        speedPenalty: -0.2,
        chargeImage: {
            image: "./rainbow-blaster-loaded.svg"
        },
        chargeImageHUD: {
            image: "./rainbow_load.png",
            growStyle: "clip"
        },
        chargeParticle: {
            particle: "srvsdbx::rainbow_ball",
            offset: {
                parr: 4.5,
                perp: 0
            },
            scale: (_, gun) => {
                const s = (gamespace.currentUpdate - gun.chargeStart) / gun.prototype.chargeProps.chargeTime;
                if (Number.isNaN(s))
                    return 1;
                return Math.clamp(s, 0, 1);
            },
            alpha: Math.random
        }
    },
    addons: [
        {
            images: ["./gun-rainbow-top.svg"],
            tint: "#FFFFFF",
            show: gun => gun.isCharging || gun.charged,
            dimensions: {
                width: 0.35,
                height: gun => {
                    const s = (gamespace.currentUpdate - gun.chargeStart) / gun.prototype.chargeProps.chargeTime;
                    if (Number.isNaN(s))
                        return 0.92;
                    return 0.92 * Math.clamp(s, 0, 1);
                },
                layer: 1
            },
            dual: false,
            position: {
                parr: gun => {
                    const s = (gamespace.currentUpdate - gun.chargeStart) / gun.prototype.chargeProps.chargeTime;
                    if (Number.isNaN(s))
                        return 2.59;
                    return 2.13 + 0.46 * Math.clamp(s, 0, 1);
                },
                perp: 0.02
            }
        }
    ]
};
//# sourceMappingURL=export.js.map