interface SimpleStatusEffect<S extends {
    [key: string]: unknown;
}> extends SimpleImport {
    init(): S;
    renew?: (state: S) => void;
    update(target: PlayerLike, creationTime: number, lastUpdate: number, prototype: StatusEffectPrototype<S>, state: S): void;
    tearDown?: (target: PlayerLike, state: S) => void;
    readonly lifetime?: number;
    readonly healthBarDecoration?: string;
}
declare class StatusEffectPrototype<S extends {
    [key: string]: unknown;
}> extends ImportedObject {
    #private;
    static from<S extends {
        [key: string]: unknown;
    }>(obj: SimpleStatusEffect<S>): Promise<srvsdbx_ErrorHandling.Result<StatusEffectPrototype<S>, srvsdbx_Errors.SandboxError[]>>;
    get init(): () => S;
    get renew(): ((state: S) => void) | undefined;
    get update(): (target: PlayerLike, creationTime: number, lastUpdate: number, prototype: StatusEffectPrototype<S>, state: S) => void;
    get tearDown(): ((target: PlayerLike, state: S) => void) | undefined;
    get decay(): number;
    get healthBarDecoration(): srvsdbx_AssetManagement.ImageSrcPair | undefined;
    constructor(name: ImportedObject["name"], displayName: ImportedObject["displayName"], objectType: ImportedObject["objectType"], targetVersion: ImportedObject["targetVersion"], namespace: ImportedObject["namespace"], includePath: ImportedObject["includePath"], init: StatusEffectPrototype<S>["init"], renew: StatusEffectPrototype<S>["renew"], update: StatusEffectPrototype<S>["update"], tearDown: StatusEffectPrototype<S>["tearDown"], decay: StatusEffectPrototype<S>["decay"], healthBarDecoration: StatusEffectPrototype<S>["healthBarDecoration"]);
    create(target: PlayerLike): StatusEffect<S>;
}
declare class StatusEffect<S extends {
    [key: string]: unknown;
}> implements Destroyable {
    #private;
    get prototype(): StatusEffectPrototype<S>;
    get target(): PlayerLike;
    get afflictionTime(): number;
    get lastUpdate(): number;
    get destroyed(): boolean;
    constructor(prototype: StatusEffectPrototype<S>, target: PlayerLike);
    update(): void;
    renew(): void;
    destroy(): void;
}
