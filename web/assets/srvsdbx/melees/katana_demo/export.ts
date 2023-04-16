const offset = {
    parr: -1.1,
    perp: 0.1
};

export default {
    name: "Katana Demo",
    displayName: "Katana",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-melee-katana-demo.svg",
        world: "./world-melee-katana-demo.svg"
    },
    worldObject: {
        dimensions: {
            width: 4.6,
            height: "auto",
            layer: 1
        },
        offset: {
            parr: -0.3 + offset.parr,
            perp: 1 + offset.perp,
            angle: srvsdbx_Math.toRad(86, "degrees")
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
            damage: 40,
            time: 200,
            areaOfEffect: {
                offset: {
                    parr: 1.75,
                    perp: 0
                },
                radius: 2
            }
        }
    ],
    handPositions: {
        leftHand: {
            parr: 0.4,
            perp: 0.8
        },
        rightHand: {
            parr: -0.3,
            perp: 1
        }
    },
    maxTargets: Infinity,
    obstacleMultiplier: 1.5,
    stonePiercing: false,
    armorPiercing: true,
    useDelay: 400,
    animations: {
        idle: "none",
        using: {
            duration: 400,
            keyframes: [
                {
                    fraction: 0,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.4,
                                perp: 0.8
                            },
                            rightHand: {
                                parr: -0.3,
                                perp: 1
                            }
                        },
                        item: {
                            offset: {
                                parr: -0.3 + offset.parr,
                                perp: 1 + offset.perp,
                                angle: srvsdbx_Math.toRad(86, "degrees")
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
                                perp: 0.75
                            },
                            rightHand: {
                                parr: 0.4,
                                perp: 1.1
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.35 + offset.parr + 0.4,
                                perp: 1.077 + offset.perp + 1,
                                angle: srvsdbx_Math.toRad(43, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.2,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 1.0568,
                                perp: -0.4
                            },
                            rightHand: {
                                parr: 1.0568,
                                perp: 0.4
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.0568 + offset.parr + 1.2,
                                perp: 0.4 + offset.perp + 1,
                                angle: 0
                            }
                        }
                    }
                },
                {
                    fraction: 0.325,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.6,
                                perp: -0.95
                            },
                            rightHand: {
                                parr: 1.11,
                                perp: -0.2
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.11 + offset.parr + 1.9,
                                perp: -0.2 + offset.perp + 0.5,
                                angle: -srvsdbx_Math.toRad(43, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.45,
                    data: {
                        hands: {
                            leftHand: {
                                parr: -0.4,
                                perp: -0.8
                            },
                            rightHand: {
                                parr: 0.3,
                                perp: -1
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.3 + offset.parr + 2.3,
                                perp: -1 + offset.perp,
                                angle: -srvsdbx_Math.toRad(86, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.625,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.6,
                                perp: -0.95
                            },
                            rightHand: {
                                parr: 1.11,
                                perp: -0.2
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.11 + offset.parr + 1.9,
                                perp: -0.2 + offset.perp + 0.5,
                                angle: -srvsdbx_Math.toRad(43, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.7,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 1.0568,
                                perp: -0.4
                            },
                            rightHand: {
                                parr: 1.0568,
                                perp: 0.4
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.0568 + offset.parr + 1.2,
                                perp: 0.4 + offset.perp + 1,
                                angle: 0
                            }
                        }
                    }
                },
                {
                    fraction: 0.85,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.85,
                                perp: 0.75
                            },
                            rightHand: {
                                parr: 0.4,
                                perp: 1.1
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.35 + offset.parr + 0.4,
                                perp: 1.077 + offset.perp + 1,
                                angle: srvsdbx_Math.toRad(43, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 1,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.4,
                                perp: 0.8
                            },
                            rightHand: {
                                parr: -0.3,
                                perp: 1
                            }
                        },
                        item: {
                            offset: {
                                parr: -0.3 + offset.parr,
                                perp: 1 + offset.perp,
                                angle: srvsdbx_Math.toRad(86, "degrees")
                            }
                        }
                    }
                }
            ]
        }
    }
} satisfies ExportInterface<SimpleMelee>;