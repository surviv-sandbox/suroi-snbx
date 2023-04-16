const offset = {
    parr: 1.1,
    perp: -0.05
};

export default {
    name: "Lasr Swrd (Green)",
    displayName: "Lasr Swrd",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-melee-lasr-sword-01.svg",
        world: "./world-melee-lasr-sword-01.svg"
    },
    worldObject: {
        dimensions: {
            width: "auto",
            height: 3,
            layer: 1
        },
        offset: {
            parr: 1.09 + offset.parr,
            perp: 0 + offset.perp,
            angle: -srvsdbx_Math.toRad(2.5, "degrees")
        },
        collider: {
            radius: 1.5,
            offsetParr: 0,
            offsetPerp: -0.2
        },
        tint: "#FFFFFF"
    },
    isReflective: true,
    moveSpeedPenalties: {
        passive: 0,
        active: 1,
        using: 0
    },
    autoAttack: false,
    damages: [
        {
            damage: 60,
            time: 300,
            areaOfEffect: {
                offset: {
                    parr: 1.75,
                    perp: 0
                },
                radius: 2.1
            }
        }
    ],
    maxTargets: Infinity,
    handPositions: {
        leftHand: {
            parr: 0.6375,
            perp: 0,
            layer: 1
        },
        rightHand: {
            parr: 1.09,
            perp: 0
        }
    },
    obstacleMultiplier: 1.5,
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
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.6375,
                                perp: 0
                            },
                            rightHand: {
                                parr: 1.09,
                                perp: 0
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.09 + offset.parr,
                                perp: 0 + offset.perp,
                                angle: -srvsdbx_Math.toRad(2.5, "degrees")
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
                                parr: 0.1,
                                perp: 1.13
                            },
                            rightHand: {
                                parr: 0.5,
                                perp: 1.4
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.5 + offset.parr - 0.1,
                                perp: 1.4 + offset.perp + 0.2,
                                angle: srvsdbx_Math.toRad(15, "degrees")
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
                                parr: 0.75,
                                perp: -0.75
                            },
                            rightHand: {
                                parr: 0.95,
                                perp: -1.3
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.95 + offset.parr - 1,
                                perp: -1.3 + offset.perp - 1.1,
                                angle: -srvsdbx_Math.toRad(90, "degrees")
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
                                perp: 0
                            },
                            rightHand: {
                                parr: 1.09,
                                perp: 0
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.09 + offset.parr,
                                perp: 0 + offset.perp,
                                angle: -srvsdbx_Math.toRad(2.5, "degrees")
                            }
                        }
                    }
                }
            ]
        },
        deflect: {
            duration: 300,
            keyframes: [
                {
                    fraction: 0,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: () => Math.random() > 0.5 ? {
                        hands: {
                            leftHand: {
                                parr: 0.5,
                                perp: 0.25
                            },
                            rightHand: {
                                parr: 0.9,
                                perp: 0.35
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.9 + offset.parr - 0.1,
                                perp: 0.35 + offset.perp + 0.2,
                                angle: srvsdbx_Math.toRad(2.5, "degrees")
                            }
                        }
                    } : {
                        hands: {
                            leftHand: {
                                parr: 0.5,
                                perp: -0.25
                            },
                            rightHand: {
                                parr: 0.9,
                                perp: -0.35
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.9 + offset.parr - 0.1,
                                perp: -0.35 + offset.perp - 0.2,
                                angle: -srvsdbx_Math.toRad(7.5, "degrees")
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
                                perp: 0
                            },
                            rightHand: {
                                parr: 1.09,
                                perp: 0
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.09 + offset.parr,
                                perp: 0 + offset.perp,
                                angle: -srvsdbx_Math.toRad(2.5, "degrees")
                            }
                        }
                    }
                }
            ]
        }
    }
} satisfies ExportInterface<SimpleMelee>;