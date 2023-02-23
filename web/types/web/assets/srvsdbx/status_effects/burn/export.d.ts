type BurnInfoMap = {
    /**
     * The last time damage was applied
     */
    lastDamageTick: number;
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
    init(): {
        lastDamageTick: number;
        lastParticleTick: number;
        nextParticleSpawn: number;
    };
    update(target: PlayerLike, afflictionTime: number, lastUpdate: number, prototype: StatusEffectPrototype<BurnInfoMap>, state: BurnInfoMap): void;
    lifetime: number;
};
export default _default;
