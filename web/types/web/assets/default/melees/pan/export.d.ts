declare const _default: {
    name: string;
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
        tint: string;
        offset: {
            parr: number;
            perp: number;
            angle: number;
        };
        collider: {
            width: "match";
            height: number;
            offsetParr: number;
            offsetPerp: number;
        };
    };
    isReflective: true;
    holstered: {
        dimensions: {
            width: "auto";
            height: number;
            layer: 2;
        };
        offset: {
            parr: number;
            perp: number;
            angle: number;
        };
        collider: {
            width: "match";
            height: number;
            offsetParr: number;
            offsetPerp: number;
        };
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
