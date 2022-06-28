class gunPrototype {
    name;
    summary;
    dual;
    images = {
        loot: void 0,
        held: void 0,
        silhouette: void 0
    };
    ballistics;
    caliber;
    delay;
    accuracy = {
        default: 0,
        moving: 0,
    };
    imageOffset = { x: 0, y: 0 };
    dimensions;
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
    fireModes = ["automatic"];
    burstProps = {
        shotDelay: 60,
        burstDelay: 500,
    };
    reload;
    altReload;
    magazineCapacity;
    moveSpeedPenalties;
    deployGroup;
    constructor(name, summary, dual, images, tint, ballistics, caliber, delay, accuracy, imageOffset, dimensions, hands, spawnOffset, suppressed, recoilImpulse, fireMode, burstProps, reload, capacity, switchDelay, casing, moveSpeedPenalties, deployGroup, altReload) {
        this.name = name;
        this.summary = summary;
        this.dual = dual;
        this.tint = tint;
        this.images = images;
        this.ballistics = ballistics;
        this.caliber = caliber;
        this.delay = delay;
        this.accuracy = accuracy;
        this.imageOffset = imageOffset;
        this.suppressed = suppressed;
        this.dimensions = dimensions;
        this.hands = hands;
        this.spawnOffset = spawnOffset;
        this.recoilImpulse = recoilImpulse;
        this.fireModes = fireMode;
        this.burstProps = burstProps;
        this.reload = reload;
        this.magazineCapacity = capacity;
        this.switchDelay = switchDelay;
        this.casing = casing;
        this.moveSpeedPenalties = moveSpeedPenalties;
        this.deployGroup = deployGroup;
        this.altReload = altReload;
    }
}
class gun {
    #proto;
    get proto() { return this.#proto; }
    #activeFireModeIndex = 0;
    get activeFireModeIndex() { return this.#activeFireModeIndex; }
    set activeFireModeIndex(v) {
        const f = this.proto.fireModes;
        this.#activeFireMode = f[this.#activeFireModeIndex = v % f.length];
    }
    ;
    #activeFireMode;
    get activeFireMode() { return this.#activeFireMode; }
    #ammo = 0;
    get ammo() { return this.#ammo; }
    set ammo(v) { this.#ammo = Math.max(0, v); }
    recoilImpulseParity = 1;
    constructor(proto) {
        this.#proto = proto;
        this.#activeFireMode = proto.fireModes[this.activeFireModeIndex];
        this.ammo = proto.magazineCapacity.normal;
    }
    primary(shooter) {
        const p = shooter, b = p.body, ip = this.#proto, fire = this.activeFireMode, burst = !!fire.match(/(auto-)?burst-/);
        if ((gamespace._currentUpdate - p.state.lastShot[p.inventory.activeIndex]) >= (burst ? (ip.burstProps.burstDelay ?? ip.delay) : ip.delay) &&
            this.#ammo &&
            !p.state.frozen &&
            !p.timers.firing) {
            p.state.fired = 0;
            shooter.timers.firing = setTimeout(function a(weapon) {
                const exceed = p.state.fired >= +fire.replace(/(auto-)?burst-/, "");
                if (!gamespace.objects.players.find(p => p.body.id == b.id) ||
                    (p.state.reloading && p.timers.reloading.all) ||
                    (!p.state.attacking && !(burst && !exceed)) ||
                    (burst && (!fire.startsWith("auto-burst-") && exceed)) ||
                    (!weapon.#ammo) ||
                    (gamespace._currentUpdate - p.state.lastSwitch < p.state.eSwitchDelay) ||
                    shooter.state.frozen) {
                    p.state.fired = 0;
                    p.state.firing = false;
                    p.timers.firing && clearTimeout(p.timers.firing);
                    p.timers.firing = false;
                    if ((p.state.reloading && p.timers.reloading.all) ||
                        (gamespace._currentUpdate - p.state.lastSwitch < p.state.eSwitchDelay)) {
                        p.timers.firing = setTimeout(() => {
                            p.timers.firing && clearTimeout(p.timers.firing);
                            p.timers.firing = false;
                            if (p.state.attacking) {
                                p.inventory.activeItem.primary(p);
                            }
                        }, (p.state.reloading && p.timers.reloading.all) ? weapon.#proto[`${weapon.#proto.altReload && !weapon.#ammo ? "altR" : "r"}eload`].duration - (gamespace._currentUpdate - p.state.reloading) : p.state.eSwitchDelay - (gamespace._currentUpdate - p.state.lastSwitch));
                    }
                    return;
                }
                if (burst && fire.startsWith("auto-burst-") && exceed) {
                    p.state.fired = 0;
                    p.state.firing = false;
                    p.timers.firing = setTimeout(a, weapon.#proto.burstProps.burstDelay, weapon);
                    return;
                }
                p.state.reloading && weapon.stopReload(p);
                p.state.noSlow = false;
                p.state.fired++;
                weapon.ammo--;
                p.state.lastShot[p.inventory.activeIndex] = gamespace._currentUpdate;
                p.state.firing = true;
                p.events.dispatchEvent("firing", weapon);
                if (weapon.#proto.dual) {
                    weapon.recoilImpulseParity *= -1;
                }
                const pr = weapon.#proto.ballistics.projectiles;
                for (let i = 0; i < pr; i++) {
                    const a = (p.state.lastShot[p.inventory.activeIndex] - gamespace._currentUpdate) > weapon.#proto.ballistics.fsaCooldown ? 0 : ip.accuracy.default + +(p.state.moving && ip.accuracy.moving), s = gamespace.bulletInfo[weapon.#proto.caliber].spawnVar, spawnOffset = () => +meanDevPM_random(s.mean, s.variation, s.plusOrMinus), start = {
                        x: b.position.x + (50 + ip.spawnOffset.y + spawnOffset()) * Math.sin(p.angle) + (weapon.recoilImpulseParity * ip.spawnOffset.x + spawnOffset()) * Math.cos(p.angle),
                        y: b.position.y - (50 + ip.spawnOffset.y + spawnOffset()) * Math.cos(p.angle) + (weapon.recoilImpulseParity * ip.spawnOffset.x + spawnOffset()) * Math.sin(p.angle)
                    }, dev = p.angle + a * (Math.random() - 0.5), body = Matter.Bodies.rectangle(start.x, start.y, ip.ballistics.tracer.width, 50 + ip.spawnOffset.y, { isStatic: false, friction: 1, restitution: 0, density: 1, angle: dev });
                    new bullet(body, p, ip, dev, start, gamespace._currentUpdate, weapon.#proto.ballistics.headshotMult != 1 && gamespace.settings.balanceChanges.weapons.general.headshots && Math.random() >= 0.85, gamespace.bulletInfo[ip.caliber].projectileInfo.type);
                }
                if (ip.casing.spawnOn == "fire") {
                    try {
                        if (!ip.casing.spawnDelay) {
                            weapon.makeCasing(p);
                        }
                        else {
                            setTimeout(() => {
                                if (p.inventory.activeItem.#proto.name == weapon.#proto.name) {
                                    weapon.makeCasing(p);
                                }
                            }, ip.casing.spawnDelay);
                        }
                    }
                    catch { }
                }
                if (!weapon.#ammo) {
                    p.timers.anticipatedReload = setTimeout(weapon.reload.bind(weapon), !burst ? weapon.#proto.delay : weapon.#proto.burstProps.shotDelay, shooter);
                }
                if (fire == "semi") {
                    p.state.firing = false;
                    p.timers.firing && clearTimeout(p.timers.firing);
                    p.timers.firing = false;
                    return;
                }
                shooter.timers.firing = setTimeout(a, fire == "automatic" ? weapon.#proto.delay : weapon.#proto.burstProps.shotDelay, weapon);
            }, 0, this);
        }
    }
    reload(shooter) {
        if (this.#ammo == this.#proto.magazineCapacity.normal || shooter.state.reloading) {
            return;
        }
        shooter.events.dispatchEvent("reloading", this);
        shooter.state.firing = false;
        shooter.timers.firing && clearTimeout(shooter.timers.firing);
        shooter.timers.firing = false;
        shooter.timers.reloading.timer && clearTimeout(shooter.timers.reloading.timer);
        shooter.timers.reloading.timer = false;
        shooter.state.reloading = gamespace._currentUpdate;
        const reloadToUse = this.#proto[`${this.#proto.altReload && !this.#ammo ? "altR" : "r"}eload`];
        if (this.#proto.casing.spawnOn == "reload") {
            try {
                if (!this.#proto.casing.spawnDelay) {
                    for (let i = 0; i < this.#proto.magazineCapacity.normal; i++, this.makeCasing(shooter))
                        ;
                }
                else {
                    setTimeout(() => {
                        if (shooter.inventory.activeItem.#proto.name == this.#proto.name) {
                            for (let i = 0; i < this.#proto.magazineCapacity.normal; i++, this.makeCasing(shooter))
                                ;
                        }
                    }, this.#proto.casing.spawnDelay);
                }
            }
            catch { }
        }
        shooter.timers.reloading = {
            timer: setTimeout(() => {
                this.#ammo = Math.min(this.#ammo + (reloadToUse.ammoReloaded == "all" ? Infinity : reloadToUse.ammoReloaded), this.#proto.magazineCapacity.normal);
                shooter.state.reloading = false;
                if (this.#ammo < this.#proto.magazineCapacity.normal && reloadToUse.chain) {
                    this.reload(shooter);
                }
                else {
                    shooter.timers.reloading.timer && clearTimeout(shooter.timers.reloading.timer);
                    shooter.timers.reloading.timer = shooter.timers.reloading.all = false;
                }
            }, reloadToUse.duration),
            all: reloadToUse.ammoReloaded == "all"
        };
    }
    stopReload(shooter) {
        if (shooter.state.reloading) {
            clearTimeout(shooter.timers.reloading.timer);
            shooter.timers.reloading.timer = shooter.timers.reloading.all = false;
            shooter.events.dispatchEvent("stopReload", this);
            if (shooter.timers.firing) {
                clearTimeout(shooter.timers.firing);
                shooter.timers.firing = false;
                this.primary(shooter);
            }
            shooter.state.reloading = shooter.timers.reloading.timer = shooter.timers.reloading.all = false;
        }
    }
    makeCasing(shooter) {
        if (!shooter.body) {
            return;
        }
        const p = shooter, b = p.body, ip = this.#proto, sin = Math.sin(p.angle), cos = Math.cos(p.angle), c = ip.casing, start = {
            x: b.position.x + (50 + c.spawnOffset.parr) * sin - +(this.recoilImpulseParity * c.spawnOffset.perp * cos),
            y: b.position.y - (50 + c.spawnOffset.parr) * cos - +(this.recoilImpulseParity * c.spawnOffset.perp * sin)
        };
        new casing(Matter.Bodies.rectangle(start.x, start.y, 0, 0, { isStatic: false, friction: 1, restitution: 0, density: 1, angle: p.angle }), ip, p.angle, start, gamespace._currentUpdate, {
            perp: +meanDevPM_random(c.velocity.perp.value, c.velocity.perp.variation.value, c.velocity.perp.variation.plusOrMinus),
            parr: +meanDevPM_random(c.velocity.parr.value, c.velocity.parr.variation.value, c.velocity.parr.variation.plusOrMinus),
            angular: +meanDevPM_random(c.velocity.angular.value, c.velocity.angular.variation.value, c.velocity.angular.variation.plusOrMinus)
        });
    }
}
class projectile {
    #body;
    get body() { return this.#body; }
    #shooter;
    get shooter() { return this.#shooter; }
    #emitter;
    get emitter() { return this.#emitter; }
    #angle;
    get angle() { return this.#angle; }
    #trajectory;
    get trajectory() { return this.#trajectory; }
    #start;
    get start() { return this.#start; }
    #end;
    get end() { return this.#end; }
    #created;
    get created() { return this.#created; }
    #crit;
    get crit() { return this.#crit; }
    #alpha;
    get alpha() { return this.#alpha; }
    #damage;
    get damage() { return this.#damage; }
    #squaredDistance = 0;
    get sqauredDistance() { return this.#squaredDistance; }
    #shrapnel;
    get shrapnel() { return this.#shrapnel; }
    #lastFalloffStep = 0;
    constructor(body, shooter, emitter, angle, start, end, created, crit, damage, isShrapnel) {
        this.#body = body;
        this.#shooter = shooter;
        this.#emitter = emitter;
        this.#angle = angle;
        this.#trajectory = angle;
        this.#start = start;
        this.#end = end;
        this.#created = created;
        this.#crit = crit;
        this.#alpha = 255;
        this.#damage = damage;
        this.#shrapnel = isShrapnel;
    }
    update(lifetime, spinVel, type, explosionInfo) {
        const bd = this.body, removeBullet = () => {
            Matter.World.remove(gamespace.world, bd);
            gamespace.objects.bullets.splice(gamespace.objects.bullets.findIndex(b => b.body.id == bd.id), 1);
            this.destroy();
        }, makeExplosion = () => {
            new explosion(bd.position, this.#shooter, this.#emitter, this.#crit);
        }, dt = (gamespace._currentUpdate - this.#created) / 1000;
        this.#angle = this.#trajectory + dt * spinVel;
        Matter.Body.setPosition(bd, {
            x: +linterp(this.#start.x, this.#end.x, clamp(dt / lifetime, 0, 1)),
            y: +linterp(this.#start.y, this.#end.y, clamp(dt / lifetime, 0, 1))
        });
        this.#squaredDistance = +squaredDist(this.#start, bd.position);
        if (this.#squaredDistance > Math.min(this.#emitter.ballistics.range, type == "explosive" ? explosionInfo.maxDist : Infinity) ** 2 ||
            dt > Math.min(lifetime, type == "explosive" ? explosionInfo.maxDist / this.#emitter.ballistics.velocity : Infinity)) {
            if (type == "explosive") {
                makeExplosion();
            }
            removeBullet();
            return;
        }
        const d = Math.sqrt(this.#squaredDistance);
        if (d - this.#lastFalloffStep > 5000) {
            this.#lastFalloffStep = 5000 * Math.floor(d / 5000);
            this.#damage = sigFigIshMult(this.#damage, this.#emitter.ballistics.falloff);
        }
        if (Matter.Query.collides(bd, gamespace.objects.obstacles.map(o => o.body)).length) {
            if (type == "explosive" && explosionInfo.explodeOnContact) {
                makeExplosion();
            }
            removeBullet();
            return;
        }
        {
            const p = Matter.Query.collides(bd, gamespace.objects.players.map(o => o.body))[0];
            if (p) {
                const f = (pl) => pl.body.id == p.bodyA.id, target = gamespace.objects.players.find(f), d = sigFigIshMult(this.#damage, this.#crit ? this.#emitter.ballistics.headshotMult : 1);
                if (target.body.id == this.#shooter.body?.id && !this.#shrapnel) {
                    return;
                }
                if (type == "explosive" && explosionInfo.explodeOnContact) {
                    makeExplosion();
                }
                else if (!target.state.invuln) {
                    target.damage(d, this);
                }
                removeBullet();
            }
        }
    }
    draw(info, lifetime) {
        const bd = this.#body, p5 = gamespace.p5;
        if (!bd) {
            return;
        }
        if (!gamespace.player ||
            +squaredDist(bd.position, (gamespace.player ? gamespace.player.body.position : { x: gamespace.camera.eyeX, y: gamespace.camera.eyeY })) < gamespace.player.renderDist ** 2) {
            p5.push();
            p5.imageMode(p5.CENTER);
            p5.translate(bd.position.x, bd.position.y);
            p5.rotate(this.#angle);
            if (info.projectileInfo.type == "explosive") {
                const dt = (gamespace._currentUpdate - this.#created) / 1000, s = (-info.projectileInfo.heightPeak * dt * (dt - lifetime) / 2) ** 0.75 + 1;
                p5.scale(s, s);
            }
            const c = p5.color(info.tints[this.#crit && gamespace.settings.bonusFeatures.headshotsUseSaturatedTracers ? (gamespace.settings.bonusFeatures.useInterpolatedSaturatedTracers && info.tints.saturated_alt) ? "saturated_alt" : "saturated" : "normal"] ?? "#FFF");
            if (this.#emitter.suppressed) {
                const min = info.alpha.min * 255, max = info.alpha.max * 255, dir = Math.sign(1 - info.alpha.rate);
                if ((min != this.#alpha && dir != -1) || (this.#alpha != max && dir != 1)) {
                    this.#alpha = +clamp(this.#alpha * info.alpha.rate, min, max);
                }
                c.setAlpha(this.#alpha);
            }
            p5.tint(c);
            const l = Math.min(info.dimensions.height, +distance(bd.position, this.#start)), w = info.dimensions.width, o = info.imageOffset;
            p5.image(info.projectileInfo.img, o.perp * w, -o.parr * l, w, l);
            p5.pop();
        }
        if (gamespace.settings.visual.debug) {
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
class bullet extends projectile {
    #lifetime;
    get lifetime() { return this.#lifetime; }
    #info;
    get info() { return this.#info; }
    #type;
    get type() { return this.#type; }
    #squaredDistance = 0;
    get sqauredDistance() { return this.#squaredDistance; }
    constructor(body, shooter, emitter, angle, start, created, crit, type) {
        super(body, shooter, emitter, angle, start, {
            x: start.x + emitter.ballistics.range * Math.sin(angle),
            y: start.y - emitter.ballistics.range * Math.cos(angle)
        }, created, crit, emitter.ballistics.damage, false);
        this.#lifetime = emitter.ballistics.range / emitter.ballistics.velocity;
        this.#type = type;
        this.#info = gamespace.bulletInfo[emitter.caliber];
        gamespace.objects.bullets.push(this);
    }
    update() {
        super.update(this.#lifetime, this.#info.projectileInfo.spinVel, this.#type, this.#info.projectileInfo);
    }
    draw() {
        if (!this.body) {
            return;
        }
        const i = this.#info;
        i.dimensions = { width: this.emitter.ballistics.tracer.width, height: this.emitter.ballistics.tracer.height };
        super.draw(i, this.#lifetime);
    }
}
class shrapnel extends projectile {
    #lifetime;
    get lifetime() { return this.#lifetime; }
    #range;
    get range() { return this.#range; }
    #info;
    get info() { return this.#info; }
    constructor(body, shooter, emitter, angle, start, created, crit) {
        const i = gamespace.explosionInfo[gamespace.bulletInfo[emitter.caliber].projectileInfo.explosionType].shrapnel, r = +meanDevPM_random(i.range.value, i.range.variation.value, i.range.variation.plusOrMinus);
        super(body, shooter, emitter, angle, start, {
            x: start.x + r * Math.sin(angle),
            y: start.y - r * Math.cos(angle)
        }, created, crit, i.damage, true);
        this.#lifetime = r / i.velocity;
        this.#info = i;
        this.#range = r;
        gamespace.objects.bullets.push(this);
    }
    update() {
        super.update(this.#lifetime, 0, "bullet", void 0);
    }
    draw() {
        if (!this.body) {
            return;
        }
        const i = this.#info, c = toHex(i.color);
        super.draw({
            alpha: {
                rate: 0,
                min: 0.96,
                max: 0.96
            },
            imageOffset: {
                parr: -0.5,
                perp: 0
            },
            dimensions: {
                width: i.tracer.width,
                height: i.tracer.height
            },
            projectileInfo: {
                type: "bullet",
                img: i.img,
                spinVel: 0
            },
            tints: {
                normal: c,
                chambered: c,
                saturated: c,
                saturated_alt: c
            }
        }, this.#lifetime);
    }
}
class explosion {
    #origin;
    get origin() { return this.#origin; }
    #createdAt;
    get createdAt() { return this.#createdAt; }
    #shooter;
    get shooter() { return this.#shooter; }
    #emitter;
    get emitter() { return this.#emitter; }
    #crit;
    get crit() { return this.#crit; }
    #damage;
    get damage() { return this.#damage; }
    #id;
    get id() { return this.#id; }
    #info;
    get info() { return this.#info; }
    static #steps = 50;
    get steps() { return explosion.#steps; }
    static {
        const map = new Map(), o = {
            x: [15, 10, 20, 25, 30, 40, 50, 75, 100],
            y: [53, 87, 39, 31, 25, 19, 16, 10, 9]
        }, lx = Decimal.div(o.x.reduce((prev, curr) => prev.plus(Decimal.ln(curr)), new Decimal(0)), o.x.length), ly = Decimal.div(o.y.reduce((prev, curr) => prev.plus(Decimal.ln(curr)), new Decimal(0)), o.y.length), sxy = o.x.reduce((prev, curr) => prev.plus(Decimal.ln(curr).minus(lx).pow(2)), new Decimal(0)), sxx = o.x.reduce((prev, curr, i) => prev.plus(Decimal.mul(Decimal.ln(curr).minus(lx), Decimal.ln(o.y[i]).minus(ly))), new Decimal(0)), B = sxx.div(sxy), A = Decimal.exp(B.times(ly).add(lx)), f = (x) => Decimal.pow(x, B).mul(A);
        // https://www.desmos.com/calculator/dangvg2nbc
        for (const i in o.x) {
            map.set(o.x[i], o.y[i]);
        }
        Object.defineProperty(explosion, "#steps", {
            set(v) {
                explosion.#steps = v;
                if (map.has(v)) {
                    explosion.#alpha = +map.get(v);
                }
                else {
                    const res = f(v);
                    explosion.#alpha = +res;
                    map.set(v, res);
                }
            }
        });
    }
    static #alpha = 16;
    get alpha() { return explosion.#alpha; }
    constructor(origin, shooter, emitter, crit) {
        this.#origin = origin;
        this.#createdAt = gamespace._currentUpdate;
        this.#id = generateId.next().value;
        this.#crit = crit;
        this.#shooter = shooter;
        this.#emitter = emitter;
        this.#info = gamespace.explosionInfo[gamespace.bulletInfo[this.#emitter.caliber].projectileInfo.explosionType];
        this.#damage = this.#info.damage;
        gamespace.objects.explosions.push(this);
        gamespace.objects.players
            .map(p => ({ player: p, dist: +squaredDist(p.body.position, origin) }))
            .filter(p => p.dist <= 600 ** 2 && !p.player.state.invuln)
            .sort((a, b) => b.dist - a.dist)
            .forEach(p => {
            const d = this.#info.damage * (p.dist < this.#info.radii.damage.min ** 2 ? 1 : (1 - (p.dist / (this.#info.radii.damage.max ** 2)))), target = p.player;
            target.damage(d, this);
        });
        const s = this.#info.shrapnel, count = s.count, r = this.#info.radii.visual.min, body = (ang, mag) => {
            return Matter.Bodies.rectangle(origin.x + mag * Math.sin(ang), origin.y - mag * Math.cos(ang), s.tracer.width, s.tracer.height / 10, { isStatic: false, friction: 1, restitution: 0, density: 1, angle: ang });
        };
        for (let i = 0; i < count; i++) {
            const ang = Math.random() * Math.PI * 2, mag = Math.random() * r / 5;
            new shrapnel(body(ang, mag), shooter, emitter, ang, {
                x: origin.x + mag * Math.sin(ang),
                y: origin.y - mag * Math.cos(ang)
            }, gamespace._currentUpdate, crit);
        }
        new decal(0, this.#info.decal.img, this.#info.decal, this.#info.decal.tint, origin);
    }
    update() {
        if (gamespace._currentUpdate - this.#createdAt >= this.#info.lifetime) {
            gamespace.objects.explosions.splice(gamespace.objects.explosions.findIndex(e => e.#id == this.#id), 1);
        }
    }
    draw() {
        if (gamespace._currentUpdate - this.#createdAt < this.#info.lifetime) {
            const p5 = gamespace.p5, { x, y } = this.#origin, steps = explosion.#steps, alpha = explosion.#alpha, d = gamespace._currentUpdate - this.#createdAt, rMin = this.#info.radii.visual.min, dr = this.#info.radii.visual.max - rMin, l = this.#info.lifetime, c = this.#info.color;
            p5.push();
            p5.translate(x, y);
            for (let i = 0; i < steps; i++) {
                const v = (i / (steps - 1)) ** 0.1;
                p5.fill(c[0] * v, c[1] * v, c[2] * v, alpha * (i / (steps - 1)) ** 0.8);
                p5.circle(0, 0, (1 - i / (steps - 1)) * 2 * (dr * (d / l) + rMin));
            }
            p5.pop();
        }
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
    #lifetime;
    get lifetime() { return this.#lifetime; }
    #start;
    get start() { return this.#start; }
    #end;
    get end() { return this.#end; }
    #created;
    get created() { return this.#created; }
    #velocities;
    get velocities() { return this.#velocities; }
    #info;
    constructor(body, emitter, angle, start, created, vel) {
        this.#body = body;
        this.#emitter = emitter;
        this.#angle = this.#trajectory = angle;
        this.#start = start;
        this.#info = gamespace.bulletInfo[this.#emitter.caliber].casing;
        const l = this.#info.lifetime;
        this.#lifetime = +meanDevPM_random(l.value, l.variation, l.plusOrMinus);
        const sin = Math.sin(angle), cos = Math.cos(angle);
        this.#end = {
            x: start.x + vel.parr * this.#lifetime / 1000 * sin - vel.perp * this.#lifetime / 1000 * cos,
            y: start.y - vel.parr * this.#lifetime / 1000 * cos - vel.perp * this.#lifetime / 1000 * sin
        };
        this.#created = created;
        this.#velocities = vel;
        gamespace.objects.casings.push(this);
    }
    update() {
        const t = gamespace._currentUpdate - this.#created;
        Matter.Body.setPosition(this.#body, {
            x: +linterp(this.#start.x, this.#end.x, clamp(t / this.#lifetime, 0, 1)),
            y: +linterp(this.#start.y, this.#end.y, clamp(t / this.#lifetime, 0, 1))
        });
        this.#angle = this.#trajectory + this.#velocities.angular * t / 1000;
        if (t >= this.#lifetime) {
            Matter.World.remove(gamespace.world, this.#body);
            gamespace.objects.casings.splice(gamespace.objects.casings.findIndex(c => c.#body.id == this.#body.id), 1);
            this.destroy();
        }
    }
    draw() {
        const b = this.#body, p5 = gamespace.p5;
        if (!b) {
            return;
        }
        if (!gamespace.player ||
            +squaredDist(b.position, (gamespace.player ? gamespace.player.body.position : { x: gamespace.camera.eyeX, y: gamespace.camera.eyeY })) < gamespace.player.renderDist ** 2) {
            p5.push();
            p5.translate(b.position.x, b.position.y);
            p5.rotate(this.#angle);
            p5.imageMode(p5.CENTER);
            p5.scale(1 - ((gamespace._currentUpdate - this.#created) / this.#lifetime) ** 2);
            p5.image(this.#info.img, 0, 0, this.#info.width, this.#info.height);
            p5.pop();
        }
    }
    destroy() {
        this.#body = this.#emitter = void 0;
    }
}
