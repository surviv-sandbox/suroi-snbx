type BurnInfoMap = {
    lastDamageTick: number;
    lastParticleTick: number;
    nextParticleSpawn: number;
};
declare const _default: {
    name: string;
    targetVersion: string;
    healthBarDecoration: string;
    init(): {
        lastDamageTick: number;
        lastParticleTick: number;
        nextParticleSpawn: number;
    };
    update(target: PlayerLike, afflictionTime: number, lastUpdate: number, prototype: StatusEffectPrototype<BurnInfoMap>, state: BurnInfoMap): void;
    lifetime: number;
};
export default _default;
