declare const _default: {
    name: string;
    targetVersion: string;
    images: {
        loot: string;
        world: string;
    };
    worldObject: {
        dimensions: {
            width: number;
            height: "auto";
            layer: 0;
        };
        offset: {
            parr: number;
            perp: number;
            angle: number;
        };
        tint: string;
    };
    moveSpeedPenalties: {
        passive: number;
        active: number;
        using: number;
    };
    autoAttack: false;
    damages: {
        damage: number;
        time: number;
        areaOfEffect: {
            offset: {
                parr: number;
                perp: number;
            };
            radius: number;
        };
    }[];
    handPositions: {
        leftHand: {
            parr: number;
            perp: number;
        };
        rightHand: {
            parr: number;
            perp: number;
        };
    };
    maxTargets: number;
    obstacleMultiplier: number;
    armorPiercing: true;
    stonePiercing: false;
    useDelay: number;
    animations: {
        idle: "none";
        using: {
            duration: number;
            keyframes: ({
                fraction: number;
                data: {
                    hands: {
                        leftHand: {
                            parr: number;
                            perp: number;
                        };
                        rightHand: {
                            parr: number;
                            perp: number;
                        };
                    };
                    item: {
                        offset: {
                            parr: number;
                            perp: number;
                            angle: number;
                        };
                        dimensions?: undefined;
                    };
                };
                easing?: undefined;
            } | {
                fraction: number;
                easing: (t: number) => number;
                data: {
                    hands: {
                        leftHand: {
                            parr: number;
                            perp: number;
                        };
                        rightHand: {
                            parr: number;
                            perp: number;
                        };
                    };
                    item: {
                        dimensions: {
                            width: number;
                            height: number;
                        };
                        offset: {
                            parr: number;
                            perp: number;
                            angle: number;
                        };
                    };
                };
            } | {
                fraction: number;
                data: {
                    hands: {
                        leftHand: {
                            parr: number;
                            perp: number;
                        };
                        rightHand: {
                            parr: number;
                            perp: number;
                        };
                    };
                    item: {
                        dimensions: {
                            width: number;
                            height: number;
                        };
                        offset: {
                            parr: number;
                            perp: number;
                            angle: number;
                        };
                    };
                };
                easing?: undefined;
            } | {
                fraction: number;
                easing: (t: number) => number;
                data: {
                    hands: {
                        leftHand: {
                            parr: number;
                            perp: number;
                        };
                        rightHand: {
                            parr: number;
                            perp: number;
                        };
                    };
                    item: {
                        offset: {
                            parr: number;
                            perp: number;
                            angle: number;
                        };
                        dimensions?: undefined;
                    };
                };
            })[];
        };
    };
};
export default _default;
