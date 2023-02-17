declare const _default: {
    name: string;
    displayName: string;
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
        };
        effectsOnHit: string[];
        obstacleMult: number;
        headshotMult: number;
        firstShotAccuracy: {
            enabled: true;
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
        layer: 1;
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
        rightHand: {
            parr: number;
            perp: number;
        };
    };
    projectileSpawnOffset: {
        parr: number;
        perp: number;
    };
    recoilImpulse: {
        direction: {
            perp: number;
            parr: number;
        };
        duration: number;
    };
    fireMode: "automatic";
};
export default _default;
