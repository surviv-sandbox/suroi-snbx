declare const _default: {
    name: string;
    targetVersion: string;
    images: {
        loot: string;
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
    obstacleMultiplier: number;
    stonePiercing: false;
    armorPiercing: false;
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
                };
                easing?: undefined;
            } | {
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
                };
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
                };
            })[];
        };
    };
};
export default _default;
