const offset = {
    parr: 3.25,
    perp: -1.2
};

export default {
    name: "Foil",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-melee-foil.svg",
        world: "./world-melee-foil.svg"
    },
    worldObject: {
        dimensions: {
            width: 5,
            height: "auto",
            layer: 0
        },
        offset: {
            parr: 0 + offset.parr,
            perp: 1.2 + offset.perp,
            angle: -srvsdbx_Math.toRad(90, "degrees")
        },
        tint: "#FFFFFF"
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 1,
        using: -3
    },
    autoAttack: false,
    damages: [
        {
            damage: 80,
            time: 70,
            areaOfEffect: {
                offset: {
                    parr: 5.2,
                    perp: 0
                },
                radius: 1.6
            }
        }
    ],
    handPositions: {
        leftHand: {
            parr: -0.2,
            perp: -0.9
        },
        rightHand: {
            parr: 1.2,
            perp: 0
        }
    },
    maxTargets: Infinity,
    obstacleMultiplier: 1,
    armorPiercing: true,
    stonePiercing: false,
    useDelay: 600,
    animations: {
        idle: "none",
        using: {
            duration: 600,
            keyframes: [
                {
                    fraction: 0,
                    data: {
                        hands: {
                            leftHand: {
                                parr: -0.2,
                                perp: -0.9
                            },
                            rightHand: {
                                parr: 1.2,
                                perp: 0
                            }
                        },
                        item: {
                            offset: {
                                parr: 0 + offset.parr,
                                perp: 1.2 + offset.perp,
                                angle: -srvsdbx_Math.toRad(90, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 1 / 3,
                    easing: srvsdbx_Animation.easingFunctions.easeOutExpo.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: -0.8,
                                perp: -0.7
                            },
                            rightHand: {
                                parr: 2,
                                perp: 0
                            }
                        },
                        item: {
                            dimensions: {
                                width: 6,
                                height: 1150 / 6500 * 5
                            },
                            offset: {
                                parr: 0.8 + offset.parr + 0.3,
                                perp: 1.2 + offset.perp,
                                angle: -srvsdbx_Math.toRad(90, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.5,
                    data: {
                        hands: {
                            leftHand: {
                                parr: -0.8,
                                perp: -0.7
                            },
                            rightHand: {
                                parr: 2,
                                perp: 0
                            }
                        },
                        item: {
                            dimensions: {
                                width: 6,
                                height: 1150 / 6500 * 5
                            },
                            offset: {
                                parr: 0.8 + offset.parr + 0.3,
                                perp: 1.2 + offset.perp,
                                angle: -srvsdbx_Math.toRad(90, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 1,
                    easing: srvsdbx_Animation.easingFunctions.easeOutCirc.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: -0.2,
                                perp: -0.9
                            },
                            rightHand: {
                                parr: 1.2,
                                perp: 0
                            }
                        },
                        item: {
                            offset: {
                                parr: 0 + offset.parr,
                                perp: 1.2 + offset.perp,
                                angle: -srvsdbx_Math.toRad(90, "degrees")
                            }
                        }
                    }
                }
            ]
        }
    }
} satisfies ExportInterface<SimpleMelee>;