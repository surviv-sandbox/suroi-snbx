type WetInfoMap = {
    lastParticleTick: number;
    nextParticleSpawn: number;
};
declare const _default: {
    name: string;
    targetVersion: string;
    healthBarDecoration: string;
    init(): {
        lastParticleTick: number;
        nextParticleSpawn: number;
    };
    update(target: PlayerLike, afflictionTime: number, lastUpdate: number, prototype: StatusEffectPrototype<WetInfoMap>, state: WetInfoMap): void;
    tearDown(target: PlayerLike): void;
    lifetime: number;
};
export default _default;
