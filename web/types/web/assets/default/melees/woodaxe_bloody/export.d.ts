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
            width: number;
            height: "auto";
            layer: 1;
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
    };
};
export default _default;
