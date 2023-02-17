const offset = {
    parr: 0.9,
    perp: 0
};
export default {
    name: "Machete Taiga",
    displayName: "Machete",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-melee-machete-taiga.svg",
        world: "./world-melee-machete-taiga.svg"
    },
    worldObject: {
        dimensions: {
            width: "auto",
            height: 3,
            layer: 1
        },
        offset: {
            parr: 0.09 + offset.parr,
            perp: 1 + offset.perp,
            angle: srvsdbx_Math.toRad(10, "degrees")
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
                    parr: 1.5,
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
    useDelay: 300,
    animations: {
        idle: "none",
        using: {
            duration: 300,
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
                                parr: 0.09,
                                perp: 1
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.09 + offset.parr,
                                perp: 1 + offset.perp,
                                angle: srvsdbx_Math.toRad(10, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.16,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.85,
                                perp: -0.75
                            },
                            rightHand: {
                                parr: 0.85,
                                perp: 1.1
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.85 + offset.parr - 0.1,
                                perp: 1.1 + offset.perp + 0.45,
                                angle: srvsdbx_Math.toRad(40, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.56,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.85,
                                perp: -0.75
                            },
                            rightHand: {
                                parr: 0.9,
                                perp: -0.689202437605
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.9 + offset.parr - 0.05,
                                perp: -0.689202437605 + offset.perp - 0.5,
                                angle: -srvsdbx_Math.toRad(30, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.78,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.85,
                                perp: -0.75
                            },
                            rightHand: {
                                parr: 1.12666543392,
                                perp: 0.125
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.12666543392 + offset.parr - 0.1,
                                perp: 0.125 + offset.perp - 0.6,
                                angle: -srvsdbx_Math.toRad(35, "degrees")
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
                                angle: srvsdbx_Math.toRad(10, "degrees")
                            }
                        }
                    }
                }
            ]
        }
    }
};
//# sourceMappingURL=export.js.map