declare const parseFunctions: {
    readonly parseAmmoData: (data: SimpleAmmo[]) => Promise<srvsdbx_ErrorHandling.ResultRes<undefined> | {
        err: unknown[][];
    }>;
    readonly parseDecalData: (data: SimpleDecal[]) => Promise<srvsdbx_ErrorHandling.ResultRes<undefined> | {
        err: unknown[][];
    }>;
    readonly parseExplosionData: (data: SimpleExplosion[]) => Promise<srvsdbx_ErrorHandling.ResultRes<undefined> | {
        err: unknown[][];
    }>;
    readonly parseEquipmentData: (data: SimpleEquipment[]) => Promise<srvsdbx_ErrorHandling.ResultRes<undefined> | {
        err: unknown[][];
    }>;
    readonly parseGunData: (data: SimpleGun[]) => Promise<srvsdbx_ErrorHandling.ResultRes<undefined> | {
        err: unknown[][];
    }>;
    readonly parseLevelData: (data: SimpleLevel[]) => void;
    readonly parseObstacleData: (data: SimpleObstacle[]) => Promise<void>;
    readonly parseParticleData: (data: SimpleParticle[]) => Promise<srvsdbx_ErrorHandling.ResultRes<undefined> | {
        err: unknown[][];
    }>;
    readonly parseStatusEffectData: (data: SimpleStatusEffect<{}>[]) => Promise<srvsdbx_ErrorHandling.ResultRes<undefined> | {
        err: unknown[][];
    }>;
    readonly parseMeleeData: (data: SimpleMelee[]) => Promise<srvsdbx_ErrorHandling.ResultRes<undefined> | {
        err: unknown[][];
    }>;
};
