const offset = {
    parr: 0.4,
    perp: 0.4
};
export default {
    name: "Karambit Prismatic",
    displayName: "Karambit",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-melee-karambit-prismatic.svg",
        world: "./world-melee-karambit-prismatic.svg"
    },
    handPositions: {
        leftHand: {
            parr: 0.85,
            perp: -0.75
        },
        rightHand: {
            parr: 0.5,
            perp: 1.01734949747
        }
    },
    worldObject: {
        dimensions: {
            width: 2.4,
            height: "auto",
            layer: 1
        },
        offset: {
            parr: 0.5 + offset.parr,
            perp: 1.01734949747 + offset.perp,
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
    obstacleMult: 1,
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
                                        parr: 0.5,
                                        perp: 1.01734949747
                                    }
                                },
                                item: {
                                    offset: {
                                        parr: 0.5 + offset.parr,
                                        perp: 1.01734949747 + offset.perp,
                                        angle: -srvsdbx_Math.toRad(20, "degrees")
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
                                        parr: 0.5,
                                        perp: 1.01734949747
                                    }
                                },
                                item: {
                                    offset: {
                                        parr: 0.5 + offset.parr,
                                        perp: 1.01734949747 + offset.perp,
                                        angle: -srvsdbx_Math.toRad(20, "degrees")
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
                                            parr: 0.5,
                                            perp: 1.01734949747
                                        }
                                    },
                                    item: {
                                        offset: {
                                            parr: 0.5 + offset.parr,
                                            perp: 1.01734949747 + offset.perp,
                                            angle: -srvsdbx_Math.toRad(20, "degrees")
                                        }
                                    }
                                }
                            },
                            {
                                fraction: 0.25,
                                easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                                data: {
                                    hands: {
                                        leftHand: {
                                            parr: 0.5,
                                            perp: -1.01734949747
                                        },
                                        rightHand: {
                                            parr: 1.11,
                                            perp: 0.23
                                        }
                                    },
                                    item: {
                                        offset: {
                                            parr: 1.11 + offset.parr + 0.1,
                                            perp: 0.23 + offset.perp - 0.4,
                                            angle: -srvsdbx_Math.toRad(65, "degrees")
                                        }
                                    }
                                }
                            },
                            {
                                fraction: 0.5,
                                data: {
                                    hands: {
                                        leftHand: {
                                            parr: 0.23,
                                            perp: -1.3
                                        },
                                        rightHand: {
                                            parr: 0.8,
                                            perp: -0.80311892021
                                        }
                                    },
                                    item: {
                                        offset: {
                                            parr: 0.8 + offset.parr + 0.2,
                                            perp: -0.80311892021 + offset.perp - 0.65,
                                            angle: -srvsdbx_Math.toRad(110, "degrees")
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
                                            parr: 0.5,
                                            perp: -1.01734949747
                                        },
                                        rightHand: {
                                            parr: 1.11,
                                            perp: 0.23
                                        }
                                    },
                                    item: {
                                        offset: {
                                            parr: 1.11 + offset.parr + 0.1,
                                            perp: 0.23 + offset.perp - 0.4,
                                            angle: -srvsdbx_Math.toRad(65, "degrees")
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
                                            parr: 0.5,
                                            perp: 1.01734949747
                                        }
                                    },
                                    item: {
                                        offset: {
                                            parr: 0.5 + offset.parr,
                                            perp: 1.01734949747 + offset.perp,
                                            angle: -srvsdbx_Math.toRad(20, "degrees")
                                        }
                                    }
                                }
                            }
                        ]
                    };
        })
    }
};
//# sourceMappingURL=export.js.map