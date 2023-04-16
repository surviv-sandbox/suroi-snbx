const offset = {
    parr: 0.3,
    perp: 0
};

export default {
    name: "Knuckles Rusted",
    displayName: "Knuckles",
    targetVersion: "0.10.0",
    images: {
        loot: "./loot-melee-knuckles-rusted.svg",
        world: "./world-melee-knuckles-rusted.svg"
    },
    worldObject: {
        dimensions: {
            width: 1,
            height: "auto",
            layer: 0
        },
        offset: {
            parr: 0.85 + offset.parr,
            perp: 0.75 + offset.perp,
            angle: 0
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
                    parr: 1.35,
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
        using: {
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
                                angle: 0
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
                                parr: 1.8,
                                perp: 0.02
                            }
                        },
                        item: {
                            offset: {
                                parr: 1.8 + offset.parr,
                                perp: 0.02 + offset.perp,
                                angle: 0
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
                                angle: 0
                            }
                        }
                    }
                }
            ]
        }
    }
} satisfies ExportInterface<SimpleMelee>;