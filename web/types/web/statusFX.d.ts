/**
 * A simplified representation of a status effect
 */
interface SimpleStatusEffect<S extends {
    [key: string]: unknown;
}> extends SimpleImport {
    /**
     * A function used to initiate all of this status effect's custom fields
     *
     * This is called once per affliction; if a status effect is renewed, it will *not* be called
     */
    init(): S;
    /**
     * A function that may be specified in order to run code whenever this status effect is renewed
     *
     * It will *not* be called on the initial infliction (`init` will).
     *
     * @param state The state of this status effect
     */
    renew?: (state: S) => void;
    /**
     * A function that will be called every tick, used to execute this status effect's logic
     * @param target The `PlayerLike` this status effect is being applied to
     * @param creationTime The last time this status effect was applied to `target`
     * @param lastUpdate The last time this function was called
     * @param prototype This status effect's prototype
     * @param state The state of this status effect
     */
    update(target: PlayerLike, creationTime: number, lastUpdate: number, prototype: StatusEffectPrototype<S>, state: S): void;
    /**
     * A function that may be specified in order to clean up any side-effects this status effects has
     *
     * Called once when this status effect is removed
     * @param target The `PlayerLike` this status effect is being applied to
     * @param state The state of this status effect
     */
    tearDown?: (target: PlayerLike, state: S) => void;
    /**
     * A delay after which the status effect will be automatically removed.
     */
    readonly lifetime?: number;
    /**
     * Optionally specify a path to an image that will be wrapped around the health bar to indicate the status effect's remaining duration
     */
    readonly healthBarDecoration?: string;
}
/**
 * Represents a certain type of status effect
 */
declare class StatusEffectPrototype<S extends {
    [key: string]: unknown;
}> extends ImportedObject {
    #private;
    /**
     * Takes a simplified representation of a status effect and converts it into a more rigorous one
     * @param obj The `SimpleStatusEffect` object to parse
     * @returns A new `StatusEffectPrototype`
     */
    static from<S extends {
        [key: string]: unknown;
    }>(obj: SimpleStatusEffect<S>): Promise<srvsdbx_ErrorHandling.Result<StatusEffectPrototype<S>, SandboxError[]>>;
    /**
     * A function that will be called once when a `StatusEffect` is created in order to initialize all its custom fields
     */
    get init(): () => S;
    /**
     A function that may be specified in order to run code whenever this status effect is renewed
     *
     * It will *not* be called on the initial infliction (`init` will).
     */
    get renew(): ((state: S) => void) | undefined;
    /**
     * A function that will be called every tick, used to execute this status effect's logic
     */
    get update(): (target: PlayerLike, creationTime: number, lastUpdate: number, prototype: StatusEffectPrototype<S>, state: S) => void;
    /**
     * A function that may be specified in order to clean up any side-effects this status effects has
     */
    get tearDown(): ((target: PlayerLike, state: S) => void) | undefined;
    /**
     * A delay after which the status effect will be automatically removed
     */
    get decay(): number;
    /**
     * Optionally specify a path to an image that will be wrapped around the health bar to indicate the status effect's remaining duration
     */
    get healthBarDecoration(): srvsdbx_AssetManagement.ImageSrcPair | undefined;
    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(name: typeof ImportedObject.prototype.name, displayName: typeof ImportedObject.prototype.displayName, objectType: typeof ImportedObject.prototype.objectType, targetVersion: typeof ImportedObject.prototype.targetVersion, namespace: typeof ImportedObject.prototype.namespace, includePath: typeof ImportedObject.prototype.includePath, init: typeof StatusEffectPrototype.prototype.init, renew: typeof StatusEffectPrototype.prototype.renew, update: typeof StatusEffectPrototype.prototype.update, tearDown: typeof StatusEffectPrototype.prototype.tearDown, decay: typeof StatusEffectPrototype.prototype.decay, healthBarDecoration: typeof StatusEffectPrototype.prototype.healthBarDecoration);
}
/**
 * Represents a specific instance of a status effect
 */
declare class StatusEffect<S extends {
    [key: string]: unknown;
}> implements Destroyable {
    #private;
    /**
     * The `StatusEffectPrototype` this instance is based on
     */
    get prototype(): StatusEffectPrototype<S>;
    /**
     * The `PlayerLike` this status effect has been afflicted on
     */
    get target(): PlayerLike;
    /**
     * The last tick this status effect was afflicted; renewals will modify this value
     */
    get afflictionTime(): number;
    /**
     * The last tick this status effect was updated on
     */
    get lastUpdate(): number;
    /**
     * Whether this status effect is still active or not
     */
    get destroyed(): boolean;
    /**
     * `* It's a constructor. It constructs.`
     * @param prototype The `StatusEffectPrototype` this instance is based on
     * @param target The `PlayerLike` this status effect is being applied to
     */
    constructor(prototype: StatusEffectPrototype<S>, target: PlayerLike);
    /**
     * Executes this status effect's logic
     */
    update(): void;
    /**
     * Clears this object's non-primitive fields to try and coax the GC into cleaning up
     */
    destroy(): void;
    /**
     * Sets this status effect's affliction time to the current time, effectively renewing it if it has a limited lifespan
     */
    renew(): void;
}
