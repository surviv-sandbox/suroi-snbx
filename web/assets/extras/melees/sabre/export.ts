const offset = {
    parr: 0.1,
    perp: -2.35
};

export default {
    name: "Sabre",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-melee-sabre.svg",
        world: "./world-melee-sabre-01.svg"
    },
    imageDeclaration: [
        "./world-melee-sabre-02.svg",
        "./world-melee-sabre-03.svg"
    ],
    worldObject: {
        dimensions: {
            width: 1.3,
            height: "auto",
            layer: 2
        },
        offset: {
            parr: 1.05,
            perp: 0.3,
            angle: 0
        },
        tint: "#FFFFFF"
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 1,
        using: -2
    },
    autoAttack: false,
    damages: [
        {
            damage: 60,
            time: 0.4 * 700,
            areaOfEffect: {
                offset: {
                    parr: 4.4,
                    perp: 0
                },
                radius: 1.9
            }
        }
    ],
    handPositions: {
        leftHand: {
            parr: -0.1,
            perp: -0.9
        },
        rightHand: {
            parr: 1.05,
            perp: 0.3
        }
    },
    maxTargets: Infinity,
    obstacleMultiplier: 1.3,
    armorPiercing: true,
    stonePiercing: false,
    useDelay: 700,
    animations: {
        idle: "none",
        using: () => {
            return Math.random() > 0.5
                // Attacking tierce
                ? {
                    duration: 700,
                    keyframes: [
                        {
                            fraction: 0,
                            data: {
                                hands: {
                                    leftHand: {
                                        parr: -0.1,
                                        perp: -0.9
                                    },
                                    rightHand: {
                                        parr: 1.05,
                                        perp: 0.3
                                    }
                                },
                                item: {
                                    image: "./world-melee-sabre-02.svg",
                                    dimensions: {
                                        width: 1.3,
                                        layer: 1
                                    },
                                    offset: {
                                        parr: 1.05 + offset.parr,
                                        perp: 0.3 + offset.perp + 2.1,
                                        angle: Math.PI
                                    }
                                }
                            }
                        },
                        {
                            fraction: 0.15,
                            easing: srvsdbx_Animation.easingFunctions.easeOutCirc.default,
                            data: {
                                hands: {
                                    leftHand: {
                                        parr: -0.15,
                                        perp: -0.95
                                    },
                                    rightHand: {
                                        parr: 0.95,
                                        perp: -0.3
                                    }
                                },
                                item: {
                                    image: "./world-melee-sabre-02.svg",
                                    dimensions: {
                                        width: 5.5,
                                        layer: 1
                                    },
                                    offset: {
                                        parr: 0.95 + offset.parr,
                                        perp: -0.3 + offset.perp,
                                        angle: Math.PI
                                    }
                                }
                            }
                        },
                        {
                            fraction: srvsdbx_Animation.easingFunctions.linterp(0.15, 0.4, Math.sqrt(0.75)),
                            easing: srvsdbx_Animation.easingFunctions.easeInCirc.default,
                            data: {
                                hands: {
                                    leftHand: {
                                        parr: -0.175,
                                        perp: -0.95
                                    },
                                    rightHand: {
                                        parr: 1,
                                        perp: -0.25
                                    }
                                },
                                item: {
                                    image: "./world-melee-sabre-02.svg",
                                    dimensions: {
                                        width: 5.5,
                                        layer: 1
                                    },
                                    offset: {
                                        parr: 1 + offset.parr + 1.6,
                                        perp: -0.25 + offset.perp + 0.7,
                                        angle: 5 * Math.PI / 4
                                    }
                                }
                            }
                        },
                        {
                            fraction: 0.4,
                            easing: srvsdbx_Animation.easingFunctions.easeInCirc.default,
                            data: {
                                hands: {
                                    leftHand: {
                                        parr: -0.3,
                                        perp: -1.1
                                    },
                                    rightHand: {
                                        parr: 1.05,
                                        perp: -0.2
                                    }
                                },
                                item: {
                                    image: "./world-melee-sabre-02.svg",
                                    dimensions: {
                                        width: 5.5,
                                        layer: 1
                                    },
                                    offset: {
                                        parr: 1.05 + offset.parr + 2.5,
                                        perp: -0.2 + offset.perp + 2.45,
                                        angle: 3 * Math.PI / 2
                                    }
                                }
                            }
                        },
                        {
                            fraction: srvsdbx_Animation.easingFunctions.linterp(0.4, 0.75, 1 - Math.sqrt(0.75)),
                            easing: srvsdbx_Animation.easingFunctions.easeOutCirc.default,
                            data: {
                                hands: {
                                    leftHand: {
                                        parr: -0.175,
                                        perp: -0.95
                                    },
                                    rightHand: {
                                        parr: 1,
                                        perp: -0.25
                                    }
                                },
                                item: {
                                    image: "./world-melee-sabre-02.svg",
                                    dimensions: {
                                        width: 5.5,
                                        layer: 1
                                    },
                                    offset: {
                                        parr: 1 + offset.parr + 1.6,
                                        perp: -0.25 + offset.perp + 0.7,
                                        angle: 5 * Math.PI / 4
                                    }
                                }
                            }
                        },
                        {
                            fraction: 0.75,
                            easing: srvsdbx_Animation.easingFunctions.easeOutCirc.default,
                            data: {
                                hands: {
                                    leftHand: {
                                        parr: -0.15,
                                        perp: -0.95
                                    },
                                    rightHand: {
                                        parr: 0.95,
                                        perp: -0.3
                                    }
                                },
                                item: {
                                    image: "./world-melee-sabre-02.svg",
                                    dimensions: {
                                        width: 5.5,
                                        layer: 1
                                    },
                                    offset: {
                                        parr: 0.95 + offset.parr,
                                        perp: -0.3 + offset.perp,
                                        angle: Math.PI
                                    }
                                }
                            }
                        },
                        {
                            fraction: 1,
                            easing: srvsdbx_Animation.easingFunctions.easeOutCirc.default,
                            data: {
                                hands: {
                                    leftHand: {
                                        parr: -0.1,
                                        perp: -0.9
                                    },
                                    rightHand: {
                                        parr: 1.05,
                                        perp: 0.3
                                    }
                                },
                                item: {
                                    image: "./world-melee-sabre-02.svg",
                                    dimensions: {
                                        width: 5.5,
                                        layer: 1
                                    },
                                    offset: {
                                        parr: 1.05 + offset.parr,
                                        perp: 0.3 + offset.perp,
                                        angle: Math.PI
                                    }
                                }
                            }
                        }
                    ]
                }
                // Attacking quarte
                : {
                    duration: 700,
                    keyframes: [
                        {
                            fraction: 0,
                            data: {
                                hands: {
                                    leftHand: {
                                        parr: -0.1,
                                        perp: -0.9
                                    },
                                    rightHand: {
                                        parr: 1.05,
                                        perp: 0.3
                                    }
                                },
                                item: {
                                    image: "./world-melee-sabre-03.svg",
                                    dimensions: {
                                        width: 1.3,
                                        layer: 1
                                    },
                                    offset: {
                                        parr: 1.05 + offset.parr,
                                        perp: 0.3 + offset.perp + 2.7,
                                        angle: 0
                                    }
                                }
                            }
                        },
                        {
                            fraction: 0.15,
                            easing: srvsdbx_Animation.easingFunctions.easeOutCirc.default,
                            data: {
                                hands: {
                                    leftHand: {
                                        parr: -0.15,
                                        perp: -0.95
                                    },
                                    rightHand: {
                                        parr: 1.1,
                                        perp: 0.5
                                    }
                                },
                                item: {
                                    image: "./world-melee-sabre-03.svg",
                                    dimensions: {
                                        width: 5.5,
                                        layer: 1
                                    },
                                    offset: {
                                        parr: 1.1 + offset.parr,
                                        perp: 0.5 + offset.perp + 4.7,
                                        angle: 0
                                    }
                                }
                            }
                        },
                        {
                            fraction: srvsdbx_Animation.easingFunctions.linterp(0.15, 0.4, Math.sqrt(0.75)),
                            easing: srvsdbx_Animation.easingFunctions.easeInCirc.default,
                            data: {
                                hands: {
                                    leftHand: {
                                        parr: -0.175,
                                        perp: -1.025
                                    },
                                    rightHand: {
                                        parr: 1.125,
                                        perp: 0.45
                                    }
                                },
                                item: {
                                    image: "./world-melee-sabre-03.svg",
                                    dimensions: {
                                        width: 5.5,
                                        layer: 1
                                    },
                                    offset: {
                                        parr: 1.125 + offset.parr + 1.7,
                                        perp: 0.45 + offset.perp + 4.1,
                                        angle: -Math.PI / 4
                                    }
                                }
                            }
                        },
                        {
                            fraction: 0.4,
                            easing: srvsdbx_Animation.easingFunctions.easeInCirc.default,
                            data: {
                                hands: {
                                    leftHand: {
                                        parr: -0.3,
                                        perp: -1.1
                                    },
                                    rightHand: {
                                        parr: 1.15,
                                        perp: 0.4
                                    }
                                },
                                item: {
                                    image: "./world-melee-sabre-03.svg",
                                    dimensions: {
                                        width: 5.5,
                                        layer: 1
                                    },
                                    offset: {
                                        parr: 1.15 + offset.parr + 2.3,
                                        perp: 0.4 + offset.perp + 2.2,
                                        angle: -Math.PI / 2
                                    }
                                }
                            }
                        },
                        {
                            fraction: srvsdbx_Animation.easingFunctions.linterp(0.4, 0.75, 1 - Math.sqrt(0.75)),
                            easing: srvsdbx_Animation.easingFunctions.easeInCirc.default,
                            data: {
                                hands: {
                                    leftHand: {
                                        parr: -0.175,
                                        perp: -1.025
                                    },
                                    rightHand: {
                                        parr: 1.125,
                                        perp: 0.45
                                    }
                                },
                                item: {
                                    image: "./world-melee-sabre-03.svg",
                                    dimensions: {
                                        width: 5.5,
                                        layer: 1
                                    },
                                    offset: {
                                        parr: 1.125 + offset.parr + 1.7,
                                        perp: 0.45 + offset.perp + 4.1,
                                        angle: -Math.PI / 4
                                    }
                                }
                            }
                        },
                        {
                            fraction: 0.75,
                            easing: srvsdbx_Animation.easingFunctions.easeOutCirc.default,
                            data: {
                                hands: {
                                    leftHand: {
                                        parr: -0.15,
                                        perp: -0.95
                                    },
                                    rightHand: {
                                        parr: 1.1,
                                        perp: 0.5
                                    }
                                },
                                item: {
                                    image: "./world-melee-sabre-03.svg",
                                    dimensions: {
                                        width: 5.5,
                                        layer: 1
                                    },
                                    offset: {
                                        parr: 1.1 + offset.parr,
                                        perp: 0.5 + offset.perp + 4.7,
                                        angle: 0
                                    }
                                }
                            }
                        },
                        {
                            fraction: 1,
                            data: {
                                hands: {
                                    leftHand: {
                                        parr: -0.1,
                                        perp: -0.9
                                    },
                                    rightHand: {
                                        parr: 1.05,
                                        perp: 0.3
                                    }
                                },
                                item: {
                                    image: "./world-melee-sabre-03.svg",
                                    dimensions: {
                                        width: 1.3,
                                        layer: 1
                                    },
                                    offset: {
                                        parr: 1.05 + offset.parr,
                                        perp: 0.3 + offset.perp + 2.7,
                                        angle: 0
                                    }
                                }
                            }
                        }
                    ]
                };
        }
    }
} satisfies ExportInterface<SimpleMelee>;