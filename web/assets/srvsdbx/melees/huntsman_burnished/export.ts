const offset = {
    parr: 0.6,
    perp: -0.4
};

export default {
    name: "Huntsman Burnished",
    displayName: "Huntsman",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-melee-huntsman-burnished.svg",
        world: "./world-melee-huntsman-burnished.svg"
    },
    worldObject: {
        dimensions: {
            width: "auto",
            height: 2.7
        },
        offset: {
            parr: 0.85 + offset.parr,
            perp: 0.75 + offset.perp,
            angle: -srvsdbx_Math.toRad(40, "degrees")
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
            damage: 24,
            time: 100,
            areaOfEffect: {
                offset: {
                    parr: 1.5,
                    perp: 0
                },
                radius: 0.9
            }
        }
    ],
    obstacleMultiplier: 1,
    stonePiercing: false,
    armorPiercing: false,
    useDelay: 250,
    animations: {
        idle: "none",
        using: (() => {
            return Math.random() > 0.6 ?
                {
                    duration: 250,
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
                                        angle: -srvsdbx_Math.toRad(40, "degrees")
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
                                        parr: 0.85,
                                        perp: -0.75
                                    },
                                    rightHand: {
                                        parr: 0.55,
                                        perp: 0.9
                                    }
                                },
                                item: {
                                    offset: {
                                        parr: 0.55 + offset.parr,
                                        perp: 0.9 + offset.perp,
                                        angle: -srvsdbx_Math.toRad(40, "degrees")
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
                                        parr: 0.85,
                                        perp: -0.75
                                    },
                                    rightHand: {
                                        parr: 1.6,
                                        perp: 0.02
                                    }
                                },
                                item: {
                                    offset: {
                                        parr: 1.6 + offset.parr,
                                        perp: 0.02 + offset.perp,
                                        angle: -srvsdbx_Math.toRad(50, "degrees")
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
                                        angle: -srvsdbx_Math.toRad(40, "degrees")
                                    }
                                }
                            }
                        }
                    ]
                }
                :
                {
                    duration: 250,
                    keyframes: [
                        {
                            fraction: 0,
                            easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                            data: {
                                hands: {
                                    leftHand: {
                                        parr: 0.85,
                                        perp: -0.75
                                    },
                                    rightHand: {
                                        parr: 1.3,
                                        perp: -0.09
                                    }
                                },
                                item: {
                                    offset: {
                                        parr: 1.3 + offset.parr - 0.45,
                                        perp: -0.09 + offset.perp - 0.3,
                                        angle: -srvsdbx_Math.toRad(90, "degrees")
                                    }
                                }
                            }
                        },
                        {
                            fraction: 0.1,
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
                                        parr: 1.1 + offset.parr - 0.5,
                                        perp: -0.273861278753 + offset.perp - 0.45,
                                        angle: -srvsdbx_Math.toRad(100, "degrees")
                                    }
                                }
                            }
                        },
                        {
                            fraction: 0.4,
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
                                        parr: 0.85 + offset.parr + 0.05,
                                        perp: 0.75 + offset.perp - 0.1,
                                        angle: -srvsdbx_Math.toRad(55, "degrees")
                                    }
                                }
                            }
                        },
                        {
                            fraction: 0.7,
                            easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                            data: {
                                hands: {
                                    leftHand: {
                                        parr: 0.85,
                                        perp: -0.75
                                    },
                                    rightHand: {
                                        parr: -0.2,
                                        perp: 1.11579568022
                                    }
                                },
                                item: {
                                    offset: {
                                        parr: -0.2 + offset.parr + 0.15,
                                        perp: 1.11579568022 + offset.perp + 0.3,
                                        angle: -srvsdbx_Math.toRad(10, "degrees")
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
                                        angle: -srvsdbx_Math.toRad(40, "degrees")
                                    }
                                }
                            }
                        }
                    ]
                };
        })
    }
} satisfies ExportInterface<SimpleMelee>;