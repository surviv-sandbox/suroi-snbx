/**
 * A container to regroup functions that parse objects from their exported forms to their ingame ones
 */
const parseFunctions = (() => {
    /**
     * Generates a function to parse exported objects into their respective instances
     * @param cls The class to be instantiated to create the object
     * @param collection The member of `gamespace.prototypes` this object type belongs to
     */
    function generateParseFunction<T, U extends MapValue<K>, K extends Gamespace["prototypes"][keyof Gamespace["prototypes"]]>(
        cls: (new (...args: any[]) => U) & { from: (obj: T) => Promise<srvsdbx_ErrorHandling.Result<U, unknown[]>>; },
        collection: K
    ) {
        return async (data: T[]): Promise<srvsdbx_ErrorHandling.Result<undefined, unknown[][]>> => {
            const errors: unknown[][] = [];

            for (const entry of data) {
                const obj = srvsdbx_ErrorHandling.handleResult(await cls.from(entry), srvsdbx_ErrorHandling.identity, errors.push);

                if (obj instanceof cls) {
                    (collection as Map<string, U>).set((obj as U).internalName, (obj as U));
                }
            }

            return errors.length ? { err: errors } : srvsdbx_ErrorHandling.emptyResult();
        };
    }

    type InterfaceMap = {
        ammoTypes: SimpleAmmo,
        decals: SimpleDecal;
        explosions: SimpleExplosion,
        firearms: SimpleGun,
        particles: SimpleParticle,
        statusEffects: SimpleStatusEffect<{}>,
        melees: SimpleMelee;
    };

    enum NameMap {
        parseAmmoData,
        parseDecalData,
        parseExplosionData,
        parseGunData,
        parseParticleData,
        parseStatusEffectData,
        parseMeleeData
    };

    const arr = [
        [Ammo, "ammoTypes", "parseAmmoData"] as const,
        [DecalPrototype, "decals", "parseDecalData"] as const,
        [ExplosionPrototype, "explosions", "parseExplosionData"] as const,
        [GunPrototype, "firearms", "parseGunData"] as const,
        [ParticlePrototype, "particles", "parseParticleData"] as const,
        [StatusEffectPrototype, "statusEffects", "parseStatusEffectData"] as const,
        [MeleePrototype, "melees", "parseMeleeData"] as const,
    ] as const;

    // bruh moment
    type helper<T extends typeof arr = typeof arr> = { [K in keyof T]: [(obj: InterfaceMap[T[K][1]]) => srvsdbx_ErrorHandling.Result<undefined, unknown[][]>, T[K][2]] };
    type helper2<T extends typeof arr = typeof arr> = { [K in keyof T]: T[K][2] };
    type helper3<T extends typeof arr = typeof arr> = { [K in keyof helper2<T>]: helper2<T>[K] };
    type helper4<T extends typeof arr = typeof arr> = { [K in TupleToUnion<helper3>]: helper<T>[typeof NameMap[K]][0] };

    return (
        arr.map(
            e => [
                generateParseFunction
                    <InterfaceMap[(typeof e)["1"]], InstanceType<(typeof e)["0"]>, Gamespace["prototypes"][(typeof e)["1"]]>
                    (
                        e[0] as any,
                        gamespace.prototypes[e[1]]
                    ),
                e[2]
            ]
        ) as unknown as helper
    ).reduce(
        (p, c) => {
            p[c[1]] = c[0] as any;

            return p;
        },
        {} as helper4
    );
})();