"use strict";
/**
 * Represents a certain type of status effect
 */
class StatusEffectPrototype extends ImportedObject {
    /**
     * Takes a simplified representation of a status effect and converts it into a more rigorous one
     * @param obj The `SimpleStatusEffect` object to parse
     * @returns A new `StatusEffectPrototype`
     */
    static async from(obj) {
        const errors = [], HPDeco = obj.healthBarDecoration ? srvsdbx_ErrorHandling.handleResult(await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${obj.includePath}/${obj.healthBarDecoration}`), srvsdbx_ErrorHandling.identity, errors.push) : void 0;
        if (errors.length)
            return { err: errors };
        return {
            res: new StatusEffectPrototype(obj.name, obj.displayName, obj.targetVersion, obj.namespace, obj.includePath, obj.init, obj.renew, obj.update, obj.tearDown, obj.lifetime ?? Infinity, HPDeco)
        };
    }
    /**
     * A function that will be called once when a `StatusEffect` is created in order to initialize all its custom fields
     */
    #init;
    /**
     * A function that will be called once when a `StatusEffect` is created in order to initialize all its custom fields
     */
    get init() { return this.#init; }
    /**
     A function that may be specified in order to run code whenever this status effect is renewed
     *
     * It will *not* be called on the initial infliction (`init` will).
     */
    #renew;
    /**
     A function that may be specified in order to run code whenever this status effect is renewed
     *
     * It will *not* be called on the initial infliction (`init` will).
     */
    get renew() { return this.#renew; }
    /**
     * A function that will be called every tick, used to execute this status effect's logic
     */
    #update;
    /**
     * A function that will be called every tick, used to execute this status effect's logic
     */
    get update() { return this.#update; }
    /**
     * A function that may be specified in order to clean up any side-effects this status effects has
     */
    #tearDown;
    /**
     * A function that may be specified in order to clean up any side-effects this status effects has
     */
    get tearDown() { return this.#tearDown; }
    /**
     * A delay after which the status effect will be automatically removed
     */
    #decay;
    /**
     * A delay after which the status effect will be automatically removed
     */
    get decay() { return this.#decay; }
    /**
     * Optionally specify a path to an image that will be wrapped around the health bar to indicate the status effect's remaining duration
     */
    #healthBarDecoration;
    /**
     * Optionally specify a path to an image that will be wrapped around the health bar to indicate the status effect's remaining duration
     */
    get healthBarDecoration() { return this.#healthBarDecoration; }
    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(name, displayName, targetVersion, namespace, includePath, init, renew, update, tearDown, decay, healthBarDecoration) {
        super(name, displayName, targetVersion, namespace, includePath);
        this.#init = init;
        this.#renew = renew;
        this.#update = update;
        this.#tearDown = tearDown;
        this.#decay = decay;
        this.#healthBarDecoration = healthBarDecoration;
    }
}
/**
 * Represents a specific instance of a status effect
 */
class StatusEffect {
    /**
     * The `StatusEffectPrototype` this instance is based on
     */
    #prototype;
    /**
     * The `StatusEffectPrototype` this instance is based on
     */
    get prototype() { return this.#prototype; }
    /**
     * The `PlayerLike` this status effect has been afflicted on
     */
    #target;
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
    #state;
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
    constructor(prototype, target) {
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
     * Clears this object's non-primitive fields to try and coax the GC into cleaning up
     */
    destroy() {
        this.#prototype.tearDown?.(this.#target, this.#state);
        this.#target.statusEffects.delete(this);
        this.#destroyed = true;
        //@ts-expect-error
        this.#prototype = this.#state = this.#target = void 0;
    }
    /**
     * Sets this status effect's affliction time to the current time, effectively renewing it if it has a limited lifespan
     */
    renew() {
        this.#afflictionTime = gamespace.currentUpdate;
        this.#prototype.renew?.(this.#state);
    }
}
//# sourceMappingURL=statusFX.js.map