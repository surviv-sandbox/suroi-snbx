/**
 * @deprecated This class hasn't really been touched since… ever. Use of this class may or may not yield expected results.
 */
class obstacle {
    #body;
    get body() { return this.#body; }
    events = new customEvent();
    image;
    width;
    height;
    tint;
    angle;
    layer;
    offset = { x: 0, y: 0, angle: 0 };
    imageMode;
    constructor(body, angle, image, imageDimensions, tint, layer, offset, imageMode) {
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
        const b = this.#body, p5 = gamespace.p5;
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
    image;
    width;
    height;
    tint;
    angle;
    position = { x: 0, y: 0 };
    constructor(angle, image, dimensions, tint, position) {
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
        }
        else {
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
            p5.tint(this.tint);
            p5.image(this.image, 0, 0, this.width, this.height);
        }
        p5.pop();
    }
}
class playerLike {
    #body;
    get body() { return this.#body; }
    aiIgnore = false;
    angle;
    events = new customEvent();
    health;
    maxHealth;
    name;
    inventory;
    options;
    #renderDist;
    get renderDist() { return this.#renderDist; }
    state = {
        attacking: false,
        eSwitchDelay: 0,
        fired: 0,
        firing: false,
        frozen: false,
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
    timers = {
        anticipatedReload: false,
        firing: false,
        reloading: {
            timer: false,
            all: false
        }
    };
    #view;
    get view() { return this.#view; }
    set view(v) {
        this.#view = v;
        this.#renderDist = getRenderDistFromView(v);
    }
    constructor(body, angle, health, loadout, options, view, name) {
        this.#body = body;
        this.#body.angle = angle;
        this.angle = angle;
        this.options = options;
        this.view = view;
        this.name = name;
        this.inventory = new inventory(this);
        this.inventory.slot0 = new gun(gamespace.guns.find(g => g.name == loadout.guns[0]));
        loadout.guns[1] && (this.inventory.slot1 = new gun(gamespace.guns.find(g => g.name == loadout.guns[1])));
        this.inventory.activeIndex = Math.round(+clamp(loadout.activeIndex, 0, 1));
        this.health = health;
        this.maxHealth = Math.max(100, health);
    }
    draw() {
        const b = this.#body, p5 = gamespace.p5;
        if (!b) {
            return;
        }
        if (!gamespace.player ||
            b.id == gamespace.player.#body.id ||
            squaredDist(b.position, (gamespace.player ? gamespace.player.body.position : { x: gamespace.camera.eyeX, y: gamespace.camera.eyeY })) < gamespace.player.#renderDist ** 2) {
            p5.push();
            p5.translate(b.position.x, b.position.y);
            p5.rotate(this.angle);
            const ac = this.inventory.activeItem, item = ac.proto, radius = 50, d = Math.min(item?.recoilImpulse?.duration ?? 0, gamespace.lastUpdate - this.state.lastShot[this.inventory.activeIndex]), op = this.state.invuln ? "80" : "";
            function drawBody() {
                p5.fill(`#F8C574${op}`);
                p5.ellipse(0, 0, 2 * radius, 2 * radius, 70);
            }
            function drawItem() {
                p5.tint(`${item.tint ?? "#FFFFFF"}${op}`);
                p5.image(item.images.held.img, (item.imageOffset.x + (ac.recoilImpulseParity == 1 ? item.recoilImpulse.x * (1 - (d / item.recoilImpulse.duration)) : 0)) * radius, (-item.imageOffset.y - (ac.recoilImpulseParity == 1 ? -item.recoilImpulse.y * (1 - (d / item.recoilImpulse.duration)) : 0)) * radius, item.dimensions.width * radius, item.dimensions.height * radius);
                if (item.dual) {
                    p5.image(item.images.held.img, -(item.imageOffset.x + (ac.recoilImpulseParity == -1 ? item.recoilImpulse.x * (1 - (d / item.recoilImpulse.duration)) : 0)) * radius, (-item.imageOffset.y - (ac.recoilImpulseParity == -1 ? -item.recoilImpulse.y * (1 - (d / item.recoilImpulse.duration)) : 0)) * radius, item.dimensions.width * radius, item.dimensions.height * radius);
                }
                p5.noTint();
            }
            function drawHands() {
                for (let i = 0; i <= 1; i++) {
                    p5.fill(`${["#302719", "#F8C574"][i]}${op}`);
                    Object.values(item.hands).filter(v => v).forEach((hand, index) => {
                        p5.ellipse((hand.x + (!item.dual || ac.recoilImpulseParity == (1 - 2 * index) ? item?.recoilImpulse?.x ?? 0 : 0) * (1 - (d / (item?.recoilImpulse?.duration ?? d)))) * radius, (-hand.y - (!item.dual || ac.recoilImpulseParity == (1 - 2 * index) ? -item?.recoilImpulse?.y ?? 0 : 0) * (1 - (d / (item?.recoilImpulse?.duration ?? d)))) * radius, radius * (i ? 0.525 : 0.75), radius * (i ? 0.525 : 0.75), 50);
                    });
                }
            }
            [
                [drawItem, drawBody, drawHands],
                [drawBody, drawItem, drawHands],
                [drawBody, drawHands, drawItem] // 2 (guns like M79) — body, hands, item
            ][item.dimensions.layer].forEach(f => f());
            if (gamespace.settings.visual.debug) {
                p5.fill("#F008");
                p5.ellipse(0, 0, 2 * radius, 2 * radius, 70);
            }
            p5.pop();
        }
    }
    destroy() {
        this.#body = void 0;
    }
    move(w, a, s, d) {
        if (!this.#body) {
            return;
        }
        if (this.state.frozen) {
            this.state.moving = false;
            return;
        }
        const pb = this.#body, m = this.#determineMoveSpeed(), f = {
            x: +(a != d) && ((((w != s) ? Math.SQRT1_2 : 1) * [-1, 1][+d] * m) / (gamespace.deltaTime ** 2)),
            y: +(w != s) && ((((a != d) ? Math.SQRT1_2 : 1) * [-1, 1][+s] * m) / (gamespace.deltaTime ** 2))
        };
        this.events.dispatchEvent("move", `${{ [-1]: "N", 0: "", 1: "S" }[Math.sign(f.y)]}${{ [-1]: "W", 0: "", 1: "E" }[Math.sign(f.x)]}`);
        Matter.Body.applyForce(pb, pb.position, f);
        this.state.moving = !!(f.x || f.y);
    }
    switchSlots(index) {
        const i = this.inventory, ip = i.activeItem.proto, f = gamespace._currentUpdate - this.state.lastFreeSwitch >= 1000;
        i.activeItem.stopReload(this);
        this.state.attacking = false;
        this.state.noSlow = true;
        this.state.firing = false;
        this.state.fired = 0;
        this.state.eSwitchDelay = this.inventory[`slot${index}`].proto.switchDelay;
        if (f &&
            gamespace.settings.balanceChanges.weapons.general.quickswitch &&
            ((gamespace._currentUpdate - this.state.lastShot[i.activeIndex]) < ip.delay) &&
            (!ip.deployGroup || ip.deployGroup != i[`slot${1 - i.activeIndex}`]?.proto.deployGroup)) {
            this.state.eSwitchDelay = 250;
        }
        if (f) {
            this.state.lastFreeSwitch = gamespace._currentUpdate;
        }
        this.state.lastSwitch = gamespace._currentUpdate;
        this.timers.reloading.timer && clearTimeout(this.timers.reloading.timer);
        this.timers.anticipatedReload && clearTimeout(this.timers.anticipatedReload);
        this.timers.firing && clearTimeout(this.timers.firing);
        this.timers.reloading.timer = false;
        this.timers.anticipatedReload = false;
        this.timers.firing = false;
        i.activeIndex = index;
        if (!i.activeItem.ammo) {
            this.timers.anticipatedReload && clearTimeout(this.timers.anticipatedReload);
            const n = i.activeItem.proto.name;
            this.timers.anticipatedReload = setTimeout(() => {
                i.activeItem.proto.name == n && i.activeItem.reload(this);
            }, this.state.eSwitchDelay);
        }
    }
    damage(amount, source) {
        const lethal = amount >= this.health;
        this.health -= amount;
        if (gamespace.settings.bonusFeatures.showDamageNumbers) {
            const makeNew = () => {
                gamespace.objects.damageNumbers.push({
                    amount: amount,
                    createdTimestamp: gamespace._currentUpdate,
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
                    prev.createdTimestamp = gamespace._currentUpdate;
                    prev.crit = source.crit;
                    prev.position = { ...this.body.position };
                    prev.lethal = lethal;
                }
                else {
                    makeNew();
                }
            }
            else {
                makeNew();
            }
        }
        ;
        if (this.health <= 0) {
            const data = {
                killer: source.shooter,
                killed: this,
                weapon: source.emitter.name,
                timestamp: gamespace._currentUpdate
            }, simpl = {
                crit: source.crit,
                killer: data.killer.#body?.id == data.killed.#body.id ? "" : data.killer.name,
                killed: data.killed.name,
                weapon: data.weapon,
                timestamp: data.timestamp,
                id: generateId.next().value
            }, index = gamespace.objects.players.findIndex(p => p.#body.id == this.#body.id);
            gamespace.kills.push(simpl);
            source.shooter.events.dispatchEvent("kill", data);
            if (!this.events.dispatchEvent("killed", data)) {
                Matter.World.remove(gamespace.world, this.body);
                if (this instanceof player) {
                    gamespace.player = void 0;
                }
                this.destroy();
                gamespace.objects.players.splice(index, 1);
            }
        }
    }
    #determineMoveSpeed() {
        if ((!this.state.noSlow ||
            !gamespace.settings.balanceChanges.weapons.general.noslow) &&
            (this.state.firing ||
                gamespace.settings.balanceChanges.weapons.general.noslow
                ? gamespace._currentUpdate - this.state.lastShot[this.inventory.activeIndex] < (!!this.inventory.activeItem.activeFireMode.match(/(auto-)?burst-/) ? this.inventory.activeItem.proto.burstProps.burstDelay : this.inventory.activeItem.proto.delay)
                : this.state.lastShot.some((s, i) => {
                    if (i > 1) { // No melee / grenades for now
                        return false;
                    }
                    const item = this.inventory[`slot${i}`];
                    return gamespace._currentUpdate - s < (!!item.activeFireMode.match(/(auto-)?burst-/) ? item.proto.burstProps.burstDelay : item.proto.delay);
                }))) {
            return (this.speed.base + this.inventory.activeItem.proto.moveSpeedPenalties.firing) / 2;
        }
        else {
            return this.speed.base + this.inventory.activeItem.proto.moveSpeedPenalties.active - 1;
        }
    }
}
class player extends playerLike {
    constructor(body, angle, health, loadout, options, view) {
        super(body, angle, health, loadout, options, view, gamespace.settings.name);
    }
}
class inventory {
    #parent;
    get parent() { return this.#parent; }
    #activeIndex = 0;
    get activeIndex() { return this.#activeIndex; }
    set activeIndex(v) {
        if (this[`slot${v}`]) {
            this.#activeIndex = v;
        }
    }
    slot0;
    slot1;
    get activeItem() { return this[`slot${this.#activeIndex}`]; }
    constructor(parent) {
        this.#parent = parent;
    }
}
;
class customEvent {
    #listenerCount = 0;
    get listenerCount() { return this.#listenerCount; }
    #listeners = [];
    get listeners() { return [...this.#listeners.map(l => ({ ...l }))]; }
    on(event, callback) {
        this.#listenerCount++;
        this.#listeners.push({ event: event, name: callback.name, callback: callback, once: false });
        return this;
    }
    once(event, callback) {
        this.#listenerCount++;
        this.#listeners.push({ event: event, name: callback.name, callback: callback, once: true });
        return this;
    }
    removeListener(event, name) {
        const l = this.#listeners.reverse().findIndex(l => l.event == event && l.name == name);
        // If multiple callbacks have the same name, the one added last is removed (hence the .reverse())
        if (l >= 0) {
            this.#listeners.splice(l, 1);
            this.#listenerCount--;
        }
        this.#listeners.reverse();
        return l >= 0;
    }
    addEventListener(event, callback, options = { once: false }) {
        return this[`on${"ce".repeat(+options.once)}`](event, callback);
    }
    removeListenersByType(event) { this.#listenerCount = (this.#listeners = this.#listeners.filter(l => l.event != event)).length; }
    removeAllListeners() { this.#listenerCount = (this.#listeners = []).length; }
    dispatchEvent(event, ...args) {
        if (this.#listenerCount) {
            const name = event instanceof Event ? event.type : event, ev = event instanceof Event
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
const gamespace = {
    get version() { return "0.7.0"; },
    bots: [],
    bulletInfo: {},
    camera: void 0,
    created: 0,
    cleanUp(options) {
        const t = setTimeout(() => { });
        for (let i = 0; i < t; i++) {
            if (perf._timers.a != i && perf._timers.b != i) {
                clearTimeout(i);
            }
        }
        // Try to coax the GC into clearing the WEBGL rendering context earlier by removing a bunch of its references
        gamespace.p5._renderer = void 0;
        gamespace.p5.drawingContext = void 0;
        gamespace.p5?.remove?.();
        gamespace.bots = [];
        gamespace._currentUpdate = 0;
        if (gamespace._frozen) {
            unfreezeInputs();
        }
        (async () => { gamespace._currentLevel && (gamespace._currentLevel.levelData = parseLevelData(await (await fetch(gamespace._currentLevel.jsonPath)).json())); })();
        gamespace._currentLevel = void 0;
        gamespace.created = 0;
        gamespace.camera = void 0;
        gamespace.deltaTime = 0;
        gamespace.engine = void 0;
        options?.clearEvents && (gamespace.events.removeAllListeners());
        gamespace._frozen = false;
        gamespace.keys = {};
        gamespace.kills = [];
        gamespace.lastUpdate = 0;
        gamespace.objects = {
            bullets: [],
            casings: [],
            damageNumbers: [],
            decals: [],
            explosions: [],
            obstacles: [],
            players: []
        };
        gamespace.player = void 0;
        gamespace.p5 = void 0;
        gamespace.world = void 0;
        ui.clear();
        options?.reloadJSONBasedFields && loadJSONBasedGamespaceFields();
        if (options?.reloadFontsAndImages) {
            for (const a of ["fonts", "images"]) {
                const k = Object.keys(gamespace[a]), f = Object.values(gamespace[a]).map((f) => ({ src: f.src, [a == "fonts" ? "font" : "img"]: (a == "fonts" ? loadFnt : loadImg)(f.src) })), o = {};
                for (const i in k) {
                    o[k[i]] = f[i];
                }
            }
        }
    },
    _currentLevel: void 0,
    _currentUpdate: 0,
    get currentUpdate() { return gamespace._currentUpdate; },
    set currentUpdate(v) {
        [gamespace.lastUpdate, gamespace._currentUpdate, gamespace.deltaTime] = [gamespace._currentUpdate, v, v - gamespace._currentUpdate];
    },
    deltaTime: 0,
    engine: void 0,
    events: new customEvent(),
    explosionInfo: {},
    exitLevel() {
        if (gamespace._currentLevel) {
            gamespace.cleanUp({ clearEvents: true });
            Array.from(document.body.children).forEach(n => n.id != "debug-div" && n.remove());
            makeMenu(true);
        }
    },
    fonts: {},
    freeze() {
        if (!gamespace._frozen) {
            freezeAllInputs();
            gamespace._frozen = true;
            const t = setTimeout(() => { });
            for (let i = 0; i < t; i++) {
                if (perf._timers.a != i && perf._timers.b != i) {
                    clearTimeout(i);
                }
            }
        }
    },
    _frozen: false,
    get frozen() { return gamespace._frozen; },
    guns: [],
    images: {},
    keys: {},
    kills: [],
    lastUpdate: 0,
    levels: [],
    objects: {
        bullets: [],
        casings: [],
        decals: [],
        damageNumbers: [],
        explosions: [],
        obstacles: [],
        players: [],
    },
    _oldStats: {
        ammo: {},
        explosions: {},
        guns: []
    },
    player: void 0,
    p5: void 0,
    settings: {
        visual: {
            graphicsQuality: 1,
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
            damageNumbersStack: true,
            headshotsUseSaturatedTracers: true,
            showDamageNumbers: true,
            useInterpolatedSaturatedTracers: true
        },
        balanceChanges: {
            weapons: {
                general: {
                    noslow: true,
                    quickswitch: true,
                    headshots: true
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
        },
    },
    update() {
        const p5 = gamespace.p5;
        function drawObjects(layer) {
            gamespace.objects.obstacles.filter(o => o.layer == layer).forEach(o => {
                Matter.Body.setVelocity(o.body, { x: -o.body.force.x, y: o.body.force.y });
                o.draw();
            });
        }
        function playerMove() {
            if (!gamespace._frozen && gamespace.player) {
                gamespace.player.move(!!gamespace.keys[keyBindings.forward.key], !!gamespace.keys[keyBindings["strafe-left"].key], !!gamespace.keys[keyBindings.backward.key], !!gamespace.keys[keyBindings["strafe-right"].key]);
            }
        }
        const now = Date.now();
        gamespace.currentUpdate = now;
        Matter.Engine.update(gamespace.engine, gamespace.deltaTime);
        if (perf.mode.fps) {
            ++perf._data.frames;
        }
        for (const key in gamespace.keys) {
            if (key.startsWith("mwheel")) {
                gamespace.keys[key] = false;
            }
        }
        p5.clear(void 0, void 0, void 0, void 0);
        const p = gamespace.player, b = p.body;
        p5.camera(b ? Math.round(b.position.x) : gamespace.camera.eyeX, b ? Math.round(b.position.y) : gamespace.camera.eyeY, p.view, b ? Math.round(b.position.x) : gamespace.camera.centerX, b ? Math.round(b.position.y) : gamespace.camera.centerY, 0);
        p5.noStroke();
        p5.rectMode(p5.CORNER);
        p5.fill(gamespace._currentLevel.world.color);
        p5.rect(0, 0, gamespace._currentLevel.world.width, gamespace._currentLevel.world.height);
        p5.imageMode(p5.CENTER);
        {
            p5.push();
            p5.rectMode(p5.CENTER);
            p5.fill(gamespace._currentLevel.world.gridColor);
            const { width, height } = gamespace._currentLevel.world;
            for (let x = 1; x < width; x += 780) {
                p5.rect(x, height / 2, 6, height);
            }
            for (let y = 1; y < height; y += 780) {
                p5.rect(width / 2, y, width, 6);
            }
            p5.pop();
        }
        gamespace.objects.decals.forEach(d => {
            d.draw();
        });
        drawObjects(0);
        gamespace.objects.explosions.forEach(e => {
            e.update();
            e.draw();
        });
        gamespace.objects.bullets.forEach(b => {
            b.update();
            b.draw();
        });
        gamespace.objects.players.forEach(player => {
            Matter.Body.setVelocity(player.body, { x: -player.body.force.x, y: -player.body.force.y });
            player.draw();
        });
        gamespace.objects.casings.forEach(c => {
            c.update();
            c.draw();
        });
        drawObjects(1);
        playerMove();
        if (gamespace.settings.bonusFeatures.showDamageNumbers) {
            gamespace.objects.damageNumbers.forEach((d, i) => {
                const t = (gamespace._currentUpdate - d.createdTimestamp), lifetime = 500, pos = {
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
                if (t > lifetime) {
                    gamespace.objects.damageNumbers.splice(i, 1);
                }
            });
        }
        !gamespace._frozen && ui.update();
        if ((p5.mouseX != p5.pmouseX || p5.mouseY != p5.pmouseY) && !gamespace._frozen) {
            p.angle = Math.PI / 2 + Math.atan2(p5.mouseY - p5.height / 2, p5.mouseX - p5.width / 2);
        }
    },
    world: void 0
};
loadJSONBasedGamespaceFields();
/*

    tsc classes.ts guns.ts main.ts settings.ts perf.ts util.ts input.ts ui.ts memory.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration --module esnext --moduleResolution node

    tsc assets/levels/level0/level.ts classes.d.ts guns.d.ts main.d.ts settings.d.ts perf.d.ts util.d.ts input.d.ts ui.d.ts memory.d.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration --module esnext --moduleResolution node

    tsc assets/levels/level1/level.ts classes.d.ts guns.d.ts main.d.ts settings.d.ts perf.d.ts util.d.ts input.d.ts ui.d.ts memory.d.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration --module esnext --moduleResolution node

    tsc assets/levels/level2/level.ts classes.d.ts guns.d.ts main.d.ts settings.d.ts perf.d.ts util.d.ts input.d.ts ui.d.ts memory.d.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration --module esnext --moduleResolution node

    tsc assets/scripts/std_ai.ts classes.d.ts guns.d.ts main.d.ts settings.d.ts perf.d.ts util.d.ts input.d.ts ui.d.ts memory.d.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration --module esnext --moduleResolution node

    tsc assets/scripts/std_level_setup.ts classes.d.ts guns.d.ts main.d.ts settings.d.ts perf.d.ts util.d.ts input.d.ts ui.d.ts memory.d.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration --module esnext --moduleResolution node

*/ 
