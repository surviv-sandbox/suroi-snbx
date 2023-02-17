"use strict";
;
/**
 * Represents a certain type of melee weapon
 */
class MeleePrototype extends InventoryItemPrototype {
    /**
     * Whether or not this melee is swung as long as the attack input is down—whether the melee "fires automatically"
     */
    #autoAttack;
    /**
     * Whether or not this melee is swung as long as the attack input is down—whether the melee "fires automatically"
     */
    get autoAttack() { return this.#autoAttack; }
    /**
     * The maximum amount of targets this melee weapon can strike per hit
     *
     * This applies every time a damage calculation is done, so a melee weapon
     * that deals damage twice per swing (like the bonesaw) and that has this
     * property set to 3 can hit a total of 6 targets per swing
     */
    #maxTargets;
    /**
     * The maximum amount of targets this melee weapon can strike per hit
     *
     * This applies every time a damage calculation is done, so a melee weapon
     * that deals damage twice per swing (like the bonesaw) and that has this
     * property set to 3 can hit a total of 6 targets per swing
     */
    get maxTargets() { return this.#maxTargets; }
    /**
     * Information about the damage this melee weapon deals and their offsets in time
     *
     * For each entry, the first number indicates the damage dealt and the second indicates
     * the amount of time after the initial swing that should pass before testing for a hit
     */
    #damages;
    /**
     * Information about the damage this melee weapon deals and their offsets in time
     *
     * For each entry, the first number indicates the damage dealt and the second indicates
     * the amount of time after the initial swing that should pass before testing for a hit
     */
    get damages() { return this.#damages; }
    /**
     * Whether or not this melee weapon's bounding box reflects bullets
     */
    #isReflective;
    /**
     * Whether or not this melee weapon's bounding box reflects bullets
     */
    get isReflective() { return this.#isReflective; }
    /**
     * A number by which this weapon's damage will be multiplied when the damage is applied to an obstacle
     */
    #obstacleMult;
    /**
     * A number by which this weapon's damage will be multiplied when the damage is applied to an obstacle
     */
    get obstacleMult() { return this.#obstacleMult; }
    /**
     * The minimum amount of time between two consecutive swings
     */
    #useDelay;
    /**
     * The minimum amount of time between two consecutive swings
     */
    get useDelay() { return this.#useDelay; }
    /**
     * A set of `Animation`s for this melee weapon to use
     */
    #animations;
    /**
     * A set of `Animation`s for this melee weapon to use
     */
    get animations() { return this.#animations; }
    /**
     * Information about this weapon's in-world rendition
     */
    #worldObject;
    /**
     * Information about this weapon's in-world rendition
     */
    get worldObject() { return this.#worldObject; }
    /**
     * Information about this weapon's in-world rendition
     */
    #holstered;
    /**
     * Information about this weapon's in-world rendition
     */
    get holstered() { return this.#holstered; }
    /**
     * An array of additional objects that can be rendered alongside this item
     *
     * This one is concerned with those residing below the item
    */
    #addonsBelow;
    /**
     * An array of additional objects that can be rendered alongside this item
     *
     * This one is concerned with those residing below the item
     */
    get addonsBelow() { return this.#addonsBelow; }
    /**
     * An array of additional objects that can be rendered alongside this item
     *
     * This one is concerned with those residing above the item
     */
    #addonsAbove;
    /**
     * An array of additional objects that can be rendered alongside this item
    *
    * This one is concerned with those residing above the item
    */
    get addonsAbove() { return this.#addonsAbove; }
    /**
     * An array of additional objects that can be rendered alongside this item
     */
    #addons;
    /**
     * An array of additional objects that can be rendered alongside this item
     */
    get addons() { return this.#addons; }
    /**
     * Takes a simplified representation of a firearm and converts it into a more rigorous one
     * @param obj The `SimpleMelee` object to parse
     * @returns A new `MeleePrototype`
     */
    static async from(obj) {
        const errors = [], pathPrefix = `${obj.includePath}/`, lootImage = srvsdbx_ErrorHandling.handleResult(await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${pathPrefix}${obj.images.loot}`), srvsdbx_ErrorHandling.identity, errors.push), worldImage = obj.images.world ? srvsdbx_ErrorHandling.handleResult(await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${pathPrefix}${obj.images.world}`), srvsdbx_ErrorHandling.identity, errors.push) : void 0, holsteredImage = obj.holstered && !!(obj.holstered.image ?? obj.images.world) ? srvsdbx_ErrorHandling.handleResult(await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${pathPrefix}${obj.holstered.image ?? obj.images.world}`), srvsdbx_ErrorHandling.identity, errors.push) : void 0, addonImages = obj.addons ? await (async () => {
            const array = [];
            for (const addon of obj.addons) {
                array.push(await srvsdbx_AssetManagement.loadImageArray(addon.images, errors, pathPrefix));
            }
            return array;
        })() : void 0;
        if (errors.length)
            return { err: errors };
        const fetchDimensions = cachify((size) => {
            return srvsdbx_AssetManagement.determineImageDimensions(worldImage.asset, {
                width: size.width ?? "auto",
                height: size.height ?? "auto",
            });
        }, {
            equalityFunction(a, b) {
                return a[0].width === b[0].width
                    && a[0].height === b[0].height;
            }
        });
        const worldObject = obj.worldObject, size = gamespace.PLAYER_SIZE;
        function interp(a, b, t) {
            const [handA, handB] = [a.hands, b.hands], [leftA, leftB] = [handA?.leftHand, handB?.leftHand], [rightA, rightB] = [handA?.rightHand, handB?.rightHand], [itemA, itemB] = [a.item, b.item], [itemAOffset, itemBOffset] = [itemA?.offset, itemB?.offset], [itemADim, itemBDim] = worldImage
                ? [
                    fetchDimensions(itemA?.dimensions ?? worldObject?.dimensions ?? { width: "auto", height: "auto" }),
                    fetchDimensions(itemB?.dimensions ?? worldObject?.dimensions ?? { width: "auto", height: "auto" })
                ]
                : [
                    void 0,
                    void 0
                ], linterp = srvsdbx_Animation.easingFunctions.linterp;
            return {
                hands: {
                    leftHand: {
                        parr: linterp(leftA?.parr ?? leftB?.parr ?? 0.85, leftB?.parr ?? leftA?.parr ?? 0.85, t),
                        perp: linterp(leftA?.perp ?? leftB?.perp ?? 0.75, leftB?.perp ?? leftA?.perp ?? 0.75, t),
                    },
                    rightHand: {
                        parr: linterp(rightA?.parr ?? rightB?.parr ?? 0.85, rightB?.parr ?? rightA?.parr ?? 0.85, t),
                        perp: linterp(rightA?.perp ?? rightB?.perp ?? -0.75, rightB?.perp ?? rightA?.perp ?? -0.75, t),
                    }
                },
                item: worldImage ? {
                    dimensions: {
                        width: size * linterp(itemADim.width, itemBDim.width, t),
                        height: size * linterp(itemADim.height, itemBDim.height, t)
                    },
                    offset: {
                        parr: linterp(itemAOffset?.parr ?? itemBOffset?.parr ?? worldObject?.offset.parr ?? 0, itemBOffset?.parr ?? itemAOffset?.parr ?? worldObject?.offset.parr ?? 0, t),
                        perp: linterp(itemAOffset?.perp ?? itemBOffset?.perp ?? worldObject?.offset.perp ?? 0, itemBOffset?.perp ?? itemAOffset?.perp ?? worldObject?.offset.perp ?? 0, t),
                        angle: linterp(itemAOffset?.angle ?? itemBOffset?.angle ?? worldObject?.offset.angle ?? 0, itemBOffset?.angle ?? itemAOffset?.angle ?? worldObject?.offset.angle ?? 0, t)
                    }
                } : void 0
            };
        }
        function generateStaticAnim() {
            return srvsdbx_Animation.Animation.createStillFrame({
                hands: {
                    leftHand: {
                        parr: (obj.handPositions?.leftHand.parr ?? 0.85),
                        perp: (obj.handPositions?.leftHand.perp ?? -0.75)
                    },
                    rightHand: {
                        parr: (obj.handPositions?.rightHand.parr ?? 0.85),
                        perp: (obj.handPositions?.rightHand.perp ?? 0.75)
                    }
                },
                item: {
                    dimensions: worldImage ?
                        (() => {
                            const dim = srvsdbx_AssetManagement.determineImageDimensions(worldImage.asset, {
                                width: worldObject?.dimensions.width ?? "auto",
                                height: worldObject?.dimensions.height ?? "auto"
                            });
                            return {
                                width: dim.width * size,
                                height: dim.height * size
                            };
                        })() :
                        void 0,
                    offset: {
                        parr: worldObject?.offset.parr === void 0 ? void 0 : worldObject?.offset.parr,
                        perp: worldObject?.offset.perp === void 0 ? void 0 : worldObject?.offset.perp,
                        angle: worldObject?.offset.angle
                    }
                }
            });
        }
        function determineAnimation(animation) {
            return animation == "none"
                ? generateStaticAnim()
                : (() => {
                    const resolved = extractValue(animation);
                    return resolved == "none"
                        ? generateStaticAnim()
                        : new srvsdbx_Animation.Animation(resolved, interp);
                });
        }
        const holster = obj.holstered, holsterCollider = holster?.collider;
        return {
            res: new MeleePrototype(obj.name, obj.displayName, obj.targetVersion, obj.namespace, obj.includePath, {
                loot: lootImage,
                world: worldImage
            }, obj.moveSpeedPenalties, obj.isReflective ?? false, obj.autoAttack, obj.maxTargets, obj.damages, worldObject, holsteredImage ? {
                image: holsteredImage,
                dimensions: holster?.dimensions ?? worldObject?.dimensions ?? { width: "auto", height: "auto", layer: 0 },
                offset: holster?.offset ?? worldObject?.offset ?? { parr: 0, perp: 0, angle: 0 },
                collider: holsterCollider ? {
                    width: holsterCollider?.width ?? holster?.dimensions?.width ?? worldObject?.dimensions.width ?? "match",
                    height: holsterCollider?.height ?? holster?.dimensions?.height ?? worldObject?.dimensions.height ?? "match",
                    offsetParr: holsterCollider?.offsetParr ?? holster?.offset?.parr ?? worldObject?.offset.parr ?? 0,
                    offsetPerp: holsterCollider?.offsetPerp ?? holster?.offset?.perp ?? worldObject?.offset.perp ?? 0,
                } : void 0
            } : void 0, obj.obstacleMult, obj.useDelay, {
                idle: determineAnimation(obj.animations.idle),
                using: determineAnimation(obj.animations.using)
            }, obj.addons ?
                obj.addons.map((addon, i) => {
                    return {
                        dimensions: addon.dimensions,
                        position: addon.position,
                        tint: addon.tint,
                        dual: addon.dual,
                        show: addon.show,
                        images: addonImages[i],
                    };
                })
                : void 0)
        };
    }
    /**
     * `* It's a constructor. It constructs`
     */
    constructor(name, displayName, targetVersion, namespace, includePath, images, moveSpeedPenalties, isReflective, autoAttack, maxTargets, damages, worldObject, holstered, obstacleMult, firingDelay, animations, addons) {
        super(name, displayName, targetVersion, namespace, includePath, images, moveSpeedPenalties);
        const size = gamespace.PLAYER_SIZE;
        function autoOrScale(dim) {
            return dim == "auto" ? dim : dim * size;
        }
        this.#autoAttack = autoAttack;
        this.#maxTargets = maxTargets;
        this.#damages = damages;
        this.#isReflective = isReflective;
        this.#worldObject = worldObject ? (() => {
            const image = images.world.asset, worldDim = srvsdbx_AssetManagement.determineImageDimensions(image, worldObject.dimensions);
            return {
                tint: worldObject.tint,
                offset: {
                    parr: worldObject.offset.parr,
                    perp: worldObject.offset.perp,
                    angle: worldObject.offset.angle
                },
                dimensions: {
                    width: worldDim.width * size,
                    height: worldDim.height * size,
                    layer: worldObject.dimensions.layer ?? 0
                },
                collider: worldObject.collider ? (() => {
                    const dim = srvsdbx_AssetManagement.determineImageDimensions(image, {
                        width: worldObject.collider.width == "match" ? worldDim.width : worldObject.collider.width,
                        height: worldObject.collider.height == "match" ? worldDim.height : worldObject.collider.height
                    });
                    return {
                        width: dim.width * size,
                        height: dim.height * size,
                        offsetParr: worldObject.collider.offsetParr,
                        offsetPerp: worldObject.collider.offsetPerp
                    };
                })() : void 0
            };
        })() : void 0;
        this.#obstacleMult = obstacleMult;
        this.#useDelay = firingDelay;
        this.#animations = animations;
        this.#holstered = holstered ? (() => {
            const holsteredDim = srvsdbx_AssetManagement.determineImageDimensions(holstered.image.asset, holstered.dimensions), colliderDims = holstered.collider ? srvsdbx_AssetManagement.determineImageDimensions(holstered.image.asset, {
                width: holstered.collider.width == "match" ? holsteredDim.width : holstered.collider.width,
                height: holstered.collider.height == "match" ? holsteredDim.height : holstered.collider.height
            }) : void 0;
            return {
                image: holstered.image,
                dimensions: {
                    width: holsteredDim.width * size,
                    height: holsteredDim.height * size,
                    layer: holstered.dimensions.layer ?? 0
                },
                offset: {
                    parr: holstered.offset.parr,
                    perp: holstered.offset.perp,
                    angle: holstered.offset.angle
                },
                collider: holstered.collider ? {
                    width: colliderDims.width * size,
                    height: colliderDims.height * size,
                    offsetParr: holstered.collider.offsetParr,
                    offsetPerp: holstered.collider.offsetPerp,
                } : {
                    width: holsteredDim.width,
                    height: holsteredDim.height,
                    offsetParr: 0,
                    offsetPerp: 0
                }
            };
        })() : void 0;
        this.#addons = addons ?
            addons.map(addon => {
                return {
                    images: addon.images,
                    tint: addon.tint,
                    dual: addon.dual,
                    show: addon.show,
                    dimensions: {
                        width: melee => autoOrScale(extractValue(addon.dimensions.width, melee)),
                        height: melee => autoOrScale(extractValue(addon.dimensions.height, melee)),
                        layer: addon.dimensions.layer
                    },
                    position: {
                        parr: melee => extractValue(addon.position.parr, melee),
                        perp: melee => extractValue(addon.position.perp, melee)
                    }
                };
            })
            : void 0;
        this.#addonsBelow = this.#addons?.filter?.(addon => addon.dimensions.layer == -1);
        this.#addonsAbove = this.#addons?.filter?.(addon => addon.dimensions.layer == 1);
    }
}
/**
 * Represents a specific instance of a melee weapon
 */
class Melee extends InventoryItem {
    /**
     * An object to manage this item's animations
     */
    #animationManager;
    /**
     * An object to manage this item's animations
     */
    get animationManager() { return this.#animationManager; }
    /**
     * The last time this weapon was fired
     */
    #lastUse = 0;
    /**
     * The last time this weapon was fired
     */
    get lastUse() { return this.#lastUse; }
    /**
     * Whether or not this melee's animation has been cancelled
     */
    #cancelledAnimation = false;
    /**
     * Whether or not this melee's animation has been cancelled
     */
    get cancelledAnimation() { return this.#cancelledAnimation; }
    /**
     * `* It's a constructor. It constructs`
     */
    constructor(owner, prototype) {
        super(owner, prototype);
        this.#animationManager = new srvsdbx_Animation.AnimationManager(prototype.animations);
    }
    /**
     * Calculates this melee's bounding box, totally unrelated to its "hitbox" (not that it has one).
     * This is used for reflecting bullets off of reflective melees
     *
     * The returned box only matches the bounding box in dimension; it is neither positioned nor rotated
     * in accordance to its in-game appearance
     */
    getCollider() {
        if (!this.prototype.isReflective)
            return;
        if (this != this.owner.activeItem && this.prototype.holstered?.collider) {
            return Matter.Bodies.rectangle(0, 0, this.prototype.holstered.collider.width, this.prototype.holstered.collider.height);
        }
        else if (this == this.owner.activeItem && this.prototype.worldObject?.collider) {
            return Matter.Bodies.rectangle(0, 0, this.prototype.worldObject.collider.width, this.prototype.worldObject.collider.height);
        }
    }
    /**
     * Returns this item's current dimensions, taking animations into account
     *
     * **This method will stop expired animations.**
     * More specifically, if an idle animation is running, but the using animation should be used,
     * the idle animation will be terminated
     */
    getItemReference() {
        if (this != this.owner.activeItem && this.prototype.holstered?.collider) {
            return {
                dimensions: {
                    width: this.prototype.holstered.collider.width,
                    height: this.prototype.holstered.collider.height
                },
                offset: {
                    parr: this.prototype.holstered.collider.offsetParr,
                    perp: this.prototype.holstered.collider.offsetPerp,
                }
            };
        }
        const timeSinceLastShot = gamespace.currentUpdate - (this.#lastUse ?? 0);
        if (!this.cancelledAnimation &&
            timeSinceLastShot < this.prototype.useDelay) {
            this.animationManager.end("idle");
            return this.animationManager.fetch("using")(timeSinceLastShot, true)?.item;
        }
        else {
            this.animationManager.end("using");
            return this.animationManager.fetch("idle")(gamespace.currentUpdate - this.owner.state.lastSwitch, true)?.item;
        }
    }
    /**
     * Serves to stop any animation related to this melee that are currently playeing
     */
    stopAnimations() {
        this.#animationManager.endAll();
        this.#cancelledAnimation = true;
    }
    /**
     * A standard method for attacking with a melee weapon. Unless your melee does something radically different, it's best to use this method
     */
    usePrimary() {
        const player = this.owner, prototype = this.prototype, state = player.state;
        if (!state.attacking ||
            gamespace.currentUpdate - state.lastSwitch < state.effectiveSwitchDelay ||
            gamespace.currentUpdate - this.#lastUse < prototype.useDelay) {
            clearTimerIfPresent(player.timers.firing);
            return;
        }
        player.timers.firing = setTimeout(function fire(melee) {
            if (!state.attacking) {
                clearTimerIfPresent(player.timers.firing);
                return;
            }
            state.firing = true;
            melee.#lastUse = gamespace.currentUpdate;
            melee.#cancelledAnimation = false;
            for (const { damage, time, areaOfEffect: collision } of prototype.damages) {
                function dealDamage() {
                    if (player.activeItem != melee)
                        return;
                    const targets = [...gamespace.objects.players.values()]
                        .map(p => {
                        if (p != player) {
                            const diff = srvsdbx_Geometry.Vector2D.fromPoint2D(p.position)
                                .plus({
                                direction: player.angle + Math.PI / 2,
                                magnitude: gamespace.PLAYER_SIZE * collision.offset.parr
                            })
                                .plus({
                                direction: player.angle,
                                magnitude: gamespace.PLAYER_SIZE * collision.offset.perp
                            })
                                .minus(player.position, true), [direction, length] = [diff.direction, diff.length / gamespace.PLAYER_SIZE];
                            return { player: p, direction, length };
                        }
                    })
                        .filter((ele) => {
                        if (ele === undefined)
                            return;
                        return ele.length <= collision.radius + 1; // Edge detection
                    })
                        .sort((a, b) => srvsdbx_Geometry.Vector2D.squaredDistBetweenPts(player.position, a.player.position)
                        /*   */ - srvsdbx_Geometry.Vector2D.squaredDistBetweenPts(player.position, b.player.position));
                    for (let i = 0, limit = Math.min(targets.length, prototype.maxTargets ?? 1); i < limit; i++) {
                        const target = targets[i];
                        new Particle(gamespace.prototypes.particles.get("srvsdbx::blood_splat"), srvsdbx_Geometry.Vector2D.fromPolarToVec(target.direction, -target.player.radius)
                            .plus(target.player.position, true), srvsdbx_Math.randomAngle());
                        target.player.applyDamage(damage);
                    }
                }
                if (time)
                    setTimeout(dealDamage, time);
                else
                    dealDamage();
            }
            state.firing = false;
            if (prototype.autoAttack) {
                player.timers.firing = setTimeout(() => fire(melee), prototype.useDelay);
            }
        }, 0, this);
    }
    /**
     * Resets this object's fields
     */
    reset() {
        this.#lastUse = 0;
    }
    /**
     * Clears this instance's object fields
     */
    destroy() {
        super.destroy();
        // @ts-expect-error
        this.#animationManager = void 0;
    }
}
//# sourceMappingURL=melee.js.map