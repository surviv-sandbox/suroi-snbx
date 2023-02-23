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
        obstacleMult: number;
        headshotMult: number;
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
            perp: number;
            parr: number;
        };
        rightHand: {
            perp: number;
            parr: number;
        };
    };
    projectileSpawnOffset: {
        perp: number;
        parr: number;
    };
    casings: {
        spawnOffset: {
            parr: number;
            perp: number;
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
    fireMode: "semi";
};
export default _default;
