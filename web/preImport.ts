/**
 * A container to regroup functions that parse objects from their exported forms to their ingame ones
 *
 * **These functions should never be called by the suer and are for internal use only**
 */
const parseFunctions = {
    async parseAmmoData(data: SimpleAmmo[]) {
        const errors: unknown[][] = [];

        for (const entry of data) {
            let error: srvsdbx_Errors.SandboxError[] = [];
            const obj = srvsdbx_ErrorHandling.handleResult(await Ammo.from(entry), srvsdbx_ErrorHandling.identity, e => (error = e, errors.push(e)));

            if (obj instanceof Ammo) {
                gamespace.prototypes.ammos.set(obj.internalName, obj);
                gamespace.events.dispatchEvent("fragmentLoaded", { res: obj });
            } else {
                gamespace.events.dispatchEvent("fragmentLoaded", {
                    err: {
                        internalName: `${entry.namespace}::${entry.name}`,
                        includePath: entry.includePath,
                        namespace: entry.namespace,
                        objectType: entry.objectType,
                        err: error
                    }
                });
            }
        }

        return errors.length ? { err: errors } : srvsdbx_ErrorHandling.emptyResult();
    },
    async parseDecalData(data: SimpleDecal[]) {
        const errors: unknown[][] = [];

        for (const entry of data) {
            let error: srvsdbx_Errors.SandboxError[] = [];
            const obj = srvsdbx_ErrorHandling.handleResult(await DecalPrototype.from(entry), srvsdbx_ErrorHandling.identity, e => (error = e, errors.push(e)));

            if (obj instanceof DecalPrototype) {
                gamespace.prototypes.decals.set(obj.internalName, obj);
                gamespace.events.dispatchEvent("fragmentLoaded", { res: obj });
            } else {
                gamespace.events.dispatchEvent("fragmentLoaded", {
                    err: {
                        internalName: `${entry.namespace}::${entry.name}`,
                        includePath: entry.includePath,
                        namespace: entry.namespace,
                        objectType: entry.objectType,
                        err: error
                    }
                });
            }
        }

        return errors.length ? { err: errors } : srvsdbx_ErrorHandling.emptyResult();
    },
    async parseExplosionData(data: SimpleExplosion[]) {
        const errors: unknown[][] = [];

        for (const entry of data) {
            let error: srvsdbx_Errors.SandboxError[] = [];
            const obj = srvsdbx_ErrorHandling.handleResult(await ExplosionPrototype.from(entry), srvsdbx_ErrorHandling.identity, e => (error = e, errors.push(e)));

            if (obj instanceof ExplosionPrototype) {
                gamespace.prototypes.explosions.set(obj.internalName, obj);
                gamespace.events.dispatchEvent("fragmentLoaded", { res: obj });
            } else {
                gamespace.events.dispatchEvent("fragmentLoaded", {
                    err: {
                        internalName: `${entry.namespace}::${entry.name}`,
                        includePath: entry.includePath,
                        namespace: entry.namespace,
                        objectType: entry.objectType,
                        err: error
                    }
                });
            }
        }

        return errors.length ? { err: errors } : srvsdbx_ErrorHandling.emptyResult();
    },
    async parseEquipmentData(data: SimpleEquipment[]) {
        const errors: unknown[][] = [];

        for (const entry of data) {
            let error: srvsdbx_Errors.SandboxError[] = [];
            const obj = srvsdbx_ErrorHandling.handleResult(await EquipmentPrototype.from(entry), srvsdbx_ErrorHandling.identity, e => (error = e, errors.push(e)));

            if (obj instanceof EquipmentPrototype) {
                gamespace.prototypes.equipments.set(obj.internalName, obj);
                gamespace.events.dispatchEvent("fragmentLoaded", { res: obj });
            } else {
                gamespace.events.dispatchEvent("fragmentLoaded", {
                    err: {
                        internalName: `${entry.namespace}::${entry.name}`,
                        includePath: entry.includePath,
                        namespace: entry.namespace,
                        objectType: entry.objectType,
                        err: error
                    }
                });
            }
        }

        return errors.length ? { err: errors } : srvsdbx_ErrorHandling.emptyResult();
    },
    async parseGunData(data: SimpleGun[]) {
        const errors: unknown[][] = [];

        for (const entry of data) {
            let error: srvsdbx_Errors.SandboxError[] = [];
            const obj = srvsdbx_ErrorHandling.handleResult(await GunPrototype.from(entry), srvsdbx_ErrorHandling.identity, e => (error = e, errors.push(e)));

            if (obj instanceof GunPrototype) {
                gamespace.prototypes.firearms.set(obj.internalName, obj);
                gamespace.events.dispatchEvent("fragmentLoaded", { res: obj });
            } else {
                gamespace.events.dispatchEvent("fragmentLoaded", {
                    err: {
                        internalName: `${entry.namespace}::${entry.name}`,
                        includePath: entry.includePath,
                        namespace: entry.namespace,
                        objectType: entry.objectType,
                        err: error
                    }
                });
            }
        }

        return errors.length ? { err: errors } : srvsdbx_ErrorHandling.emptyResult();
    },
    parseLevelData(data: SimpleLevel[]) {
        const levels = data.map(d => Level.from(d));

        gamespace.levels.push(...levels);

        for (const level of levels) {
            gamespace.events.dispatchEvent("fragmentLoaded", { res: level });
        }
    },
    async parseObstacleData(data: SimpleObstacle[]) {
        const errors: unknown[][] = [];

        for (const entry of data) {
            let error: srvsdbx_Errors.SandboxError[] = [];
            const obj = srvsdbx_ErrorHandling.handleResult(await ObstaclePrototype.from(entry), srvsdbx_ErrorHandling.identity, e => (error = e, errors.push(e)));

            if (obj instanceof ObstaclePrototype) {
                gamespace.prototypes.obstacles.set(obj.internalName, obj);
                gamespace.events.dispatchEvent("fragmentLoaded", { res: obj });
            } else {
                gamespace.events.dispatchEvent("fragmentLoaded", {
                    err: {
                        internalName: `${entry.namespace}::${entry.name}`,
                        includePath: entry.includePath,
                        namespace: entry.namespace,
                        objectType: entry.objectType,
                        err: error
                    }
                });
            }
        }
    },
    async parseParticleData(data: SimpleParticle[]) {
        const errors: unknown[][] = [];

        for (const entry of data) {
            let error: srvsdbx_Errors.SandboxError[] = [];
            const obj = srvsdbx_ErrorHandling.handleResult(await ParticlePrototype.from(entry), srvsdbx_ErrorHandling.identity, e => (error = e, errors.push(e)));

            if (obj instanceof ParticlePrototype) {
                gamespace.prototypes.particles.set(obj.internalName, obj);
                gamespace.events.dispatchEvent("fragmentLoaded", { res: obj });
            } else {
                gamespace.events.dispatchEvent("fragmentLoaded", {
                    err: {
                        internalName: `${entry.namespace}::${entry.name}`,
                        includePath: entry.includePath,
                        namespace: entry.namespace,
                        objectType: entry.objectType,
                        err: error
                    }
                });
            }
        }

        return errors.length ? { err: errors } : srvsdbx_ErrorHandling.emptyResult();
    },
    async parseStatusEffectData(data: SimpleStatusEffect<{}>[]) {
        const errors: unknown[][] = [];

        for (const entry of data) {
            let error: srvsdbx_Errors.SandboxError[] = [];
            const obj = srvsdbx_ErrorHandling.handleResult(await StatusEffectPrototype.from(entry), srvsdbx_ErrorHandling.identity, e => (error = e, errors.push(e)));

            if (obj instanceof StatusEffectPrototype) {
                gamespace.prototypes.statusEffects.set(obj.internalName, obj);
                gamespace.events.dispatchEvent("fragmentLoaded", { res: obj });
            } else {
                gamespace.events.dispatchEvent("fragmentLoaded", {
                    err: {
                        internalName: `${entry.namespace}::${entry.name}`,
                        includePath: entry.includePath,
                        namespace: entry.namespace,
                        objectType: entry.objectType,
                        err: error
                    }
                });
            }
        }

        return errors.length ? { err: errors } : srvsdbx_ErrorHandling.emptyResult();
    },
    async parseMeleeData(data: SimpleMelee[]) {
        const errors: unknown[][] = [];

        for (const entry of data) {
            let error: srvsdbx_Errors.SandboxError[] = [];
            const obj = srvsdbx_ErrorHandling.handleResult(await MeleePrototype.from(entry), srvsdbx_ErrorHandling.identity, e => (error = e, errors.push(e)));

            if (obj instanceof MeleePrototype) {
                gamespace.prototypes.melees.set(obj.internalName, obj);
                gamespace.events.dispatchEvent("fragmentLoaded", { res: obj });
            } else {
                gamespace.events.dispatchEvent("fragmentLoaded", {
                    err: {
                        internalName: `${entry.namespace}::${entry.name}`,
                        includePath: entry.includePath,
                        namespace: entry.namespace,
                        objectType: entry.objectType,
                        err: error
                    }
                });
            }
        }

        return errors.length ? { err: errors } : srvsdbx_ErrorHandling.emptyResult();
    }
} as const;