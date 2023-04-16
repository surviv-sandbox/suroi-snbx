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
            width: number;
            height: number;
            drawAbovePlayer: true;
            forceMaximumLength: true;
        };
        obstacleMultiplier: number;
        headshotMultiplier: number;
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
        layer: 2;
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
            perp: number;
            parr: number;
        };
    };
    projectileSpawnOffset: {
        parr: number;
        perp: number;
    };
    casings: {
        count: number;
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
    fireMode: "release-charge";
    chargeProps: {
        chargeTime: number;
        speedPenalty: number;
        chargeImage: {
            image: string;
        };
        chargeImageHUD: {
            image: string;
            growStyle: "clip";
        };
        chargeParticle: {
            particle: string;
            offset: {
                parr: number;
                perp: number;
            };
            scale: (_: number, gun: Gun) => number;
            alpha: () => number;
        };
    };
    addons: {
        images: string[];
        tint: string;
        show: (gun: Gun) => boolean;
        dimensions: {
            width: number;
            height: (gun: Gun) => number;
            layer: 1;
        };
        dual: false;
        position: {
            parr: (gun: Gun) => number;
            perp: number;
        };
    }[];
};
export default _default;
