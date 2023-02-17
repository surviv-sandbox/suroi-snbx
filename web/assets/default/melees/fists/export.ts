export default {
    name: "Fists",
    targetVersion: "0.10.0",
    images: {
        loot: "./fists.svg"
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
                        }
                    }
                },
                {
                    fraction: 0.5,
                    easing: srvsdbx_Animation.easingFunctions.easeInCubic.default,
                    data: () => ({
                        hands: Math.random() > 0.5 ? {
                            leftHand: {
                                parr: 0.85,
                                perp: -0.75
                            },
                            rightHand: {
                                parr: 1.8,
                                perp: 0.02
                            }
                        } : {
                            leftHand: {
                                parr: 1.8,
                                perp: -0.02
                            },
                            rightHand: {
                                parr: 0.85,
                                perp: 0.75
                            }
                        }
                    })
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
                        }
                    }
                }
            ]
        }
    }
} satisfies ExportInterface<SimpleMelee>;