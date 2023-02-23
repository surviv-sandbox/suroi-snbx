const offset = {
    parr: 0.5,
    perp: 0
};

export default {
    name: "Hook",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-melee-hook-silver.svg",
        world: "./world-melee-hook-silver.svg"
    },
    worldObject: {
        dimensions: {
            width: "auto",
            height: 1.5,
            layer: 2
        },
        offset: {
            parr: 0.85 + offset.parr,
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
    autoAttack: true,
    damages: [
        {
            damage: 18,
            time: 75,
            areaOfEffect: {
                offset: {
                    parr: 1,
                    perp: 0
                },
                radius: 0.9
            }
        }
    ],
    obstacleMult: 1,
    useDelay: 175,
    animations: {
        idle: "none",
        using: {
            duration: 175,
            keyframes: [
                {
                    fraction: 0,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.85,
                                perp: -0.75
                            },
                            rightHand: {
                                parr: 0.85,
                                perp: 0.75
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.85 + offset.parr,
                                perp: 0.75 + offset.perp,
                                angle: srvsdbx_Math.toRad(0, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.1,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.85,
                                perp: -0.75
                            },
                            rightHand: {
                                parr: 0.85,
                                perp: 0.75
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.85 + offset.parr,
                                perp: 0.75 + offset.perp + 0.2,
                                angle: srvsdbx_Math.toRad(18, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.5,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.85,
                                perp: -0.75
                            },
                            rightHand: {
                                parr: 1.13,
                                perp: 0.09
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.13 + offset.parr,
                                perp: 0.09 + offset.perp - 0.1,
                                angle: -srvsdbx_Math.toRad(10, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.8,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.85,
                                perp: -0.75
                            },
                            rightHand: {
                                parr: 1.1,
                                perp: -0.273861278753
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.1 + offset.parr,
                                perp: -0.273861278753 + offset.perp - 0.2,
                                angle: -srvsdbx_Math.toRad(25, "degrees")
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
                                parr: 0.85,
                                perp: -0.75
                            },
                            rightHand: {
                                parr: 0.85,
                                perp: 0.75
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.85 + offset.parr,
                                perp: 0.75 + offset.perp,
                                angle: srvsdbx_Math.toRad(0, "degrees")
                            }
                        }
                    }
                }
            ]
        }
    }
} satisfies ExportInterface<SimpleMelee>;