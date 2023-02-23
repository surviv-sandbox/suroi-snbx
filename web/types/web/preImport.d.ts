/**
 * A container to regroup functions that parse objects from their exported forms to their ingame ones
 *
 * **These functions should never be called by the suer and are for internal use only**
 */
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
    readonly parseGunData: (data: SimpleGun[]) => Promise<srvsdbx_ErrorHandling.ResultRes<undefined> | {
        err: unknown[][];
    }>;
    readonly parseParticleData: (data: SimpleParticle[]) => Promise<srvsdbx_ErrorHandling.ResultRes<undefined> | {
        err: unknown[][];
    }>;
    readonly parseStatusEffectData: (data: SimpleStatusEffect<{}>[]) => Promise<srvsdbx_ErrorHandling.ResultRes<undefined> | {
        err: unknown[][];
    }>;
    readonly parseMeleeData: (data: SimpleMelee[]) => Promise<srvsdbx_ErrorHandling.ResultRes<undefined> | {
        err: unknown[][];
    }>;
    readonly parseLevelData: (data: SimpleLevel[]) => void;
};
