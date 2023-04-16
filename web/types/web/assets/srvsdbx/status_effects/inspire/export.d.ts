type InspireInfoMap = {
    lastParticleTick: number;
    nextParticleSpawn: number;
};
declare const _default: {
    name: string;
    targetVersion: string;
    init(): {
        lastParticleTick: number;
        nextParticleSpawn: number;
    };
    update(target: PlayerLike, afflictionTime: number, lastUpdate: number, prototype: StatusEffectPrototype<InspireInfoMap>, state: InspireInfoMap): void;
    tearDown(target: PlayerLike): void;
    lifetime: number;
};
export default _default;
