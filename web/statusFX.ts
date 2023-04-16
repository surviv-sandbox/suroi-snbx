/**
 * A simplified representation of a status effect
 */
interface SimpleStatusEffect<S extends { [key: string]: unknown; }> extends SimpleImport {
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
class StatusEffectPrototype<S extends { [key: string]: unknown; }> extends ImportedObject {
    /**
     * Takes a simplified representation of a status effect and converts it into a more rigorous one
     * @param obj The `SimpleStatusEffect` object to parse
     * @returns A new `StatusEffectPrototype`
     */
    static async from<S extends { [key: string]: unknown; }>(obj: SimpleStatusEffect<S>): Promise<srvsdbx_ErrorHandling.Result<StatusEffectPrototype<S>, srvsdbx_Errors.SandboxError[]>> {
        const errors: srvsdbx_Errors.SandboxError[] = [],
            HPDeco = obj.healthBarDecoration ? srvsdbx_ErrorHandling.handleResult(
                await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${obj.includePath}/${obj.healthBarDecoration}`),
                srvsdbx_ErrorHandling.identity,
                e => errors.push(e)
            ) : void 0;

        if (errors.length) return { err: errors };

        return {
            res: new StatusEffectPrototype<S>(
                obj.name,
                obj.displayName,
                obj.objectType,
                obj.targetVersion,
                obj.namespace,
                obj.includePath,
                obj.init,
                obj.renew,
                obj.update,
                obj.tearDown,
                obj.lifetime ?? Infinity,
                HPDeco as srvsdbx_AssetManagement.ImageSrcPair
            )
        };
    }

    /**
     * A function that will be called once when a `StatusEffect` is created in order to initialize all its custom fields
     */
    readonly #init: SimpleStatusEffect<S>["init"];
    /**
     * A function that will be called once when a `StatusEffect` is created in order to initialize all its custom fields
     */
    get init() { return this.#init; }

    /**
     A function that may be specified in order to run code whenever this status effect is renewed
     *
     * It will *not* be called on the initial infliction (`init` will).
     */
    readonly #renew: SimpleStatusEffect<S>["renew"];
    /**
     A function that may be specified in order to run code whenever this status effect is renewed
     *
     * It will *not* be called on the initial infliction (`init` will).
     */
    get renew() { return this.#renew; }

    /**
     * A function that will be called every tick, used to execute this status effect's logic
     */
    readonly #update: SimpleStatusEffect<S>["update"];
    /**
     * A function that will be called every tick, used to execute this status effect's logic
     */
    get update() { return this.#update; }

    /**
     * A function that may be specified in order to clean up any side-effects this status effects has
     */
    readonly #tearDown: SimpleStatusEffect<S>["tearDown"];
    /**
     * A function that may be specified in order to clean up any side-effects this status effects has
     */
    get tearDown() { return this.#tearDown; }

    /**
     * A delay after which the status effect will be automatically removed
     */
    #decay: number;
    /**
     * A delay after which the status effect will be automatically removed
     */
    get decay() { return this.#decay; }

    /**
     * Optionally specify a path to an image that will be wrapped around the health bar to indicate the status effect's remaining duration
     */
    readonly #healthBarDecoration: srvsdbx_AssetManagement.ImageSrcPair | undefined;
    /**
     * Optionally specify a path to an image that will be wrapped around the health bar to indicate the status effect's remaining duration
     */
    get healthBarDecoration() { return this.#healthBarDecoration; }

    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(
        name: ImportedObject["name"],
        displayName: ImportedObject["displayName"],
        objectType: ImportedObject["objectType"],
        targetVersion: ImportedObject["targetVersion"],
        namespace: ImportedObject["namespace"],
        includePath: ImportedObject["includePath"],
        init: StatusEffectPrototype<S>["init"],
        renew: StatusEffectPrototype<S>["renew"],
        update: StatusEffectPrototype<S>["update"],
        tearDown: StatusEffectPrototype<S>["tearDown"],
        decay: StatusEffectPrototype<S>["decay"],
        healthBarDecoration: StatusEffectPrototype<S>["healthBarDecoration"],
    ) {
        super(name, displayName, objectType, targetVersion, namespace, includePath);

        this.#init = init;
        this.#renew = renew;
        this.#update = update;
        this.#tearDown = tearDown;
        this.#decay = decay;
        this.#healthBarDecoration = healthBarDecoration;
    }

    /**
     * Creates a new `StatusEffect` based on this prototype
     * @param target The target to apply this status effect to
     * @returns The newly created status effect
     */
    create(target: PlayerLike) {
        return new StatusEffect<S>(
            this,
            target
        );
    }
}

/**
 * Represents a specific instance of a status effect
 */
class StatusEffect<S extends { [key: string]: unknown; }> implements Destroyable {
    /**
     * The `StatusEffectPrototype` this instance is based on
     */
    readonly #prototype: StatusEffectPrototype<S>;
    /**
     * The `StatusEffectPrototype` this instance is based on
     */
    get prototype() { return this.#prototype; }

    /**
     * The `PlayerLike` this status effect has been afflicted on
     */
    readonly #target: PlayerLike;
    /**
     * The `PlayerLike` this status effect has been afflicted on
     */
    get target() { return this.#target; }

    /**
     * The last tick this status effect was afflicted; renewals will modify this value
     */
    #afflictionTime = gamespace.currentUpdate;
    /**
     * The last tick this status effect was afflicted; renewals will modify this value
     */
    get afflictionTime() { return this.#afflictionTime; }

    /**
     * The last tick this status effect was updated on
     */
    #lastUpdate = gamespace.currentUpdate;
    /**
     * The last tick this status effect was updated on
     */
    get lastUpdate() { return this.#lastUpdate; }

    /**
     * An object where additional info can be stored for use in the `update` function
     */
    readonly #state: S;

    /**
     * Whether this status effect is still active or not
     */
    #destroyed = false;
    /**
     * Whether this status effect is still active or not
     */
    get destroyed() { return this.#destroyed; }

    /**
     * `* It's a constructor. It constructs.`
     * @param prototype The `StatusEffectPrototype` this instance is based on
     * @param target The `PlayerLike` this status effect is being applied to
     */
    constructor(prototype: StatusEffectPrototype<S>, target: PlayerLike) {
        this.#prototype = prototype;
        this.#target = target;
        this.#state = this.#prototype.init();
    }

    /**
     * Executes this status effect's logic
     */
    update() {
        this.#prototype.update(this.#target, this.#afflictionTime, this.#lastUpdate, this.#prototype, this.#state);
        this.#lastUpdate = gamespace.currentUpdate;
    }

    /**
     * Sets this status effect's affliction time to the current time, effectively renewing it if it has a limited lifespan
    */
    renew() {
        this.#afflictionTime = gamespace.currentUpdate;
        this.#prototype.renew?.(this.#state);
    }

    /**
     * Clears this object's non-primitive fields to try and coax the GC into cleaning up
     */
    destroy() {
        if (this.#destroyed) return;
        this.#prototype.tearDown?.(this.#target, this.#state);
        this.#target.statusEffects.delete(this as unknown as StatusEffect<{}>);

        this.#destroyed = true;

        //@ts-expect-error
        this.#prototype = this.#state = this.#target = void 0;
    }
}