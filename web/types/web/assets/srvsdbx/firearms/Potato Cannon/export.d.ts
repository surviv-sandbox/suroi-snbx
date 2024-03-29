declare const _default: {
    name: string;
    targetVersion: string;
    images: {
        loot: string;
        world: string;
    };
    dual: false;
    tint: string;
    ballistics: {
        damage: number;
        velocity: number;
        range: number;
        tracer: {
            width: "auto";
            height: number;
            forceMaximumLength: true;
            noShrink: true;
            trail: {
                image: string;
                width: number;
                maxLength: number;
                tint: string;
                offset: {
                    parr: number;
                    perp: number;
                };
            };
        };
        obstacleMultiplier: number;
        headshotMultiplier: number;
        firstShotAccuracy: {
            enabled: false;
            rechargeTime: number;
        };
        falloff: number;
        projectiles: number;
    };
    suppressed: false;
    caliber: string;
    useDelay: number;
    deployGroup: number;
    accuracy: {
        default: number;
        moving: number;
    };
    moveSpeedPenalties: {
        passive: number;
        active: number;
        using: number;
    };
    imageOffset: {
        parr: number;
        perp: number;
    };
    dimensions: {
        width: "auto";
        height: number;
        layer: 2;
    };
    reload: {
        duration: number;
        ammoReloaded: number;
        chain: true;
    };
    magazineCapacity: {
        normal: number;
        firepower: number;
    };
    switchDelay: number;
    handPositions: {
        leftHand: {
            parr: number;
            perp: number;
        };
        rightHand: {
            perp: number;
            parr: number;
        };
    };
    projectileSpawnOffset: {
        parr: number;
        perp: number;
    };
    casings: {
        spawnOffset: {
            parr: number;
            perp: number;
        };
        velocity: {
            parr: () => number;
            perp: () => number;
        };
        spawnOn: "fire";
        spawnDelay: number;
    };
    recoilImpulse: {
        direction: {
            perp: number;
            parr: number;
        };
        duration: number;
    };
    fireMode: "semi";
};
export default _default;
