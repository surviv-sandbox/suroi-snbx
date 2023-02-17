type WetInfoMap = {
    /**
     * The last time a particle was spawned
     */
    lastParticleTick: number;
    /**
     * When the next particle will be spawned
     */
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
    lifetime: number;
};
export default _default;
