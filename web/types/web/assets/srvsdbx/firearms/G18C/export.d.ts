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
            width: number;
            height: number;
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
        width: number;
        height: number;
        layer: 0;
    };
    reload: {
        duration: number;
        ammoReloaded: "all";
        chain: false;
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
    };
    projectileSpawnOffset: {
        parr: number;
        perp: number;
    };
    casings: {
        spawnOffset: {
            perp: number;
            parr: number;
        };
        velocity: {
            perp: () => number;
            parr: () => number;
        };
        spawnOn: "fire";
        spawnDelay: number;
    };
    recoilImpulse: {
        direction: {
            parr: number;
            perp: number;
        };
        duration: number;
    };
    fireMode: "automatic";
};
export default _default;
