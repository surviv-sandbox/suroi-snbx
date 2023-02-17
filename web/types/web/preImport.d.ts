/**
 * A container to regroup functions that parse objects from their exported forms to their ingame ones
 */
declare const parseFunctions: {
    parseAmmoData: (obj: SimpleAmmo) => srvsdbx_ErrorHandling.Result<undefined, unknown[][]>;
    parseDecalData: (obj: SimpleDecal) => srvsdbx_ErrorHandling.Result<undefined, unknown[][]>;
    parseExplosionData: (obj: SimpleExplosion) => srvsdbx_ErrorHandling.Result<undefined, unknown[][]>;
    parseGunData: (obj: SimpleGun) => srvsdbx_ErrorHandling.Result<undefined, unknown[][]>;
    parseMeleeData: (obj: SimpleMelee) => srvsdbx_ErrorHandling.Result<undefined, unknown[][]>;
    parseParticleData: (obj: SimpleParticle) => srvsdbx_ErrorHandling.Result<undefined, unknown[][]>;
    parseStatusEffectData: (obj: SimpleStatusEffect<{}>) => srvsdbx_ErrorHandling.Result<undefined, unknown[][]>;
};
