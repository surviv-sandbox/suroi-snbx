"use strict";
/**
 * A container to regroup functions that parse objects from their exported forms to their ingame ones
 */
const parseFunctions = (() => {
    /**
     * Generates a function to parse exported objects into their respective instances
     * @param cls The class to be instantiated to create the object
     * @param collection The member of `gamespace.prototypes` this object type belongs to
     */
    function generateParseFunction(cls, collection) {
        return async (data) => {
            const errors = [];
            for (const entry of data) {
                const obj = srvsdbx_ErrorHandling.handleResult(await cls.from(entry), srvsdbx_ErrorHandling.identity, errors.push);
                if (obj instanceof cls) {
                    collection.set(obj.internalName, obj);
                }
            }
            return errors.length ? { err: errors } : srvsdbx_ErrorHandling.emptyResult();
        };
    }
    let NameMap;
    (function (NameMap) {
        NameMap[NameMap["parseAmmoData"] = 0] = "parseAmmoData";
        NameMap[NameMap["parseDecalData"] = 1] = "parseDecalData";
        NameMap[NameMap["parseExplosionData"] = 2] = "parseExplosionData";
        NameMap[NameMap["parseGunData"] = 3] = "parseGunData";
        NameMap[NameMap["parseParticleData"] = 4] = "parseParticleData";
        NameMap[NameMap["parseStatusEffectData"] = 5] = "parseStatusEffectData";
        NameMap[NameMap["parseMeleeData"] = 6] = "parseMeleeData";
    })(NameMap || (NameMap = {}));
    ;
    const arr = [
        [Ammo, "ammoTypes", "parseAmmoData"],
        [DecalPrototype, "decals", "parseDecalData"],
        [ExplosionPrototype, "explosions", "parseExplosionData"],
        [GunPrototype, "firearms", "parseGunData"],
        [ParticlePrototype, "particles", "parseParticleData"],
        [StatusEffectPrototype, "statusEffects", "parseStatusEffectData"],
        [MeleePrototype, "melees", "parseMeleeData"],
    ];
    return arr.map(e => [
        generateParseFunction(e[0], gamespace.prototypes[e[1]]),
        e[2]
    ]).reduce((p, c) => {
        p[c[1]] = c[0];
        return p;
    }, {});
})();
//# sourceMappingURL=preImport.js.map