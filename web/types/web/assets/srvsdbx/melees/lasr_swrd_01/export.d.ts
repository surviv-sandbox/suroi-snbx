declare const _default: {
    name: string;
    displayName: string;
    targetVersion: string;
    images: {
        loot: string;
        world: string;
    };
    worldObject: {
        dimensions: {
            width: "auto";
            height: number;
            layer: 1;
        };
        offset: {
            parr: number;
            perp: number;
            angle: number;
        };
        collider: {
            radius: number;
            offsetParr: number;
            offsetPerp: number;
        };
        tint: string;
    };
    isReflective: true;
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
    maxTargets: number;
    handPositions: {
        leftHand: {
            parr: number;
            perp: number;
            layer: 1;
        };
        rightHand: {
            parr: number;
            perp: number;
        };
    };
    obstacleMult: number;
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
                    };
                };
            })[];
        };
        deflect: {
            duration: number;
            keyframes: ({
                fraction: number;
                easing: (t: number) => number;
                data: () => {
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
                        offset: {
                            parr: number;
                            perp: number;
                            angle: number;
                        };
                    };
                };
                easing?: undefined;
            })[];
        };
    };
};
export default _default;
