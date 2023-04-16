const offset = {
    parr: -0.1,
    perp: -0.19
};

export default {
    name: "Panzerhammer",
    displayName: "War Hammer",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-melee-warhammer-tank.svg",
        world: "./world-melee-warhammer-tank.svg"
    },
    worldObject: {
        dimensions: {
            width: 5.4,
            height: "auto",
            layer: 1
        },
        offset: {
            parr: 0.9 + offset.parr,
            perp: 0.75 + offset.perp,
            angle: 0
        },
        tint: "#FFFFFF"
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 1,
        using: 0
    },
    autoAttack: false,
    damages: [
        {
            damage: 64,
            time: 300,
            areaOfEffect: {
                offset: {
                    parr: 1.5,
                    perp: 0
                },
                radius: 1.75
            }
        }
    ],
    handPositions: {
        leftHand: {
            parr: 0.9,
            perp: -0.55
        },
        rightHand: {
            parr: 0.9,
            perp: 0.75
        }
    },
    obstacleMultiplier: 1.92,
    stonePiercing: true,
    armorPiercing: true,
    useDelay: 600,
    animations: {
        idle: "none",
        using: {
            duration: 600,
            keyframes: [
                {
                    fraction: 0,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.9,
                                perp: -0.55
                            },
                            rightHand: {
                                parr: 0.9,
                                perp: 0.75
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.9 + offset.parr,
                                perp: 0.75 + offset.perp,
                                angle: 0
                            }
                        }
                    }
                },
                {
                    fraction: 0.2,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 1.13,
                                perp: -0.23
                            },
                            rightHand: {
                                parr: 0.65,
                                perp: 0.924
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.65 + offset.parr + 0.1,
                                perp: 0.924 + offset.perp - 0.1,
                                angle: srvsdbx_Math.toRad(25, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.35,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.75,
                                perp: -0.85
                            },
                            rightHand: {
                                parr: 1.2,
                                perp: 0.2
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.2 + offset.parr,
                                perp: 0.2 + offset.perp,
                                angle: -srvsdbx_Math.toRad(23.5, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.5,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: -0.23,
                                perp: -1.13
                            },
                            rightHand: {
                                parr: 1.15,
                                perp: -0.75
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.15 + offset.parr - 0.4,
                                perp: -0.75 + offset.perp + 0.05,
                                angle: -srvsdbx_Math.toRad(72, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.75,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.75,
                                perp: -0.85
                            },
                            rightHand: {
                                parr: 1.116,
                                perp: 0.174
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.116 + offset.parr + 0.1,
                                perp: 0.174 + offset.perp,
                                angle: -srvsdbx_Math.toRad(23.5, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 1,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.9,
                                perp: -0.55
                            },
                            rightHand: {
                                parr: 0.9,
                                perp: 0.75
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.9 + offset.parr,
                                perp: 0.75 + offset.perp,
                                angle: 0
                            }
                        }
                    }
                }
            ]
        }
    }
} satisfies ExportInterface<SimpleMelee>;