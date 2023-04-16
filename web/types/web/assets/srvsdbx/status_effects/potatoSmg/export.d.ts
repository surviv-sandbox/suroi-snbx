type SGInfoMap = {
    applyCount: number;
};
declare const _default: {
    name: string;
    targetVersion: string;
    init(): {
        applyCount: number;
    };
    renew(state: SGInfoMap): void;
    update(target: PlayerLike, afflictionTime: number, lastUpdate: number, prototype: StatusEffectPrototype<SGInfoMap>, state: SGInfoMap): void;
    tearDown(target: PlayerLike): void;
    lifetime: number;
};
export default _default;
