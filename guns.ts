class gunPrototype {
    name: string;
    summary: {
        class: string,
        engagementDistance: {
            min: number,
            max: number;
        },
        shouldNoslow: boolean,
        role: "primary" | "secondary";
    };
    dual: boolean;
    images: {
        loot: {
            img: import("p5").Image | void,
            src: string | false;
        } | void,
        held: {
            img: import("p5").Image | void,
            src: string | false;
        } | void,
        silhouette: {
            img: import("p5").Image | void,
            src: string | false;
        } | void;
    } = {
            loot: void 0,
            held: void 0,
            silhouette: void 0
        };
    ballistics: {
        damage: number,
        velocity: number,
        range: number,
        obstacleMult: number,
        headshotMult: number,
        tracer: {
            width: number,
            height: number;
        },
        projectiles: number,
        falloff: number,
        fsaCooldown: number;
    };
    caliber: string;
    delay: number;
    accuracy: { default: number; moving: number; } = {
        default: 0,
        moving: 0,
    };
    imageOffset: { x: number; y: number; } = { x: 0, y: 0 };
    dimensions: {
        width: number,
        height: number,
        layer: 0 | 1 | 2;
    };
    switchDelay: number;
    hands: {
        lefthand: {
            x: number; y: number;
        }; righthand?: {
            x: number; y: number;
        };
    } = {
            lefthand: { x: 0.5, y: -1 },
            righthand: { x: 0.5, y: -1 }
        };
    tint: string;
    spawnOffset: { x: number; y: number; } = { x: 0, y: 0 };
    suppressed: boolean;
    casing: {
        spawnOffset: {
            perp: number;
            parr: number;
        },
        velocity: {
            perp: {
                value: number,
                variation: {
                    value: number;
                    plusOrMinus: boolean;
                };
            },
            parr: {
                value: number;
                variation: {
                    value: number,
                    plusOrMinus: boolean;
                };
            },
            angular: {
                value: number,
                variation: {
                    value: number;
                    plusOrMinus: boolean;
                };
            };
        };
        spawnOn: "fire" | "reload",
        spawnDelay: number;
    };
    recoilImpulse: { x: number; y: number; duration: number; } = { x: 0, y: -5, duration: 80 };
    fireModes: ("automatic" | "semi" | `${"auto-" | ""}burst-${number}`)[] = ["automatic"];
    burstProps: { shotDelay: number; burstDelay: number; } = {
        shotDelay: 60,
        burstDelay: 500,
    };
    reload: {
        duration: number,
        ammoReloaded: number | "all",
        chain: boolean;
    };
    altReload?: {
        duration: number,
        ammoReloaded: number | "all",
        chain: boolean;
    };
    magazineCapacity: {
        normal: number,
        firepower: number;
    };
    moveSpeedPenalties: {
        active: number,
        firing: number;
    };
    deployGroup: number;

    constructor(name: string,
        summary: typeof gunPrototype.prototype.summary,
        dual: boolean,
        images: typeof gunPrototype.prototype.images,
        tint: string,
        ballistics: typeof gunPrototype.prototype.ballistics,
        caliber: string,
        delay: number,
        accuracy: typeof gunPrototype.prototype.accuracy,
        imageOffset: typeof gunPrototype.prototype.imageOffset,
        dimensions: typeof gunPrototype.prototype.dimensions,
        hands: typeof gunPrototype.prototype.hands,
        spawnOffset: typeof gunPrototype.prototype.spawnOffset,
        suppressed: boolean,
        recoilImpulse: typeof gunPrototype.prototype.recoilImpulse,
        fireMode: typeof gunPrototype.prototype.fireModes,
        burstProps: typeof gunPrototype.prototype.burstProps,
        reload: typeof gunPrototype.prototype.reload,
        capacity: typeof gunPrototype.prototype.magazineCapacity,
        switchDelay: number,
        casing: typeof gunPrototype.prototype.casing,
        moveSpeedPenalties: typeof gunPrototype.prototype.moveSpeedPenalties,
        deployGroup: number,
        altReload?: typeof gunPrototype.prototype.altReload
    ) {
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
    #proto: gunPrototype;
    get proto() { return this.#proto; }

    #activeFireModeIndex: number = 0;
    get activeFireModeIndex() { return this.#activeFireModeIndex; }
    set activeFireModeIndex(v) {
        const f = this.proto.fireModes;
        this.#activeFireMode = f[this.#activeFireModeIndex = v % f.length];
    };

    #activeFireMode: (typeof gunPrototype.prototype.fireModes)[number];
    get activeFireMode() { return this.#activeFireMode; }

    #ammo: number = 0;
    get ammo() { return this.#ammo; }
    set ammo(v) { this.#ammo = Math.max(0, v); }

    recoilImpulseParity: -1 | 1 = 1;

    constructor(proto: gunPrototype) {
        this.#proto = proto;
        this.#activeFireMode = proto.fireModes[this.activeFireModeIndex];
        this.ammo = proto.magazineCapacity.normal;
    }
    primary(shooter: playerLike) {
        const p = shooter,
            b = p.body,
            ip = this.#proto,
            fire = this.activeFireMode,
            burst = !!fire.match(/(auto-)?burst-/);

        if ((gamespace._currentUpdate - p.state.lastShot[p.inventory.activeIndex]) >= (burst ? (ip.burstProps.burstDelay ?? ip.delay) : ip.delay) &&
            this.#ammo &&
            !p.state.frozen &&
            !p.timers.firing
        ) {
            p.state.fired = 0;
            shooter.timers.firing = setTimeout(function a(weapon: gun) {
                const exceed = p.state.fired >= +fire.replace(/(auto-)?burst-/, "");

                if (
                    !gamespace.objects.players.find(p => p.body.id == b.id) ||
                    (p.state.reloading && p.timers.reloading.all) ||
                    (!p.state.attacking && !(burst && !exceed)) ||
                    (burst && (!fire.startsWith("auto-burst-") && exceed)) ||
                    (!weapon.#ammo) ||
                    (gamespace._currentUpdate - p.state.lastSwitch < p.state.eSwitchDelay) ||
                    shooter.state.frozen
                ) {
                    p.state.fired = 0;
                    p.state.firing = false;

                    p.timers.firing && clearTimeout(p.timers.firing as number);
                    p.timers.firing = false;

                    if (
                        (p.state.reloading && p.timers.reloading.all) ||
                        (gamespace._currentUpdate - p.state.lastSwitch < p.state.eSwitchDelay)
                    ) {
                        p.timers.firing = setTimeout(() => {
                            p.timers.firing && clearTimeout(p.timers.firing);
                            p.timers.firing = false;

                            if (p.state.attacking) {
                                p.inventory.activeItem.primary(p);
                            }
                        }, (p.state.reloading && p.timers.reloading.all) ? weapon.#proto[`${weapon.#proto.altReload && !weapon.#ammo ? "altR" : "r"}eload` as badCodeDesign].duration - (gamespace._currentUpdate - p.state.reloading) : p.state.eSwitchDelay - (gamespace._currentUpdate - p.state.lastSwitch)) as any as number;
                    }
                    return;
                }

                if (burst && fire.startsWith("auto-burst-") && exceed) {
                    p.state.fired = 0;
                    p.state.firing = false;
                    p.timers.firing = setTimeout(a, weapon.#proto.burstProps.burstDelay, weapon) as badCodeDesign;
                    return;
                }

                p.state.reloading && weapon.stopReload(p);

                p.state.noSlow = false;
                p.state.fired++;
                weapon.ammo--;
                p.state.lastShot[p.inventory.activeIndex] = gamespace._currentUpdate;
                p.state.firing = true;
                p.events.dispatchEvent("firing", weapon);
                if (weapon.#proto.dual) { weapon.recoilImpulseParity *= -1; }

                const pr = weapon.#proto.ballistics.projectiles;
                for (let i = 0; i < pr; i++) {
                    const a = (p.state.lastShot[p.inventory.activeIndex] - gamespace._currentUpdate) > weapon.#proto.ballistics.fsaCooldown ? 0 : ip.accuracy.default + +(p.state.moving && ip.accuracy.moving),
                        s = gamespace.bulletInfo[weapon.#proto.caliber].spawnVar,
                        spawnOffset = () => +meanDevPM_random(s.mean, s.variation, s.plusOrMinus),
                        start = {
                            x: b.position.x + (50 + ip.spawnOffset.y + spawnOffset()) * Math.sin(p.angle) + (weapon.recoilImpulseParity * ip.spawnOffset.x + spawnOffset()) * Math.cos(p.angle),
                            y: b.position.y - (50 + ip.spawnOffset.y + spawnOffset()) * Math.cos(p.angle) + (weapon.recoilImpulseParity * ip.spawnOffset.x + spawnOffset()) * Math.sin(p.angle)
                        },
                        dev = p.angle + a * (Math.random() - 0.5),
                        body = Matter.Bodies.rectangle(
                            start.x,
                            start.y,
                            ip.ballistics.tracer.width,
                            50 + ip.spawnOffset.y,
                            { isStatic: false, friction: 1, restitution: 0, density: 1, angle: dev }
                        );

                    new bullet(
                        body,
                        p,
                        ip,
                        dev,
                        start,
                        gamespace._currentUpdate,
                        weapon.#proto.ballistics.headshotMult != 1 && gamespace.settings.balanceChanges.weapons.general.headshots && Math.random() >= 0.85,
                        gamespace.bulletInfo[ip.caliber].projectileInfo.type
                    );
                }

                if (ip.casing.spawnOn == "fire") {
                    try {
                        if (!ip.casing.spawnDelay) {
                            weapon.makeCasing(p);
                        } else {
                            setTimeout(() => {
                                if (p.inventory.activeItem.#proto.name == weapon.#proto.name) {
                                    weapon.makeCasing(p);
                                }
                            }, ip.casing.spawnDelay);
                        }
                    } catch { }
                }

                if (!weapon.#ammo) {
                    p.timers.anticipatedReload = setTimeout(weapon.reload.bind(weapon), !burst ? weapon.#proto.delay : weapon.#proto.burstProps.shotDelay, shooter) as any as number;
                }

                if (fire == "semi") {
                    p.state.firing = false;
                    p.timers.firing && clearTimeout(p.timers.firing);
                    p.timers.firing = false;
                    return;
                }

                shooter.timers.firing = setTimeout(a, fire == "automatic" ? weapon.#proto.delay : weapon.#proto.burstProps.shotDelay, weapon) as any as number;
            }, 0, this) as any as number;
        }
    }
    reload(shooter: playerLike) {
        if (this.#ammo == this.#proto.magazineCapacity.normal || shooter.state.reloading) { return; }
        shooter.events.dispatchEvent("reloading", this);

        shooter.state.firing = false;
        shooter.timers.firing && clearTimeout(shooter.timers.firing);
        shooter.timers.firing = false;

        shooter.timers.reloading.timer && clearTimeout(shooter.timers.reloading.timer);
        shooter.timers.reloading.timer = false;

        shooter.state.reloading = gamespace._currentUpdate;
        const reloadToUse = this.#proto[`${this.#proto.altReload && !this.#ammo ? "altR" : "r"}eload`] as { duration: number; ammoReloaded: number | "all"; chain: boolean; };


        if (this.#proto.casing.spawnOn == "reload") {
            try {
                if (!this.#proto.casing.spawnDelay) {
                    for (let i = 0; i < this.#proto.magazineCapacity.normal; i++, this.makeCasing(shooter));
                } else {
                    setTimeout(() => {
                        if (shooter.inventory.activeItem.#proto.name == this.#proto.name) {
                            for (let i = 0; i < this.#proto.magazineCapacity.normal; i++, this.makeCasing(shooter));
                        }
                    }, this.#proto.casing.spawnDelay);
                }
            } catch { }
        }

        shooter.timers.reloading = {
            timer: setTimeout(() => {
                this.#ammo = Math.min(this.#ammo + (reloadToUse.ammoReloaded == "all" ? Infinity : reloadToUse.ammoReloaded as number), this.#proto.magazineCapacity.normal);
                shooter.state.reloading = false;

                if (this.#ammo < this.#proto.magazineCapacity.normal && reloadToUse.chain) {
                    this.reload(shooter);
                } else {
                    shooter.timers.reloading.timer && clearTimeout(shooter.timers.reloading.timer);
                    shooter.timers.reloading.timer = shooter.timers.reloading.all = false;
                }
            }, reloadToUse.duration) as badCodeDesign as number,
            all: reloadToUse.ammoReloaded == "all"
        };
    }
    stopReload(shooter: playerLike) {
        if (shooter.state.reloading) {
            clearTimeout(shooter.timers.reloading.timer as badCodeDesign);
            shooter.timers.reloading.timer = shooter.timers.reloading.all = false;
            shooter.events.dispatchEvent("stopReload", this);
            if (shooter.timers.firing) {
                clearTimeout(shooter.timers.firing as badCodeDesign);
                shooter.timers.firing = false;
                this.primary(shooter);
            }
            shooter.state.reloading = shooter.timers.reloading.timer = shooter.timers.reloading.all = false;
        }
    }
    makeCasing(shooter: playerLike) {
        if (!shooter.body) { return; }

        const p = shooter,
            b = p.body,
            ip = this.#proto,
            sin = Math.sin(p.angle),
            cos = Math.cos(p.angle),
            c = ip.casing,
            start = {
                x: b.position.x + (50 + c.spawnOffset.parr) * sin - +(this.recoilImpulseParity * c.spawnOffset.perp * cos),
                y: b.position.y - (50 + c.spawnOffset.parr) * cos - +(this.recoilImpulseParity * c.spawnOffset.perp * sin)
            };

        new casing(
            Matter.Bodies.rectangle(
                start.x,
                start.y,
                0,
                0,
                { isStatic: false, friction: 1, restitution: 0, density: 1, angle: p.angle }
            ),
            ip,
            p.angle,
            start,
            gamespace._currentUpdate,
            {
                perp: +meanDevPM_random(c.velocity.perp.value, c.velocity.perp.variation.value, c.velocity.perp.variation.plusOrMinus),
                parr: +meanDevPM_random(c.velocity.parr.value, c.velocity.parr.variation.value, c.velocity.parr.variation.plusOrMinus),
                angular: +meanDevPM_random(c.velocity.angular.value, c.velocity.angular.variation.value, c.velocity.angular.variation.plusOrMinus)
            }
        );
    }
}

abstract class projectile {
    #body: Matter.Body;
    get body() { return this.#body; }

    #shooter: playerLike;
    get shooter() { return this.#shooter; }

    #emitter: gunPrototype;
    get emitter() { return this.#emitter; }

    #angle: number;
    get angle() { return this.#angle; }

    #trajectory: number;
    get trajectory() { return this.#trajectory; }

    #start: { x: number; y: number; };
    get start() { return this.#start; }

    #end: { x: number, y: number; };
    get end() { return this.#end; }

    #created: timestamp;
    get created() { return this.#created; }

    #crit: boolean;
    get crit() { return this.#crit; }

    #alpha: number;
    get alpha() { return this.#alpha; }

    #damage: number;
    get damage() { return this.#damage; }

    #squaredDistance: number = 0;
    get sqauredDistance() { return this.#squaredDistance; }

    #shrapnel: boolean;
    get shrapnel() { return this.#shrapnel; }

    #lastFalloffStep: number = 0;

    constructor(body: Matter.Body, shooter: playerLike, emitter: gunPrototype, angle: number, start: { x: number, y: number; }, end: { x: number, y: number; }, created: number, crit: boolean, damage: number, isShrapnel: boolean) {
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
    update(lifetime: number, spinVel: number, type: typeof gamespace.bulletInfo[string]["projectileInfo"]["type"], explosionInfo: { explosionType: string, explodeOnContact: boolean, maxDist: number, heightPeak: number; }) {
        const bd = this.body,
            removeBullet = () => {
                Matter.World.remove(gamespace.world, bd);
                gamespace.objects.bullets.splice(gamespace.objects.bullets.findIndex(b => b.body.id == bd.id), 1);
                this.destroy();
            },
            makeExplosion = () => {
                new explosion(bd.position, this.#shooter, this.#emitter, this.#crit);
            },
            dt = (gamespace._currentUpdate - this.#created) / 1000;

        this.#angle = this.#trajectory + dt * spinVel;

        Matter.Body.setPosition(bd,
            {
                x: +linterp(this.#start.x, this.#end.x, clamp(dt / lifetime, 0, 1)),
                y: +linterp(this.#start.y, this.#end.y, clamp(dt / lifetime, 0, 1))
            }
        );

        this.#squaredDistance = +squaredDist(this.#start, bd.position);

        if (
            this.#squaredDistance > Math.min(this.#emitter.ballistics.range, type == "explosive" ? explosionInfo.maxDist : Infinity) ** 2 ||
            dt > Math.min(lifetime, type == "explosive" ? explosionInfo.maxDist / this.#emitter.ballistics.velocity : Infinity)
        ) {
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
                const f = (pl: playerLike) => pl.body.id == p.bodyA.id,
                    target = gamespace.objects.players.find(f) as playerLike,
                    d = sigFigIshMult(this.#damage, this.#crit ? this.#emitter.ballistics.headshotMult : 1);

                if (target.body.id == this.#shooter.body?.id && !this.#shrapnel) {
                    return;
                }

                if (type == "explosive" && explosionInfo.explodeOnContact) {
                    makeExplosion();
                } else if (!target.state.invuln) {
                    target.damage(d, this);
                }

                removeBullet();
            }
        }
    }
    draw(info: {
        tints: {
            normal: string;
            saturated: string;
            saturated_alt?: string;
            chambered: string;
        };
        alpha: {
            rate: number;
            min: number;
            max: number;
        };
        imageOffset: {
            parr: number;
            perp: number;
        };
        dimensions: {
            width: number;
            height: number;
        };
        projectileInfo: ({
            type: "explosive";
            explosionType: string;
            explodeOnContact: boolean;
            maxDist: number;
            heightPeak: number;
        } | {
            type: "bullet";
        }) & {
            img: import("p5").Image;
            spinVel: number;
        };
    }, lifetime: number) {
        const bd = this.#body,
            p5 = gamespace.p5;
        if (!bd) { return; }

        if (
            !gamespace.player ||
            +squaredDist(bd.position, (gamespace.player ? gamespace.player.body.position : { x: gamespace.camera.eyeX, y: gamespace.camera.eyeY })) < gamespace.player.renderDist ** 2
        ) {
            p5.push();
            p5.imageMode(p5.CENTER);
            p5.translate(bd.position.x, bd.position.y);
            p5.rotate(this.#angle);
            if (info.projectileInfo.type == "explosive") {
                const dt = (gamespace._currentUpdate - this.#created) / 1000,
                    s = (-info.projectileInfo.heightPeak * dt * (dt - lifetime) / 2) ** 0.75 + 1;

                p5.scale(s, s);
            }
            const c = p5.color(info.tints[this.#crit && gamespace.settings.bonusFeatures.headshotsUseSaturatedTracers ? (gamespace.settings.bonusFeatures.useInterpolatedSaturatedTracers && info.tints.saturated_alt) ? "saturated_alt" : "saturated" : "normal"] ?? "#FFF");

            if (this.#emitter.suppressed) {
                const min = info.alpha.min * 255,
                    max = info.alpha.max * 255,
                    dir = Math.sign(1 - info.alpha.rate) as -1 | 0 | 1;

                if ((min != this.#alpha && dir != -1) || (this.#alpha != max && dir != 1)) {
                    this.#alpha = +clamp(this.#alpha * info.alpha.rate, min, max);
                }

                c.setAlpha(this.#alpha);
            }

            p5.tint(c);

            const l = Math.min(info.dimensions.height, +distance(bd.position, this.#start)),
                w = info.dimensions.width,
                o = info.imageOffset;

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
        this.#body = this.#shooter = this.#emitter = void 0 as badCodeDesign;
    }
}

class bullet extends projectile {
    #lifetime: number;
    get lifetime() { return this.#lifetime; }

    #info: typeof gamespace.bulletInfo[string];
    get info() { return this.#info; }

    #type: typeof gamespace.bulletInfo[string]["projectileInfo"]["type"];
    get type() { return this.#type; }

    #squaredDistance: number = 0;
    get sqauredDistance() { return this.#squaredDistance; }

    constructor(body: Matter.Body, shooter: playerLike, emitter: gunPrototype, angle: number, start: { x: number; y: number; }, created: number, crit: boolean, type: typeof bullet.prototype.type) {
        super(
            body,
            shooter,
            emitter,
            angle,
            start,
            {
                x: start.x + emitter.ballistics.range * Math.sin(angle),
                y: start.y - emitter.ballistics.range * Math.cos(angle)
            },
            created,
            crit,
            emitter.ballistics.damage,
            false
        );

        this.#lifetime = emitter.ballistics.range / emitter.ballistics.velocity;

        this.#type = type;
        this.#info = gamespace.bulletInfo[emitter.caliber];
        gamespace.objects.bullets.push(this);
    }

    update() {
        super.update(this.#lifetime, this.#info.projectileInfo.spinVel, this.#type, this.#info.projectileInfo as badCodeDesign);
    }
    draw() {
        if (!this.body) { return; }
        const i: badCodeDesign = this.#info;
        i.dimensions = { width: this.emitter.ballistics.tracer.width, height: this.emitter.ballistics.tracer.height };

        super.draw(i, this.#lifetime);
    }
}

class shrapnel extends projectile {
    #lifetime: number;
    get lifetime() { return this.#lifetime; }

    #range: number;
    get range() { return this.#range; }

    #info: typeof gamespace.explosionInfo[string]["shrapnel"];
    get info() { return this.#info; }

    constructor(body: Matter.Body, shooter: playerLike, emitter: gunPrototype, angle: number, start: { x: number, y: number; }, created: number, crit: boolean) {
        const i = gamespace.explosionInfo[(gamespace.bulletInfo[emitter.caliber].projectileInfo as { explosionType: string; }).explosionType].shrapnel,
            r = +meanDevPM_random(i.range.value, i.range.variation.value, i.range.variation.plusOrMinus);

        super(body,
            shooter,
            emitter,
            angle,
            start,
            {
                x: start.x + r * Math.sin(angle),
                y: start.y - r * Math.cos(angle)
            },
            created,
            crit,
            i.damage,
            true
        );

        this.#lifetime = r / i.velocity;

        this.#info = i;
        this.#range = r;
        gamespace.objects.bullets.push(this);
    }
    update() {
        super.update(this.#lifetime, 0, "bullet", void 0 as badCodeDesign);
    }
    draw() {
        if (!this.body) { return; }
        const i = this.#info,
            c = toHex(i.color);

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
    #origin: { x: number, y: number; };
    get origin() { return this.#origin; }

    #createdAt: timestamp;
    get createdAt() { return this.#createdAt; }

    #shooter: playerLike;
    get shooter() { return this.#shooter; }

    #emitter: gunPrototype;
    get emitter() { return this.#emitter; }

    #crit: boolean;
    get crit() { return this.#crit; }

    #damage: number;
    get damage() { return this.#damage; }

    #id: number;
    get id() { return this.#id; }

    #info: typeof gamespace.explosionInfo[string];
    get info() { return this.#info; }

    static #steps: number = 50;
    get steps() { return explosion.#steps; }

    static {
        const map = new Map<number, number | Decimal>(),
            o = {
                x: [15, 10, 20, 25, 30, 40, 50, 75, 100],
                y: [53, 87, 39, 31, 25, 19, 16, 10, 9]
            },
            lx = Decimal.div(o.x.reduce((prev, curr) => prev.plus(Decimal.ln(curr)), new Decimal(0)), o.x.length),
            ly = Decimal.div(o.y.reduce((prev, curr) => prev.plus(Decimal.ln(curr)), new Decimal(0)), o.y.length),
            sxy = o.x.reduce((prev, curr) => prev.plus(Decimal.ln(curr).minus(lx).pow(2)), new Decimal(0)),
            sxx = o.x.reduce((prev, curr, i) => prev.plus(Decimal.mul(Decimal.ln(curr).minus(lx), Decimal.ln(o.y[i]).minus(ly))), new Decimal(0)),
            B = sxx.div(sxy),
            A = Decimal.exp(B.times(ly).add(lx)),
            f = (x: number) => Decimal.pow(x, B).mul(A);
        // https://www.desmos.com/calculator/dangvg2nbc

        for (const i in o.x) {
            map.set(o.x[i], o.y[i]);
        }

        Object.defineProperty(explosion, "#steps", {
            set(v: number) {
                explosion.#steps = v;

                if (map.has(v)) {
                    explosion.#alpha = +(map.get(v) as Decimal);
                } else {
                    const res = f(v);

                    explosion.#alpha = +res;
                    map.set(v, res);
                }
            }
        });
    }

    static #alpha: number = 16;
    get alpha() { return explosion.#alpha; }

    constructor(origin: { x: number, y: number; }, shooter: playerLike, emitter: gunPrototype, crit: boolean) {
        this.#origin = origin;
        this.#createdAt = gamespace._currentUpdate;
        this.#id = generateId.next().value;
        this.#crit = crit;
        this.#shooter = shooter;
        this.#emitter = emitter;
        this.#info = gamespace.explosionInfo[(gamespace.bulletInfo[this.#emitter.caliber].projectileInfo as { explosionType: string; }).explosionType];
        this.#damage = this.#info.damage;
        gamespace.objects.explosions.push(this);

        gamespace.objects.players
            .map(p => ({ player: p, dist: +squaredDist(p.body.position, origin) }))
            .filter(p => p.dist <= 600 ** 2 && !p.player.state.invuln)
            .sort((a, b) => b.dist - a.dist)
            .forEach(p => {
                const d = this.#info.damage * (p.dist < this.#info.radii.damage.min ** 2 ? 1 : (1 - (p.dist / (this.#info.radii.damage.max ** 2)))),
                    target = p.player;

                target.damage(d, this);
            });

        const s = this.#info.shrapnel,
            count = s.count,
            r = this.#info.radii.visual.min,
            body = (ang: number, mag: number) => {
                return Matter.Bodies.rectangle(
                    origin.x + mag * Math.sin(ang),
                    origin.y - mag * Math.cos(ang),
                    s.tracer.width,
                    s.tracer.height / 10,
                    { isStatic: false, friction: 1, restitution: 0, density: 1, angle: ang }
                );
            };


        for (let i = 0; i < count; i++) {
            const ang = Math.random() * Math.PI * 2,
                mag = Math.random() * r / 5;

            new shrapnel(
                body(ang, mag),
                shooter,
                emitter,
                ang,
                {
                    x: origin.x + mag * Math.sin(ang),
                    y: origin.y - mag * Math.cos(ang)
                },
                gamespace._currentUpdate,
                crit
            );
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
            const p5 = gamespace.p5,
                { x, y } = this.#origin,
                steps = explosion.#steps,
                alpha = explosion.#alpha,
                d = gamespace._currentUpdate - this.#createdAt,
                rMin = this.#info.radii.visual.min,
                dr = this.#info.radii.visual.max - rMin,
                l = this.#info.lifetime,
                c = this.#info.color;


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
    #body: Matter.Body;
    get body() { return this.#body; }

    #emitter: gunPrototype;
    get emitter() { return this.#emitter; }

    #angle: number;
    get angle() { return this.#angle; }

    #trajectory: number;
    get trajectory() { return this.#trajectory; }

    #lifetime: number;
    get lifetime() { return this.#lifetime; }

    #start: { x: number; y: number; };
    get start() { return this.#start; }

    #end: { x: number; y: number; };
    get end() { return this.#end; }

    #created: timestamp;
    get created() { return this.#created; }

    #velocities: { parr: number, perp: number, angular: number; };
    get velocities() { return this.#velocities; }

    #info: typeof gamespace.bulletInfo[string]["casing"];

    constructor(body: Matter.Body, emitter: gunPrototype, angle: number, start: { x: number; y: number; }, created: number, vel: { parr: number, perp: number, angular: number; }) {
        this.#body = body;
        this.#emitter = emitter;
        this.#angle = this.#trajectory = angle;
        this.#start = start;
        this.#info = gamespace.bulletInfo[this.#emitter.caliber].casing;

        const l = this.#info.lifetime;
        this.#lifetime = +meanDevPM_random(l.value, l.variation, l.plusOrMinus);

        const sin = Math.sin(angle),
            cos = Math.cos(angle);

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
        const b = this.#body,
            p5 = gamespace.p5;
        if (!b) { return; }

        if (
            !gamespace.player ||
            +squaredDist(b.position, (gamespace.player ? gamespace.player.body.position : { x: gamespace.camera.eyeX, y: gamespace.camera.eyeY })) < gamespace.player.renderDist ** 2
        ) {
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
        this.#body = this.#emitter = void 0 as badCodeDesign;
    }
}