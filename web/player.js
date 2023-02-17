"use strict";
/**
 * Represents a bot or player: generally, something that can act as a player
 */
class PlayerLike extends Generic {
    /**
     * This player's inventory object
     */
    #inventory = new Inventory(this);
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
    #state = {
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
    #timers = {
        anticipatedReload: false,
        firing: false,
        reload: false
    };
    get timers() { return this.#timers; }
    /**
     * Information about this player's hand positions
     */
    #hands = {
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
    #speed = {
        default: 12
    };
    /**
     * Information about the speed players travel at
     */
    get speed() { return this.#speed; }
    /**
     * The point in the game world this player is aiming at
     */
    #aimPoint;
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
        damage: new ReducibleMap((acc, cur) => acc * cur, 1),
        /**
          * A `Map` whose values will modify incoming damage by multiplying it and whose keys are their respectives sources
        */
        protection: new ReducibleMap((acc, cur) => acc * cur, 1),
        /**
         * A `Map` whose values are speed multipliers and whose keys are their respectives sources
        */
        speed: new ReducibleMap((acc, cur) => acc * cur, 1),
        /**
         * A `Map` whose values will modify reload time and fire rate by multiplying it and whose keys are their respectives sources
         */
        ergonomics: new ReducibleMap((acc, cur) => acc * cur, 1),
    };
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
    #statusEffects = (() => {
        const s = new Set();
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
            if (residing)
                residing.renew();
            else
                nativeAdd(effect);
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
            Matter.Body.setPosition(this.body = Matter.Bodies.circle(0, 0, this.#radius = r), pos);
            Matter.Body.setAngle(this.body, this.angle);
        }
    }
    /**
     * `* It's a constructor. It constructs.`
     * @param position A `Point2D` object dictating this object's starting position
     */
    constructor(position) {
        super(Matter.Bodies.circle(0, 0, 50), (p5) => {
            const T = this, body = T.body, currentSize = this.#radius, defaultSize = gamespace.PLAYER_SIZE, activeItem = T.activeItem, itemPrototype = activeItem?.prototype;
            p5.push();
            p5.translate(T.position.x, T.position.y);
            p5.rotate(T.angle);
            p5.noStroke();
            function drawBody() {
                p5.push();
                p5.fill("#F8C574");
                p5.circle(0, 0, 2 * currentSize);
                gamespace.drawDebug(p5, T.collidable ? "COLLIDABLE" : "DEFAULT", () => p5.circle(0, 0, 2 * currentSize), () => {
                    p5.rotate(-T.angle);
                    p5.translate(-body.position.x, -body.position.y);
                }, T);
                p5.pop();
            }
            const [drawLeftHand, drawRightHand] = (() => {
                function generate(hand) {
                    return () => {
                        if (!hand)
                            return;
                        p5.push();
                        for (let layer = 0; layer < 2; layer++) {
                            p5.fill(layer ? "#F8C574" : "#302719");
                            const handSize = layer ? 0.525 : 0.75;
                            p5.circle(hand.perp * currentSize, -hand.parr * currentSize, handSize * defaultSize);
                            if (!layer) {
                                gamespace.drawHitboxIfEnabled(p5, "DEFAULT", p5 => {
                                    p5.circle(hand.perp * currentSize, -hand.parr * currentSize, handSize * defaultSize);
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
                }, fallback = activeItem.animationManager.fetch("idle")(gamespace.currentUpdate - T.#state.lastSwitch, true)?.hands ?? defaultHandPos, handReference = (() => {
                    const timeSinceLastShot = gamespace.currentUpdate - (T.activeItem?.lastUse ?? 0);
                    if (!activeItem.cancelledAnimation &&
                        timeSinceLastShot < Math.max(itemPrototype.useDelay, itemPrototype?.recoilImpulse?.duration ?? -Infinity)) {
                        activeItem.animationManager.end("idle");
                        return activeItem.animationManager.fetch("using")(timeSinceLastShot, true)?.hands;
                    }
                    else {
                        activeItem.animationManager.end("using");
                        return fallback;
                    }
                })() ?? defaultHandPos;
                return [
                    generate((itemPrototype.dual && activeItem.recoilImpulseParity == -1
                        ? fallback
                        : handReference).leftHand),
                    generate((itemPrototype.dual && activeItem.recoilImpulseParity == 1
                        ? fallback
                        : handReference).rightHand),
                ];
            })();
            function drawItem() {
                p5.push();
                if (activeItem && itemPrototype) {
                    const useChargedImage = activeItem instanceof Gun
                        && itemPrototype instanceof GunPrototype
                        && itemPrototype.fireMode.includes("charge") && activeItem.charged, chargeProps = itemPrototype?.chargeProps, itemReference = T.activeItem.getItemReference(), image = (useChargedImage ? chargeProps?.chargeImage?.image?.asset : void 0) ?? itemPrototype.images.world?.asset, dimensions = (() => {
                        const dim = (useChargedImage ? activeItem.chargedDimensions : void 0)
                            ?? itemReference?.dimensions
                            ?? activeItem.dimensions
                            ?? { width: 0, height: 0 };
                        return {
                            width: dim.width ?? 0,
                            height: dim.height ?? 0
                        };
                    })(), recoilImpulseParity = activeItem.recoilImpulseParity ?? 1, fallbackOffset = itemPrototype?.imageOffset ?? { parr: 0, perp: 0, angle: 0 }, offset = (() => {
                        const o = (useChargedImage ? chargeProps?.chargeImage?.imageOffset : void 0) ?? itemReference?.offset ?? fallbackOffset;
                        return {
                            parr: o.parr,
                            perp: o.perp,
                            angle: "angle" in o ? o.angle : void 0
                        };
                    })(), offsetPerp = offset.perp ?? 0, offsetParr = offset.parr ?? 0, recoilPerp = offsetPerp - fallbackOffset.perp, recoilParr = offsetParr - fallbackOffset.parr;
                    p5.rectMode(p5.CENTER);
                    p5.imageMode(p5.CENTER);
                    const drawAddons = (addons, dual) => {
                        for (const addon of addons ?? []) {
                            if (extractValue(addon.show, activeItem) === false || (dual && addon.dual !== true))
                                continue;
                            const img = pickRandomInArray(addon.images).asset, dimensions = srvsdbx_AssetManagement.determineImageDimensions(img, {
                                width: extractValue(addon.dimensions.width, activeItem),
                                height: extractValue(addon.dimensions.height, activeItem)
                            }), position = {
                                parr: extractValue(addon.position.parr, activeItem),
                                perp: extractValue(addon.position.perp, activeItem)
                            }, recImpPar = dual ? -1 : 1, finalPosition = {
                                parr: (position.parr + +(recoilImpulseParity == recImpPar && addon.recoil !== false) * recoilParr) * currentSize,
                                perp: (position.perp + +(recoilImpulseParity == recImpPar && addon.recoil !== false) * recoilPerp) * currentSize
                            };
                            p5.push();
                            p5.tint(extractValue(addon.tint, activeItem));
                            p5.translate(finalPosition.perp, -finalPosition.parr);
                            p5.rotate(offset.angle ?? 0);
                            p5.image(img, 0, 0, dimensions.width, dimensions.height);
                            gamespace.drawHitboxIfEnabled(p5, "DEFAULT", p5 => {
                                p5.rect(0, 0, dimensions.width, dimensions.height);
                            });
                            p5.pop();
                        }
                    };
                    drawAddons(itemPrototype.addonsBelow, false);
                    if (image) {
                        p5.push();
                        p5.tint(itemPrototype.tint ?? "#FFFFFF");
                        if (itemPrototype instanceof MeleePrototype) {
                            p5.translate((recoilImpulseParity == 1 ? offsetPerp : fallbackOffset.perp) * currentSize, -(recoilImpulseParity == 1 ? offsetParr : fallbackOffset.parr) * currentSize);
                        }
                        else {
                            p5.translate((recoilImpulseParity == 1 ? offsetPerp : fallbackOffset.perp) * defaultSize, -(recoilImpulseParity == 1 ? offsetParr : fallbackOffset.parr) * defaultSize);
                        }
                        p5.rotate(offset.angle ?? 0);
                        p5.image(image, 0, 0, dimensions.width, dimensions.height);
                        gamespace.drawHitboxIfEnabled(p5, "DEFAULT", p5 => {
                            p5.rect(0, 0, dimensions.width, dimensions.height);
                        });
                        if (activeItem instanceof Melee && itemPrototype instanceof MeleePrototype) {
                            const collider = activeItem.getCollider();
                            if (collider) {
                                p5.push();
                                // random component switch is random
                                p5.translate(-(itemPrototype.worldObject?.collider?.offsetParr ?? 0) * defaultSize, (itemPrototype.worldObject?.collider?.offsetPerp ?? 0) * defaultSize);
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
                    if (activeItem instanceof Melee && itemPrototype instanceof MeleePrototype) {
                        // Show the damage closest to the current time, ±100ms
                        const damages = itemPrototype.damages.filter(d => 100 >= Math.abs(gamespace.currentUpdate - activeItem.lastUse - d.time)).map(d => d.areaOfEffect);
                        if (damages.length)
                            for (let i = 0, l = damages.length; i < l; i++) {
                                const damage = damages[i];
                                p5.push();
                                p5.translate(damage.offset.perp * defaultSize, -damage.offset.parr * defaultSize);
                                gamespace.drawHitboxIfEnabled(p5, "AREA_OF_EFFECT", () => {
                                    p5.circle(0, 0, 2 * damage.radius * defaultSize);
                                });
                                p5.pop();
                            }
                    }
                    drawAddons(itemPrototype.addonsAbove, false);
                    if (itemPrototype.dual) {
                        drawAddons(itemPrototype.addonsBelow, true);
                        if (image) {
                            p5.push();
                            p5.tint(itemPrototype.tint ?? "#FFFFFF");
                            p5.translate(-(recoilImpulseParity == -1 ? offsetPerp : fallbackOffset.perp) * defaultSize, -(recoilImpulseParity == -1 ? offsetParr : fallbackOffset.parr) * defaultSize);
                            p5.rotate(offset.angle ?? 0);
                            p5.image(image, 0, 0, dimensions.width, dimensions.height);
                            gamespace.drawHitboxIfEnabled(p5, "DEFAULT", p5 => {
                                p5.rect(0, 0, dimensions.width, dimensions.height);
                            });
                            p5.pop();
                        }
                        drawAddons(itemPrototype.addonsAbove, false);
                    }
                }
                p5.pop();
            }
            function drawHolsteredItems(layer) {
                for (const [_, i] of T.#inventory.items) {
                    if (i instanceof Melee && T.activeItem != i) {
                        const holster = i.prototype.holstered;
                        if (holster?.dimensions.layer != layer)
                            return;
                        p5.push();
                        p5.translate(holster.offset.perp * currentSize, -holster.offset.parr * currentSize);
                        p5.rotate(holster.offset.angle);
                        p5.imageMode(p5.CENTER);
                        p5.rectMode(p5.CENTER);
                        p5.image(holster.image.asset, 0, 0, holster.dimensions.width, holster.dimensions.height);
                        gamespace.drawHitboxIfEnabled(p5, "DEFAULT", () => {
                            p5.rect(0, 0, holster.dimensions.width, holster.dimensions.height);
                        });
                        const collider = i.getCollider();
                        if (collider) {
                            p5.push();
                            // random component switch is random
                            p5.translate(-holster.collider.offsetParr * defaultSize, holster.collider.offsetPerp * defaultSize);
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
                if (itemPrototype instanceof GunPrototype) {
                    const handPos = itemPrototype.handPositions;
                    if (handPos.leftHand.layer == 0) {
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
            let functions, layer = (itemPrototype?.fireMode?.includes?.("charge")
                && activeItem?.charged
                ? itemPrototype?.chargeProps?.chargeImage?.dimensions?.layer
                : void 0)
                ?? itemPrototype?.dimensions?.layer
                ?? itemPrototype?.worldObject?.dimensions.layer
                ?? 0;
            switch (layer) {
                case 0: {
                    functions = [
                        drawHolsteredItems.bind(void 0, 0), drawItemAndHands,
                        drawHolsteredItems.bind(void 0, 1), drawBody,
                        drawRemainingHands, drawHolsteredItems.bind(void 0, 2) // layer 2
                    ];
                    break;
                }
                case 1: {
                    functions = [
                        drawHolsteredItems.bind(void 0, 0),
                        drawHolsteredItems.bind(void 0, 1), drawBody, drawItemAndHands,
                        drawRemainingHands, drawHolsteredItems.bind(void 0, 2) // layer 2
                    ];
                    break;
                }
                case 2: {
                    functions = [
                        drawHolsteredItems.bind(void 0, 0), drawBody,
                        drawHolsteredItems.bind(void 0, 1), drawRemainingHands,
                        drawHolsteredItems.bind(void 0, 2), drawItemAndHands // layer 2
                    ];
                    break;
                }
            }
            for (let i = 0, l = functions.length; i < l; functions[i++]())
                ;
            p5.pop();
        }, position);
        this.#aimPoint = srvsdbx_Geometry.Vector2D.zeroPt();
        gamespace.objects.players.set(this.id, this);
    }
    /**
     * Inverses the weapon slots, putting the first weapon in the second and vice versa
     */
    swapWeapons() {
        const primary = this.inventory.getItem(0, "Main"), secondary = this.inventory.getItem(1, "Main");
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
    setActiveItemIndex(slotId) {
        if (this.#inventory.getItem(slotId, "Main")) {
            const oldIndex = this.#activeItemIndex, oldItem = this.activeItem, activeItemIsGun = () => this.activeItem instanceof Gun;
            if (oldItem instanceof Gun) {
                oldItem.stopCharging();
            }
            oldItem?.stopAnimations?.();
            this.#activeItemIndex = slotId;
            if (slotId != oldIndex) {
                const proto = this.activeItem?.prototype, oldProto = oldItem?.prototype;
                this.#state.effectiveSwitchDelay = proto?.switchDelay ?? 0;
                this.#state.noSlow = true;
                this.#previousActiveIndex = oldIndex;
                if (!activeItemIsGun() || !(oldProto instanceof GunPrototype)) {
                    this.#state.effectiveSwitchDelay = proto instanceof GunPrototype ? 250 : 0;
                }
                else if (gamespace.currentUpdate - this.#state.lastFreeSwitch >= 1000 &&
                    gamespace.currentUpdate - (oldItem?.lastUse ?? 0) < (((!!oldProto?.fireMode?.match?.(/^(auto-)?burst/)
                        && oldProto?.burstProps
                        ? oldProto?.burstProps?.burstDelay
                        : oldProto?.useDelay) ?? Infinity)) &&
                    (oldProto?.deployGroup ?? 0) / (proto?.deployGroup ?? 0) != 1 // Different non - zero deployGroups(0 / 0 gives NaN, and NaN != 1)
                ) {
                    this.#state.effectiveSwitchDelay = 250;
                    this.#state.lastFreeSwitch = gamespace.currentUpdate;
                }
                this.#state.lastSwitch = gamespace.currentUpdate;
                clearTimerIfPresent(this.#timers.firing);
                clearTimerIfPresent(this.#timers.reload);
                this.#state.attacking = this.#state.reloading = this.#timers.firing = this.#timers.reload = false;
                if (activeItemIsGun()) {
                    const item = this.activeItem;
                    if (!item.ammo) {
                        this.#timers.anticipatedReload = setTimeout(() => item.standardReload(), this.#state.effectiveSwitchDelay);
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
    compileVelocities() {
        const keys = [
            "forwards",
            "strafeL",
            "backwards",
            "strafeR"
        ], keyboardRaw = srvsdbx_Geometry.Vector3D.fromPoint3D(keys.reduce((p, c) => srvsdbx_Geometry.Vector3D.plus(p, this.velocityMap.get(c) ?? srvsdbx_Geometry.Vector3D.zeroPt(), true), srvsdbx_Geometry.Vector3D.zeroPt())), keyboard = keyboardRaw.scale(this.determineMoveSpeed() * 0.05 / keyboardRaw.length, true);
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
        const passive = [...this.#inventory.items.values()].reduce((accumulator, item) => accumulator + (item.prototype.moveSpeedPenalties.passive ?? 0), 0), activeItem = this.activeItem, prototype = activeItem?.prototype, isGun = prototype instanceof GunPrototype, isCharging = isGun && (activeItem instanceof Gun) && prototype.fireMode.includes("charge") && (activeItem.isCharging || activeItem.charged), applyFiringPenalty = isGun ?
            !this.#state.noSlow && // Not currently noslow'ing
                (this.#state.firing || // Currently firing
                    gamespace.currentUpdate - (this.activeItem?.lastUse ?? 0) < ((!!prototype.fireMode.match(/^(auto-)?burst/) && prototype.burstProps ? prototype.burstProps.burstDelay : prototype.useDelay) ?? Infinity)
                // Or the delay between now and the last shot is less than the weapon's firing delay
                ) : false;
        const speed = this.#speed.default // Base speed
            + passive //  Passive speed penalties
            + (prototype?.moveSpeedPenalties?.active ?? 0) //   Active speed penalty
            + (applyFiringPenalty ? prototype.moveSpeedPenalties.using : 0) //   Firing speed penalty
            + (isCharging ? prototype.chargeProps?.speedPenalty ?? 0 : 0); // Charging speed penalty
        return (applyFiringPenalty ? speed / 2 : speed - 1) * this.#modifiers.speed.reduced;
    }
    /**
     * Context:
     * To establish a ratio between screen pixels and in-game units, the following method was used:
     *
     * Given a game window with some aspect ratio `a`:
     * - Place the player at (400, 400).
     * - Place the cursor at (0, 0).
     * - Measure how many pixels away from the player the cursor is (axis doesn't matter).
     * - This gives us a ratio: 400 in-game units to some number `p`.
     * - Repeat for various window sizes whose aspect ratios are `a`.
     *
     * Repeat the above for various other aspect ratios.
     *
     * These were then compiled into a Desmos graph, and a curious fact appeared:
     * for each aspect ratio, the relation between the window's width and the amount `p`
     * previously mentioned was linear—minus some outliers.
     *
     * Between aspect ratios, however, the exact ratio changed
     * And thus, we attempt to find a relationship between the aspect ratio and the
     * previously-mentioned ratio. This relation turns out to be exponential, approximated
     * with the function `5.1271399901e^-(1.3697806015a + 2.0079957) + 0.08619961`, where `a` is the aspect ratio.
     *
     * Thus, given an aspect ratio `a`, we may calculate the slope of a line—this slope is the
     * ratio between the window's width and the amount of pixels it takes to travel 400 units.
     * At any given moment, the difference between the mouse's position and that of the player's,
     * when multiplied by the calculated ratio and added to the player's position, will give the
     * point in the game world over which the mouse is hovering.
     *
     *
     * All these findings are summarized (although not annotated) in the following Desmos graph: https://www.desmos.com/calculator/agiykvhwdo
     *
     * **This is literally the worst thing I have ever written.**
     *
     * ~~and now the length of the method's name is the same as the average Java class name~~
     *
     * @returns The ratio between in-game units and screen pixels; it converts from screen pixels to in-game units.
     */
    static #superCringeEmpiricallyDerivedPixelToUnitRatio = 400 / ((5.1271399901 * Math.E ** -(1.3697806015 * (window.innerWidth / window.innerHeight) + 2.0079957) + 0.08619961) * window.innerWidth);
    static get superCringeEmpiricallyDerivedPixelToUnitRatio() { return this.#superCringeEmpiricallyDerivedPixelToUnitRatio; }
    /**
     * Makes the player face the user's mouse cursor, setting its aim point to that of the mouse cursor's (after adjustment)
     */
    lookAtMouse(p5) {
        const scaleFactor = PlayerLike.#superCringeEmpiricallyDerivedPixelToUnitRatio, offsetFromCenter = srvsdbx_Geometry.Vector2D.fromPoint2D({ x: p5.mouseX, y: p5.mouseY })
            .minus({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        this.#aimPoint = srvsdbx_Geometry.Vector2D.plus(this.position, {
            x: scaleFactor * offsetFromCenter.x,
            y: scaleFactor * offsetFromCenter.y
        });
        this.angle = offsetFromCenter.direction + Math.PI / 2;
    }
    /**
     * Makes the player look at a specified point
     * @param pt The point to look at
     */
    lookAtPoint(pt) {
        const diff = srvsdbx_Geometry.Vector2D.fromPoint2D(pt).minus(this.position);
        this.#aimPoint = srvsdbx_Geometry.Vector2D.clone(pt);
        this.angle = diff.direction + Math.PI / 2;
    }
    /**
     * Applies the specified amount of damage to a player
     * @param amount The amount of damage to deal. Negative numbers heal
     */
    applyDamage(amount, source) {
        return this.applyHealing(-amount, source);
    }
    /**
     * Heals the players by the specified amount
     * @param amount The amount of health to heal by. Negative numbers harm
    */
    applyHealing(amount, source) {
        if (!Number.isNaN(amount)) {
            this.#health += amount * this.#modifiers.protection.reduced;
            if (this.#health < 0) {
                this.events.dispatchEvent("death", source);
                source && source.events.dispatchEvent("kill", this);
            }
            return srvsdbx_ErrorHandling.emptyResult();
        }
        else
            return { err: "Received NaN" };
    }
    /**
     * Directly set the player's health
     * @param amount The amount to set the player's health at
     */
    setHealth(amount) {
        if (!Number.isNaN(amount)) {
            this.#health = amount;
            return srvsdbx_ErrorHandling.emptyResult();
        }
        else
            return { err: "Received NaN" };
    }
    /**
     * Identical to the method it overrides, but clears `PlayerLike`-specific fields
     */
    destroy() {
        super.destroy();
        this.#inventory.destroy();
        //@ts-expect-error
        this.#modifiers = this.#hands = this.#inventory = this.#speed = this.#state = this.#statusEffects = this.#timers = void 0;
    }
}
/**
 * A singleton class representing the player
 */
const Player = createSingleton(class Player extends PlayerLike {
    /**
     * A `Map` whose values are shake intensities and whose keys are the intensities' corresponding sources
     */
    #shakeIntensities = new ReducibleMap((acc, cur) => cur > acc ? cur : acc, 0);
    /**
     * Returns the largest shake intensity out of the ones registered. For repeated use, assign this value to a variable to avoid repeatedly running the getter
     */
    get shakeIntensity() { return this.#shakeIntensities.reduced; }
    /**
     * `* It's a constructor. It constructs.`
     * @param position A `Point2D` object dictating this object's starting position
     */
    constructor(position) {
        super(position);
    }
    /**
     * Adds a source of screen shake to the player. Sources farther than 40 surviv units have no effect
     * @param source The name of the source this shake is originating from
     * @param strength The shake's strength
     * @param origin The point from which the shake originates
     */
    addShake(source, strength, origin) {
        const shakeIntensity = this.#determineShakeIntensity(origin, strength);
        if (!shakeIntensity)
            this.removeShake(source);
        else
            this.#shakeIntensities.set(source, shakeIntensity);
    }
    /**
     * Removes a source of screen shake from this player
     * @param source The name of the source to remove
     */
    removeShake(source) {
        this.#shakeIntensities.delete(source);
    }
    /**
     * Determines the final shake intensity given an initial strength and the shake's distance from the player
     * @param origin The point from which the shake originates
     * @param strength The strength of the shake
     */
    #determineShakeIntensity(origin, strength) {
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
/**
 * Represents a player's inventory
 */
class Inventory {
    /**
     * A reference to the PlayerLike that owns this inventory
     */
    #owner;
    /**
     * A reference to the PlayerLike that owns this inventory
     */
    get owner() { return this.#owner; }
    /**
     * A map whose keys are the slot names and whose values are the items stocked there
     */
    #items = new Map;
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
    constructor(owner) {
        this.#owner = owner;
    }
    /**
     * Fetches an item in a given slot corresponding to some category
     * @param slot The slot number
     * @param category The category this item belongs to. (ex: `Main` for firearms, `Medical` for consumables, `Ammo` for ammunition)
     * @returns The item at the specified location, if it exists
     */
    getItem(slot, category) {
        return this.#items.get(`${category}${slot}`);
    }
    /**
     * Sets an item in a given slot corresponding to some category
     * @param slot The slot number
     * @param category The category this item belongs to. (ex: `Main` for firearms, `Medical` for consumables, `Ammo` for ammunition)
     * @param item The item to store at that slot
     * @param reset Whether or not to reset the item that was just passed in
     */
    setItem(slot, category, item, reset) {
        const key = `${category}${slot}`;
        this.#items.set(key, item);
        reset && category == "Main" && item.reset();
        this.#owner.activeItem ?? this.#owner.setActiveItemIndex(slot);
    }
    /**
     * Clears object attributes from this instance
     */
    destroy() {
        // If you don't want an inventory's items to be destroyed when the inventory is destroyed, drop them into the game world beforehand
        for (const [_, i] of this.#items)
            i.destroy();
        // @ts-expect-error
        this.#items = this.#owner = void 0;
    }
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
    #images;
    /**
     * References to this item's associated images
     */
    get images() { return this.#images; }
    /**
     * Information about the movement speed penalties incurred by the use of this item
     */
    #moveSpeedPenalties;
    /**
     * Information about the movement speed penalties incurred by the use of this item
     */
    get moveSpeedPenalties() { return this.#moveSpeedPenalties; }
    constructor(name, displayName, targetVersion, namespace, includePath, images, moveSpeedPenalties) {
        super(name, displayName, targetVersion, namespace, includePath);
        this.#images = images;
        this.#moveSpeedPenalties = moveSpeedPenalties;
    }
}
/**
 * Represents an instance of an item in a user's inventory
 */
class InventoryItem {
    /**
     * A reference to the PlayerLike that owns this item
     */
    #owner;
    /**
     * A reference to the PlayerLike that owns this item
     */
    get owner() { return this.#owner; }
    /**
     * A reference to the prototype this item is based on
     */
    #prototype;
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
    constructor(owner, prototype) {
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
//# sourceMappingURL=player.js.map