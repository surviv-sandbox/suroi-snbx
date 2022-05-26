class obstacle {
    #body;
    get body() { return this.#body; }
    image;
    imageWidth;
    imageHeight;
    tint;
    angle;
    layer;
    offset = { x: 0, y: 0, angle: 0 };
    imageMode;
    constructor(body, angle, image, imageDimensions, tint, layer, offset, imageMode) {
        this.#body = body;
        this.angle = angle;
        this.image = image;
        this.imageWidth = imageDimensions?.width ?? 1;
        this.imageHeight = imageDimensions?.height ?? 1;
        this.tint = tint ?? "#FFFFFF";
        this.layer = layer ?? 1;
        this.offset = {
            x: offset?.x,
            y: offset?.y,
            angle: offset?.angle,
        };
        this.imageMode = imageMode ?? "center";
    }
    draw(p5) {
        const b = this.#body;
        p5.push();
        p5.imageMode(this.imageMode);
        p5.translate(b.position.x, b.position.y);
        p5.rotate(this.#body.angle + this.offset.angle);
        p5.translate(this.offset.x, this.offset.y);
        if (this.image && sqauredDist(b.position, gamespace.player.body.position) < (p5.width + p5.height) ** 2) {
            p5.tint(this.tint);
            p5.image(this.image, 0, 0, this.imageWidth, this.imageHeight);
        }
        p5.noTint();
        p5.pop();
        if (gamespace.settings.debug) {
            p5.fill("#FF000080");
            p5.beginShape();
            for (let i = 0; i < b.vertices.length; i++) {
                p5.vertex(b.vertices[i].x, b.vertices[i].y);
            }
            p5.endShape();
        }
    }
}
class playerLike {
    #body;
    get body() { return this.#body; }
    angle;
    health;
    maxHealth;
    inventory;
    options;
    state = {
        attacking: false,
        eSwitchDelay: 0,
        fired: 0,
        firing: false,
        lastShot: [0, 0, 0, 0],
        lastFreeSwitch: 0,
        lastSwitch: 0,
        moving: false,
        noSlow: false,
        reloading: false,
        custom: {}
    };
    timers = {
        reloading: {
            timer: false,
            all: false
        }
    };
    speed = {
        base: 12
    };
    view;
    constructor(body, angle, health, loadout, options, view) {
        this.#body = body;
        this.#body.angle = angle;
        this.angle = angle;
        this.options = options;
        this.view = view;
        this.inventory = new inventory(this);
        this.inventory.slot0 = new gun(gamespace.guns.find(g => g.name == loadout.guns[0]));
        loadout.guns[1] && (this.inventory.slot1 = new gun(gamespace.guns.find(g => g.name == loadout.guns[1])));
        this.inventory.activeIndex = Math.round(+clamp(loadout.activeIndex, 0, 1));
        this.health = health;
        this.maxHealth = Math.max(100, health);
    }
    draw(p5) {
        const b = this.#body;
        p5.push();
        p5.translate(b.position.x, b.position.y);
        p5.rotate(this.angle);
        const ac = this.inventory.activeItem, item = ac.proto, radius = 50, d = Math.min(item?.recoilImpulse?.duration ?? 0, gamespace.lastUpdate - this.state.lastShot[this.inventory.activeIndex]);
        if (item) {
            p5.tint(item.tint ?? "#FFFFFF");
            p5.image(item.images.held, (item.offset.x + (ac.recoilImpulseParity == 1 ? item.recoilImpulse.x * (1 - (d / item.recoilImpulse.duration)) : 0)) * radius, (item.offset.y - (ac.recoilImpulseParity == 1 ? item.recoilImpulse.y * (1 - (d / item.recoilImpulse.duration)) : 0)) * radius, item.width * radius, item.height * radius);
            if (item.dual) {
                p5.image(item.images.held, -(item.offset.x + (ac.recoilImpulseParity == -1 ? item.recoilImpulse.x * (1 - (d / item.recoilImpulse.duration)) : 0)) * radius, (item.offset.y - (ac.recoilImpulseParity == -1 ? item.recoilImpulse.y * (1 - (d / item.recoilImpulse.duration)) : 0)) * radius, item.width * radius, item.height * radius);
            }
            p5.tint("#FFFFFF");
        }
        p5.fill("#F8C574");
        p5.ellipse(0, 0, 2 * radius, 2 * radius, 70);
        for (let i = 0; i <= 1; i++) {
            p5.fill(["#000", "#F8C574"][i]);
            Object.values(item.hands).filter(v => v).forEach((hand, index) => {
                p5.ellipse((hand.x + (!item.dual || ac.recoilImpulseParity == (1 - 2 * index) ? item?.recoilImpulse?.x ?? 0 : 0) * (1 - (d / (item?.recoilImpulse?.duration ?? d)))) * radius, (hand.y - (!item.dual || ac.recoilImpulseParity == (1 - 2 * index) ? item?.recoilImpulse?.y ?? 0 : 0) * (1 - (d / (item?.recoilImpulse?.duration ?? d)))) * radius, radius * (i ? 0.525 : 0.75), radius * (i ? 0.525 : 0.75), 50);
            });
        }
        p5.rotate(-this.angle);
        p5.pop();
    }
    destroy() {
        if (this.#body.id == gamespace.player.#body.id) { // Temporary hack to keep distance-based rendering from breaking when the player dies
            this.#body = { position: { ...this.#body.position } };
        }
        else {
            this.#body = void 0;
        }
    }
    move(w, a, s, d) {
        const pb = this.body, m = this.#determineMoveSpeed(), f = {
            x: +(a != d) && ((((w != s) ? Math.SQRT1_2 : 1) * [-1, 1][+d] * m) / (gamespace.deltaTime ** 2)),
            y: +(w != s) && ((((a != d) ? Math.SQRT1_2 : 1) * [-1, 1][+s] * m) / (gamespace.deltaTime ** 2))
        };
        Matter.Body.applyForce(pb, pb.position, f);
        this.state.moving = !!(f.x || f.y);
    }
    #determineMoveSpeed() {
        if (this.state.firing || gamespace._currentUpdate - this.state.lastShot[this.inventory.activeIndex] < this.inventory.activeItem.proto.delay && !this.state.noSlow) {
            return (this.speed.base + this.inventory.activeItem.proto.moveSpeedPenalties.firing) / 2;
        }
        else {
            return this.speed.base + this.inventory.activeItem.proto.moveSpeedPenalties.active - 1;
        }
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
class gunPrototype {
    name;
    dual;
    images = {
        loot: void 0,
        held: void 0
    };
    ballistics;
    caliber;
    delay;
    accuracy = {
        default: 0,
        moving: 0,
    };
    offset = { x: 0, y: 0 };
    width;
    height;
    switchDelay;
    hands = {
        lefthand: { x: 0.5, y: -1 },
        righthand: { x: 0.5, y: -1 }
    };
    tint;
    spawnOffset = { x: 0, y: 0 };
    suppressed;
    casing;
    recoilImpulse = { x: 0, y: -5, duration: 80 };
    fireMode = ["automatic"];
    burstProps = {
        shotDelay: 60,
        burstDelay: 500,
    };
    reload;
    altReload;
    magazineCapacity;
    moveSpeedPenalties;
    constructor(name, dual, images, tint, ballistics, caliber, delay, accuracy, offset, dimensions, hands, spawnOffset, suppressed, recoilImpulse, fireMode, burstProps, reload, capacity, switchDelay, casing, moveSpeedPenalties, altReload) {
        this.name = name;
        this.dual = dual;
        this.tint = tint;
        this.images = images;
        this.ballistics = ballistics;
        this.caliber = caliber;
        this.delay = delay;
        this.accuracy = accuracy;
        this.offset = offset;
        this.suppressed = suppressed;
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.hands = hands;
        this.spawnOffset = spawnOffset;
        this.recoilImpulse = recoilImpulse;
        this.fireMode = fireMode;
        this.burstProps = burstProps;
        this.reload = reload;
        this.magazineCapacity = capacity;
        this.switchDelay = switchDelay;
        this.casing = casing;
        this.moveSpeedPenalties = moveSpeedPenalties;
        this.altReload = altReload;
    }
}
class gun {
    #proto;
    get proto() { return this.#proto; }
    #activeFireModeIndex = 0;
    get activeFireModeIndex() { return this.#activeFireModeIndex; }
    set activeFireModeIndex(v) {
        const f = this.proto.fireMode;
        this.#activeFireMode = f[this.#activeFireModeIndex = v % f.length];
    }
    ;
    #activeFireMode;
    get activeFireMode() { return this.#activeFireMode; }
    #ammo = 0;
    get ammo() { return this.#ammo; }
    set ammo(v) { this.#ammo = Math.max(0, v); }
    recoilImpulseParity;
    constructor(proto) {
        this.#proto = proto;
        this.#activeFireMode = proto.fireMode[this.activeFireModeIndex];
        this.ammo = proto.magazineCapacity.normal;
        this.recoilImpulseParity = 1;
    }
    primary(shooter) {
        const p = shooter, b = p.body, ip = this.#proto, fire = this.activeFireMode, burst = fire.startsWith("burst-");
        if ((gamespace._currentUpdate - p.state.lastShot[p.inventory.activeIndex]) >= (burst ? (ip.burstProps.burstDelay ?? ip.delay) : ip.delay) && this.#ammo) {
            const timer = setTimeout(function a(weapon) {
                if (!gamespace.objects.players.find(p => p.body.id == b.id) ||
                    (p.state.reloading && p.timers.reloading.all) ||
                    (!p.state.attacking) ||
                    (burst && p.state.fired >= +fire.replace("burst-", "")) ||
                    (!weapon.#ammo) ||
                    (gamespace._currentUpdate - p.state.lastSwitch < p.state.eSwitchDelay)) {
                    p.state.firing = false;
                    return clearTimeout(timer);
                }
                p.state.reloading && weapon.stopReload(p);
                p.state.noSlow = false;
                p.state.fired++;
                weapon.ammo--;
                p.state.lastShot[p.inventory.activeIndex] = gamespace._currentUpdate;
                p.state.firing = true;
                if (weapon.#proto.dual) {
                    weapon.recoilImpulseParity *= -1;
                }
                const pr = weapon.#proto.ballistics.projectiles;
                for (let i = 0; i < pr; i++) {
                    const a = (p.state.lastShot[p.inventory.activeIndex] - gamespace._currentUpdate) > weapon.#proto.ballistics.fsaCooldown ? 0 : ip.accuracy.default + (p.state.moving && ip.accuracy.moving), s = gamespace.bulletInfo[weapon.#proto.caliber].spawnVar, spawnOffset = () => meanDevPM_random(s.mean, s.variation, s.plusOrMinus), start = {
                        x: b.position.x + (50 + ip.spawnOffset.y + spawnOffset()) * Math.sin(p.angle) + (weapon.recoilImpulseParity * ip.spawnOffset.x + spawnOffset()) * Math.cos(p.angle),
                        y: b.position.y - (50 + ip.spawnOffset.y + spawnOffset()) * Math.cos(p.angle) + (weapon.recoilImpulseParity * ip.spawnOffset.x + spawnOffset()) * Math.sin(p.angle)
                    }, dev = p.angle + a * (Math.random() - 0.5), body = Matter.Bodies.rectangle(start.x, start.y, ip.ballistics.tracer.width * 50, Math.min(100, ip.spawnOffset.y), { isStatic: false, friction: 1, restitution: 0, density: 1, angle: dev });
                    new bullet(body, p, ip, dev, start, gamespace._currentUpdate, Math.min(100, ip.spawnOffset.y), Math.random() >= 0.85);
                }
                try {
                    function makeCasing() {
                        if (shooter.state.noSlow) {
                            return;
                        }
                        const start = {
                            x: b.position.x + (50 + ip.spawnOffset.y) * Math.sin(p.angle) + (weapon.recoilImpulseParity * ip.spawnOffset.x) * Math.cos(p.angle),
                            y: b.position.y - (50 + ip.spawnOffset.y) * Math.cos(p.angle) + (weapon.recoilImpulseParity * ip.spawnOffset.x) * Math.sin(p.angle)
                        };
                        new casing(Matter.Bodies.rectangle(start.x, start.y, 0, 0, { isStatic: false, friction: 1, restitution: 0, density: 1, angle: p.angle }), ip, p.angle, start, gamespace._currentUpdate, {
                            perp: meanDevPM_random(ip.casing.velocity.perp.value, ip.casing.velocity.perp.variation.value, ip.casing.velocity.perp.variation.plusOrMinus),
                            parr: meanDevPM_random(ip.casing.velocity.parr.value, ip.casing.velocity.parr.variation.value, ip.casing.velocity.parr.variation.plusOrMinus),
                            angular: meanDevPM_random(ip.casing.velocity.angular.value, ip.casing.velocity.angular.variation.value, ip.casing.velocity.angular.variation.plusOrMinus)
                        });
                    }
                    if (!ip.casing.spawnDelay) {
                        makeCasing();
                    }
                    else {
                        setTimeout(makeCasing, ip.casing.spawnDelay);
                    }
                }
                catch { }
                if (!weapon.#ammo) {
                    return weapon.reload(shooter);
                }
                if (fire == "semi") {
                    shooter.state.firing = false;
                    return;
                }
                setTimeout(a, fire == "automatic" ? weapon.#proto.delay : weapon.#proto.burstProps.shotDelay, weapon);
            }, 0, this);
        }
    }
    reload(shooter) {
        if (this.#ammo == this.#proto.magazineCapacity.normal || shooter.state.reloading) {
            return;
        }
        shooter.state.firing = false;
        shooter.state.reloading = gamespace._currentUpdate;
        const reloadToUse = this.#proto[`${this.#proto.altReload && !this.#ammo ? "altR" : "r"}eload`];
        shooter.timers.reloading.timer && clearTimeout(shooter.timers.reloading.timer);
        shooter.timers.reloading = {
            timer: setTimeout(() => {
                this.#ammo = Math.min(this.#ammo + (reloadToUse.ammoReloaded == "all" ? Infinity : reloadToUse.ammoReloaded), this.#proto.magazineCapacity.normal);
                shooter.state.reloading = false;
                if (this.#ammo < this.#proto.magazineCapacity.normal && reloadToUse.chain) {
                    this.reload(shooter);
                }
            }, reloadToUse.duration),
            all: reloadToUse.ammoReloaded == "all"
        };
    }
    stopReload(shooter) {
        if (shooter.state.reloading) {
            clearTimeout(shooter.timers.reloading.timer);
            shooter.state.reloading = shooter.timers.reloading.timer = false;
        }
    }
}
class bullet {
    #body;
    get body() { return this.#body; }
    #shooter;
    get shooter() { return this.#shooter; }
    #emitter;
    get emitter() { return this.#emitter; }
    #angle;
    get angle() { return this.#angle; }
    #start;
    get start() { return this.#start; }
    #created;
    get created() { return this.#created; }
    #length;
    get length() { return this.#length; }
    #crit;
    get crit() { return this.#crit; }
    squaredDistance = 0;
    #lastFalloffStep = 0;
    #damage;
    constructor(body, shooter, emitter, angle, start, created, length, crit) {
        this.#body = body;
        this.#shooter = shooter;
        this.#emitter = emitter;
        this.#angle = angle;
        this.#start = start;
        this.#created = created;
        this.#length = length;
        this.#crit = crit;
        this.#damage = this.#emitter.ballistics.damage;
        gamespace.objects.bullets.push(this);
    }
    update() {
        const bd = this.#body, removeBullet = () => {
            Matter.World.remove(gamespace.world, this.#body);
            gamespace.objects.bullets.splice(gamespace.objects.bullets.findIndex(b => b.#body.id == this.#body.id), 1);
            this.destroy();
        }, v = this.#emitter.ballistics.velocity * (gamespace._currentUpdate - this.#created) / 1000;
        Matter.Body.setPosition(bd, { x: this.#start.x + Math.sin(this.#angle) * v, y: this.#start.y - Math.cos(this.#angle) * v });
        this.squaredDistance = sqauredDist(this.#start, bd.position);
        if (this.squaredDistance > this.#emitter.ballistics.range ** 2) {
            removeBullet();
            return;
        }
        const d = Math.sqrt(this.squaredDistance);
        if (d - this.#lastFalloffStep > 50000) {
            this.#lastFalloffStep = 50000 * Math.floor(d / 50000);
            this.#damage *= this.#emitter.ballistics.falloff;
        }
        if (Matter.Query.collides(bd, gamespace.objects.obstacles.map(o => o.body)).length) {
            removeBullet();
            return;
        }
        {
            const p = Matter.Query.collides(bd, gamespace.objects.players.map(o => o.body))[0];
            if (p) {
                const f = (pl) => pl.body.id == p.bodyA.id, target = gamespace.objects.players.find(f), index = gamespace.objects.players.findIndex(f), d = this.#damage * (this.crit ? this.#emitter.ballistics.headshotMult : 1), lethal = target.health <= d;
                target.health -= d;
                if (gamespace.settings.bonus_features.show_damage_numbers) {
                    const makeNew = () => {
                        gamespace.objects.damageNumbers.push({
                            amount: d,
                            createdTimestamp: gamespace._currentUpdate,
                            crit: this.#crit,
                            position: { ...target.body.position },
                            lethal,
                            rngOffset: {
                                x: Math.random() * 30 - 15,
                                y: Math.random() * 30 - 15
                            },
                            targetId: target.body.id
                        });
                    };
                    if (gamespace.settings.bonus_features.damage_numbers_stack) {
                        const prev = gamespace.objects.damageNumbers.find(da => da.targetId == target.body.id);
                        if (prev) {
                            prev.amount += d;
                            prev.createdTimestamp = gamespace._currentUpdate;
                            prev.crit = this.#crit;
                            prev.position = { ...target.body.position };
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
                if (target.health <= 0) {
                    Matter.World.remove(gamespace.world, target.body);
                    target.destroy();
                    gamespace.objects.players.splice(index, 1);
                }
                removeBullet();
            }
        }
    }
    draw(p5) {
        const bd = this.#body;
        if (!bd) {
            return;
        }
        if (sqauredDist(bd.position, gamespace.player.body.position) < (p5.width + p5.height) ** 2) {
            p5.push();
            p5.translate(bd.position.x, bd.position.y);
            p5.rotate(this.angle);
            const c = p5.color(gamespace.bulletInfo[this.#emitter.caliber]?.tints?.[this.#crit && gamespace.settings.bonus_features.headshots_use_saturated_tracers ? "saturated" : "normal"] ?? "#FFF");
            c.setAlpha(this.#emitter.suppressed ? 128 : 255);
            p5.tint(c);
            const l = Math.min(992, distance(bd.position, this.#start));
            p5.image(gamespace.images.tracer, 0, l / 2 - this.#length / 2, this.#emitter.ballistics.tracer.width * 50, l);
            p5.pop();
        }
        if (gamespace.settings.debug) {
            p5.fill("#FF000080");
            p5.beginShape();
            for (let i = 0; i < bd.vertices.length; i++) {
                p5.vertex(bd.vertices[i].x, bd.vertices[i].y);
            }
            p5.endShape();
        }
    }
    destroy() {
        this.#body = this.#shooter = this.#emitter = void 0;
    }
}
class casing {
    #body;
    get body() { return this.#body; }
    #emitter;
    get emitter() { return this.#emitter; }
    #angle;
    get angle() { return this.#angle; }
    #trajectory;
    get trajectory() { return this.#trajectory; }
    #start;
    get start() { return this.#start; }
    #created;
    get created() { return this.#created; }
    #velocities;
    get velocities() { return this.#velocities; }
    #squaredDist;
    #info;
    #despawnDist;
    constructor(body, emitter, angle, start, created, vel) {
        this.#body = body;
        this.#emitter = emitter;
        this.#angle = this.#trajectory = angle;
        this.#start = start;
        this.#created = created;
        this.#velocities = vel;
        this.#info = gamespace.bulletInfo[this.#emitter.caliber].casing;
        this.#despawnDist = meanDevPM_random(this.#info.despawnDist.mean, this.#info.despawnDist.variation, this.#info.despawnDist.plusOrMinus);
        gamespace.objects.casings.push(this);
    }
    update() {
        const t = (gamespace._currentUpdate - this.#created) / 1000;
        Matter.Body.setPosition(this.#body, {
            x: this.#start.x + (Math.sin(this.#trajectory) * this.#velocities.parr - Math.cos(this.#trajectory) * this.#velocities.perp) * t,
            y: this.#start.y + (Math.cos(this.#trajectory) * this.#velocities.parr - Math.sin(this.#trajectory) * this.#velocities.perp) * t
        });
        this.#angle = this.#trajectory + this.#velocities.angular * t;
        this.#squaredDist = sqauredDist(this.#body.position, this.#start);
        if (this.#squaredDist > this.#despawnDist ** 2) {
            Matter.World.remove(gamespace.world, this.#body);
            gamespace.objects.casings.splice(gamespace.objects.casings.findIndex(c => c.#body.id == this.#body.id), 1);
            this.destroy();
        }
    }
    draw(p5) {
        if (!this.#body) {
            return;
        }
        if (sqauredDist(this.#body.position, gamespace.player.body.position) < (p5.width + p5.height) ** 2) {
            p5.push();
            p5.translate(this.#body.position.x, this.#body.position.y);
            p5.rotate(this.#angle);
            p5.tint(255, 255 - (255 * this.#squaredDist / this.#despawnDist ** 2));
            p5.image(this.#info.img, 0, 0, this.#info.width, this.#info.height);
            p5.pop();
        }
    }
    destroy() {
        this.#body = this.#emitter = void 0;
    }
}
const gamespace = {
    get version() { return `0.0.1 (build 05-25-2022)`; },
    bulletInfo: {},
    _currentLevel: void 0,
    _currentUpdate: 0,
    get currentUpdate() { return gamespace._currentUpdate; },
    set currentUpdate(v) {
        [gamespace.lastUpdate, gamespace._currentUpdate, gamespace.deltaTime] = [gamespace._currentUpdate, v, v - gamespace._currentUpdate];
    },
    deltaTime: 0,
    engine: void 0,
    fonts: {},
    freeze() {
        if (!gamespace._frozen) {
            freezeAllInputs();
            gamespace._frozen = true;
            const t = setTimeout(() => { });
            for (let i = 0; i < t; i++) {
                clearTimeout(i);
            }
        }
    },
    _frozen: false,
    get frozen() { return gamespace._frozen; },
    guns: [],
    images: {
        tracer: loadImg("assets/items/ammo/tracer.png")
    },
    keys: {},
    lastUpdate: 0,
    levels: [],
    objects: {
        bullets: [],
        casings: [],
        damageNumbers: [],
        obstacles: [],
        players: [],
    },
    player: void 0,
    settings: {
        graphicsQuality: 1,
        debug: false,
        bonus_features: {
            headshots_use_saturated_tracers: true,
            show_damage_numbers: true,
            damage_numbers_stack: true
        }
    },
    update(p5) {
        function drawPlayers() {
            gamespace.objects.players.forEach(player => {
                Matter.Body.setVelocity(player.body, { x: -player.body.force.x, y: -player.body.force.y });
                player.draw(p5);
            });
        }
        ;
        function drawObjects(layer) {
            gamespace.objects.obstacles.filter(o => o.layer == layer).forEach(o => {
                Matter.Body.setVelocity(o.body, { x: -o.body.force.x, y: o.body.force.y });
                o.draw(p5);
            });
        }
        ;
        function drawBullets() {
            gamespace.objects.bullets.forEach(b => {
                b.update();
                b.draw(p5);
            });
        }
        ;
        function drawCasings() {
            gamespace.objects.casings.forEach(c => {
                c.update();
                c.draw(p5);
            });
        }
        function playerMove() {
            if (!gamespace._frozen) {
                gamespace.player.move(!!gamespace.keys[keyBindings.forward.key], !!gamespace.keys[keyBindings["strafe-left"].key], !!gamespace.keys[keyBindings.backward.key], !!gamespace.keys[keyBindings["strafe-right"].key]);
            }
        }
        ;
        const now = Date.now();
        gamespace.currentUpdate = now;
        // for (let i = 0; i < 10; i++, Matter.Engine.update(gamespace.engine, gamespace.deltaTime / 10));
        Matter.Engine.update(gamespace.engine, gamespace.deltaTime);
        if (perf.mode.fps) {
            ++perf._data.frames;
        }
        p5.clear(void 0, void 0, void 0, void 0);
        const p = gamespace.player, b = p.body;
        p5.camera(Math.round(b.position.x), Math.round(b.position.y), p.view - p5.width / 2, Math.round(b.position.x), Math.round(b.position.y), 0);
        p5.noStroke();
        p5.rectMode(p5.CORNER);
        p5.fill(gamespace._currentLevel.world.colour);
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
        drawObjects(0);
        drawBullets();
        drawCasings();
        drawPlayers();
        drawObjects(1);
        try {
            playerMove();
        }
        catch { }
        if (gamespace.settings.bonus_features.show_damage_numbers) {
            gamespace.objects.damageNumbers.forEach((d, i) => {
                const t = (gamespace._currentUpdate - d.createdTimestamp), lifetime = 500, [minX, maxX, minY, maxY] = [gamespace.player.body.position.x - 1000, gamespace.player.body.position.x + 1000, gamespace.player.body.position.y - 650, gamespace.player.body.position.y + 650], pos = {
                    x: d.position.x + d.rngOffset.x,
                    y: d.position.y + d.rngOffset.y
                };
                p5.push();
                p5.translate(+clamp(pos.x, minX, maxX), +clamp(pos.y, minY, maxY));
                p5.textAlign(checkBounds(pos.x, minX, maxX) ? "center" : ({ 1: "left", [-1]: "right" })[Math.cmp(pos.x, minX)], checkBounds(pos.y, minY, maxY) ? "center" : ({ 1: "top", [-1]: "bottom" })[Math.cmp(pos.y, minY)]);
                p5.textSize(d.lethal ? 90 : 80);
                if (d.crit) {
                    const c = p5.color(0, 255, 0);
                    c.setAlpha(255 * (1 - t / lifetime));
                    p5.fill(c);
                    p5.text(`${d.amount}${d.lethal ? "!" : ""}`, 10, -10);
                }
                const c = p5.color(255, 0, 0);
                c.setAlpha(255 * (1 - t / lifetime));
                p5.fill(c);
                p5.text(`${d.amount}${d.lethal ? "!" : ""}`, 0, 0);
                p5.pop();
                if (t > lifetime) {
                    gamespace.objects.damageNumbers.splice(i, 1);
                }
            });
        }
        !gamespace._frozen && drawUI();
        if ((p5.mouseX != p5.pmouseX || p5.mouseY != p5.pmouseY) && !gamespace._frozen) {
            p.angle = Math.PI / 2 + Math.atan2(p5.mouseY - p5.height / 2, p5.mouseX - p5.width / 2);
        }
    },
    world: void 0
};
(async () => {
    gamespace.guns = parseGunData((await (await fetch("assets/json/guns.json")).json()));
    gamespace.bulletInfo = parseAmmoData((await (await fetch("assets/json/ammo.json")).json()));
})();
/*

    tsc classes.ts main.ts perf.ts util.ts input.ts ui.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration

    tsc assets/levels/level0/level.ts classes.d.ts main.d.ts perf.d.ts util.d.ts input.d.ts ui.d.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration

*/ 
