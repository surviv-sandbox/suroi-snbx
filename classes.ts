/**
* @deprecated This class hasn't really been touched since… ever. Use of this class may or may not yield expected results.
 */
class obstacle {
    #body: Matter.Body;
    get body() { return this.#body; }

    events = new customEvent();
    image: import("p5").Image;
    width: number;
    height: number;
    tint: string;
    angle: number;
    layer: number;
    offset: { x: number; y: number; angle: number; } = { x: 0, y: 0, angle: 0 };
    imageMode: import("p5").IMAGE_MODE;

    constructor(body: Matter.Body, angle: number, image: import("p5").Image, imageDimensions: { width: number; height: number; }, tint: string, layer: number, offset: { x: number; y: number; angle: number; }, imageMode: import("p5").IMAGE_MODE) {
        this.#body = body;
        this.angle = angle;
        this.image = image;
        this.width = imageDimensions?.width ?? 1;
        this.height = imageDimensions?.height ?? 1;
        this.tint = tint ?? "#FFFFFF";
        this.layer = layer ?? 1;
        this.offset = {
            x: offset?.x,
            y: offset?.y,
            angle: offset?.angle,
        };
        this.imageMode = imageMode ?? "center";
    }
    draw() {
        const b = this.#body,
            p5 = gamespace.p5;

        p5.push();
        p5.imageMode(this.imageMode);
        p5.translate(b.position.x, b.position.y);
        p5.rotate(this.#body.angle + this.offset.angle);
        p5.translate(this.offset.x, this.offset.y);

        if (this.image && squaredDist(b.position, (gamespace.player ? gamespace.player.body.position : { x: gamespace.camera.eyeX, y: gamespace.camera.eyeY })) < gamespace.player.renderDist ** 2) {
            p5.tint(this.tint);
            p5.image(this.image, 0, 0, this.width, this.height);
        }

        p5.noTint();
        p5.pop();

        if (gamespace.settings.visual.debug) {
            p5.fill("#FF000080");
            p5.beginShape();
            for (let i = 0; i < b.vertices.length; i++) {
                p5.vertex(b.vertices[i].x, b.vertices[i].y);
            }
            p5.endShape();
        }
    }
}

class decal {
    image: import("p5").Image;
    width: number;
    height: number;
    tint: colorModes;
    angle: number;
    position: { x: number; y: number; } = { x: 0, y: 0 };

    constructor(angle: number, image: import("p5").Image, dimensions: { width: number; height: number; }, tint: colorModes, position: { x: number; y: number; }) {
        this.angle = angle;
        this.image = image;
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.tint = tint;
        this.position = {
            x: position.x,
            y: position.y
        };

        gamespace.objects.decals.push(this);

        const m = gamespace.settings.visual.maxDecals;

        if (!m) {
            gamespace.objects.decals = [];
        } else {
            while (gamespace.objects.decals.length > m) {
                gamespace.objects.decals.shift();
            }
        }
    }
    draw() {
        const p5 = gamespace.p5;

        p5.push();
        p5.translate(this.position.x, this.position.y);
        p5.rotate(this.angle);

        if (this.image && squaredDist(this.position, (gamespace.player ? gamespace.player.body.position : { x: gamespace.camera.eyeX, y: gamespace.camera.eyeY })) < gamespace.player.renderDist ** 2) {
            p5.tint(toHex(this.tint));
            p5.image(this.image, 0, 0, this.width, this.height);
        }

        p5.pop();
    }
}

class playerLike {
    #body: Matter.Body;
    get body() { return this.#body; }

    aiIgnore: boolean = false;
    angle: number;
    events = new customEvent();
    health: number;
    maxHealth: number;
    name: string;
    inventory: inventory;

    aimTarget: { x: number, y: number; };

    #renderDist: number;
    get renderDist() { return this.#renderDist; }

    state: {
        attacking: boolean,
        eSwitchDelay: number,
        fired: number,
        firing: boolean,
        frozen: boolean,
        hitsGiven: Map<string, { hits: number, amount: number; }>,
        hitsTaken: Map<string, { hits: number, amount: number; }>,
        invuln: boolean,
        lastShot: [number, number, number, number],
        lastFreeSwitch: number,
        lastSwitch: number,
        moving: boolean,
        noSlow: boolean,
        reloading: false | number,
        custom: {
            [key: string]: unknown;
        };
    } = {
            attacking: false,
            eSwitchDelay: 0,
            fired: 0,
            firing: false,
            frozen: false,
            hitsGiven: new Map,
            hitsTaken: new Map,
            invuln: false,
            lastShot: [0, 0, 0, 0],
            lastFreeSwitch: 0,
            lastSwitch: 0,
            moving: false,
            noSlow: false,
            reloading: false,
            custom: {}
        };
    speed = {
        base: 12
    };
    timers: {
        anticipatedReload: false | number,
        firing: false | number,
        reloading: {
            timer: false | number,
            all: boolean;
        };
    } = {
            anticipatedReload: false,
            firing: false,
            reloading: {
                timer: false,
                all: false
            }
        };

    #velocity: number;
    get velocity() { return this.#velocity; }

    #view: number;
    get view() { return this.#view; }
    set view(v) {
        this.#view = v;
        this.#renderDist = getRenderDistFromView(v);
    }

    constructor(body: Matter.Body, angle: number, health: number, loadout: { guns: string[]; activeIndex: number; }, options: { friction: number; restitution: number; inertia?: number; density: number; }, view: number, name: string) {
        this.#body = body;
        this.#body.angle = angle;
        this.angle = angle;
        this.view = view;
        this.name = name;

        this.inventory = new inventory(this);
        this.inventory.slot0 = new gun(gamespace.guns.get(loadout.guns[0])!);
        loadout.guns[1] && (this.inventory.slot1 = new gun(gamespace.guns.get(loadout.guns[1])!));
        this.inventory.activeIndex = Math.round(+clamp(loadout.activeIndex, 0, 1)) as 0 | 1;

        this.health = health;
        this.maxHealth = Math.max(100, health);

        this.events.addEventListener("killed", () => {
            if (this instanceof player) {
                this.events.dispatchEvent("dumpHitInfo");
            }

            const s = this.state;

            s.attacking = false;
            s.eSwitchDelay = 0;
            s.fired = 0;
            s.firing = false;
            s.hitsGiven = new Map;
            s.hitsTaken = new Map;
            s.lastShot = [0, 0, 0, 0];
            s.lastFreeSwitch = 0;
            s.lastSwitch = 0;
            s.moving = false;
            s.noSlow = false;
            s.reloading = false;
        });
    }
    draw() {
        const b = this.#body,
            p5 = gamespace.p5;

        if (!b) { return; }

        if (
            !gamespace.player ||
            b.id == gamespace.player.#body.id ||
            squaredDist(b.position, (gamespace.player ? gamespace.player.body.position : { x: gamespace.camera.eyeX, y: gamespace.camera.eyeY })) < gamespace.player.#renderDist ** 2
        ) {
            p5.push();
            p5.translate(b.position.x, b.position.y);
            p5.rotate(this.angle);

            const ac = this.inventory.activeItem,
                item = ac.proto,
                args: [gun, playerLike] = [ac, this],
                radius = 50,
                du = extractValue(item?.recoilImpulse?.duration ?? Infinity, args),
                d = Math.min(du ?? 0, gamespace.currentUpdate - this.state.lastShot[this.inventory.activeIndex]),
                op = this.state.invuln ? "80" : "";

            let recImpPerp: number,
                recImpParr: number;

            function drawBody() {
                p5.fill(`#F8C574${op}`);
                p5.ellipse(0, 0, 2 * radius, 2 * radius, 70);
            }

            function drawItem() {
                const offPerp = extractValue(item.imageOffset.perp, args),
                    offParr = extractValue(item.imageOffset.parr, args),
                    dimW = extractValue(item.dimensions.width, args),
                    dimH = extractValue(item.dimensions.height, args),
                    interp = (1 - (d / du)),
                    img = extractValue(item.images.held.img, [ac, this]),
                    aspectRatio = img.width / img.height,
                    /*
                        If dimW is "auto", then use dimH and the aspect ratio to get the width
                        If dimH is also "auto", use the image's original width
                        If dimW is not "auto", use it as the width
                        
                        same procedure for height
                    */
                    calcWidth = dimW == "auto"
                        ? dimH == "auto"
                            ? img.width
                            : dimH * aspectRatio
                        : dimW,
                    calcHeight = dimH == "auto"
                        ? dimW == "auto"
                            ? img.height
                            : dimW / aspectRatio
                        : dimH;

                recImpPerp ??= extractValue(item.recoilImpulse.perp, args);
                recImpParr ??= extractValue(item.recoilImpulse.parr, args);

                p5.tint(`${extractValue(item.tint, args) ?? "#FFFFFF"}${op}`);
                p5.image(
                    img,
                    (offPerp + (ac.recoilImpulseParity == 1 ? recImpPerp * interp : 0)),
                    (-offParr - (ac.recoilImpulseParity == 1 ? -recImpParr * interp : 0)),
                    calcWidth,
                    calcHeight
                );

                if (item.dual) {
                    p5.image(
                        img,
                        -(offPerp + (ac.recoilImpulseParity == -1 ? recImpPerp * interp : 0)),
                        (-offParr - (ac.recoilImpulseParity == -1 ? -recImpParr * interp : 0)),
                        calcWidth,
                        calcHeight
                    );
                }
                p5.noTint();
            }

            function drawHands() {
                recImpPerp ??= extractValue(item.recoilImpulse.perp, args);
                recImpParr ??= extractValue(item.recoilImpulse.parr, args);

                for (let i = 0; i <= 1; i++) {
                    p5.fill(`${["#302719", "#F8C574"][i]}${op}`);
                    Object.values(item.hands)
                        .filter(v => v)
                        .forEach((hand, index) => {
                            const perp = extractValue(hand.perp, args),
                                parr = extractValue(hand.parr, args),
                                interp = (1 - (d / (du ?? d)));

                            p5.ellipse(
                                (perp + (!item.dual || ac.recoilImpulseParity == (1 - 2 * index) ? recImpPerp ?? 0 : 0) * interp),
                                (-parr - (!item.dual || ac.recoilImpulseParity == (1 - 2 * index) ? -recImpParr ?? 0 : 0) * interp),
                                i ? 26.25 : 37.5,
                                i ? 26.25 : 37.5,
                                50
                            );
                        });
                }
            }

            [
                [drawItem, drawBody, drawHands], // 0 (default) — item, body, hands
                [drawBody, drawItem, drawHands], // 1 (guns like FAMAS) — body, item, hands
                [drawBody, drawHands, drawItem]  // 2 (guns like M79) — body, hands, item
            ][extractValue(item.dimensions.layer, [ac, this])].forEach(f => f());

            if (gamespace.settings.visual.debug) {
                p5.fill("#F008");
                p5.ellipse(0, 0, 2 * radius, 2 * radius, 70);


                const ls = this.state.lastShot[this.inventory.activeIndex],
                    a = ((gamespace.currentUpdate - ls) > extractValue(item.ballistics.fsaCooldown, args) ? 0 : extractValue(item.accuracy.default, args)) + +(this.state.moving && extractValue(item.accuracy.moving, args)),
                    range = extractValue(item.ballistics.range, [ac, this]),
                    caliber = extractValue(item.caliber, args),
                    s = gamespace.bulletInfo.get(caliber)!,
                    parr = extractValue(item.spawnOffset.parr, args),
                    perp = extractValue(item.spawnOffset.perp, args),
                    spawnOffset = s.spawnVar,
                    start = {
                        x: b.position.x + (50 + parr + extractValue(spawnOffset, [])) * Math.sin(this.angle) + (ac.recoilImpulseParity * perp + extractValue(spawnOffset, [])) * Math.cos(this.angle),
                        y: b.position.y - (50 + parr + extractValue(spawnOffset, [])) * Math.cos(this.angle) + (ac.recoilImpulseParity * perp + extractValue(spawnOffset, [])) * Math.sin(this.angle)
                    };

                p5.rotate(-this.angle);
                p5.translate(start.x - this.#body.position.x, start.y - this.#body.position.y);
                p5.rotate(this.angle);

                p5.fill("#00F2");
                p5.arc(0, 0, 2 * range, 2 * range, (-a - Math.PI) / 2, (a - Math.PI) / 2, "pie");
                p5.fill("#00F2");
                p5.arc(0, 0, 2 * Math.min(range, 5000), 2 * Math.min(range, 5000), (-a - Math.PI) / 2, (a - Math.PI) / 2, "pie");
            }

            p5.pop();
        }
    }
    destroy() {
        this.#body = void 0 as any;
    }
    move(w: boolean, a: boolean, s: boolean, d: boolean) {
        if (!this.#body) { return; }

        if (this.state.frozen) {
            this.state.moving = false;
            return;
        }

        const pb = this.#body,
            m = this.#determineMoveSpeed(),
            f = {
                x: +(a != d) && ((((w != s) ? Math.SQRT1_2 : 1) * [-1, 1][+d] * m) / (gamespace.deltaTime ** 2)),
                y: +(w != s) && ((((a != d) ? Math.SQRT1_2 : 1) * [-1, 1][+s] * m) / (gamespace.deltaTime ** 2))
            };
        this.events.dispatchEvent("move", `${{ [-1]: "N", 0: "", 1: "S" }[Math.sign(f.y)]}${{ [-1]: "W", 0: "", 1: "E" }[Math.sign(f.x)]}`);

        Matter.Body.applyForce(pb, pb.position, f);

        this.state.moving = !!(f.x || f.y);
    }
    switchSlots(index: 0 | 1) {
        const inv = this.inventory,
            i = inv.activeItem,
            ip = i.proto,
            f = gamespace.currentUpdate - this.state.lastFreeSwitch >= 1000,
            deployGroup = extractValue(ip.deployGroup, [i, this]);

        i.stopReload(this);
        this.state.attacking = false;
        this.state.noSlow = true;
        this.state.firing = false;
        this.state.fired = 0;
        this.state.eSwitchDelay = extractValue((this.inventory[`slot${index}`] as gun).proto.switchDelay, [i, this]);

        if (
            f &&
            gamespace.settings.balanceChanges.weapons.general.quickswitch &&
            ((gamespace.currentUpdate - this.state.lastShot[inv.activeIndex]) < extractValue(ip.delay, [i, this])) &&
            (
                gamespace.settings.balanceChanges.weapons.general.quickswitch == 2 ||
                !deployGroup ||
                deployGroup != extractValue((inv[`slot${1 - inv.activeIndex}`] as gun)?.proto.deployGroup, [inv[`slot${1 - inv.activeIndex}`] as gun, this])
            )
        ) {
            this.state.eSwitchDelay = 250;
        }

        if (f) {
            this.state.lastFreeSwitch = gamespace.currentUpdate;
        }

        this.state.lastSwitch = gamespace.currentUpdate;

        this.timers.reloading.timer && clearTimeout(this.timers.reloading.timer);
        this.timers.anticipatedReload && clearTimeout(this.timers.anticipatedReload);
        this.timers.firing && clearTimeout(this.timers.firing);
        this.timers.reloading.timer = false;
        this.timers.anticipatedReload = false;
        this.timers.firing = false;
        inv.activeIndex = index;

        if (!inv.activeItem.ammo) {
            const n = inv.activeItem.proto.name;

            this.timers.anticipatedReload = setTimeout(() => {
                this.timers.anticipatedReload && clearTimeout(this.timers.anticipatedReload);
                inv.activeItem.proto.name == n && inv.activeItem.reload(this);
            }, this.state.eSwitchDelay) as any as number;
        }
    }
    damage(amount: number, source: projectile | explosion) {
        const lethal = amount >= this.health;

        this.health -= amount;

        if (gamespace.settings.bonusFeatures.showDamageNumbers) {
            const makeNew = () => {
                gamespace.objects.damageNumbers.push({
                    amount: amount,
                    createdTimestamp: gamespace.currentUpdate,
                    crit: source.crit,
                    position: { ...this.body.position },
                    lethal,
                    rngOffset: {
                        x: Math.random() * 30 - 15,
                        y: Math.random() * 30 - 15
                    },
                    targetId: this.body.id
                });
            };

            if (gamespace.settings.bonusFeatures.damageNumbersStack) {
                const prev = gamespace.objects.damageNumbers.find(da => da.targetId == this.body.id);
                if (prev) {
                    prev.amount += amount;
                    prev.createdTimestamp = gamespace.currentUpdate;
                    prev.crit = source.crit;
                    prev.position = { ...this.body.position };
                    prev.lethal = lethal;
                } else {
                    makeNew();
                }
            } else {
                makeNew();
            }
        };

        if (this.health <= 0) {
            const data = {
                killer: source.shooter,
                killed: this,
                weapon: source.emitter.name,
                timestamp: gamespace.currentUpdate
            },
                simpl = {
                    crit: source.crit,
                    killer: data.killer.#body?.id == data.killed.#body.id ? "" : data.killer.name,
                    killed: data.killed.name,
                    weapon: data.weapon,
                    timestamp: data.timestamp,
                    id: generateId.next().value
                },
                index = gamespace.objects.players.findIndex(p => p.#body.id == this.#body.id);

            gamespace.kills.push(simpl);
            source.shooter.events.dispatchEvent("kill", data);

            if (!this.events.dispatchEvent("killed", data)) {
                Matter.World.remove(gamespace.world, this.body);

                if (this instanceof player) {
                    gamespace._removePlayer();
                }

                this.destroy();
                gamespace.objects.players.splice(index, 1);
            }

        }
    }
    #determineMoveSpeed() {
        const item = this.inventory.activeItem;
        if (
            (
                !this.state.noSlow ||
                !gamespace.settings.balanceChanges.weapons.general.noslow
            ) &&
            (
                this.state.firing ||
                    gamespace.settings.balanceChanges.weapons.general.noslow
                    ? gamespace.currentUpdate - this.state.lastShot[this.inventory.activeIndex] < (extractValue(!!item.activeFireMode.match(/(auto-)?burst-/) ? item.proto.burstProps.burstDelay : item.proto.delay, [item, this]))
                    : this.state.lastShot.some((s, i) => {
                        if (i > 1) { // No melee / grenades for now
                            return false;
                        }

                        const item = this.inventory[`slot${i}`] as gun;

                        return gamespace.currentUpdate - s < (extractValue(!!item.activeFireMode.match(/(auto-)?burst-/) ? item.proto.burstProps.burstDelay : item.proto.delay, [item, this]));
                    })
            )
        ) {
            return (this.speed.base + extractValue(item.proto.moveSpeedPenalties.firing, [item, this])) / 2;
        } else {
            return this.speed.base + extractValue(item.proto.moveSpeedPenalties.active, [item, this]) - 1;
        }
    }
}

class player extends playerLike {
    #shakeInts: Map<string, number> = new Map;

    get shakeInt() {
        return Math.max(...(this.#shakeInts.size ? this.#shakeInts.values() : [0]));
    }

    constructor(body: Matter.Body, angle: number, health: number, loadout: { guns: string[]; activeIndex: number; }, options: { friction: number; restitution: number; inertia?: number; density: number; }, view: number) {
        super(body, angle, health, loadout, options, view, gamespace.settings.name);

        this.events.addEventListener("dumpHitInfo", () => {
            if (this.state.hitsGiven.size || this.state.hitsTaken.size) {
                gamespace.console.log(`------------\nDamage given:\n  ${Array.from(this.state.hitsGiven.entries()).map(v => `${v[0]}: ${v[1].amount} in ${v[1].hits} ${v[1].hits != 1 ? "hits" : "hit"}`).join("\n  ")}\n- - - - - - \nDamage taken:\n  ${Array.from(this.state.hitsTaken.entries()).map(v => `${v[0]}: ${v[1].amount} in ${v[1].hits} ${v[1].hits != 1 ? "hits" : "hit"}`).join("\n  ")}\n------------`);
            }
        });
    }

    addShake(source: string, origin: { x: number, y: number; }, strength: number) {
        const s = this.#determineShakeInt(origin, strength);

        if (!s) {
            this.#shakeInts.delete(source);
        } else {
            this.#shakeInts.set(source, s);
        }
    }

    #determineShakeInt(origin: { x: number, y: number; }, strength: number) {
        return +clamp((+distance(this.body.position, origin) - 2000) / -1500, 0, 1) * strength;
    }
}

class inventory {
    #parent: playerLike;
    get parent() { return this.#parent; }

    #activeIndex: 0 | 1 = 0;
    get activeIndex() { return this.#activeIndex; }
    set activeIndex(v) {
        if (this[`slot${v}`]) {
            this.#activeIndex = v;
        }
    }

    slot0: gun | void;
    slot1: gun | void;

    get activeItem() { return this[`slot${this.#activeIndex}`] as gun; }

    constructor(parent: playerLike) {
        this.#parent = parent;
    }
}

interface listener {
    event: string,
    callback: (this: customEvent, event: Event, ...args: any[]) => any,
    name: string,
    once?: boolean;
};

class customEvent {
    #listenerCount: number = 0;
    get listenerCount() { return this.#listenerCount; }

    #listeners: listener[] = [];
    get listeners() { return [...this.#listeners.map(l => ({ ...l }))]; }

    on(event: string, callback: listener["callback"]) { // node.js style
        this.#listenerCount++;
        this.#listeners.push({ event: event, name: callback.name, callback: callback, once: false });
        return this;
    }
    once(event: string, callback: listener["callback"]) {
        this.#listenerCount++;
        this.#listeners.push({ event: event, name: callback.name, callback: callback, once: true });
        return this;
    }
    removeListener(event: string, name: string) {
        const l = this.#listeners.reverse().findIndex(l => l.event == event && l.name == name);
        // If multiple callbacks have the same name, the one added last is removed (hence the .reverse())
        if (l >= 0) {
            this.#listeners.splice(l, 1);
            this.#listenerCount--;
        }
        this.#listeners.reverse();
        return l >= 0;
    }
    addEventListener(event: string, callback: listener["callback"], options: { once: boolean; } = { once: false }): this { // DOM style
        return this[`on${"ce".repeat(+options.once)}`](event, callback);
    }
    removeListenersByType(event: string) { this.#listenerCount = (this.#listeners = this.#listeners.filter(l => l.event != event)).length; }
    removeAllListeners() { this.#listenerCount = (this.#listeners = []).length; }
    dispatchEvent(event: string | Event, ...args: Parameters<listener["callback"]>[1][]) {
        if (this.#listenerCount) {
            const name = event instanceof Event ? event.type : event,
                ev = event instanceof Event
                    ? event.cancelable
                        ? event
                        : new Event(event.type, { bubbles: event.bubbles, cancelable: true, composed: event.composed })
                    : new Event(event, { cancelable: true });

            this.#listeners.forEach(l => void (l.event == name && l.callback.call(this, ev, ...args)));

            this.#listeners = this.#listeners.filter(l => l.event != name || !l.once);

            this.#listenerCount = this.#listeners.length;
            return ev.defaultPrevented;
        }
        return false;
    }
}

type bulletInfo = {
    name: string;
    tints: {
        normal: TOrFT<string, [projectile]>;
        saturated: TOrFT<string, [projectile]>;
        chambered: TOrFT<string, [projectile]>;
    };
    alpha: {
        rate: TOrFT<number, [projectile]>;
        min: TOrFT<number, [projectile]>;
        max: TOrFT<number, [projectile]>;
    };
    spawnVar: TOrFT<number, []>;
    imageOffset: {
        parr: TOrFT<number, [projectile]>;
        perp: TOrFT<number, [projectile]>;
    };
    projectileInfo: ({
        type: "explosive";
        explosionType: TOrFT<string, [projectile]>;
        explodeOnContact: TOrFT<boolean, [projectile]>;
        maxDist: TOrFT<number, [projectile]>;
        heightPeak: TOrFT<number, [projectile]>;
    } | {
        type: "bullet";
    }) & {
        img: TOrFT<import("p5").Image, [projectile]>;
        spinVel: TOrFT<number, [projectile]>;
    };
    casing: {
        img: TOrFT<import("p5").Image, [casing]>;
        lifetime: TOrFT<number, [casing]>;
        width: TOrFT<number, [casing]>;
        height: TOrFT<number, [casing]>;
    };
};

type explosionInfo = {
    name: string;
    damage: TOrFT<number, []>;
    obstacleMult: TOrFT<number, []>;
    radii: {
        visual: {
            min: TOrFT<number, []>;
            max: TOrFT<number, []>;
        };
        damage: {
            min: TOrFT<number, []>;
            max: TOrFT<number, []>;
        };
    };
    lifetime: TOrFT<number, []>;
    shakeStrength: TOrFT<number, []>;
    shakeDuration: TOrFT<number, []>;
    color: TOrFT<colorModes, []>;
    decal: {
        img: TOrFT<import("p5").Image, []>;
        width: TOrFT<number, []>;
        height: TOrFT<number, []>;
        tint: TOrFT<colorModes, []>;
    };
    shrapnel: {
        count: TOrFT<number, []>;
        damage: TOrFT<number, []>;
        color: TOrFT<colorModes, []>;
        img: TOrFT<import("p5").Image, []>;
        velocity: TOrFT<number, []>;
        range: TOrFT<number, []>;
        falloff: TOrFT<number, []>;
        tracer: {
            width: TOrFT<number, []>;
            height: TOrFT<number, []>;
        };
    };
};

// If a method's name starts with an underscore, it means that you should only call it if you 1000% know what you're doing and if the wind outside is blowing at 42.9º W (aka almost never)
class gsp {
    static #initialized = false;

    #version: string = "0.9.0";
    get version() { return this.#version; }

    #bots: InstanceType<typeof import("./assets/scripts/std_ai").default>[];
    get bots() { return this.#bots; }

    #bulletInfo: Map<string, bulletInfo> = new Map;
    get bulletInfo() { return this.#bulletInfo; }

    #camera: import("p5").Camera;
    get camera() { return this.#camera; }

    #compatibilityData = (() => {
        return (async () => {
            this.#compatibilityData = JSON.parse((await (await fetch("./compatibility.jsonc")).text()).replace(/\/\*[\w\W]*\*\/\n/, ""));
        })(), {};
    })() as unknown as { [key: string]: { [key: string]: string[]; }; };
    get compatibilityData() { return this.#compatibilityData; }

    #console = new csl;
    get console() { return this.#console; }

    #currentLevel: level;
    get currentLevel() { return this.#currentLevel; }

    #currentUpdate: timestamp;
    get currentUpdate() { return this.#currentUpdate; }

    #created: timestamp;
    get created() { return this.#created; }

    #deltaTime: number;
    get deltaTime() { return this.#deltaTime; }

    #engine: Matter.Engine;
    get engine() { return this.#engine; }

    #events: customEvent = new customEvent;
    get events() { return this.#events; }

    #explosionInfo: Map<string, explosionInfo> = new Map;
    get explosionInfo() { return this.#explosionInfo; };

    #fonts: Map<string, import("p5").Font> = new Map;
    get fonts() { return this.#fonts; }

    #frozen: boolean = false;
    get frozen() { return this.#frozen; }

    #guns: Map<string, gunPrototype> = new Map;
    get guns() { return this.#guns; }

    #images: Map<string, import("p5").Image> = new Map;
    get images() { return this.#images; }

    #keys: { [key: number]: boolean; } = {};
    get keys() { return this.#keys; }

    #kills: {
        crit: boolean,
        killed: string,
        killer: string,
        timestamp: timestamp,
        weapon: string,
        id: number;
    }[] = [];
    get kills() { return this.#kills; }

    #levels: Map<string, level> = new Map;
    get levels() { return this.#levels; }

    #loadedContent: {
        ammos: boolean,
        explosions: boolean,
        guns: boolean,
        levels: boolean;
    } = {
            ammos: false,
            explosions: false,
            guns: false,
            levels: false
        };

    #objects: {
        bullets: (bullet | shrapnel)[],
        casings: casing[],
        damageNumbers: {
            amount: number,
            createdTimestamp: timestamp,
            crit: boolean,
            lethal: boolean,
            position: { x: number, y: number; },
            rngOffset: { x: number, y: number; };
            targetId: number;
        }[],
        decals: decal[],
        explosions: explosion[],
        obstacles: obstacle[],
        players: playerLike[];
    } = {
            bullets: [],
            casings: [],
            damageNumbers: [],
            decals: [],
            explosions: [],
            obstacles: [],
            players: []
        };
    get objects() { return this.#objects; }

    #player: player;
    get player() { return this.#player; }

    #p5: import("p5");
    get p5() { return this.#p5; }

    #ready: boolean = false;
    get ready() { return this.#ready; }

    #settings: {
        visual: {
            graphicsQuality: number,
            debug: boolean,
            monitors: [0 | 1 | 2, 0 | 1 | 2],
            hud: boolean,
            maxDecals: number;
        },
        useNativeMath: boolean,
        name: string,
        bonusFeatures: {
            botDebug: boolean,
            csgoStyleKillfeed: boolean,
            damageNumbersStack: boolean,
            headshotsUseSaturatedTracers: boolean,
            showDamageNumbers: boolean,
            useInterpolatedSaturatedTracers: boolean;
        },
        balanceChanges: {
            weapons: {
                general: {
                    noslow: boolean,
                    quickswitch: 0 | 1 | 2,
                    headshots: boolean,
                    noBuckshotSpawnVar: boolean;
                },
                m79: {
                    grenadeSpin: boolean,
                    moveSpeedPenalty: boolean,
                    spawnCasingOnReload: boolean;
                },
                mp220: {
                    pullBothTriggers: boolean;
                };
            };
        };
    } = {
            visual: {
                graphicsQuality: 1.5,
                debug: false,
                monitors: [0, 0],
                hud: true,
                maxDecals: 250
            },
            useNativeMath: true,
            name: "Player",
            bonusFeatures: {
                botDebug: false,
                csgoStyleKillfeed: false,
                damageNumbersStack: false,
                headshotsUseSaturatedTracers: false,
                showDamageNumbers: false,
                useInterpolatedSaturatedTracers: false
            },
            balanceChanges: {
                weapons: {
                    general: {
                        noslow: true,
                        quickswitch: 1,
                        headshots: true,
                        noBuckshotSpawnVar: false
                    },
                    m79: {
                        grenadeSpin: true,
                        moveSpeedPenalty: true,
                        spawnCasingOnReload: false
                    },
                    mp220: {
                        pullBothTriggers: false
                    }
                }
            }
        };
    get settings() { return this.#settings; }

    #world: Matter.Composite;
    get world() { return this.#world; }

    constructor() {
        if (gsp.#initialized) {
            throw new Error(`The gamespace has already been initialized.`);
        }
        gsp.#initialized = true;
        this.#console.log("Gamespace initialized");

        ["guns", "ammos", "explosions", "levels"].forEach((e, i) => {
            const f = () => {
                this.#console.log(`${e[0].toUpperCase()}${e.slice(1)} loaded`);
                this.#loadedContent[e] = true;
                if (Object.values(this.#loadedContent).every(v => v)) {
                    this.#events.dispatchEvent("ready");
                }
            };

            if (this[["guns", "bulletInfo", "explosionInfo", "levels"][i]].size) {
                f();
            } else {
                this.events.addEventListener(`${e}Loaded`, f, { once: true });
            }
        });
    }

    cleanUp(options: { reloadFontsAndImages?: boolean, clearEvents?: boolean; }) {
        const t = (setTimeout(() => { }) as any as number);
        for (let i = 0; i < t; i++) {
            if (perf._timers.a != i && perf._timers.b != i) {
                clearTimeout(i);
            }
        }

        // Try to coax the GC into clearing the WEBGL rendering context earlier by removing a bunch of its references
        (this.p5 as badCodeDesign)._renderer = void 0;
        this.p5.drawingContext = void 0;

        this.p5?.remove?.();
        this.#bots = [];
        this.#currentUpdate = 0;

        if (this.#frozen) { unfreezeInputs(); }

        this.#currentLevel = void 0 as badCodeDesign;
        this.#created = 0;
        this.#camera = void 0 as badCodeDesign;
        this.#deltaTime = 0;
        this.#engine = void 0 as badCodeDesign;
        options?.clearEvents && (this.events.removeAllListeners());
        this.#frozen = false;
        this.#keys = {};
        this.#kills = [];
        this.#objects = { // Let's pray the GC is good enough to prevent memory leaks, since we're not explicitly destroying any of these objects
            bullets: [],
            casings: [],
            damageNumbers: [],
            decals: [],
            explosions: [],
            obstacles: [],
            players: []
        };
        this.#player = void 0 as badCodeDesign;
        this.#p5 = void 0 as badCodeDesign;
        this.#world = void 0 as badCodeDesign;
        ui.clear();

        if (options?.reloadFontsAndImages) {
            type IHaveNoGoodNameIdeas = ({ src: string; } & ({ font: import("p5").Font; } | { img: import("p5").Image; }));

            for (const a of ["fonts", "images"]) {
                const k = Object.keys(this[a]),
                    f: IHaveNoGoodNameIdeas[] = (Object.values(this[a]) as IHaveNoGoodNameIdeas[]).map((f: { src: string; } & ({ font: import("p5").Font; } | { img: import("p5").Image; })) => ({ src: f.src, [a == "fonts" ? "font" : "img"]: (a == "fonts" ? loadFnt : loadImg)(f.src) })) as any,
                    o: IHaveNoGoodNameIdeas = {} as IHaveNoGoodNameIdeas;

                for (const i in k) { o[k[i]] = f[i]; }
            }
        }
    }
    exitLevel() {
        if (this.#currentLevel) {
            gamespace.console.log(`Exiting level '${gamespace.#currentLevel.name}'`);
            this.cleanUp({ clearEvents: true });
            Array.from(document.body.children).forEach(n => ["debug-div", "console-wrapper"].includes(n.id) || n.remove());
            this.makeMenu(true);
        }
    }
    freeze() {
        if (!this.#frozen) {
            freezeAllInputs();
            this.#frozen = true;

            const t = (setTimeout(() => { }) as any as number);
            for (let i = 0; i < t; i++) {
                if (perf._timers.a != i && perf._timers.b != i) {
                    clearTimeout(i);
                }
            }
        }
    }
    update() {
        if (!gamespace.player) { return; }

        const p5 = this.p5;

        function drawObjects(layer: number) {
            gamespace.objects.obstacles.filter((o: { layer: number; }) => o.layer == layer).forEach((o: { body: Matter.Body; draw: () => void; }) => {
                Matter.Body.setVelocity(o.body, { x: -o.body.force.x, y: o.body.force.y });
                o.draw();
            });
        }

        function playerMove() {
            if (!gamespace.#frozen && gamespace.player) {
                gamespace.player.move(!!gamespace.keys[keyBindings.forward.key], !!gamespace.keys[keyBindings["strafe-left"].key], !!gamespace.keys[keyBindings.backward.key], !!gamespace.keys[keyBindings["strafe-right"].key]);
            }
        }

        const now = Date.now();
        this.#deltaTime = now - this.#currentUpdate;
        this.#currentUpdate = now;
        Matter.Engine.update(this.engine, this.deltaTime);

        if (perf.mode.fps) {
            ++perf._data.frames;
        }

        for (const key in this.keys) {
            if (key.startsWith("mwheel")) {
                this.keys[key] = false;
            }
        }

        p5.clear(void 0 as badCodeDesign, void 0 as badCodeDesign, void 0 as badCodeDesign, void 0 as badCodeDesign);

        const p = this.player,
            b = p.body;

        {
            const x = b && Math.round(b.position.x),
                y = b && Math.round(b.position.y),
                uv = (() => {
                    const x = 2 * Math.random() - 1;

                    return { x, y: (2 * Math.round(Math.random()) - 1) * Math.sqrt(1 - x ** 2) };
                })(),
                s = { x: uv.x * p.shakeInt, y: uv.y * p.shakeInt };


            p5.camera(
                (x ?? this.#camera.eyeX) + s.x,
                (y ?? this.#camera.eyeY) + s.y,
                p.view,
                (x ?? this.#camera.centerX) + s.x,
                (y ?? this.#camera.centerY) + s.y,
                0
            );
        }

        p5.noStroke();
        p5.rectMode(p5.CORNER);
        p5.fill(this.currentLevel.world.color);
        p5.rect(0, 0, this.currentLevel.world.width, this.currentLevel.world.height);
        p5.imageMode(p5.CENTER);

        {
            p5.push();
            p5.rectMode(p5.CENTER);
            p5.fill(this.currentLevel.world.gridColor);
            const { width, height } = this.currentLevel.world;

            for (let x = 1; x < width; x += 780) {
                p5.rect(x, height / 2, 6, height);
            }
            for (let y = 1; y < height; y += 780) {
                p5.rect(width / 2, y, width, 6);
            }
            p5.pop();
        }

        this.objects.decals.forEach(d => {
            d.draw();
        });

        drawObjects(0);

        this.objects.explosions.forEach(e => {
            e.update();
            e.draw();
        });

        this.objects.bullets.forEach(b => {
            b.update();
            b.draw();
        });

        this.objects.players.forEach(player => {
            Matter.Body.setVelocity(player.body, { x: -player.body.force.x, y: -player.body.force.y });
            player.draw();
        });

        this.objects.casings.forEach(c => {
            c.update();
            c.draw();
        });

        drawObjects(1);
        playerMove();

        if (this.settings.bonusFeatures.showDamageNumbers) {
            this.objects.damageNumbers.forEach((d, i) => {
                const t = (this.currentUpdate - d.createdTimestamp),
                    lifetime = 500,
                    pos = {
                        x: d.position.x + d.rngOffset.x,
                        y: d.position.y + d.rngOffset.y
                    };

                p5.push();
                p5.translate(pos.x, pos.y);

                p5.textAlign("center", "center");

                p5.textSize(d.lethal ? 90 : 80);

                if (d.crit) {
                    const c = p5.color(0, 255, 0);
                    c.setAlpha(255 * (1 - t / lifetime));
                    p5.fill(c);

                    p5.text(`${Math.round(100 * d.amount) / 100}${d.lethal ? "!" : ""}`, 10, -10);
                }

                const c = p5.color(255, 0, 0);
                c.setAlpha(255 * (1 - t / lifetime));
                p5.fill(c);

                p5.text(`${Math.round(100 * d.amount) / 100}${d.lethal ? "!" : ""}`, 0, 0);
                p5.pop();

                if (t > lifetime) { this.objects.damageNumbers.splice(i, 1); }
            });
        }

        !this.#frozen && ui.update();

        if (this.player) {
            if ((p5.mouseX != p5.pmouseX || p5.mouseY != p5.pmouseY) && !this.#frozen) {

                p.angle = Math.PI / 2 + Math.atan2(p5.mouseY - p5.height / 2, p5.mouseX - p5.width / 2);
            }

            const s = (1228 * this.player.view) / (665 * p5.width);

            p.aimTarget = {
                x: this.player.body.position.x + (p5.mouseX - p5.width / 2) * s,
                y: this.player.body.position.y + (p5.mouseY - p5.height / 2) * s
            };
        }
    }

    makeMenu(first: boolean) {
        if (memoryManager.getItem("sawPopup", "boolean") || window.confirm("This build of surviv.io sandbox is an alpha build, and may therefore be unstable. No garantees about this build's quality or fitness for any given purpose are given.")) {
            memoryManager.has("sawPopup") || memoryManager.setItem("sawPopup", true);

            const container = makeElement("div", "menu-container"),
                play = makeElement("button", "play", "main-menu-button surviv-purple-button"),
                refreshImports = makeElement("button", "imports", "main-menu-button surviv-blue-button"),
                settings = makeElement("button", "settings", "main-menu-button surviv-purple-button"),
                changelog = makeElement("button", "changelog", "main-menu-button surviv-grey-button"),
                attributions = makeElement("button", "attributions", "main-menu-button surviv-grey-button"),
                csl = makeElement("button", "console", "surviv-grey-button"),
                ver = makeElement("p", "version"),
                title = makeElement("h1", "title"),
                nameField = makeElement("div", "name-field", "main-menu-button surviv-outline-button");

            title.innerHTML = `SURVIV<span style="color: #FFE400">.IO</span> SANDBOX`;
            play.textContent = "Play";
            refreshImports.textContent = "Refresh imports";
            settings.textContent = "Settings";
            changelog.textContent = "Changelog";
            attributions.textContent = "Attributions";
            nameField.textContent = this.settings.name;

            nameField.contentEditable = "true";

            ver.innerHTML = `SURVIV.IO sandbox v${this.version}`;

            {
                const div = this.#console.generateWarningWidget();
                div.id = "csl-marker-cont";

                if (div.children.length) {
                    csl.appendChild(div);
                }
            }

            const timer = setTimeout(() => {
                if (play.disabled) {
                    const d =
                        [
                            { p: "guns", n: "Guns" },
                            { p: "bulletInfo", n: "Ammo types", l: "ammos" },
                            { p: "explosionInfo", n: "Explosions", l: "explosions" },
                            { p: "levels", n: "Levels" }
                        ];

                    if (d.every(v => !!this[v.p].size)) {
                        this.#events.dispatchEvent("ready");

                        this.#console.warn({
                            main: `Late 'ready' event dispatch was caused by missing load event dispatches. The following load event(s) weren't dispatched:`,
                            detail: `${d.filter(v => !this.#loadedContent[v.l ?? v.p]).map(v => `${v.l ?? v.p}Loaded`).join("\n")}`
                        }, true);

                        play.style.pointerEvents = "";
                        play.disabled = false;
                        play.style.opacity = "";
                    } else {
                        this.console.log({
                            main: "Loaded content:",
                            detail: `${d.map(v => `${v.n}: ${this[v.p].size ? "LOADED" : "MISSING"}`).join("\n")}`
                        }, true);
                        this.console.opened || window.alert("It's taking a while for things to load… check the console to see if there are any errors (the gray button below the name field).\nIf all else fails, try refreshing the page.");
                    }

                }
            }, 5000);

            if (!this.#ready) {
                play.disabled = true;
                play.style.opacity = "0.5";
                play.style.pointerEvents = "none";

                this.events.addEventListener("ready", () => {
                    this.#ready = true;
                    clearTimeout(timer);
                    play.style.pointerEvents = "";
                    play.disabled = false;
                    play.style.opacity = "";
                }, { once: true });
            }

            (first ? document.body.appendChild(container) : $("menu-container")!).append(...[
                title,
                play,
                "isElectron" in window ? refreshImports : void 0,
                settings,
                changelog,
                attributions,
                csl,
                ver,
                nameField
            ].filter(v => v!) as HTMLElement[]);

            document.body.style.backgroundColor = "#83AF50";

            csl.addEventListener("click", ev => (!ev.button) && gamespace.console[gamespace.console.opened ? "close" : "open"]());

            nameField.addEventListener("keydown", e => e.key == "Enter" && nameField.blur());

            nameField.addEventListener("blur", () => {
                this.settings.name = nameField.textContent as string;
                memoryManager.setItem("settings", this.settings);
            });

            play.addEventListener("click", e => {
                if (!e.button) {
                    const menu = $("menu-container") as HTMLDivElement,
                        back = makeElement("button", "back", "surviv-blue-button"),
                        can = makeElement("canvas", "levelsel-bg"),
                        ctx = can.getContext("2d") as CanvasRenderingContext2D,
                        r = () => Array.from(menu.children).forEach(e => e.id != "console-wrapper" && e.remove());

                    r();

                    can.width = window.innerWidth;
                    can.height = window.innerHeight;
                    can.style.width = can.style.height = "100%";
                    ctx.fillStyle = "#547033";
                    ctx.fillRect(0, 0, can.width / 10, can.height);
                    ctx.fillRect(0, 0, can.width, can.height / 9);

                    back.textContent = "Back";

                    menu.append(back, can);

                    back.addEventListener("click", e => void (!e.button && (() => {
                        r();
                        this.makeMenu(false);
                    })()));

                    [...this.levels.values()].forEach((l, i) => {
                        const button = makeElement("button", `level-${l.name}`, "level-card"),
                            levelTitle = makeElement("p", `level-${l.name}-title`, "level-title"),
                            desc = makeElement("p", `level-${l.name}-desc`, "level-desc");

                        button.style.left = `${(17 * (i % 5)) + 11}%`;
                        button.style.top = `${(Math.floor(i / 5) * 22) + 100 / 9 + 2}%`;
                        button.style[`background${l.thumbnail ? "Image" : "Color"}`] = l.thumbnail ? `url(${l.thumbnail})` : (l.color || "#333333");

                        levelTitle.textContent = l.name;
                        if (l.description) {
                            desc.textContent = l.description;
                            button.appendChild(desc);
                        }

                        menu.appendChild(button).appendChild(levelTitle);

                        button.addEventListener("click", e => void (!e.button && startGame(l.name)));
                    });
                }
            });

            settings.addEventListener("click", async e => {
                if (!e.button) {
                    clearTimeout(timer);
                    (await import("./settings.js")).makeSettings();
                }
            });

            changelog.addEventListener("click", e => void (!e.button && window.open("./changelog/index.html", "_self")));

            attributions.addEventListener("click", e => void (!e.button && window.open("./attributions/index.html", "_self")));

            function startGame(name: string) {
                document.body.style.backgroundColor = "rgb(20, 20, 20)";
                $("menu-container")!.remove();

                const ob = JSON.parse(localStorage.surviv_sandbox ?? "{}") as JSONObject;

                memoryManager.setItem("levels", (() => {
                    const o: { [key: string]: JSONContent; } = {};

                    gamespace.levels.forEach(l => void (o[`level-${l.name}`] = ob.levels?.[`level-${l.name}`] ?? {}));

                    return o;
                })());

                gamespace.#currentLevel = gamespace.levels.get(name)!;
                gamespace.console.log(`Entering level '${gamespace.#currentLevel.name}'`);
                gamespace.#currentLevel.initializer();
            }

            refreshImports.addEventListener("click", async e => {
                if (!e.button) {
                    play.disabled = settings.disabled = attributions.disabled = changelog.disabled = true;

                    refreshImports.textContent = "Refreshing…";

                    await (window as any).writeImports();

                    refreshImports.textContent = "Refresh imports";

                    play.disabled = settings.disabled = attributions.disabled = changelog.disabled = false;
                }
            });
        }
    }

    _removePlayer() {
        this.#player = void 0 as badCodeDesign;
    }

    _overrideKills(val: typeof gsp.prototype.kills) {
        this.#kills = val;
    }

    _overrideSettings(val: typeof gsp.prototype.settings) {
        this.#settings = val;
    }

    stdLevelSetup(engine: Matter.Engine, world: Matter.World, p5: import("p5"), level: level, levelData: ReturnType<typeof parseLevelData>, AI: typeof import("./assets/scripts/std_ai").default, font?: { font: string | import("p5").Font, size?: number; }) {
        engine.gravity.y = 0;
        gamespace.#engine = engine;
        gamespace.#world = world;
        gamespace.#p5 = p5;

        window.addEventListener("contextmenu", e => e.preventDefault());
        window.addEventListener("resize", () => void p5.resizeCanvas(p5.windowWidth, p5.windowHeight));

        p5.createCanvas(window.innerWidth, window.innerHeight, p5.WEBGL);
        gamespace.#camera = (p5 as badCodeDesign)._elements[0]._curCamera;

        ($("defaultCanvas0") as HTMLCanvasElement).style.display = "none";

        gamespace.#created = gamespace.#currentUpdate = Date.now();

        p5.pixelDensity(gamespace.settings.visual.graphicsQuality);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.imageMode(p5.CENTER);
        p5.angleMode(p5.RADIANS);
        p5.cursor("crosshair");

        if (font) {
            p5.textFont(typeof font.font == "string" ? p5.loadFont(font.font) : font.font, font.size);
        }

        {
            function makeBound(x: number, y: number, w: number, h: number) {
                return new obstacle(Matter.Bodies.rectangle(x, y, w, h, { isStatic: true }), 0, gamespace.images.get("blank") as import("p5").Image, { width: 1, height: 1 }, "#FFF", 1, { x: 0, y: 0, angle: 0 }, p5.CENTER);
            }

            const w = level.world.width,
                h = level.world.height,
                t = 1000;

            levelData.obstacles.concat(
                ...levelData.players as any,
                ...[
                    [
                        -t / 2,
                        h / 2,
                        t,
                        h + t
                    ],
                    [
                        w + t / 2,
                        h / 2,
                        t,
                        h + t
                    ],
                    [
                        w / 2,
                        -t / 2,
                        w + t,
                        t
                    ],
                    [
                        w / 2,
                        h + t / 2,
                        w + t,
                        t
                    ]
                ].map(v => makeBound(...v as [number, number, number, number]))
                // @ts-ignore
            ).forEach(ob => void Matter.World.add(world, ob.body));
        }

        gamespace.objects.players = levelData.players;
        gamespace.objects.obstacles = levelData.obstacles;
        gamespace.#bots = gamespace.objects.players.slice(1).map(p => new AI(p));

        gamespace.#player = gamespace.objects.players[0] as player;
        gamespace.player.angle = Math.PI / 2 + Math.atan2(p5.mouseY - p5.height / 2, p5.mouseX - p5.width / 2);

        ($("defaultCanvas0") as HTMLCanvasElement).style.display = "";
        ui.create();
    }
}

const gamespace = new gsp;

/*

    tsc classes.ts guns.ts main.ts settings.ts perf.ts util.ts input.ts ui.ts memory.ts console.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration --module esnext --moduleResolution node

    tsc assets/levels/level0/level.ts classes.d.ts guns.d.ts main.d.ts settings.d.ts perf.d.ts util.d.ts input.d.ts ui.d.ts memory.d.ts console.d.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration --module esnext --moduleResolution node

    tsc assets/levels/level1/level.ts classes.d.ts guns.d.ts main.d.ts settings.d.ts perf.d.ts util.d.ts input.d.ts ui.d.ts memory.d.ts console.d.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration --module esnext --moduleResolution node

    tsc assets/levels/level2/level.ts classes.d.ts guns.d.ts main.d.ts settings.d.ts perf.d.ts util.d.ts input.d.ts ui.d.ts memory.d.ts console.d.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration --module esnext --moduleResolution node

    tsc assets/scripts/std_ai.ts classes.d.ts guns.d.ts main.d.ts settings.d.ts perf.d.ts util.d.ts input.d.ts ui.d.ts memory.d.ts console.d.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration --module esnext --moduleResolution node

*/