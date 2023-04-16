const offset = {
    parr: 0.8,
    perp: -0.3
};

export default {
    name: "Pan",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-melee-pan-black.svg",
        world: "./world-melee-pan-black.svg"
    },
    worldObject: {
        dimensions: {
            width: "auto",
            height: 2.3,
            layer: 1
        },
        tint: "#FFFFFF",
        offset: {
            parr: 0.85 + offset.parr,
            perp: 0.75 + offset.perp,
            angle: -srvsdbx_Math.toRad(25, "degrees")
        },
        collider: {
            width: "match",
            height: 1.6,
            offsetParr: 0,
            offsetPerp: -0.2
        }
    },
    isReflective: true,
    holstered: {
        dimensions: {
            width: "auto",
            height: 2,
            layer: 2
        },
        offset: {
            parr: -0.8,
            perp: 0.7,
            angle: srvsdbx_Math.toRad(45, "degrees")
        },
        collider: {
            width: "match",
            height: 1.4,
            offsetParr: 0,
            offsetPerp: -0.2
        }
    },
    moveSpeedPenalties: {
        passive: 0,
        active: 1,
        using: 0
    },
    autoAttack: false,
    damages: [
        {
            damage: 60,
            time: 150,
            areaOfEffect: {
                offset: {
                    parr: 2,
                    perp: 0
                },
                radius: 1.5
            }
        }
    ],
    obstacleMultiplier: 0.8,
    stonePiercing: false,
    armorPiercing: false,
    useDelay: 500,
    animations: {
        idle: "none",
        using: {
            duration: 500,
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
                                angle: -srvsdbx_Math.toRad(25, "degrees")
                            }
                        }
                    }
                },
                {
                    fraction: 0.3,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: {
                        hands: {
                            leftHand: {
                                parr: 0.85,
                                perp: -0.75
                            },
                            rightHand: {
                                parr: 0.75,
                                perp: -1.1
                            }
                        },
                        item: {
                            offset: {
                                parr: 0.75 + offset.parr - 0.5,
                                perp: -1.1 + offset.perp - 0.4,
                                angle: -srvsdbx_Math.toRad(80, "degrees")
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
                                parr: 0.85,
                                perp: -0.75
                            },
                            rightHand: {
                                parr: 1,
                                perp: 0.1
                            }
                        },
                        item: {
                            offset: {
                                parr: 1 + offset.parr,
                                perp: 0.1 + offset.perp + 0.1,
                                angle: -srvsdbx_Math.toRad(25, "degrees")
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
                                parr: 0.85,
                                perp: -0.75
                            },
                            rightHand: {
                                parr: 1.2,
                                perp: 1.3
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.2 + offset.parr,
                                perp: 1.3 + offset.perp + 0.75,
                                angle: srvsdbx_Math.toRad(30, "degrees")
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
                                angle: -srvsdbx_Math.toRad(25, "degrees")
                            }
                        }
                    }
                }
            ]
        }
    }
} satisfies ExportInterface<SimpleMelee>;