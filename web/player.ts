/**
 * Represents a bot or player: generally, something that can act as a player
 */
class PlayerLike extends Generic<{
    collision: {
        event: CollisionEvent,
        args: [Generic];
    },
    /**
     * This player's death
     */
    death: {
        /**
         * The `Event` instance
         */
        event: Event,
        /**
         * The `PlayerLike` that killed this instance, if applicable
         */
        args: [PlayerLike | undefined];
    },
    /**
     * This player's killing of another
     */
    kill: {
        /**
         * The `Event` instance
         */
        event: Event,
        /**
         * The `PlayerLike` that was killed
         */
        args: [PlayerLike];
    };
}> implements Destroyable {
    /**
     * This player's inventory object
     */
    readonly #inventory = new Inventory(this);
    /**
     * This player's inventory object
     */
    get inventory() { return this.#inventory; }

    /**
     * The index of the last active item
     */
    #previousActiveIndex = 1;
    /**
     * The index of the last active item
     */
    get previousActiveIndex() { return this.#previousActiveIndex; }

    /**
     * The index of the active item
     */
    #activeItemIndex = 0;
    /**
     * Returns the index of the active item
     */
    get activeItemIndex() { return this.#activeItemIndex; }

    /**
     * The item currently in use by the PlayerLike
     */
    get activeItem() { return this.#inventory.getItem(this.#activeItemIndex, "Main"); }

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
            firing: false,
            lastSwitch: 0,
            lastFreeSwitch: 0,
            noSlow: false,
            reloading: false
        };
    get state() { return this.#state; }

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
     * Stores any timers on this player. Timers are used to delay actions, like reloads.
     *
     * **When assigning these timers, take care to clear any timer that might be stored there!**
     */
    readonly #timers: {
        /**
         * The timer responsible for firing the user's current weapon
         */
        firing: false | number,
        /**
         * The timer responsible for replenishing the user's ammo after some delay
         */
        reload: false | number;
    } = {
            firing: false,
            reload: false
        };
    get timers() { return this.#timers; }

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
    get hands() { return this.#hands; }

    /**
     * Information about the speed players travel at
     */
    readonly #speed = {
        default: 12
    };
    /**
     * Information about the speed players travel at
     */
    get speed() { return this.#speed; }

    /**
     * The point in the game world this player is aiming at
     */
    #aimPoint: srvsdbx_Geometry.Point2D;
    /**
     * The point in the game world this player is aiming at
     */
    get aimPoint() { return this.#aimPoint; }

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
     * A collections of `Map`s whose role is to modify the intensity of actions
     * performed by this player, such as dealing damage, speed, etc
     */
    #modifiers = {
        /**
         * A `Map` whose values will modify outgoing damage by multiplying it and whose keys are their respectives sources
        */
        damage: new ReducibleMap<string, number>((acc, cur) => acc * cur, 1),
        /**
          * A `Map` whose values will modify incoming damage by multiplying it and whose keys are their respectives sources
         */
        protection: new ReducibleMap<string, number>((acc, cur) => acc * cur, 1),
        /**
         * A `Map` whose values are speed multipliers and whose keys are their respectives sources
         *
         * Note that additive modifiers have precedence over multiplicative ones; the formula
         * for the final speed is therefore `(s + a) * m`, where `s` is the base speed, `m` is
         * the product of all the multiplicative speed modifiers and `a` is the sum of all the
         * additive modifiers
         */
        speedMult: new ReducibleMap<string, number>((acc, cur) => acc * cur, 1),
        /**
         * A `Map` whose values are speed additions and whose keys are their respectives sources
         *
         * Note that additive modifiers have precedence over multiplicative ones; the formula
         * for the final speed is therefore `(s + a) * m`, where `s` is the base speed, `m` is
         * the product of all the multiplicative speed modifiers and `a` is the sum of all the
         * additive modifiers
         */
        speedAdd: new ReducibleMap<string, number>((acc, cur) => acc + cur, 0),
        /**
         * A `Map` whose values will modify reload time and fire rate by multiplying it and whose keys are their respectives sources
         */
        ergonomics: new ReducibleMap<string, number>((acc, cur) => acc * cur, 1),
    } as const;
    /**
     * A collections of `Map`s whose role is to modify the intensity of actions
     * performed by this player, such as dealing damage, speed, etc
     */
    get modifiers() { return this.#modifiers; }

    /**
     * A `Set` of status effects currently affecting this player
     *
     * **Implementation note:** Calling this object's `.clear` method will call each status effect's
     * `.destroy` method before clearing the set
     */
    readonly #statusEffects = (() => {
        const s = new Set<StatusEffect<{}>>();

        const nativeClear = s.clear.bind(s);
        const nativeAdd = s.add.bind(s);

        s.clear = () => {
            for (const effect of s)
                effect.destroy();

            nativeClear();
        };

        s.add = (effect) => {
            /*
                This serves to prevent two instances of the same status effect from being applied at once.

                Sets disallow duplicate entries, but since two constructor calls yield two different instances,
                we need to compare them by prototype instead (the prototype field and not the result of `Object.getPrototypeOf`)
            */

            const residing = [...s.values()].find(fx => fx.prototype == effect.prototype);

            if (residing) residing.renew();
            else nativeAdd(effect);

            return s;
        };

        return s;
    })();
    /**
     * A `Set` of status effects currently affecting this player
     */
    get statusEffects() { return this.#statusEffects; }

    /**
     * The radius of this player
     */
    #radius = gamespace.PLAYER_SIZE;
    /**
     * The radius of this player
     *
     * - `get`: Returns this player's radius
     * - `set`: Sets this player's radius if it is not `NaN`
     */
    get radius() { return this.#radius; }
    set radius(r) {
        if (!Number.isNaN(r)) {
            const pos = {
                x: this.position.x,
                y: this.position.y
            };

            Matter.Body.setPosition(
                this.body = Matter.Bodies.circle(0, 0, this.#radius = r),
                pos
            );
            Matter.Body.setAngle(this.body, this.angle);
        }
    }

    /**
     * `* It's a constructor. It constructs.`
     * @param position A `Point2D` object dictating this object's starting position
     */
    constructor(position: srvsdbx_Geometry.Point2D) {
        super(
            Matter.Bodies.circle(0, 0, 50),
            (p5: import("p5")) => {
                const T = this,
                    body = T.body,
                    currentSize = this.#radius,
                    defaultSize = gamespace.PLAYER_SIZE,
                    activeItem = T.activeItem,
                    itemPrototype = activeItem?.prototype as (InventoryItemPrototype & SimpleEquipableItem) | undefined;

                p5.push();

                p5.translate(T.position.x, T.position.y);
                p5.rotate(T.angle);

                p5.noStroke();

                function drawBody() {
                    p5.push();

                    p5.fill("#F8C574");
                    p5.circle(0, 0, 2 * currentSize);

                    gamespace.drawDebug(
                        p5,
                        T.collidable ? "COLLIDABLE" : "DEFAULT",
                        () => p5.circle(0, 0, 2 * currentSize),
                        () => {
                            p5.rotate(-T.angle);
                            p5.translate(-body.position.x, -body.position.y);
                        },
                        T as Generic
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

                                if (!layer) {
                                    gamespace.drawHitboxIfEnabled(p5, "DEFAULT", p5 => {
                                        p5.circle(
                                            hand.perp * currentSize,
                                            -hand.parr * currentSize,
                                            handSize * defaultSize
                                        );
                                    });
                                }
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
                            && itemPrototype!.fireMode.includes("charge") && activeItem.charged,

                            chargeProps = (itemPrototype as unknown as GunPrototype)?.chargeProps,

                            itemReference = T.activeItem.getItemReference(),

                            image = (useChargedImage ? chargeProps?.chargeImage?.image?.asset : void 0) ?? itemPrototype!.images.world?.asset,
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
                                const o = (useChargedImage ? chargeProps?.chargeImage?.imageOffset : void 0) ?? itemReference?.offset ?? fallbackOffset;

                                return {
                                    parr: o.parr,
                                    perp: o.perp,
                                    angle: "angle" in o ? o.angle : void 0
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

                                const img = pickRandomInArray(addon.images).asset,
                                    dimensions = srvsdbx_AssetManagement.determineImageDimensions(img, {
                                        width: extractValue(addon.dimensions.width, activeItem as Gun & Melee),
                                        height: extractValue(addon.dimensions.height, activeItem as Gun & Melee)
                                    }),
                                    position = {
                                        parr: extractValue(addon.position.parr, activeItem as Gun & Melee),
                                        perp: extractValue(addon.position.perp, activeItem as Gun & Melee)
                                    },
                                    recImpPar = dual ? -1 : 1,
                                    finalPosition = {
                                        parr: (position.parr + +(recoilImpulseParity == recImpPar && addon.recoil !== false) * recoilParr) * currentSize,
                                        perp: (position.perp + +(recoilImpulseParity == recImpPar && addon.recoil !== false) * recoilPerp) * currentSize
                                    };

                                p5.push();

                                p5.tint(extractValue(addon.tint, activeItem as Gun & Melee));

                                p5.translate(finalPosition.perp, -finalPosition.parr);
                                p5.rotate(offset.angle ?? 0);
                                p5.image(
                                    img,
                                    0,
                                    0,
                                    dimensions.width,
                                    dimensions.height
                                );

                                gamespace.drawHitboxIfEnabled(p5, "DEFAULT", p5 => {
                                    p5.rect(
                                        0, 0,
                                        dimensions.width, dimensions.height
                                    );
                                });

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

                                if (collider && (itemPrototype.canReflectWhileAttacking || !T.#state.attacking)) {
                                    p5.push();

                                    // random component switch is random
                                    p5.translate(
                                        -(itemPrototype.worldObject?.collider?.offsetParr ?? 0) * defaultSize,
                                        (itemPrototype.worldObject?.collider?.offsetPerp ?? 0) * defaultSize
                                    );

                                    const vertices = collider.vertices;

                                    gamespace.drawHitboxIfEnabled(p5, "REFLECTIVE", () => {
                                        p5.beginShape();
                                        for (let i = 0, l = vertices.length; i < l; i++) {
                                            p5.vertex(vertices[i].x, vertices[i].y);
                                        }
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
                            // Show the damage closest to the current time, ±100ms
                            const damages = itemPrototype.damages.filter(
                                d => 100 >= Math.abs(gamespace.currentUpdate - activeItem.lastUse - d.time)
                            ).map(d => d.areaOfEffect);

                            if (damages.length)
                                for (let i = 0, l = damages.length; i < l; i++) {
                                    const damage = damages[i];

                                    p5.push();
                                    p5.translate(
                                        damage.offset.perp * defaultSize,
                                        -damage.offset.parr * defaultSize
                                    );

                                    gamespace.drawHitboxIfEnabled(p5, "AREA_OF_EFFECT", () => {
                                        p5.circle(0, 0, 2 * damage.radius * defaultSize);
                                    });

                                    p5.pop();
                                }
                        }

                        if (
                            activeItem instanceof Gun
                            && itemPrototype instanceof GunPrototype
                            && itemPrototype.effectsOnFire
                        )
                            for (const query of itemPrototype.effectsOnFire)
                                gamespace.drawHitboxIfEnabled(p5, "AREA_OF_EFFECT", () => {
                                    // This AoE tends to be big enough that the default level of detail
                                    // isn't enough
                                    p5.ellipse(0, 0, 2 * query.radius, 2 * query.radius, 50);
                                });

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
                    for (const [_, i] of T.#inventory.items) {
                        if (i instanceof Melee && T.activeItem != i) {
                            const holster = i.prototype.holstered;

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

                            const collider = i.getCollider();

                            if (collider) {
                                p5.push();

                                // random component switch is random
                                p5.translate(
                                    -holster.collider.offsetParr * defaultSize,
                                    holster.collider.offsetPerp * defaultSize
                                );

                                const vertices = collider.vertices;

                                gamespace.drawHitboxIfEnabled(p5, "REFLECTIVE", () => {
                                    p5.beginShape();
                                    for (let i = 0, l = vertices.length; i < l; i++) {
                                        p5.vertex(vertices[i].x, vertices[i].y);
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
                        (itemPrototype as unknown as srvsdbx_ErrorHandling.Maybe<GunPrototype>)?.fireMode?.includes?.("charge")
                            && (activeItem as srvsdbx_ErrorHandling.Maybe<Gun>)?.charged

                            ? (itemPrototype as unknown as srvsdbx_ErrorHandling.Maybe<GunPrototype>)?.chargeProps?.chargeImage?.dimensions?.layer
                            : void 0
                    )
                        ?? (itemPrototype as unknown as srvsdbx_ErrorHandling.Maybe<GunPrototype>)?.dimensions?.layer
                        ?? (itemPrototype as unknown as srvsdbx_ErrorHandling.Maybe<MeleePrototype>)?.worldObject?.dimensions.layer
                        ?? 0;

                switch (layer) {
                    case 0: {
                        functions = [
                            drawHolsteredItems.bind(void 0, 0), drawItemAndHands, // layer 0
                            drawHolsteredItems.bind(void 0, 1), drawBody, // layer 1
                            drawRemainingHands, drawHolsteredItems.bind(void 0, 2) // layer 2
                        ] as const;
                        break;
                    }
                    case 1: {
                        functions = [
                            drawHolsteredItems.bind(void 0, 0), // layer 0
                            drawHolsteredItems.bind(void 0, 1), drawBody, drawItemAndHands, // layer 1
                            drawRemainingHands, drawHolsteredItems.bind(void 0, 2) // layer 2
                        ] as const;
                        break;
                    }
                    case 2: {
                        functions = [
                            drawHolsteredItems.bind(void 0, 0), drawBody, // layer 0
                            drawHolsteredItems.bind(void 0, 1), drawRemainingHands, // layer 1
                            drawHolsteredItems.bind(void 0, 2), drawItemAndHands // layer 2
                        ] as const;
                        break;
                    }
                }

                for (let i = 0, l = functions.length; i < l; functions[i++]());

                p5.pop();
            },
            position
        );

        this.#aimPoint = srvsdbx_Geometry.Vector2D.zeroPt();

        gamespace.objects.players.set(this.id, this);
    }

    /**
     * Determines if this player can currently use their active item
     *
     * A player can use their active item if:
     * - There is an active item
     * - It is equippable
     * - The elapsed time since its last use is greater than the item's use delay
     * @returns Whether or not the item can be used
     */
    canAttack() {
        const item = this.activeItem;

        if (!item || !(typeof (item.prototype as InventoryItemPrototype & SimpleEquipableItem).useDelay != "number")) return false;

        return item.lastUse - gamespace.currentUpdate >= (item.prototype as InventoryItemPrototype & SimpleEquipableItem).useDelay;
    }

    /**
     * Inverses the weapon slots, putting the first weapon in the second and vice versa
     */
    swapWeapons() {
        const primary = this.inventory.getItem(0, "Main"),
            secondary = this.inventory.getItem(1, "Main");

        secondary && this.inventory.setItem(0, "Main", secondary, false);
        primary && this.inventory.setItem(1, "Main", primary, false);

        if (this.#previousActiveIndex == 0 || this.#previousActiveIndex == 1) {
            this.#previousActiveIndex = 1 - this.#previousActiveIndex;
        }

        if (this.#activeItemIndex == 0 || this.#activeItemIndex == 1) {
            this.#activeItemIndex = 1 - this.#activeItemIndex;
        }
    }

    /**
     * Sets the player's active item by referring to the at which it's contained
     * @param slotId The slot in the inventory to switch to
     */
    setActiveItemIndex(slotId: number) {
        if (this.#inventory.getItem(slotId, "Main")) {
            const oldIndex = this.#activeItemIndex,
                oldItem = this.activeItem,
                activeItemIsGun = () => this.activeItem instanceof Gun;

            if (oldItem instanceof Gun) {
                oldItem.stopCharging();
            }

            oldItem?.stopAnimations?.();

            this.#activeItemIndex = slotId;

            if (slotId != oldIndex) {
                const proto = this.activeItem?.prototype,
                    oldProto = oldItem?.prototype,

                    freeSwitchExpired = gamespace.currentUpdate - this.#state.lastFreeSwitch >= 1000;

                if (freeSwitchExpired) this.#state.lastFreeSwitch = gamespace.currentUpdate;

                this.#state.effectiveSwitchDelay = (proto as srvsdbx_ErrorHandling.Maybe<GunPrototype>)?.switchDelay ?? 0;
                this.#state.noSlow = true;

                this.#previousActiveIndex = oldIndex;
                if (
                    // last free switch happened over a second ago
                    freeSwitchExpired &&

                    // the switch is occurring before the weapon can fire
                    gamespace.currentUpdate - (oldItem?.lastUse ?? 0) < (
                        ((
                            !!(oldProto as GunPrototype)?.fireMode?.match?.(/^(auto-)?burst/) && (oldProto as GunPrototype)?.burstProps
                                ? (oldProto as GunPrototype)?.burstProps?.burstDelay
                                : (oldProto as InventoryItemPrototype & SimpleEquipableItem)?.useDelay
                        ) ?? Infinity)
                    ) &&

                    // Different non-zero deployGroups (0 / 0 gives NaN, and NaN != 1)
                    ((oldProto as srvsdbx_ErrorHandling.Maybe<GunPrototype>)?.deployGroup ?? 0) / ((proto as srvsdbx_ErrorHandling.Maybe<GunPrototype>)?.deployGroup ?? 0) != 1
                ) this.#state.effectiveSwitchDelay = 250;

                this.#state.lastSwitch = gamespace.currentUpdate;

                clearTimerIfPresent(this.#timers.firing);
                clearTimerIfPresent(this.#timers.reload);
                this.#state.attacking = this.#state.reloading = this.#timers.firing = this.#timers.reload = false;

                if (activeItemIsGun()) {
                    const item = this.activeItem as Gun;

                    if (!item.ammo) {
                        item.scheduleReload(this.#state.effectiveSwitchDelay);
                    }
                }
            }
        }
    }

    /**
     * Identical to the method it overrides, save for the fact that it pays special consideration to the velocities corresponding to keyboard inputs
     * These correspond to the following keys in the `velocityMap`: `forwards`, `strafeL`, `backwards`, `strafeR`. The addition of the velocities is a vector,
     * whose magnitude is set to a certain amount corresponding to the player's speed.
     *
     * Other velocities are treated normally.
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
                    (p, c) => srvsdbx_Geometry.Vector3D.plus(p, this.velocityMap.get(c) ?? srvsdbx_Geometry.Vector3D.zeroPt(), true),
                    srvsdbx_Geometry.Vector3D.zeroPt()
                )
            ),
            keyboard = keyboardRaw.scale(this.determineMoveSpeed() * 0.05 / keyboardRaw.length, true);

        return [...this.velocityMap.entries()]
            .filter(([key, _]) => !keys.includes(key))
            .reduce((accumulator, [_, current]) => accumulator.plus(current), srvsdbx_Geometry.Vector3D.zeroVec())
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
            isCharging = isGun && (activeItem! instanceof Gun) && (prototype as GunPrototype).fireMode.includes("charge") && (activeItem!.isCharging || activeItem!.charged),
            applyFiringPenalty = isGun ?
                !this.#state.noSlow && // Not currently noslow'ing
                (
                    this.#state.firing || // Currently firing
                    gamespace.currentUpdate - (this.activeItem?.lastUse ?? 0) < ((!!prototype.fireMode.match(/^(auto-)?burst/) && prototype.burstProps ? prototype.burstProps.burstDelay : prototype.useDelay) ?? Infinity)
                    // Or the delay between now and the last shot is less than the weapon's firing delay
                    + (this.#state.attacking && prototype.fireMode != "semi" ? 50 : 1)
                    // If firing in full auto, we add padding to the movement penalty to prevent the speed from viscously vibrating
                ) : false;

        const speed = this.#speed.default // Base speed
            + passive //  Passive speed penalties
            + ((prototype?.moveSpeedPenalties as { active?: number; })?.active ?? 0)  //   Active speed penalty
            + (applyFiringPenalty ? (prototype as GunPrototype).moveSpeedPenalties.using : 0) //   Firing speed penalty
            + (isCharging ? prototype.chargeProps?.speedPenalty ?? 0 : 0);// Charging speed penalty

        return ((applyFiringPenalty ? speed / 2 : speed - 1) + this.#modifiers.speedAdd.reduced) * this.#modifiers.speedMult.reduced;
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
     * Applies the specified amount of damage to a player
     * @param amount The amount of damage to deal. Negative numbers heal
     */
    applyDamage(amount: number, source?: PlayerLike): srvsdbx_ErrorHandling.Result<undefined, string> {
        return this.applyHealing(-amount, source);
    }

    /**
     * Heals the players by the specified amount
     * @param amount The amount of health to heal by. Negative numbers harm
    */
    applyHealing(amount: number, source?: PlayerLike): srvsdbx_ErrorHandling.Result<undefined, string> {
        if (!Number.isNaN(amount)) {
            this.#health += amount * this.#modifiers.protection.reduced;

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
     */
    setHealth(amount: number): srvsdbx_ErrorHandling.Result<undefined, string> {
        if (!Number.isNaN(amount)) {
            this.#health = amount;

            return srvsdbx_ErrorHandling.emptyResult();
        } else return { err: "Received NaN" };
    }

    /**
     * Identical to the method it overrides, but clears `PlayerLike`-specific fields
     */
    override destroy() {
        super.destroy();

        this.#inventory.destroy();

        //@ts-expect-error
        this.#modifiers = this.#hands = this.#inventory = this.#speed = this.#state = this.#statusEffects = this.#timers = void 0;
    }
}

/**
 * A singleton class representing the player
 */
const Player = createSingleton(class Player extends PlayerLike implements Destroyable {
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
        return Math.clamp((2000 - srvsdbx_Geometry.Vector2D.distBetweenPts(this.body.position, origin)) / 1500, 0, 1) * strength;
    }

    /**
     * Identical to the method it overrides, but clears `Player`-specific fields
     */
    destroy() {
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
     * A map whose keys are the slot names and whose values are the items stocked there
     */
    readonly #items: Map<string, InventoryItem | (InventoryItem & EquipableItem)> = new Map;
    /**
     * A map whose keys are the slot names and whose values are the items stocked there
     */
    get items() { return this.#items; }

    /**
     * Whether or not an object has been destroyed
     */
    #destroyed = false;
    /**
     * Whether or not an object has been destroyed
     */
    get destroyed() { return this.#destroyed; }

    /**
     * `* It's a constructor. It constructs.`
     * @param owner The owner of this inventory
     */
    constructor(owner: PlayerLike) {
        this.#owner = owner;
    }

    /**
     * Fetches an item in a given slot corresponding to some category
     * @param slot The slot number
     * @param category The category this item belongs to. (ex: `Main` for firearms, `Medical` for consumables, `Ammo` for ammunition)
     * @template T The category type. `Main` returns `EquipableItem`s, while others just return `InventoryItem`s
     * @template U The type of animations this item has, if applicable
     * @returns The item at the specified location, if it exists
     */
    getItem<
        T extends "Main" | string,
        U extends ItemAnimation = ItemAnimation
    >(
        slot: number,
        category: T
    ): InventoryItem & (T extends "Main" ? (EquipableItem<U>) : {}) | undefined {
        return this.#items.get(`${category}${slot}`) as any;
    }

    /**
     * Checks to see if an item exists in a slot
     * @param slot The slot number
     * @param category The category this item belongs to. (ex: `Main` for firearms, `Medical` for consumables, `Ammo` for ammunition)
     * @returns Whether or not there exists an item there
     */
    hasItem(slot: number, category: string) {
        return this.#items.has(`${category}${slot}`);
    }

    /**
     * Sets an item in a given slot corresponding to some category
     * @param slot The slot number
     * @param category The category this item belongs to. (ex: `Main` for firearms, `Medical` for consumables, `Ammo` for ammunition)
     * @param item The item to store at that slot
     * @param reset Whether or not to reset the item that was just passed in
     * @template T The category type. `Main` returns `EquipableItem`s, while others just return `InventoryItem`s
     * @template U The type of animations this item has, if applicable
     */
    setItem<
        T extends "Main" | string,
        U extends ItemAnimation = ItemAnimation
    >(
        slot: number,
        category: T,
        item: InventoryItem & (T extends "Main" ? (EquipableItem<U, string>) : {}),
        reset?: boolean
    ) {
        const key = `${category}${slot}`;

        this.#items.set(key, item);
        reset && category == "Main" && (item as InventoryItem & EquipableItem<U>).reset();

        this.#owner.activeItem ?? this.#owner.setActiveItemIndex(slot);
    }

    /**
     * Clears object attributes from this instance
     *
     * **Warning: Any and all items that are in this inventory when this method is called
     * will also be destroyed. If this is undesirable, drop them into the game world beforehand**
     */
    destroy() {
        for (const [_, i] of this.#items)
            i.destroy();

        // @ts-expect-error
        this.#items = this.#owner = void 0;
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
class InventoryItemPrototype extends ImportedObject {
    /**
     * References to this item's associated images
     */
    readonly #images: {
        /**
         * The image used to represent this item in the inventory, or as a dropped item
         */
        readonly loot: srvsdbx_AssetManagement.ImageSrcPair;
        /**
         * The image used to represent this item in the game worlf
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
        name: typeof ImportedObject.prototype.name,
        displayName: typeof ImportedObject.prototype.displayName,
        objectType: typeof ImportedObject.prototype.objectType,
        targetVersion: typeof ImportedObject.prototype.targetVersion,
        namespace: typeof ImportedObject.prototype.namespace,
        includePath: typeof ImportedObject.prototype.includePath,
        images: typeof InventoryItemPrototype.prototype.images,
        moveSpeedPenalties: typeof InventoryItemPrototype.prototype.moveSpeedPenalties,
    ) {
        super(name, displayName, objectType, targetVersion, namespace, includePath);
        this.#images = images;
        this.#moveSpeedPenalties = moveSpeedPenalties;
    }
}

/**
 * A simplified representation of an item that can be equipped by the user
 */
interface SimpleEquipableItem extends SimpleInventoryItem {
    /**
     * The minimum amount of time that the user must wait before two uses of an item
     */
    readonly useDelay: number;
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
         * The image's dimensions
         */
        readonly dimensions?: {
            /**
             * The image's width in surviv units
             */
            readonly width?: number,
            /**
             * The image's height in surviv units
             */
            readonly height?: number;
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
    getItemReference(): ItemAnimation["item"];
    /**
     * Calculates this item's hand rigging, taking into account any animations currently active
     */
    getHandReference(): ItemAnimation["hands"];
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
 */
class InventoryItem<T extends InventoryItemPrototype = InventoryItemPrototype> implements Destroyable {
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
     * @param owner The owner of this item
     */
    constructor(owner: PlayerLike, prototype: T) {
        this.#owner = owner;
        this.#prototype = prototype;
    }

    /**
     * Destroys this item, clearing its references to other objects
     */
    destroy() {
        // @ts-expect-error
        this.#owner = this.#prototype = void 0;
    }
}