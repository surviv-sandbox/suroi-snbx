const offset = {
    parr: 0.18,
    perp: -0.32
};

export default {
    name: "Crowbar Recon",
    displayName: "Crowbar",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-melee-crowbar-recon.svg",
        world: "./world-melee-crowbar-recon.svg"
    },
    worldObject: {
        dimensions: {
            width: 0.8,
            height: "auto",
            layer: 1
        },
        offset: {
            parr: 0.85 + offset.parr,
            perp: 0.75 + offset.perp,
            angle: -srvsdbx_Math.toRad(34, "degrees")
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
            damage: 33,
            time: 120,
            areaOfEffect: {
                offset: {
                    parr: 1.25,
                    perp: 0
                },
                radius: 1.25
            }
        }
    ],
    obstacleMult: 1.4,
    useDelay: 300,
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
                                        angle: -srvsdbx_Math.toRad(40, "degrees")
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
                    duration: 300,
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
                                        perp: -0.09 + offset.perp - 0.1,
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
                                        perp: -0.273861278753 + offset.perp - 0.2,
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
                                        perp: 0.75 + offset.perp - 0.2,
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