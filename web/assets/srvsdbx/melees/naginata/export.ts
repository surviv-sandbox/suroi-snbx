const offset = {
    parr: -0.2,
    perp: 0.7
};

export default {
    name: "Naginata",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-melee-naginata.svg",
        world: "./world-melee-naginata.svg"
    },
    worldObject: {
        dimensions: {
            width: 7,
            height: "auto",
            layer: 1
        },
        offset: {
            parr: 0.55 + offset.parr,
            perp: 1.45 + offset.perp,
            angle: srvsdbx_Math.toRad(16, "degrees")
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
            damage: 56,
            time: 270,
            areaOfEffect: {
                offset: {
                    parr: 3.5,
                    perp: 0
                },
                radius: 2
            }
        }
    ],
    handPositions: {
        leftHand: {
            parr: 1.15,
            perp: -0.443
        },
        rightHand: {
            parr: 0.55,
            perp: 1.45
        }
    },
    maxTargets: Infinity,
    obstacleMultiplier: 1.92,
    stonePiercing: false,
    armorPiercing: true,
    useDelay: 540,
    animations: {
        idle: "none",
        using: {
            duration: 540,
            keyframes: [
                {
                    fraction: 0,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 1.15,
                                perp: -0.443
                            },
                            rightHand: {
                                parr: 0.55,
                                perp: 1.45
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.55 + offset.parr,
                                perp: 1.45 + offset.perp,
                                angle: srvsdbx_Math.toRad(16, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.15,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 1.15,
                                perp: 0.443
                            },
                            rightHand: {
                                parr: -0.55,
                                perp: 1.45
                            }
                        },
                        item: {
                            offset: {
                                parr: -0.55 + offset.parr - 0.6,
                                perp: 1.45 + offset.perp - 0.45,
                                angle: srvsdbx_Math.toRad(65, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.225,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 1.2,
                                perp: -0.9
                            },
                            rightHand: {
                                parr: 1.8,
                                perp: 0.8
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.8 + offset.parr + 0.4,
                                perp: 0.8 + offset.perp + 0.1,
                                angle: -srvsdbx_Math.toRad(20, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.3,
                    data: {
                        hands: {
                            leftHand: {
                                parr: -0.2,
                                perp: -1.4
                            },
                            rightHand: {
                                parr: 1.3,
                                perp: -0.2
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.3 + offset.parr + 0.8,
                                perp: -0.2 + offset.perp + 0.1,
                                angle: -srvsdbx_Math.toRad(45, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.37,
                    data: {
                        hands: {
                            leftHand: {
                                parr: -0.9,
                                perp: -0.9
                            },
                            rightHand: {
                                parr: 0.9,
                                perp: -0.9
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.9 + offset.parr + 0.9,
                                perp: -0.9 + offset.perp - 0.7,
                                angle: -srvsdbx_Math.toRad(90, "degrees")
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
                                parr: -1.2,
                                perp: -0.1
                            },
                            rightHand: {
                                parr: 0.1,
                                perp: -1.3
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.1 + offset.parr + 0.9,
                                perp: -1.3 + offset.perp - 1.4,
                                angle: -srvsdbx_Math.toRad(135, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.6,
                    data: {
                        hands: {
                            leftHand: {
                                parr: -0.9,
                                perp: -0.9
                            },
                            rightHand: {
                                parr: 0.9,
                                perp: -0.9
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.9 + offset.parr + 0.9,
                                perp: -0.9 + offset.perp - 0.7,
                                angle: -srvsdbx_Math.toRad(90, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.75,
                    data: {
                        hands: {
                            leftHand: {
                                parr: -0.2,
                                perp: -1.4
                            },
                            rightHand: {
                                parr: 1.3,
                                perp: -0.2
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.3 + offset.parr + 0.8,
                                perp: -0.2 + offset.perp + 0.1,
                                angle: -srvsdbx_Math.toRad(45, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.9,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 1,
                                perp: -0.9
                            },
                            rightHand: {
                                parr: 1.4,
                                perp: 0.8
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.4 + offset.parr + 0.4,
                                perp: 0.8 + offset.perp + 0.1,
                                angle: -srvsdbx_Math.toRad(17, "degrees")
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
                                parr: 1.15,
                                perp: -0.443
                            },
                            rightHand: {
                                parr: 0.55,
                                perp: 1.45
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.55 + offset.parr,
                                perp: 1.45 + offset.perp,
                                angle: srvsdbx_Math.toRad(16, "degrees")
                            }
                        }
                    }
                }
            ]
        }
    }
} satisfies ExportInterface<SimpleMelee>;