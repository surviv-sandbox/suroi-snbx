const offset = {
    parr: 0.19,
    perp: -0.282
};

export default {
    name: "Wood Axe Bloodstained",
    displayName: "Wood Axe",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-melee-woodaxe-bloody.svg",
        world: "./world-melee-woodaxe-bloody.svg"
    },
    worldObject: {
        dimensions: {
            width: 3.2,
            height: "auto",
            layer: 1
        },
        offset: {
            parr: 1.09 + offset.parr,
            perp: 0.382 + offset.perp,
            angle: -srvsdbx_Math.toRad(20, "degrees")
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
            damage: 36,
            time: 180,
            areaOfEffect: {
                offset: {
                    parr: 1.35,
                    perp: 0
                },
                radius: 1
            }
        }
    ],
    handPositions: {
        leftHand: {
            parr: 0.6375,
            perp: -0.872
        },
        rightHand: {
            parr: 1.09,
            perp: 0.382
        }
    },
    obstacleMult: 1.92,
    useDelay: 360,
    animations: {
        idle: "none",
        using: {
            duration: 360,
            keyframes: [
                {
                    fraction: 0,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.6375,
                                perp: -0.872
                            },
                            rightHand: {
                                parr: 1.09,
                                perp: 0.382
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.09 + offset.parr,
                                perp: 0.382 + offset.perp,
                                angle: -srvsdbx_Math.toRad(20, "degrees")
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
                                parr: 0.95,
                                perp: -0.618465843843
                            },
                            rightHand: {
                                parr: 0.75,
                                perp: 0.85
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.75 + offset.parr + 0.2,
                                perp: 0.85 + offset.perp - 0.1,
                                angle: srvsdbx_Math.toRad(5, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.45,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.175,
                                perp: -1.11998883923
                            },
                            rightHand: {
                                parr: 1.13357840488,
                                perp: 0
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.13357840488 + offset.parr - 0.2,
                                perp: 0 + offset.perp - 0.2,
                                angle: -srvsdbx_Math.toRad(40.5, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.6,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: -0.6,
                                perp: -0.961769203084
                            },
                            rightHand: {
                                parr: 0.75,
                                perp: -0.85
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.75 + offset.parr - 0.4,
                                perp: -0.85 + offset.perp - 0.1,
                                angle: -srvsdbx_Math.toRad(86, "degrees")
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
                                parr: 0.175,
                                perp: -1.11998883923
                            },
                            rightHand: {
                                parr: 1.13357840488,
                                perp: 0
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.13357840488 + offset.parr - 0.2,
                                perp: 0 + offset.perp - 0.2,
                                angle: -srvsdbx_Math.toRad(40.5, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 1,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.6375,
                                perp: -0.872
                            },
                            rightHand: {
                                parr: 1.09,
                                perp: 0.382
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.09 + offset.parr,
                                perp: 0.382 + offset.perp,
                                angle: -srvsdbx_Math.toRad(20, "degrees")
                            }
                        }
                    }
                }
            ]
        }
    }
} satisfies ExportInterface<SimpleMelee>;