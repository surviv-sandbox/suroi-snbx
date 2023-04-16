/**
 * Represents a bot or player: generally, something that can act as a player
 */
class PlayerLike extends Generic<{
    collision: [Generic, srvsdbx_Geometry.Point2D[]],
    /**
     * This player's death
     *
     * This event is fired whenever this object's health reaches 0
     */
    death: [PlayerLike | undefined],
    /**
     * This player's killing of another
     */
    kill: [PlayerLike];
}> implements Destroyable {
    /**
     * The default movement speed for players
     */
    static readonly #DEFAULT_SPEED = 12;
    /**
     * The default movement speed for players
     */
    static get DEFAULT_SPEED() { return this.#DEFAULT_SPEED; }

    /**
     * The item currently in use by the PlayerLike
     *
     * If they do not currently have an item equipped, `undefined` is returned
     */
    get activeItem() { return this.#inventory.containers.main.get(this.#activeItemIndex) as (InventoryItem<InventoryItemPrototype & EquipableItemPrototype> & EquipableItem) | undefined; }

    /**
     * The index of the active item
     */
    #activeItemIndex = 0;
    /**
     * Returns the index of the active item
     */
    get activeItemIndex() { return this.#activeItemIndex; }

    /**
     * The point in the game world this player is aiming at
     */
    #aimPoint: srvsdbx_Geometry.Point2D;
    /**
     * The point in the game world this player is aiming at
     */
    get aimPoint() { return this.#aimPoint; }

    /**
     * Information about this player's hand positions
     */
    readonly #hands = {
        /**
         * Information about the player's left hand
         */
        leftHand: {
            /**
             * How far along the axis parallel to the player's view line this hand is
             */
            parr: 0.85,
            /**
             * How far along the axis perpendicular to the player's view line this hand is
             */
            perp: -0.75
        },
        /**
         * Information about the player's right hand
         */
        rightHand: {
            /**
             * How far along the axis parallel to the player's view line this hand is
             */
            parr: 0.85,
            /**
             * How far along the axis perpendicular to the player's view line this hand is
             */
            perp: 0.75
        }
    };
    /**
     * Information about this player's hand positions
     */
    get hands() { return this.#hands; }

    /**
     * The player's current health
     */
    #health = 100;
    /**
     * The player's current health
     *
     * `get`: Returns the player's current health
     *
     * `set`: Sets the player's current health, except if the value is `NaN` (the setter serves to prevent accidentally corrupting the health with a `NaN`)
     */
    get health() { return this.#health; }

    /**
     * This player's inventory object
     */
    readonly #inventory = new Inventory(this);
    /**
     * This player's inventory object
     */
    get inventory() { return this.#inventory; }

    /**
     * The maximum amount of health this player may have
     */
    #maxHealth = 100;
    /**
     * The maximum amount of health this player may have
     *
     * `get`: Returns the player's maximum health
     *
     * `set`: Sets the player's maximum health, except if the value is `NaN` (the setter serves to prevent accidentally corrupting the health with a `NaN`)
     */
    get maxHealth() { return this.#maxHealth; }
    set maxHealth(v) {
        !Number.isNaN(v) && (this.#maxHealth = v);
    }

    /**
     * A collections of `Map`s whose role is to modify the intensity of actions
     * performed by this player, such as dealing damage, speed, etc
     *
     * **When adding or otherwise operating on modifiers, be sure not to interfere with any other
     * names currently in the map; usually, prefixing your desired name with a namespace specifier
     * (`fire_effect` -> `srvsdbx::fire_effect`) should do the trick**
     */
    #modifiers = {
        /**
         * A `Map` whose values will modify outgoing damage by multiplying it and whose keys are their respectives sources
         *
         * **Names likely to be used:**
         *
         * _These names correspond to sources included in the standard `srvsdbx` namespace; they are therefore quite likely
         * to be used_
         * - `srvsdbx::frenemy`
        */
        damage: new ReducibleMap<string, number>((acc, cur) => acc * cur, 1),
        /**
          * A `Map` whose values will modify incoming damage by multiplying it and whose keys are their respectives sources
          *
          * **Reserved names (do not use):**
          *
          * _These names are almost guaranteed to be used by the game; thus, they should not be used to avoid overriding them_
          * - `vest`
          * - `helmet`
          * - `backpack`
         */
        protection: new ReducibleMap<string, number>((acc, cur) => acc * cur, 1),
        /**
         * A `Map` whose values are speed multipliers and whose keys are their respectives sources
         *
         * Note that additive modifiers have precedence over multiplicative ones; the formula
         * for the final speed is therefore `(s + a) * m`, where `s` is the base speed, `m` is
         * the product of all the multiplicative speed modifiers and `a` is the sum of all the
         * additive modifiers
         *
         * **Names likely to be used:**
         *
         * _These names correspond to sources included in the standard `srvsdbx` namespace; they are therefore quite likely
         * to be used_
         * - `srvsdbx::wet`
         * - `srvsdbx::potatoSmg`
         */
        speedMultipliers: new ReducibleMap<string, number>((acc, cur) => acc * cur, 1),
        /**
         * A `Map` whose values are speed additions and whose keys are their respectives sources
         *
         * Note that additive modifiers have precedence over multiplicative ones; the formula
         * for the final speed is therefore `(s + a) * m`, where `s` is the base speed, `m` is
         * the product of all the multiplicative speed modifiers and `a` is the sum of all the
         * additive modifiers
         *
         * _These names correspond to sources included in the standard `srvsdbx` namespace; they are therefore quite likely
         * to be used_
         * - `srvsdbx::inspire`
         */
        speedAdd: new ReducibleMap<string, number>((acc, cur) => acc + cur, 0),
        /**
         * A `Map` whose values will modify reload time and fire rate by multiplying it and whose keys are their respectives sources
         *
         *  _These names correspond to sources included in the standard `srvsdbx` namespace; they are therefore quite likely
         * to be used_
         * - `srvsdbx::wet`
         */
        ergonomics: new ReducibleMap<string, number>((acc, cur) => acc * cur, 1),
    } as const;
    /**
     * A collections of `Map`s whose role is to modify the intensity of actions
     * performed by this player, such as dealing damage, speed, etc
     */
    get modifiers() { return this.#modifiers; }

    /**
     * The index of the last active item
     */
    #previousActiveIndex = 1;
    /**
     * The index of the last active item
     */
    get previousActiveIndex() { return this.#previousActiveIndex; }

    /**
     * The radius of this player **in pixels**
     */
    #radius = gamespace.PLAYER_SIZE;
    /**
     * The radius of this player **in pixels**
     *
     * - `get`: Returns this player's radius
     * - `set`: Sets this player's radius if it is not `NaN`
     */
    get radius() { return this.#radius; }
    set radius(r) {
        if (Number.isNaN(r)) return;

        this.body.scale(r);
    }

    /**
     * Holds information about the current state of this player
     */
    readonly #state: {
        /**
         * Whether or not this player is currently attempting to attack
         */
        attacking: boolean,
        /**
         * The amount of time a user will have to wait before using their item, taking free switches into account
         */
        effectiveSwitchDelay: number,
        /**
         * Whether or not this player is currently firing their weapon
         */
        firing: boolean,
        /**
         * The time this user will have to wait before firing their weapon
         */
        firingDelay: number,
        /**
         * The timestamp of the last time the user swapped items
         */
        lastSwitch: number,
        /**
         * The timestamp of the last "free" switch the user has performed
         *
         * A "free switch" is defined as an item switch that bypasses an item's usual switch delay: "quickswitching"
         */
        lastFreeSwitch: number,
        /**
         * Whether firing speed penalties should apply
         */
        noSlow: boolean;
        /**
         * Whether or not this player is currently reloading their weapon
         */
        reloading: false | number;
    } = {
            attacking: false,
            effectiveSwitchDelay: 0,
            firingDelay: 0,
            firing: false,
            lastSwitch: 0,
            lastFreeSwitch: 0,
            noSlow: false,
            reloading: false
        };
    /**
     * Holds information about the current state of this player
     */
    get state() { return this.#state; }

    /**
     * A `Set` of status effects currently affecting this player
     *
     * **Implementation note:** Calling this object's `.clear` method will call each status effect's
     * `.destroy` method before clearing the set
     */
    readonly #statusEffects = (() => {
        const set = new Set<StatusEffect<{}>>(),
            nativeClear = set.clear.bind(set),
            nativeAdd = set.add.bind(set);

        set.clear = () => {
            for (const effect of set)
                effect.destroy();

            nativeClear();
        };

        set.add = (effect) => {
            /*
                This serves to prevent two instances of the same status effect from being applied at once.

                Sets disallow duplicate entries, but since two constructor calls yield two different instances,
                we need to compare them by prototype instead (the prototype field and not the result of `Object.getPrototypeOf`)
            */

            const residing = [...set.values()].find(fx => fx.prototype == effect.prototype);

            if (residing) residing.renew();
            else nativeAdd(effect);

            return set;
        };

        return set;
    })();
    /**
     * A `Set` of status effects currently affecting this player
     */
    get statusEffects() { return this.#statusEffects; }

    /**
     * Stores any timers on this player. Timers are used to delay actions, like reloads.
     *
     * **When assigning these timers, take care to clear any timer that might be stored there!**
     */
    readonly #timers: {
        /**
         * The timer responsible for firing the user's current weapon
        */
        firing: false | number;
    } = {
            firing: false
        };
    /**
     * Stores any timers on this player. Timers are used to delay actions, like reloads.
     *
     * **When assigning these timers, take care to clear any timer that might be stored there!**
     */
    get timers() { return this.#timers; }

    /**
     * A rough measure of this player's "scope" level
     *
     * Passed directly as the z position of p5's camera
     */
    #view = 1330;
    /**
     * A rough measure of this player's "scope" level
     *
     * Passed directly as the z position of p5's camera
     */
    get view() { return this.#view; }

    /**
     * Used internally to keep track of intersections with obstacles
     */
    readonly #intersections = new ReducibleMap<number, srvsdbx_Geometry.Vector2D>(
        (acc, cur) => acc.plus(cur),
        srvsdbx_Geometry.Vector2D.zeroVector()
    );
    /**
     * Moves this player to ensure it isn't intersecting any other game object
     *
     * **Don't call this!**
     */
    // This is kinda hacky, but I can't think of another way
    unintersect() {
        if (this.#intersections.size) {
            const intersection = this.#intersections.reduced,
                restrictions = this.#restrictions.reduced;

            intersection.x *= restrictions[intersection.x < 0 ? "left" : "right"];
            intersection.y *= restrictions[intersection.y < 0 ? "up" : "down"];

            this.setPosition(intersection.plus(this.position));
            this.#intersections.clear();
        }
    }

    /**
     * Restrictions on movement imposed by collisions with obstacles
     */
    readonly #restrictions = new ReducibleMap<number, {
        left: number,
        up: number,
        right: number,
        down: number;
    }>(
        (acc, cur) => ({
            left: acc.left * cur.left,
            up: acc.up * cur.up,
            right: acc.right * cur.right,
            down: acc.down * cur.down
        }),
        {
            left: 1,
            up: 1,
            right: 1,
            down: 1
        }
    );
    get restrictions() { return this.#restrictions; }

    /**
     * `* It's a constructor. It constructs.`
     * @param position A `Point2D` object dictating this object's starting position
     */
    constructor(position: srvsdbx_Geometry.Point2D) {
        super(
            new srvsdbx_Geometry.Circle(
                srvsdbx_Geometry.Vector2D.zeroPoint(),
                gamespace.PLAYER_SIZE
            ),
            (p5: import("p5")) => {
                const T = this,
                    body = T.body,
                    currentSize = this.#radius,
                    defaultSize = gamespace.PLAYER_SIZE,
                    activeItem = T.activeItem,
                    itemPrototype = activeItem?.prototype,
                    itemReference = activeItem?.getItemReference();

                p5.push();

                p5.translate(T.position.x, T.position.y);
                p5.rotate(T.angle);

                p5.noStroke();

                function drawEquipment(key: EquipmentTypes) {
                    const object = T.#inventory.containers.equipment.get(key);
                    if (object?.prototype?.images?.world && object.prototype.worldObject) {
                        p5.push();

                        const proto = object.prototype,
                            image = proto.images.world!,
                            worldObject = proto.worldObject!,
                            dimensions = {
                                width: worldObject.dimensions.width * currentSize,
                                height: worldObject.dimensions.height * currentSize,
                            },
                            offset = {
                                parr: worldObject.offset.parr * currentSize,
                                perp: worldObject.offset.perp * currentSize,
                                angle: worldObject.offset.angle
                            };

                        p5.rectMode(p5.CENTER);
                        p5.imageMode(p5.CENTER);

                        p5.tint(worldObject.tint);
                        p5.translate(offset.perp, -offset.parr);
                        p5.rotate(offset.angle);

                        p5.image(
                            image.asset,
                            0, 0,
                            dimensions.width,
                            dimensions.height
                        );

                        gamespace.drawHitboxIfEnabled(p5, "DEFAULT", () => {
                            p5.rect(
                                0, 0,
                                dimensions.width,
                                dimensions.height
                            );
                        });

                        p5.pop();
                    }
                }

                function drawBody() {
                    p5.push();

                    p5.fill("#F8C574");
                    p5.circle(0, 0, 2 * currentSize);

                    p5.pop();

                    p5.push();
                    gamespace.drawDebug(
                        p5,
                        T.collidable.getHitboxName(),
                        () => p5.circle(0, 0, 2 * currentSize),
                        () => {
                            p5.rotate(-T.angle);
                            p5.translate(-body.origin.x, -body.origin.y);
                        },
                        T
                    );
                    p5.pop();
                }

                const [drawLeftHand, drawRightHand] = (() => {
                    function generate(hand: { perp: number, parr: number; } | undefined) {
                        return () => {
                            if (!hand) return;

                            p5.push();

                            for (let layer = 0; layer < 2; layer++) {
                                p5.fill(layer ? "#F8C574" : "#302719");
                                const handSize = layer ? 0.525 : 0.75;

                                p5.circle(
                                    hand.perp * currentSize,
                                    -hand.parr * currentSize,
                                    handSize * defaultSize
                                );

                                if (!layer)
                                    gamespace.drawHitboxIfEnabled(p5, "DEFAULT", p5 =>
                                        p5.circle(
                                            hand.perp * currentSize,
                                            -hand.parr * currentSize,
                                            handSize * defaultSize
                                        )
                                    );
                            }

                            p5.pop();
                        };
                    }

                    if (activeItem === void 0 || itemPrototype === void 0) {
                        return [
                            generate({
                                parr: T.#hands.leftHand.parr,
                                perp: T.#hands.leftHand.perp
                            }),
                            generate({
                                parr: T.#hands.rightHand.parr,
                                perp: T.#hands.rightHand.perp
                            })
                        ];
                    }

                    const defaultHandPos = {
                        leftHand: {
                            parr: T.#hands.leftHand.parr,
                            perp: T.#hands.leftHand.perp
                        },
                        rightHand: {
                            parr: T.#hands.rightHand.parr,
                            perp: T.#hands.rightHand.perp
                        }
                    },
                        fallback = activeItem.animationManager.fetch("idle")(gamespace.currentUpdate - T.#state.lastSwitch, true)?.hands ?? defaultHandPos,
                        handReference = activeItem.getHandReference() ?? defaultHandPos;

                    return [
                        generate(
                            ((itemPrototype as unknown as GunPrototype).dual && (activeItem as Gun).recoilImpulseParity == -1
                                ? fallback
                                : handReference
                            ).leftHand
                        ),
                        generate(
                            ((itemPrototype as unknown as GunPrototype).dual && (activeItem as Gun).recoilImpulseParity == 1
                                ? fallback
                                : handReference
                            ).rightHand
                        ),
                    ];
                })();

                function drawItem() {
                    p5.push();

                    if (activeItem && itemPrototype) {
                        const useChargedImage = activeItem instanceof Gun
                            && itemPrototype instanceof GunPrototype
                            && itemPrototype.fireMode.includes("charge") && activeItem.charged,

                            chargeProps = (itemPrototype as unknown as GunPrototype)?.chargeProps,

                            image = (useChargedImage ? chargeProps?.chargeImage?.image?.asset : void 0)
                                ?? (itemReference?.image
                                    ? itemPrototype.imageMap.get(itemReference.image!)?.asset
                                    : itemPrototype!.images.world?.asset),

                            dimensions = (() => {
                                const dim = (useChargedImage ? activeItem.chargedDimensions : void 0)
                                    ?? itemReference?.dimensions
                                    ?? (activeItem as Gun).dimensions
                                    ?? { width: 0, height: 0 };

                                return {
                                    width: dim.width ?? 0,
                                    height: dim.height ?? 0
                                };
                            })(),

                            recoilImpulseParity = (activeItem as Gun).recoilImpulseParity ?? 1,

                            fallbackOffset = (itemPrototype as unknown as GunPrototype)?.imageOffset ?? { parr: 0, perp: 0, angle: 0 },

                            offset = (() => {
                                const offset = (useChargedImage ? chargeProps?.chargeImage?.imageOffset : void 0) ?? itemReference?.offset ?? fallbackOffset;

                                return {
                                    parr: offset.parr,
                                    perp: offset.perp,
                                    angle: "angle" in offset ? offset.angle : void 0
                                };
                            })(),

                            offsetPerp = offset.perp ?? 0,
                            offsetParr = offset.parr ?? 0,

                            recoilPerp = offsetPerp - fallbackOffset.perp,
                            recoilParr = offsetParr - fallbackOffset.parr;

                        p5.rectMode(p5.CENTER);
                        p5.imageMode(p5.CENTER);

                        function drawAddons(addons: GunPrototype["addons"], dual: boolean) {
                            for (const addon of addons ?? []) {
                                if (extractValue(addon.show, activeItem as Gun & Melee) === false || (dual && addon.dual !== true)) continue;

                                const image = pickRandomInArray(addon.images).asset,
                                    dimensions = srvsdbx_AssetManagement.determineImageDimensions(image, {
                                        width: extractValue(addon.dimensions.width, activeItem as Gun & Melee),
                                        height: extractValue(addon.dimensions.height, activeItem as Gun & Melee)
                                    }),
                                    position = {
                                        parr: extractValue(addon.position.parr, activeItem as Gun & Melee),
                                        perp: extractValue(addon.position.perp, activeItem as Gun & Melee)
                                    },
                                    recoilImpulseParity = dual ? -1 : 1,
                                    finalPosition = {
                                        parr: (position.parr + +(recoilImpulseParity == recoilImpulseParity && addon.recoil !== false) * recoilParr) * currentSize,
                                        perp: (position.perp + +(recoilImpulseParity == recoilImpulseParity && addon.recoil !== false) * recoilPerp) * currentSize
                                    };

                                p5.push();

                                p5.tint(extractValue(addon.tint, activeItem as Gun & Melee));

                                p5.translate(finalPosition.perp, -finalPosition.parr);
                                p5.rotate(offset.angle ?? 0);
                                p5.image(
                                    image,
                                    0, 0,
                                    dimensions.width, dimensions.height
                                );

                                gamespace.drawHitboxIfEnabled(p5, "DEFAULT", p5 =>
                                    p5.rect(
                                        0, 0,
                                        dimensions.width, dimensions.height
                                    )
                                );

                                p5.pop();

                            }
                        };

                        drawAddons((itemPrototype as unknown as GunPrototype | MeleePrototype).addonsBelow, false);

                        if (image) {
                            p5.push();
                            p5.tint((itemPrototype as unknown as GunPrototype).tint ?? "#FFFFFF");

                            const scale = itemPrototype instanceof MeleePrototype ? currentSize : defaultSize;
                            p5.translate(
                                (recoilImpulseParity == 1 ? offsetPerp : fallbackOffset.perp) * scale,
                                -(recoilImpulseParity == 1 ? offsetParr : fallbackOffset.parr) * scale
                            );

                            p5.rotate(offset.angle ?? 0);

                            p5.image(
                                image,
                                0, 0,
                                dimensions.width, dimensions.height
                            );

                            gamespace.drawHitboxIfEnabled(p5, "DEFAULT", p5 => {
                                p5.rect(
                                    0, 0,
                                    dimensions.width, dimensions.height
                                );
                            });

                            if (activeItem instanceof Melee && itemPrototype instanceof MeleePrototype) {
                                const collider = activeItem.getCollider();

                                if (collider && (itemPrototype.canReflectWhileAttacking || T.canAttack())) {
                                    p5.push();

                                    // random component switch is random
                                    p5.translate(
                                        -(itemPrototype.worldObject?.collider?.offsetParr ?? 0) * defaultSize,
                                        (itemPrototype.worldObject?.collider?.offsetPerp ?? 0) * defaultSize
                                    );

                                    gamespace.drawHitboxIfEnabled(p5, "REFLECTIVE", () => {
                                        p5.beginShape();

                                        if (collider instanceof srvsdbx_Geometry.Rectangle) {
                                            const vertices = collider.vertices;

                                            for (let i = 0, l = vertices.length; i < l; i++)
                                                p5.vertex(vertices[i].x, vertices[i].y);

                                        } else p5.circle(0, 0, 2 * collider.radius);

                                        p5.endShape("close");
                                    });

                                    p5.pop();
                                }
                            }

                            p5.pop();
                        }

                        if (
                            activeItem instanceof Melee
                            && itemPrototype instanceof MeleePrototype
                        ) {
                            // Show any damage that has occured in the last 100ms
                            const damages = itemPrototype.damages.filter(
                                d => srvsdbx_Math.checkBounds(gamespace.currentUpdate - activeItem.lastUse - d.time, 0, 100)
                            ).map(d => d.areaOfEffect);

                            if (damages.length)
                                for (const damage of damages) {
                                    p5.push();
                                    p5.translate(
                                        damage.offset.perp * defaultSize,
                                        -damage.offset.parr * defaultSize
                                    );

                                    gamespace.drawHitboxIfEnabled(p5, "AREA_OF_EFFECT", () =>
                                        p5.circle(0, 0, 2 * damage.radius * defaultSize)
                                    );

                                    p5.pop();
                                }
                        }

                        if (
                            activeItem instanceof Gun
                            && itemPrototype instanceof GunPrototype
                            && itemPrototype.effectsOnFire
                        )
                            for (const query of itemPrototype.effectsOnFire)
                                gamespace.drawHitboxIfEnabled(p5, "AREA_OF_EFFECT", () =>
                                    // This AoE tends to be big enough that the default level of detail
                                    // isn't enough
                                    p5.ellipse(0, 0, 2 * query.radius, 2 * query.radius, 50)
                                );

                        drawAddons((itemPrototype as unknown as GunPrototype | MeleePrototype).addonsAbove, false);

                        if ((itemPrototype as unknown as GunPrototype).dual) {
                            drawAddons((itemPrototype as unknown as GunPrototype | MeleePrototype).addonsBelow, true);

                            if (image) {
                                p5.push();
                                p5.tint((itemPrototype as unknown as GunPrototype).tint ?? "#FFFFFF");

                                p5.translate(
                                    -(recoilImpulseParity == -1 ? offsetPerp : fallbackOffset.perp) * defaultSize,
                                    -(recoilImpulseParity == -1 ? offsetParr : fallbackOffset.parr) * defaultSize
                                );
                                p5.rotate(offset.angle ?? 0);

                                p5.image(
                                    image,
                                    0, 0,
                                    dimensions.width, dimensions.height
                                );

                                gamespace.drawHitboxIfEnabled(p5, "DEFAULT", p5 => {
                                    p5.rect(
                                        0, 0,
                                        dimensions.width, dimensions.height
                                    );
                                });

                                p5.pop();
                            }

                            drawAddons((itemPrototype as unknown as GunPrototype | MeleePrototype).addonsAbove, false);
                        }
                    }

                    p5.pop();
                }

                function drawHolsteredItems(layer: 0 | 1 | 2) {
                    for (const [, item] of T.#inventory.containers.main) {
                        if (item instanceof Melee && T.activeItem != item) {
                            const holster = item.prototype.holstered;

                            if (holster?.dimensions.layer != layer) return;

                            p5.push();
                            p5.translate(
                                holster.offset.perp * currentSize,
                                -holster.offset.parr * currentSize
                            );
                            p5.rotate(holster.offset.angle);
                            p5.imageMode(p5.CENTER);
                            p5.rectMode(p5.CENTER);

                            p5.image(
                                holster.image.asset,
                                0, 0,
                                holster.dimensions.width, holster.dimensions.height
                            );

                            gamespace.drawHitboxIfEnabled(p5, "DEFAULT", () => {
                                p5.rect(
                                    0, 0,
                                    holster.dimensions.width, holster.dimensions.height
                                );
                            });

                            const collider = item.getCollider();

                            if (collider) {
                                p5.push();

                                p5.translate(
                                    -holster.collider.offsetParr * defaultSize,
                                    holster.collider.offsetPerp * defaultSize
                                );

                                gamespace.drawHitboxIfEnabled(p5, "REFLECTIVE", () => {
                                    p5.beginShape();

                                    if (collider instanceof srvsdbx_Geometry.Rectangle) {
                                        const vertices = collider.vertices;
                                        for (let i = 0, l = vertices.length; i < l; i++) {
                                            p5.vertex(vertices[i].x, vertices[i].y);
                                        }
                                    } else {
                                        p5.circle(0, 0, 2 * collider.radius);
                                    }

                                    p5.endShape("close");
                                });

                                p5.pop();
                            }

                            p5.pop();
                        }
                    }
                }

                const hands = { left: true, right: true };

                function drawItemAndHands() {
                    if (itemPrototype && itemPrototype.handPositions) {
                        const handPos = itemPrototype.handPositions;

                        if (handPos.leftHand?.layer == 0) {
                            hands.left = false;
                            drawLeftHand();
                        }

                        if (handPos.rightHand?.layer == 0) {
                            hands.right = false;
                            drawRightHand();
                        }
                    }

                    drawItem();
                }

                function drawRemainingHands() {
                    hands.left && drawLeftHand();
                    hands.right && drawRightHand();
                }

                /*
                    layer 0: below body and hands
                    layer 1: above body, below hands
                    layer 2: above body and hands
                */

                let functions,
                    layer = (
                        (itemPrototype as unknown as GunPrototype | undefined)?.fireMode?.includes?.("charge")
                            && (activeItem as Gun | undefined)?.charged

                            ? (itemPrototype as unknown as GunPrototype | undefined)?.chargeProps?.chargeImage?.dimensions?.layer
                            : void 0
                    )
                        ?? itemReference?.dimensions?.layer
                        ?? (itemPrototype as unknown as GunPrototype | undefined)?.dimensions?.layer
                        ?? (itemPrototype as unknown as MeleePrototype | undefined)?.worldObject?.dimensions.layer
                        ?? 0;

                switch (layer) {
                    case 0: {
                        functions = [
                            drawEquipment.bind(void 0, "backpack"),
                            drawHolsteredItems.bind(void 0, 0),
                            drawItemAndHands,
                            drawHolsteredItems.bind(void 0, 1),
                            drawBody,
                            drawEquipment.bind(void 0, "vest"),
                            drawRemainingHands,
                            drawHolsteredItems.bind(void 0, 2),
                            drawEquipment.bind(void 0, "helmet"),
                        ] as const;
                        break;
                    }
                    case 1: {
                        functions = [
                            drawEquipment.bind(void 0, "backpack"),
                            drawHolsteredItems.bind(void 0, 0),
                            drawHolsteredItems.bind(void 0, 1),
                            drawBody,
                            drawEquipment.bind(void 0, "vest"),
                            drawItemAndHands,
                            drawRemainingHands,
                            drawHolsteredItems.bind(void 0, 2),
                            drawEquipment.bind(void 0, "helmet"),
                        ] as const;
                        break;
                    }
                    case 2: {
                        functions = [
                            drawEquipment.bind(void 0, "backpack"),
                            drawHolsteredItems.bind(void 0, 0),
                            drawBody,
                            drawEquipment.bind(void 0, "vest"),
                            drawHolsteredItems.bind(void 0, 1),
                            drawRemainingHands,
                            drawItemAndHands,
                            drawHolsteredItems.bind(void 0, 2),
                            drawEquipment.bind(void 0, "helmet"),
                        ] as const;
                        break;
                    }
                }

                for (let i = 0, l = functions.length; i < l; functions[i++]());

                p5.pop();
            },
            position
        );

        this.#aimPoint = srvsdbx_Geometry.Vector2D.zeroPoint();

        const modifyConstraints = (() => {
            const generateAddToMap =
                <V>(map: Map<number, V>) =>
                    (value: V) =>
                        void map.set(
                            map.size - 1,
                            value
                        ),
                addToIntersections = generateAddToMap(this.#intersections),
                addToRestrictions = (() => {
                    const add = generateAddToMap(this.#restrictions);

                    return (diff: srvsdbx_Geometry.Vector2D) => {
                        add({
                            left: diff.x != 0 ?
                                diff.x > 0 ? Math.abs(Math.sin(diff.direction)) : 1
                                : 1,
                            up: diff.y != 0 ?
                                diff.y > 0 ? Math.abs(Math.cos(diff.direction)) : 1
                                : 1,
                            right: diff.x != 0 ?
                                diff.x > 0 ? 1 : Math.abs(Math.sin(diff.direction))
                                : 1,
                            down: diff.y != 0 ?
                                diff.y > 0 ? 1 : Math.abs(Math.cos(diff.direction))
                                : 1
                        });
                    };
                })();

            return (diff: srvsdbx_Geometry.Vector2D) => {
                addToIntersections(diff);
                addToRestrictions(diff);
            };
        })();

        this.events.addEventListener("collision", (_, target) => {
            if (target.collidable != CollisionLevels.ALL) return;

            if (target instanceof Obstacle) {
                const hitbox = (target as Obstacle<ObstacleTypes>).prototype.hitbox;

                if (hitbox.type == "circle") {
                    const diff = srvsdbx_Geometry.Vector2D.fromPoint2D(this.position)
                        .minus(target.position);

                    diff.length = (this.#radius + (target as Obstacle<"circle">).radius * target.scale) - diff.length;

                    modifyConstraints(diff);
                } else {
                    const vertices = (target as Obstacle<"rectangle">).body.vertices,
                        squaredRadius = this.#radius ** 2,
                        verticesByDistance = vertices
                            .map(vertex => [vertex, srvsdbx_Geometry.Vector2D.squaredDistanceBetweenPts(vertex, this.position)] as [srvsdbx_Geometry.Point2D, number])
                            .sort(([, a], [, b]) => a - b),
                        collidedVertices = verticesByDistance
                            .filter(([, distance]) => distance < squaredRadius)
                            .map(([vertex]) => vertex),
                        solveVertex = (vertex: srvsdbx_Geometry.Point2D) => {
                            const diff = srvsdbx_Geometry.Vector2D.fromPoint2D(this.position)
                                .minus(vertex);

                            /*
                                The behavior here is to make the circle "slide" off
                                the vertex, but we have to sure it doesn't slide into
                                the box. In other words, we ensure the displacement doesn't
                                slide the circle into one of the box's edges.

                                Using the signs of the circle's velocity, we figure out which
                                side to limit.
                            */

                            const currentVelocity = this.velocityMap.reduced,
                                halfDimensions = {
                                    width: (target as Obstacle<"rectangle">).dimensions.width * target.scale / 2,
                                    height: (target as Obstacle<"rectangle">).dimensions.height * target.scale / 2
                                };

                            if (
                                currentVelocity.x != 0 &&
                                srvsdbx_Math.checkBounds(
                                    this.position.y - target.position.y,
                                    -halfDimensions.height,
                                    halfDimensions.height
                                )
                            ) {
                                diff.y = 0;
                            } else if (
                                currentVelocity.y != 0 &&
                                srvsdbx_Math.checkBounds(
                                    this.position.x - target.position.x,
                                    -halfDimensions.width,
                                    halfDimensions.width
                                )
                            ) {
                                diff.x = 0;
                            }

                            diff.length = this.#radius - diff.length;

                            modifyConstraints(diff);
                        },
                        solveEdge = (collidedEdge: srvsdbx_Geometry.LineSegment) => {
                            /*
                                There's a cheeky optimization we can do here: since surviv only has axis-aligned
                                boxes, then it's guaranteed that one of the components of both start and end will
                                be the same: either both x components will be the same, or both y components will be

                                The repeated component lets us know whether the segment is vertical or horizontal, and so
                                from there, it's almost trivial to calculate the displacement; no vector math needed
                            */

                            // Vertical segment
                            if (collidedEdge.start.x == collidedEdge.end.x) {
                                const dx = this.position.x - collidedEdge.start.x;

                                modifyConstraints(
                                    new srvsdbx_Geometry.Vector2D(
                                        /*
                                            Inherit sign and "magnitude"

                                            Think of the abs as ensuring that the displacement's
                                            size is the same regardless of what side the collision
                                            comes from, and the sign ensures that the player is
                                            pushed out in the right direction
                                        */
                                        Math.sign(dx) * (this.#radius - Math.abs(dx)),
                                        0
                                    )
                                );
                            } else {
                                // Horizontal segment
                                const dy = this.position.y - collidedEdge.start.y;

                                modifyConstraints(
                                    new srvsdbx_Geometry.Vector2D(
                                        0,
                                        Math.sign(dy) * (this.#radius - Math.abs(dy))
                                    )
                                );
                            }
                        };

                    switch (collidedVertices.length) {
                        case 1: { // Colliding with one corner, easy enough
                            solveVertex(collidedVertices[0]);
                            break;
                        }
                        case 2: { // Two corners
                            solveEdge({
                                start: collidedVertices[0],
                                end: collidedVertices[1]
                            });
                            break;
                        }
                        case 3: {
                            solveVertex(verticesByDistance[0][0]);
                            break;
                        }
                        case 4: {
                            solveVertex(target.position);
                            break;
                        }
                        default: { // Colliding with edge
                            solveEdge({
                                // The edge that'll be colliding will be the one
                                // bound by the two closest vertices
                                start: verticesByDistance[0][0],
                                end: verticesByDistance[1][0]
                            });
                            break;
                        }
                    }
                }
            }
        });

        gamespace.objects.players.set(this.id, this);
    }

    /**
     * Identical to the method it overrides, but modified to take
     * restrictions into account
     */
    override update() {
        if (this.destroyed || this.parent) return;

        const body = this.body,
            deltaTime = gamespace.currentUpdate - gamespace.lastUpdate,
            velocity = this.compileVelocities(),
            restriction = this.#restrictions.reduced,
            finalVelocity = {
                x: deltaTime * velocity.x * (velocity.x > 0 ? restriction.right : restriction.left),
                y: deltaTime * velocity.y * (velocity.y > 0 ? restriction.up : restriction.down)
            };

        this.setPosition({
            x: body.origin.x + finalVelocity.x,
            y: body.origin.y + finalVelocity.y
        });

        this.#restrictions.clear();

        this.angle += srvsdbx_Math.normalizeAngle(deltaTime * this.compileAngularVelocities() / 1000, "radians");

        this.layer += velocity.z * deltaTime;

        super.updateFollowers();
    }

    /**
     * Determines if this player can currently use their active item
     *
     * A player can use their active item if:
     * - There is an active item
     * - It is equipable
     * - The elapsed time since its last use is greater than the item's use delay
     * @returns Whether or not the item can be used
     */
    canAttack() {
        const item = this.activeItem;

        if (!item || (typeof item.prototype.useDelay != "number"))
            return false;

        return gamespace.currentUpdate - item.lastUse >= this.#state.firingDelay;
    }

    /**
     * Inverses the weapon slots, putting the first weapon in the second and vice versa
     */
    swapWeapons() {
        this.#inventory.containers.main.swap(0, 1, true);

        if (this.#previousActiveIndex == 0 || this.#previousActiveIndex == 1)
            this.#previousActiveIndex = 1 - this.#previousActiveIndex;

        if (this.#activeItemIndex == 0 || this.#activeItemIndex == 1)
            this.#activeItemIndex = 1 - this.#activeItemIndex;
    }

    /**
     * Sets the player's active item by referring to the at which it's contained
     * @param slotId The slot in the inventory to switch to
     */
    setActiveItemIndex(slotId: number) {
        if (this.#inventory.containers.main.has(slotId)) {
            const oldIndex = this.#activeItemIndex,
                oldItem = this.activeItem;

            if (slotId != oldIndex) {
                this.#activeItemIndex = slotId;

                const proto = this.activeItem?.prototype,
                    oldProto = oldItem?.prototype,
                    canFreeSwitch = gamespace.currentUpdate - this.#state.lastFreeSwitch >= 1000;

                if (oldItem instanceof Gun) {
                    oldItem.stopCharging();
                    oldItem.reloadTimer.clear();
                }
                oldItem?.stopAnimations?.();

                this.applySwitchPenalties();

                this.#previousActiveIndex = oldIndex;
                if (
                    // Last free switch happened over a second ago
                    canFreeSwitch &&

                    // The switch is occurring before the current weapon can fire
                    !(gamespace.currentUpdate - (oldItem?.lastUse ?? 0) >= (
                        ((
                            !!(oldProto as GunPrototype)?.fireMode?.match?.(/^(auto-)?burst/) && (oldProto as GunPrototype)?.burstProps
                                ? (oldProto as GunPrototype)?.burstProps?.burstDelay
                                : oldProto?.useDelay
                        ) ?? Infinity)
                    ) &&

                        // Different non-zero deployGroups (0 / 0 gives NaN, and NaN != 1)
                        ((oldProto as GunPrototype | undefined)?.deployGroup ?? 0)
                        / ((proto as GunPrototype | undefined)?.deployGroup ?? 0)
                        == 1
                    )
                ) this.#state.effectiveSwitchDelay = proto instanceof GunPrototype ? 250 : 0;

                this.#state.firingDelay = this.#state.effectiveSwitchDelay;

                if (this.activeItem instanceof Gun) {
                    const item = this.activeItem;

                    if (!item.ammo) item.scheduleReload(this.#state.effectiveSwitchDelay);
                }
            }
        }
    }

    /**
     * Simulates the user switching to another item and back to this one, without
     * actually switching anything
     *
     * Used to apply penalties when swapping out items
     */
    applySwitchPenalties() {
        if (!this.activeItem) return;

        const proto = this.activeItem!.prototype,
            canFreeSwitch = gamespace.currentUpdate - this.#state.lastFreeSwitch >= 1000,
            isGun = proto instanceof GunPrototype;

        this.#state.effectiveSwitchDelay = isGun ? proto.switchDelay : 0;

        if (canFreeSwitch) {
            this.#state.lastFreeSwitch = gamespace.currentUpdate;
            if (isGun) {
                this.#state.effectiveSwitchDelay = 250;
            }
        }

        this.#state.noSlow = true;

        this.#state.lastSwitch = gamespace.currentUpdate;

        if (this.activeItem instanceof Gun) {
            this.activeItem.stopCharging();
            this.activeItem.reloadTimer.clear();
        }

        clearTimerIfPresent(this.#timers.firing);
        this.#state.attacking = this.#state.reloading = this.#timers.firing = false;
    }

    /**
     * Identical to the method it overrides, save for the fact that it pays special consideration to the velocities corresponding to keyboard inputs
     * These correspond to the following keys in the `velocityMap`: `forwards`, `strafeL`, `backwards`, `strafeR`. The addition of the velocities is a vector,
     * whose magnitude is set to a certain amount corresponding to the player's speed.
     *
     * Other velocities are treated normally.
     * @returns This player's velocity
     */
    override compileVelocities() {
        const keys = [
            "forwards",
            "strafeL",
            "backwards",
            "strafeR"
        ],
            keyboardRaw = srvsdbx_Geometry.Vector3D.fromPoint3D(
                keys.reduce(
                    (p, c) => srvsdbx_Geometry.Vector3D.plus(p, this.velocityMap.get(c) ?? srvsdbx_Geometry.Vector3D.zeroPoint(), true),
                    srvsdbx_Geometry.Vector3D.zeroPoint()
                )
            ),
            keyboard = keyboardRaw.scale(this.determineMoveSpeed() * 0.05 / keyboardRaw.length, true);

        return [...this.velocityMap.entries()]
            .filter(([key, _]) => !keys.includes(key))
            .reduce((accumulator, [_, current]) => accumulator.plus(current), srvsdbx_Geometry.Vector3D.zeroVector())
            .plus(keyboard);
    }

    /**
     * Uses this player's state to determine the speed at which they should move
     * @returns This player's speed, in surviv units per second
     */
    determineMoveSpeed() {
        const passive = [...this.#inventory.items.values()].reduce(
            (accumulator, item) => accumulator + (item.prototype.moveSpeedPenalties.passive ?? 0),
            0
        ),
            activeItem = this.activeItem,
            prototype = activeItem?.prototype,

            isGun = prototype instanceof GunPrototype,
            isCharging = isGun && (activeItem! instanceof Gun) && prototype.fireMode.includes("charge") && (activeItem!.isCharging || activeItem!.charged),
            applyFiringPenalty = activeItem ?
                !this.#state.noSlow && // Not currently doing noslow
                (
                    this.#state.firing || // Currently firing
                    gamespace.currentUpdate - (activeItem.lastUse ?? 0) < (
                        (
                            isGun && !!prototype!.fireMode?.match?.(/^(auto-)?burst/) && prototype!.burstProps
                                ? prototype!.burstProps!.burstDelay
                                : prototype!.useDelay
                        ) ?? Infinity
                    )
                    // Or the delay between now and the last shot is less than the weapon's firing delay
                    + (this.#state.attacking && isGun && prototype!.fireMode != "semi" ? 50 : 1)
                    // If firing in full auto, we add padding to the movement penalty to prevent the speed from viscously vibrating
                )
                : false;

        const baseSpeed = PlayerLike.#DEFAULT_SPEED                                                           //  Default speed
            + passive                                                                                         //  Passive speed penalties
            + (
                applyFiringPenalty
                    ? (prototype as GunPrototype).moveSpeedPenalties.using                                    //   Active speed penalty
                    : prototype?.moveSpeedPenalties?.active ?? 0                                              //   Firing speed penalty
            )
            + (isCharging ? prototype.chargeProps?.speedPenalty ?? 0 : 0),                                    // Charging speed penalty

            //    __|> base penalty
            add = -1 + this.#modifiers.speedAdd.reduced,                                                      //       Additive modifiers
            multipliers = this.#modifiers.speedMultipliers.reduced * (applyFiringPenalty && isGun ? 0.5 : 1); // Multiplicative modifiers

        return (baseSpeed + add) * multipliers;
    }

    /**
     * Makes the player face the user's mouse cursor, setting its aim point to that of the mouse cursor's (after adjustment)
     */
    lookAtMouse(p5: import("p5")) {
        const scaleFactor = gamespace.superCringeEmpiricallyDerivedPixelToUnitRatio,
            offsetFromCenter = srvsdbx_Geometry.Vector2D.fromPoint2D({ x: p5.mouseX, y: p5.mouseY })
                .minus({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

        this.#aimPoint = srvsdbx_Geometry.Vector2D.plus(
            this.position,
            {
                x: scaleFactor * offsetFromCenter.x,
                y: scaleFactor * offsetFromCenter.y
            }
        );

        this.angle = offsetFromCenter.direction + Math.PI / 2;
    }

    /**
     * Makes the player look at a specified point
     * @param pt The point to look at
     */
    lookAtPoint(pt: srvsdbx_Geometry.Point2D) {
        const diff = srvsdbx_Geometry.Vector2D.fromPoint2D(pt).minus(this.position);

        this.#aimPoint = srvsdbx_Geometry.Vector2D.clone(pt);

        this.angle = diff.direction + Math.PI / 2;
    }

    /**
     * A specialized method for applying damage via bullets
     * @param bullet The bullet for which damage will be calculated
     */
    applyBulletDamage(bullet: Bullet) {
        const isHeadshot = bullet.isHeadshot,
            damage = (isHeadshot ? bullet.damage : bullet.damage * bullet.multipliers.headshot)
                * [...this.#modifiers.protection.entries()].reduce((acc, cur) => {
                    switch (cur[0]) {
                        case "vest": return acc * (isHeadshot ? 1 : cur[1]);
                        case "helmet": return acc * (isHeadshot ? cur[1] : 0.7 + cur[1] * 0.3);
                        /*
                            Helmets have a protection value which is multiplied by 0.3 for body shots
                            The formula for bodyshot protection is therefore `p * 0.3` for some protection value `p`.
                            Converting from protection value to protection modifier can be done by subtracting the value `v` from 1 (`m = 1 - v`)
                            Therefore, the formula for determining the bodyshot protection given a protection value `p` is
                            the result of the following steps:
                            - Convert to a protection value
                            - Multiply by 0.3
                            - Convert back to a protection modifier

                            Assembling the three steps yields
                            1 - (1 - p) * 0.3

                            And then simplifying
                            1 - (1 * 0.3 - p * 0.3)
                            1 - 0.3 + p * 0.3
                            0.7 + p * 0.3
                        */
                        default: return acc * cur[1];
                    }
                }, 1);

        this.setHealth(this.#health - damage);
    }

    /**
     * Applies the specified amount of damage to a player
     * @param amount The amount of damage to deal. Negative numbers heal
     * @param source The player dealing the damage, if applicable
    */
    applyDamage(amount: number, source?: PlayerLike): srvsdbx_ErrorHandling.Result<undefined, string> {
        if (!Number.isNaN(amount)) {
            this.#health -= amount * this.#modifiers.protection.reduced;

            if (this.#health < 0) {
                this.events.dispatchEvent("death", source);
                source && source.events.dispatchEvent("kill", this);
            }

            return srvsdbx_ErrorHandling.emptyResult();
        } else return { err: "Received NaN" };
    }

    /**
     * Heals the players by the specified amount
     * @param amount The amount of health to heal by. Negative numbers harm
     * @param source The player dealing the damage, if applicable
    */
    applyHealing(amount: number, source?: PlayerLike): srvsdbx_ErrorHandling.Result<undefined, string> {
        if (!Number.isNaN(amount)) {
            this.#health += amount;

            if (this.#health < 0) {
                this.events.dispatchEvent("death", source);
                source && source.events.dispatchEvent("kill", this);
            }

            return srvsdbx_ErrorHandling.emptyResult();
        } else return { err: "Received NaN" };
    }

    /**
     * Directly set the player's health
     * @param amount The amount to set the player's health at
     * @param source The player dealing the damage, if applicable
     */
    setHealth(amount: number, source?: PlayerLike): srvsdbx_ErrorHandling.Result<undefined, string> {
        if (!Number.isNaN(amount)) {
            this.#health = amount;

            if (this.#health < 0) {
                this.events.dispatchEvent("death", source);
                source && source.events.dispatchEvent("kill", this);
            }

            return srvsdbx_ErrorHandling.emptyResult();
        } else return { err: "Received NaN" };
    }

    /**
     * Identical to the method it overrides, but clears `PlayerLike`-specific fields
     */
    override destroy() {
        if (this.destroyed) return;
        super.destroy();

        this.#inventory.destroy();

        //@ts-expect-error
        this.#modifiers = this.#hands = this.#inventory = this.#state = this.#statusEffects = this.#timers = void 0;
    }
}

/**
 * A singleton class representing the player
 */
const Player = srvsdbx_OOP.createSingleton(class Player extends PlayerLike implements Destroyable {
    /**
     * A `Map` whose values are shake intensities and whose keys are the intensities' corresponding sources
     */
    readonly #shakeIntensities = new ReducibleMap<string, number>(
        (acc, cur) => cur > acc ? cur : acc,
        0
    );

    /**
     * Returns the largest shake intensity out of the ones registered. For repeated use, assign this value to a variable to avoid repeatedly running the getter
     */
    get shakeIntensity() { return this.#shakeIntensities.reduced; }

    /**
     * `* It's a constructor. It constructs.`
     * @param position A `Point2D` object dictating this object's starting position
     */
    constructor(position: srvsdbx_Geometry.Point2D) {
        super(position);
    }

    /**
     * Adds a source of screen shake to the player. Sources farther than 40 surviv units have no effect
     * @param source The name of the source this shake is originating from
     * @param strength The shake's strength
     * @param origin The point from which the shake originates
     */
    addShake(source: string, strength: number, origin: srvsdbx_Geometry.Point2D) {
        const shakeIntensity = this.#determineShakeIntensity(origin, strength);

        if (!shakeIntensity) this.removeShake(source);
        else this.#shakeIntensities.set(source, shakeIntensity);
    }

    /**
     * Removes a source of screen shake from this player
     * @param source The name of the source to remove
     */
    removeShake(source: string) {
        this.#shakeIntensities.delete(source);
    }

    /**
     * Determines the final shake intensity given an initial strength and the shake's distance from the player
     * @param origin The point from which the shake originates
     * @param strength The strength of the shake
     */
    #determineShakeIntensity(origin: { x: number, y: number; }, strength: number) {
        return Math.clamp((2000 - srvsdbx_Geometry.Vector2D.distanceBetweenPts(this.body.origin, origin)) / 1500, 0, 1) * strength;
    }

    /**
     * Identical to the method it overrides, but clears `Player`-specific fields
     */
    destroy() {
        if (this.destroyed) return;
        super.destroy();

        //@ts-expect-error
        this.#shakeIntensities = void 0;
    }
});

type Player = InstanceType<typeof Player>;

/**
 * Represents a player's inventory
 */
class Inventory implements Destroyable {
    /**
     * A reference to the PlayerLike that owns this inventory
     */
    readonly #owner: PlayerLike;
    /**
     * A reference to the PlayerLike that owns this inventory
     */
    get owner() { return this.#owner; }

    /**
     * The amount of equipable items this inventory possess
     */
    static readonly #MAIN_SLOTS = 4;
    /**
     * The amount of equipable items this inventory possess
     */
    static get MAIN_SLOTS() { return this.#MAIN_SLOTS; }

    /**
     * An aggregation of the `main` and `equipment` containers
    */
    readonly #items = new Map<string, InventoryItem>();
    /**
     * An aggregation of the `main` and `equipment` containers
     */
    get items() { return this.#items; }

    /**
     * Whether or not this object has been destroyed
     */
    #destroyed = false;
    /**
     * Whether or not this object has been destroyed
     */
    get destroyed() { return this.#destroyed; }

    /**
     * The inventory is divided into four containers to house different types
     * of items
     */
    readonly #containers = (() => {
        // This weird-ass magic is needed to keep typescript happy; without it, it whines about supertypes of ItemAnimation not being assignable to it
        const generateItemMap = <T extends InventoryItem, E extends boolean = false, K = number>(mapName: string) => {
            type U = T & IfThenElse<E, EquipableItem, {}>;

            type NewMap<W> = Omit<AugmentedMap<K, W>, "set"> & {
                /**
                 * Adds a new item to this collection at a certain key, replacing any item already there
                 * @param key The key at which to insert the item
                 * @param item The item to insert there
                 * @param destroyCurrent If set to `true` (`true` by default), then the item already occupying
                 * the slot designated by `key` will be destroyed
                 */
                set
                    <V extends ItemAnimation = ItemAnimation>
                    (
                        key: K,
                        item: IfThenElse<E, T & EquipableItem<V, string>, U> | IfThenElse<E, T & EquipableItem<V, string>, U>["prototype"],
                        destroyCurrent?: boolean
                    ): boolean;
            };

            const map = new AugmentedMap<K, U>() as NewMap<U>;

            const destroyAtKey = (key: K) => {
                this.#items.get(`${mapName}${key}`)?.destroy?.();
            };

            map.set = <V extends ItemAnimation = ItemAnimation>
                (
                    key: K,
                    item: IfThenElse<E, T & EquipableItem<V, string>, U> | IfThenElse<E, T & EquipableItem<V, string>, U>["prototype"],
                    destroyCurrent = true
                ) => {
                destroyCurrent && destroyAtKey(key);

                const instance = item instanceof InventoryItemPrototype
                    ? item.create(this.#owner)
                    : item;

                this.#items.set(`${mapName}${key}`, instance);

                return AugmentedMap.prototype.set.call(map, key, instance);
            };

            map.delete = (key: K) => {
                destroyAtKey(key);
                this.#items.delete(`${mapName}${key}`);
                return AugmentedMap.prototype.delete.call(map, key);
            };

            map.clear = () => {
                for (const [k] of this.#items)
                    if (k.startsWith(mapName)) {
                        this.#items.get(k)?.destroy?.();
                        this.#items.delete(k);
                    }

                AugmentedMap.prototype.clear.call(map);
            };

            return map;
        };

        return {
            /**
             * The main container represents items that can be equipped by the user,
             * such as firearms, melees and grenades
             */
            main: (() => {
                const map = generateItemMap<InventoryItem<InventoryItemPrototype & EquipableItemPrototype> & EquipableItem, true>("Main"),
                    set = map.set.bind(map);

                map.set = (key, item, destroyCurrent, applySwitchPenalties = true) => {
                    const owner = this.#owner;

                    if (key == owner.activeItemIndex && applySwitchPenalties)
                        /*
                            When switching out the active item for another, we need to
                            impose all the delays that would be imposed for switching to
                            another slot.
                        */
                        this.#owner.applySwitchPenalties();

                    const returnVal = set(key, item, destroyCurrent);

                    if (!owner.activeItem)
                        owner.setActiveItemIndex(key);

                    return returnVal;
                };

                return map as typeof map & {
                    /**
                     * Adds a new item to this collection at a certain key, replacing any item already there
                     * @param key The key at which to insert the item
                     * @param item The item to insert there
                     * @param destroyCurrent If set to `true` (`true` by default), then the item already occupying
                     * the slot designated by `key` will be destroyed
                     * @param applySwitchPenalties If set to `true` (`true` by default), the active
                     * item will be incumbered as if it had just been switched to
                     */
                    set(
                        key: number,
                        item: InventoryItem & EquipableItem,
                        destroyCurrent?: boolean,
                        applySwitchPenalties?: boolean
                    ): typeof map;
                };
            })(),
            /**
             * The equipment container holds `Equipment` objects, equipped by the user
             */
            equipment: generateItemMap<Equipment, false, EquipmentTypes>("Equipment"),
            /**
             * The consumable container holds a quantity of items of a certain type, rather
             * than holding a certain item in a certain slot; consumables are items that, when
             * consumed, do something to the player or their environment.
             */
            consumables: new Map<string, number>(),
            /**
             * The ammo container holds a quantity of items of a certain type, rather
             * than holding a certain item in a certain slot; ammos are objects needed for
             * firing weapons
             */
            ammo: new Map<string, number>()
            //todo: perks
        };
    })();
    get containers() { return this.#containers; }

    /**
     * `* It's a constructor. It constructs.`
     * @param owner The owner of this inventory
     */
    constructor(owner: PlayerLike) {
        this.#owner = owner;
    }

    /**
     * Clears object attributes from this instance
     *
     * **Warning: Any and all items that are in this inventory when this method is called
     * will also be destroyed. If this is undesirable, drop them into the game world beforehand**
     */
    destroy() {
        if (this.#destroyed) return;
        this.#destroyed = true;

        for (const name in this.#containers)
            for (const [, item] of this.#containers[name as keyof Inventory["containers"]])
                if (typeof item == "object") item.destroy();

        // @ts-expect-error
        this.#containers = this.#items = this.#owner = void 0;
    }
}

/**
 * A simplified representation of an item in a player's inventory
 */
interface SimpleInventoryItem extends SimpleImport {
    /**
     * Information about the images associated with this item
     */
    readonly images: {
        /**
         * The path of the image used for this item's display in the inventory and as a dropped item
         */
        readonly loot: string,
        /**
         * The path of the image used for this item's in-world rendition
         */
        readonly world?: string;
    },
    /**
     * By how much this item slows down its user, all in surviv units / second
     */
    readonly moveSpeedPenalties: {
        /**
         * The movement penalty incurred when this item is in a player's inventory
         */
        readonly passive: number;
        /**
         * The movement penalty incurred when this item is active
         */
        readonly active: number;
        /**
         * The movement penalty incurred when this item is firing
         */
        readonly using: number;
    };
}

/**
 * All items of the same type—all bandages, all M4's, all smoke grenades—have things in common, like loot image.
 *
 * This class is a template for in-world items to base themselves off of.
 */
const InventoryItemPrototype = (() => {
    abstract class InventoryItemPrototype extends ImportedObject {
        /**
         * References to this item's associated images
         */
        readonly #images: {
            /**
             * The image used to represent this item in the inventory, or as a dropped item
             */
            readonly loot: srvsdbx_AssetManagement.ImageSrcPair;
            /**
             * The image used to represent this item in the game world
             */
            readonly world?: srvsdbx_AssetManagement.ImageSrcPair;
        };
        /**
         * References to this item's associated images
         */
        get images() { return this.#images; }

        /**
         * Information about the movement speed penalties incurred by the use of this item
         */
        readonly #moveSpeedPenalties: {
            /**
             * The movement penalty incurred when this item is in a player's inventory
             */
            readonly passive: number;
        };
        /**
         * Information about the movement speed penalties incurred by the use of this item
         */
        get moveSpeedPenalties() { return this.#moveSpeedPenalties; }

        /**
         * `* It's a constructor. It constructs.`
         * @param name The name of the item
         * @param displayName Optionally specify a prettier name for this object
         * @param objectType The type of object this is
         * @param targetVersion The version of the sandbox this object targets
         * @param namespace The namespace this object belongs to
         * @param includePath The path this object was imported this
         * @param images Images associated with this item
         * @param moveSpeedPenalties Movement penalties associated with this item
         */
        constructor(
            name: ImportedObject["name"],
            displayName: ImportedObject["displayName"],
            objectType: ImportedObject["objectType"],
            targetVersion: ImportedObject["targetVersion"],
            namespace: ImportedObject["namespace"],
            includePath: ImportedObject["includePath"],
            images: InventoryItemPrototype["images"],
            moveSpeedPenalties: InventoryItemPrototype["moveSpeedPenalties"],
        ) {
            super(name, displayName, objectType, targetVersion, namespace, includePath);

            this.#images = images;
            this.#moveSpeedPenalties = moveSpeedPenalties;
        }

        /**
         * Creates a new instance of this item
         * @param owner The player the created item will belong to
         */
        abstract create(owner: PlayerLike): InventoryItem<InventoryItemPrototype>;
    }

    return srvsdbx_OOP.makeAbstract(InventoryItemPrototype);
})();
type InventoryItemPrototype = InstanceType<typeof InventoryItemPrototype>;

/**
 * A simplified representation of an item that can be equipped by the user
 */
interface SimpleEquipableItem extends SimpleInventoryItem {
    /**
     * All images are loaded at startup. This array is used to declare all of the images this item will use
     * Attempts to use an image not on this list will result in an error
     *
     * The exception to this are the images declared in `images`; they are always loaded, and are therefore
     * always available. Thus, if your item doesn't use any image other than its loot/world image, you can
     * safely omit this attribute
     *
     * The strings in this array should reference the image's paths
     */
    readonly imageDeclaration?: string[],
    /**
     * The minimum amount of time that the user must wait before two uses of an item
     */
    readonly useDelay: number,
    /**
     * Specify default positions for the user's hands when holding this weapon when no animations are playing
     */
    readonly handPositions?: HandPositions;
}

/**
 * Represents the positions of a player's hands
 */
type HandPositions = {
    /**
     * Information about the left hand
     */
    readonly leftHand?: {
        /**
         * The hand's offset in surviv units along the axis parallel to the player's aim line
         */
        readonly parr: number,
        /**
         * The hand's offset in surviv units along the axis perpendicular to the player's aim line
         */
        readonly perp: number,
        /**
         * What layer to render this hand on
         * The right hand will be rendered above the left one if they are on the same layer
         *
         * - `0`: The default, renders the hand below the item
         * - `1`: Renders the hand above the item
         */
        readonly layer?: 0 | 1;
    },
    /**
     * Information about the right hand
     */
    readonly rightHand?: {
        /**
         * The hand's offset in surviv units along the axis parallel to the player's aim line
         */
        readonly parr: number,
        /**
         * The hand's offset in surviv units along the axis perpendicular to the player's aim line
         */
        readonly perp: number,
        /**
         * What layer to render this hand on
         * The right hand will be rendered above the left one if they are on the same layer
         *
         * - `0`: The default, renders the hand below the item
         * - `1`: Renders the hand above the item
         */
        readonly layer?: 0 | 1;
    };
};

/**
 * Represents the data for animating an object
 */
type ItemAnimation = {
    /**
     * Data about the player's hands
     */
    readonly hands?: HandPositions,
    /**
     * Data about the item's world image
     */
    readonly item?: {
        /**
         * Optionally specify a new image to use
         *
         * This is applied at the beginning of the keyframe and is not subject
         * to interpolation
         */
        readonly image?: string;
        /**
         * The image's dimensions
         *
         * Omitted components are substituted with `"auto"`
         */
        readonly dimensions?: {
            /**
             * The image's width in surviv units
             */
            readonly width?: number,
            /**
             * The image's height in surviv units
             */
            readonly height?: number,
            /**
             * A new layer to use
             *
             * This is applied at the beginning of the keyframe and is not subject
             * to interpolation
             */
            readonly layer?: 0 | 1 | 2;
        },
        /**
         * At what offset to draw this image, with (0, 0) being the player's center
         */
        readonly offset?: {
            /**
             * The offset in surviv units to apply along the axis parallel to the player's aim line
             */
            readonly parr?: number,
            /**
             * The offset in surviv units to apply along the axis perpendicular to the player's aim line
             */
            readonly perp?: number,
            /**
             * The angular offset to apply to the item
             */
            readonly angle?: number;
        };
    };
};

/**
 * Represents an equipable item's prototype; item prototypes bridge the gap between
 * simple items and concrete in-game items
 */
interface EquipableItemPrototype {
    /**
     * A map that contains images that have been declared by this object, and whose keys
     * are the paths to those images, *which are a concatenation of the object's include path
     * and the image's path as specified in the object file*.
     *
     * For example, an image declared as being at `./my-image.svg` in an object that's located
     * at `assets/foo/melees` can be accessed by using the key `assets/foo/melees/./my-image.svg`
     *
     * This map's `get` method is guaranteed not to return `undefined`: if an invalid key
     * is used, an error is thrown
     */
    readonly imageMap: Map<string, srvsdbx_AssetManagement.ImageSrcPair>;
    /**
     * The minimum amount of time that the user must wait before two uses of an item
     */
    readonly useDelay: SimpleEquipableItem["useDelay"],
    /**
     * Specify default positions for the user's hands when holding this weapon when no animations are playing
     */
    readonly handPositions: SimpleEquipableItem["handPositions"];
    /**
     * Information about the images associated with this item
     */
    readonly images: { [K in keyof SimpleInventoryItem["images"]]: srvsdbx_AssetManagement.ImageSrcPair },
    /**
     * By how much this item slows down its user, all in surviv units / second
     */
    readonly moveSpeedPenalties: SimpleInventoryItem["moveSpeedPenalties"];
}

/**
 * Represents an item that can be equipped by the user, such as guns, melees and grenades
 * @template T The type of animation this item has
 * @template K The names of the animations this item has
 */
interface EquipableItem<T extends ItemAnimation = ItemAnimation, K extends string = "idle" | "using"> {
    /**
     * An object to manage this item's animations
     */
    readonly animationManager: srvsdbx_Animation.AnimationManager<T, K>;
    /**
     * A timestamp indicating the last time this item was used
     */
    readonly lastUse: number;
    /**
     * Resets this object to its default state
     */
    reset(): void;
    /**
     * A method that will be called when this item's owner uses this item with primary fire (usually left mouse)
     */
    usePrimary(): void;
    /**
     * Calculates this item's dimensions and offsets, taking into account any animations currently active
     */
    getItemReference(): T["item"];
    /**
     * Calculates this item's hand rigging, taking into account any animations currently active
     */
    getHandReference(): T["hands"];
    /**
     * Serves to stop any animation related to this item that are currently playing
     */
    stopAnimations(): void;
    /**
     * Whether this item's animations have been cancelled for some reason
     */
    readonly cancelledAnimation: boolean;
}

/**
 * Represents an instance of an item in a user's inventory
 * @template T The type of prototype this item has
 */
const InventoryItem = (() => {
    abstract class InventoryItem<T extends InventoryItemPrototype = InventoryItemPrototype> implements Destroyable {
        /**
         * A reference to the PlayerLike that owns this item
         */
        readonly #owner: PlayerLike;
        /**
         * A reference to the PlayerLike that owns this item
         */
        get owner() { return this.#owner; }

        /**
         * A reference to the prototype this item is based on
         */
        readonly #prototype: T;
        /**
         * A reference to the prototype this item is based on
         */
        get prototype() { return this.#prototype; }

        /**
         * Whether or not this item has been destroyed
         */
        #destroyed = false;
        /**
         * Whether or not this item has been destroyed
         */
        get destroyed() { return this.#destroyed; }

        /**
         * `* It's a constructor. It constructs.`
         * @param prototype The `ItemPrototype` this item is based on
         * @param owner The owner of this item
         */
        constructor(prototype: T, owner: PlayerLike) {
            this.#prototype = prototype;
            this.#owner = owner;
        }

        /**
         * Destroys this item, clearing its references to other objects
         *
         * **It is the caller's responsibility to ensure that destroyed items are removed from the game world (i.e., inventories)**
         */
        destroy() {
            if (this.#destroyed) return;
            this.#destroyed = true;

            // @ts-expect-error
            this.#owner = this.#prototype = void 0;
        }
    }

    return srvsdbx_OOP.makeAbstract(InventoryItem);
})();
type InventoryItem<T extends InventoryItemPrototype = InventoryItemPrototype> = InstanceType<typeof InventoryItem<T>>;