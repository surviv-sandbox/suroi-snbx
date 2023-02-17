const offset = {
    parr: 0.85,
    perp: 0.45
};
export default {
    name: "The Separator",
    displayName: "Bonesaw",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-melee-bonesaw-healer.svg",
        world: "./world-melee-bonesaw-healer.svg"
    },
    worldObject: {
        dimensions: {
            width: "auto",
            height: 3.2,
            layer: 1
        },
        offset: {
            parr: 0.09 + offset.parr,
            perp: 1 + offset.perp,
            angle: srvsdbx_Math.toRad(17, "degrees")
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
            damage: 44,
            time: 100,
            areaOfEffect: {
                offset: {
                    parr: 2,
                    perp: 0
                },
                radius: 1.75
            }
        },
        {
            damage: 44,
            time: 500,
            areaOfEffect: {
                offset: {
                    parr: 2,
                    perp: 0
                },
                radius: 1.75
            }
        }
    ],
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: -0.75
        },
        rightHand: {
            parr: 0.09,
            perp: 1
        }
    },
    maxTargets: Infinity,
    obstacleMult: 1,
    useDelay: 700,
    animations: {
        idle: "none",
        using: {
            duration: 700,
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
                                parr: 0.09,
                                perp: 1
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.09 + offset.parr,
                                perp: 1 + offset.perp,
                                angle: srvsdbx_Math.toRad(17, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 1 / 14,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.85,
                                perp: -0.75
                            },
                            rightHand: {
                                parr: 0.95,
                                perp: 1.05
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.95 + offset.parr,
                                perp: 1.05 + offset.perp + 0.2,
                                angle: srvsdbx_Math.toRad(35, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 1 / 7,
                    easing: srvsdbx_Animation.easingFunctions.easeInQuintic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.85,
                                perp: -0.75
                            },
                            rightHand: {
                                parr: 1.2,
                                perp: -1.1
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.2 + offset.parr,
                                perp: -1.1 + offset.perp - 1,
                                angle: -srvsdbx_Math.toRad(35, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 4.5 / 7,
                    easing: srvsdbx_Animation.easingFunctions.easeInQuintic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.85,
                                perp: -0.75
                            },
                            rightHand: {
                                parr: 1.9,
                                perp: -0.8
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.9 + offset.parr + 0.15,
                                perp: -0.8 + offset.perp - 0.65,
                                angle: -srvsdbx_Math.toRad(20, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 5 / 7,
                    easing: srvsdbx_Animation.easingFunctions.easeInQuintic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.85,
                                perp: -0.75
                            },
                            rightHand: {
                                parr: -0.75,
                                perp: 0.85
                            }
                        },
                        item: {
                            offset: {
                                parr: -0.75 + offset.parr + 0.15,
                                perp: 0.85 + offset.perp - 0.65,
                                angle: -srvsdbx_Math.toRad(20, "degrees")
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
                                parr: 0.09,
                                perp: 1
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.09 + offset.parr,
                                perp: 1 + offset.perp,
                                angle: srvsdbx_Math.toRad(17, "degrees")
                            }
                        }
                    }
                }
            ]
        }
    }
};
//# sourceMappingURL=export.js.map