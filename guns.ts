class gunPrototype {
    name: string;
    summary: {
        class: TOrFT<string, []>,
        engagementDistance: {
            min: TOrFT<number, []>,
            max: TOrFT<number, []>;
        },
        shouldNoslow: TOrFT<boolean, []>,
        role: TOrFT<"primary" | "secondary", []>;
    };
    dual: TOrFT<boolean, [gun, playerLike]>;
    images: {
        loot: {
            img: TOrFT<import("p5").Image, [gun, playerLike]>,
            src: TOrFT<string, []>;
        },
        held: {
            img: TOrFT<import("p5").Image, [gun, playerLike]>,
            src: TOrFT<string, []>;
        },
        silhouette: {
            img: TOrFT<import("p5").Image, [gun, playerLike]>,
            src: TOrFT<string, []>;
        };
    };
    ballistics: {
        damage: TOrFT<number, [gun, playerLike]>,
        velocity: TOrFT<number, [gun, playerLike]>,
        range: TOrFT<number, [gun, playerLike]>,
        obstacleMult: TOrFT<number, [gun, playerLike]>,
        headshotMult: TOrFT<number, [gun, playerLike]>,
        tracer: {
            width: TOrFT<number, [gun, playerLike]>,
            height: TOrFT<number, [gun, playerLike]>;
        },
        hitboxLength: TOrFT<number, [gun, playerLike]>;
        projectiles: TOrFT<number, [gun, playerLike]>,
        falloff: TOrFT<number, [gun, playerLike]>,
        fsaCooldown: TOrFT<number, [gun, playerLike]>;
    };
    caliber: TOrFT<string, [gun, playerLike]>;
    delay: TOrFT<number, [gun, playerLike]>;
    accuracy: {
        default: TOrFT<number, [gun, playerLike]>,
        moving: TOrFT<number, [gun, playerLike]>;
    } = {
            default: 0,
            moving: 0,
        };
    imageOffset: {
        perp: TOrFT<number, [gun, playerLike]>,
        parr: TOrFT<number, [gun, playerLike]>;
    } = {
            perp: 0,
            parr: 0
        };
    dimensions: {
        width: TOrFT<number, [gun, playerLike]>,
        height: TOrFT<number, [gun, playerLike]>,
        layer: TOrFT<0 | 1 | 2, [gun, playerLike]>;
    };
    switchDelay: TOrFT<number, [gun, playerLike]>;
    hands: {
        lefthand: {
            perp: TOrFT<number, [gun, playerLike]>,
            parr: TOrFT<number, [gun, playerLike]>;
        }; righthand?: {
            perp: TOrFT<number, [gun, playerLike]>,
            parr: TOrFT<number, [gun, playerLike]>;
        };
    } = {
            lefthand: {
                perp: 0.5,
                parr: -1
            },
            righthand: {
                perp: 0.5,
                parr: -1
            }
        };
    tint: TOrFT<hexColor, [gun, playerLike]>;
    spawnOffset: {
        perp: TOrFT<number, [gun, playerLike]>,
        parr: TOrFT<number, [gun, playerLike]>;
    } = {
            perp: 0,
            parr: 0
        };
    suppressed: TOrFT<boolean, [gun, playerLike]>;
    casing: {
        spawnOffset: {
            perp: TOrFT<number, [gun, playerLike]>;
            parr: TOrFT<number, [gun, playerLike]>;
        },
        velocity: {
            perp: TOrFT<number, [gun, playerLike]>,
            parr: TOrFT<number, [gun, playerLike]>,
            angular: TOrFT<number, [gun, playerLike]>;
        };
        spawnOn: TOrFT<"fire" | "reload", [gun, playerLike]>,
        spawnDelay: TOrFT<number, [gun, playerLike]>;
    };
    recoilImpulse: {
        perp: TOrFT<number, [gun, playerLike]>;
        parr: TOrFT<number, [gun, playerLike]>;
        duration: TOrFT<number, [gun, playerLike]>;
    } = {
            perp: 0,
            parr: -5,
            duration: 80
        };

    fireModes: TOrFT<("automatic" | "semi" | `${"auto-" | ""}burst-${number}`)[], []> = ["automatic"];
    burstProps: {
        shotDelay: TOrFT<number, [gun, playerLike]>,
        burstDelay: TOrFT<number, [gun, playerLike]>;
    } = {
            shotDelay: 60,
            burstDelay: 500,
        };
    reload: {
        duration: TOrFT<number, [gun, playerLike]>,
        ammoReloaded: TOrFT<number | "all", [gun, playerLike]>,
        chain: TOrFT<boolean, [gun, playerLike]>;
    };
    altReload?: {
        duration: TOrFT<number, [gun, playerLike]>,
        ammoReloaded: TOrFT<number | "all", [gun, playerLike]>,
        chain: TOrFT<boolean, [gun, playerLike]>;
    };
    magazineCapacity: {
        normal: TOrFT<number, []>,
        firepower: TOrFT<number, []>;
    };
    moveSpeedPenalties: {
        active: TOrFT<number, [gun, playerLike]>,
        firing: TOrFT<number, [gun, playerLike]>;
    };
    deployGroup: TOrFT<number, [gun, playerLike]>;

    constructor(
        name: typeof gunPrototype.prototype.name,
        summary: typeof gunPrototype.prototype.summary,
        dual: typeof gunPrototype.prototype.dual,
        images: typeof gunPrototype.prototype.images,
        tint: typeof gunPrototype.prototype.tint,
        ballistics: typeof gunPrototype.prototype.ballistics,
        caliber: typeof gunPrototype.prototype.caliber,
        delay: typeof gunPrototype.prototype.delay,
        accuracy: typeof gunPrototype.prototype.accuracy,
        imageOffset: typeof gunPrototype.prototype.imageOffset,
        dimensions: typeof gunPrototype.prototype.dimensions,
        hands: typeof gunPrototype.prototype.hands,
        spawnOffset: typeof gunPrototype.prototype.spawnOffset,
        suppressed: typeof gunPrototype.prototype.suppressed,
        recoilImpulse: typeof gunPrototype.prototype.recoilImpulse,
        fireMode: typeof gunPrototype.prototype.fireModes,
        burstProps: typeof gunPrototype.prototype.burstProps,
        reload: typeof gunPrototype.prototype.reload,
        capacity: typeof gunPrototype.prototype.magazineCapacity,
        switchDelay: typeof gunPrototype.prototype.switchDelay,
        casing: typeof gunPrototype.prototype.casing,
        moveSpeedPenalties: typeof gunPrototype.prototype.moveSpeedPenalties,
        deployGroup: typeof gunPrototype.prototype.deployGroup,
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

    activeFireModeIndex: number = 0;

    get activeFireMode() { return extractValue(this.#proto.fireModes, [])[this.activeFireModeIndex]; }

    #ammo: number = 0;
    get ammo() { return this.#ammo; }
    set ammo(v) { this.#ammo = Math.max(0, v); }

    recoilImpulseParity: -1 | 1 = 1;

    constructor(proto: gunPrototype) {
        this.#proto = proto;
        this.ammo = extractValue(proto.magazineCapacity.normal, []);
    }
    primary(shooter: playerLike) {
        const p = shooter,
            b = p.body,
            ip = this.#proto,
            fire = this.activeFireMode,
            burst = !!fire.match(/(auto-)?burst-/),
            args: [gun, playerLike] = [this, shooter];

        if ((gamespace.currentUpdate - p.state.lastShot[p.inventory.activeIndex]) >= (burst ? (extractValue(ip.burstProps.burstDelay, [this, shooter]) ?? extractValue(ip.delay, [this, shooter])) : extractValue(ip.delay, [this, shooter])) &&
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
                    (gamespace.currentUpdate - p.state.lastSwitch < p.state.eSwitchDelay) ||
                    shooter.state.frozen
                ) {
                    p.state.fired = 0;
                    p.state.firing = false;

                    p.timers.firing && clearTimeout(p.timers.firing as number);
                    p.timers.firing = false;

                    if (
                        (p.state.reloading && p.timers.reloading.all) ||
                        (gamespace.currentUpdate - p.state.lastSwitch < p.state.eSwitchDelay)
                    ) {
                        p.timers.firing = setTimeout(() => {
                            p.timers.firing && clearTimeout(p.timers.firing);
                            p.timers.firing = false;

                            if (p.state.attacking) {
                                p.inventory.activeItem.primary(p);
                            }
                        }, (p.state.reloading && p.timers.reloading.all) ? extractValue(ip[`${ip.altReload && !weapon.#ammo ? "altR" : "r"}eload`]!.duration, args) - (gamespace.currentUpdate - p.state.reloading) : p.state.eSwitchDelay - (gamespace.currentUpdate - p.state.lastSwitch)) as any as number;
                    }
                    return;
                }

                if (burst && fire.startsWith("auto-burst-") && exceed) {
                    p.state.fired = 0;
                    p.state.firing = false;
                    p.timers.firing = setTimeout(a, extractValue(ip.burstProps.burstDelay, args), weapon) as badCodeDesign;
                    return;
                }

                p.state.reloading && weapon.stopReload(p);

                p.state.noSlow = false;
                p.state.fired++;
                weapon.ammo--;
                const ls = p.state.lastShot[p.inventory.activeIndex];
                p.state.firing = true;
                p.events.dispatchEvent("firing", weapon);
                if (extractValue(ip.dual, args)) { weapon.recoilImpulseParity *= -1; }

                const pr = extractValue(ip.ballistics.projectiles, args);
                for (let i = 0; i < pr; i++) {
                    const a = ((gamespace.currentUpdate - ls) > extractValue(ip.ballistics.fsaCooldown, args) ? 0 : extractValue(ip.accuracy.default, args)) + +(p.state.moving && extractValue(ip.accuracy.moving, args)),
                        caliber = extractValue(ip.caliber, args),
                        s = gamespace.bulletInfo.get(caliber)!,
                        parr = extractValue(ip.spawnOffset.parr, args),
                        perp = extractValue(ip.spawnOffset.perp, args),
                        spawnOffset = s.spawnVar,
                        l = extractValue(ip.ballistics.hitboxLength, args),
                        start = {
                            x: b.position.x + (50 + parr + extractValue(spawnOffset, []) - l / 2) * Math.sin(p.angle) + (weapon.recoilImpulseParity * perp + extractValue(spawnOffset, [])) * Math.cos(p.angle),
                            y: b.position.y - (50 + parr + extractValue(spawnOffset, []) - l / 2) * Math.cos(p.angle) + (weapon.recoilImpulseParity * perp + extractValue(spawnOffset, [])) * Math.sin(p.angle)
                        },
                        dev = p.angle + a * (Math.random() - 0.5),
                        body = Matter.Bodies.rectangle(
                            start.x,
                            start.y,
                            extractValue(ip.ballistics.tracer.width, args),
                            l,
                            { isStatic: false, friction: 1, restitution: 0, density: 1, angle: dev }
                        );

                    new bullet(
                        body,
                        p,
                        weapon,
                        dev,
                        start,
                        gamespace.currentUpdate,
                        extractValue(weapon.#proto.ballistics.headshotMult, args) != 1 && gamespace.settings.balanceChanges.weapons.general.headshots && Math.random() >= 0.85,
                        gamespace.bulletInfo.get(caliber)!.projectileInfo.type
                    );
                }

                if (ip.casing.spawnOn == "fire") {
                    try {
                        const d = extractValue(ip.casing.spawnDelay, args);

                        if (!d) {
                            weapon.makeCasing(p);
                        } else {
                            setTimeout(() => {
                                if (p.inventory.activeItem.#proto.name == weapon.#proto.name) {
                                    weapon.makeCasing(p);
                                }
                            }, d);
                        }
                    } catch { }
                }

                p.state.lastShot[p.inventory.activeIndex] = gamespace.currentUpdate;

                if (!weapon.#ammo) {
                    p.timers.anticipatedReload = setTimeout(weapon.reload.bind(weapon), extractValue(!burst ? weapon.#proto.delay : weapon.#proto.burstProps.shotDelay, args), shooter) as any as number;
                }

                if (fire == "semi") {
                    p.state.firing = false;
                    p.timers.firing && clearTimeout(p.timers.firing);
                    p.timers.firing = false;
                    return;
                }

                shooter.timers.firing = setTimeout(a, extractValue(fire == "automatic" ? weapon.#proto.delay : weapon.#proto.burstProps.shotDelay, args), weapon) as any as number;
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

        shooter.state.reloading = gamespace.currentUpdate;
        const args: [gun, playerLike] = [this, shooter],
            r = this.#proto[`${this.#proto.altReload && !this.#ammo ? "altR" : "r"}eload`]!,
            reloadToUse = {
                duration: extractValue(r.duration, args),
                ammoReloaded: extractValue(r.ammoReloaded, args),
                chain: extractValue(r.chain, args)
            };


        if (this.#proto.casing.spawnOn == "reload") {
            const d = extractValue(this.#proto.casing.spawnDelay, args),
                s = extractValue(this.#proto.magazineCapacity.normal, []);

            try {
                if (!d) {
                    for (let i = 0; i < s; i++, this.makeCasing(shooter));
                } else {
                    setTimeout(() => {
                        if (shooter.inventory.activeItem.#proto.name == this.#proto.name) {
                            for (let i = 0; i < s; i++, this.makeCasing(shooter));
                        }
                    }, d);
                }
            } catch { }
        }

        shooter.timers.reloading = {
            timer: setTimeout(() => {
                this.#ammo = Math.min(this.#ammo + (reloadToUse.ammoReloaded == "all" ? Infinity : reloadToUse.ammoReloaded as number), extractValue(this.#proto.magazineCapacity.normal, []));
                shooter.state.reloading = false;

                if (this.#ammo < extractValue(this.#proto.magazineCapacity.normal, []) && reloadToUse.chain) {
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
            args: [gun, playerLike] = [this, shooter],
            parr = extractValue(c.spawnOffset.parr, args),
            perp = extractValue(c.spawnOffset.perp, args),
            start = {
                x: b.position.x + (50 + parr) * sin + +(this.recoilImpulseParity * perp * cos),
                y: b.position.y - (50 + parr) * cos + +(this.recoilImpulseParity * perp * sin)
            };

        new casing(
            Matter.Bodies.rectangle(
                start.x,
                start.y,
                0,
                0,
                { isStatic: false, friction: 1, restitution: 0, density: 1, angle: p.angle }
            ),
            this,
            p,
            start,
            gamespace.currentUpdate,
            {
                perp: extractValue(c.velocity.perp, args),
                parr: extractValue(c.velocity.parr, args),
                angular: extractValue(c.velocity.angular, args)
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

    #emitterInst: gun;
    get emitterInst() { return this.#emitterInst; }

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

    constructor(body: Matter.Body, shooter: playerLike, emitterInst: gun, angle: number, start: { x: number, y: number; }, end: { x: number, y: number; }, created: number, crit: boolean, damage: number, isShrapnel: boolean) {
        this.#body = body;
        this.#shooter = shooter;
        this.#emitterInst = emitterInst;
        this.#emitter = emitterInst.proto;
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
    update(
        lifetime: number,
        spinVel: number,
        type: bulletInfo["projectileInfo"]["type"],
        explosionInfo: {
            explosionType: TOrFT<string, [projectile]>,
            explodeOnContact: TOrFT<boolean, [projectile]>,
            maxDist: TOrFT<number, [projectile]>,
            heightPeak: TOrFT<number, [projectile]>;
        }
    ) {
        const bd = this.body,
            removeBullet = () => {
                Matter.World.remove(gamespace.world, bd);
                gamespace.objects.bullets.splice(gamespace.objects.bullets.findIndex(b => b.body.id == bd.id), 1);
                this.destroy();
            },
            makeExplosion = () => {
                new explosion(bd.position, this.#shooter, this.#emitterInst, this.#crit);
            },
            dt = (gamespace.currentUpdate - this.#created) / 1000,
            args: [gun, playerLike] = [this.#emitterInst, this.#shooter];

        this.#angle = this.#trajectory + dt * spinVel;

        Matter.Body.setPosition(bd,
            {
                x: +linterp(this.#start.x, this.#end.x, clamp(dt / lifetime, 0, 1)),
                y: +linterp(this.#start.y, this.#end.y, clamp(dt / lifetime, 0, 1))
            }
        );

        this.#squaredDistance = +squaredDist(this.#start, bd.position);

        if (
            this.#squaredDistance > Math.min(extractValue(this.#emitter.ballistics.range, args), type == "explosive" ? extractValue(explosionInfo.maxDist, [this]) : Infinity) ** 2 ||
            dt > Math.min(lifetime, type == "explosive" ? extractValue(explosionInfo.maxDist, [this]) / extractValue(this.#emitter.ballistics.velocity, args) : Infinity)
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

            this.#damage = sigFigIshMult(this.#damage, extractValue(this.#emitter.ballistics.falloff, args));
        }

        {
            if (Matter.Query.collides(bd, gamespace.objects.obstacles.map(o => o.body)).length) {
                if (type == "explosive" && explosionInfo.explodeOnContact) {
                    makeExplosion();
                }
                removeBullet();
                return;
            }

            const p = Matter.Query.collides(bd, gamespace.objects.players.map(o => o.body))[0];

            if (p) {
                const f = (pl: playerLike) => pl.body.id == p.bodyA.id,
                    target = gamespace.objects.players.find(f) as playerLike,
                    d = sigFigIshMult(this.#damage, this.#crit ? extractValue(this.#emitter.ballistics.headshotMult, args) : 1);

                if (target.body.id == this.#shooter.body?.id && !this.#shrapnel) {
                    return;
                }

                if (type == "explosive" && explosionInfo.explodeOnContact) {
                    makeExplosion();
                } else if (!target.state.invuln) {
                    {
                        const g = this.#shooter.state.hitsGiven.get(target.name),
                            t = this.#shooter.state.hitsGiven.get(target.name);

                        this.#shooter.state.hitsGiven.set(target.name, { hits: (g?.hits ?? 0) + 1, amount: (g?.amount ?? 0) + d });
                        target.state.hitsTaken.set(this.#shooter.name, { hits: (t?.hits ?? 0) + 1, amount: (t?.amount ?? 0) + d });
                    }

                    target.damage(d, this);
                }

                removeBullet();
            }
        }
    }
    draw(info: {
        alpha: {
            min: TOrFT<number, [gun, playerLike]>,
            max: TOrFT<number, [gun, playerLike]>,
            rate: TOrFT<number, [gun, playerLike]>;
        },
        imageOffset: {
            perp: TOrFT<number, [gun, playerLike]>,
            parr: TOrFT<number, [gun, playerLike]>;
        },
        dimensions: {
            width: TOrFT<number, [gun, playerLike]>,
            height: TOrFT<number, [gun, playerLike]>;
        },
        projectileInfo: {
            type: TOrFT<string, [gun, playerLike]>,
            heightPeak: TOrFT<number, [gun, playerLike]>,
            img: TOrFT<import("p5").Image, [gun, playerLike]>;
        },
        tints: {
            normal: TOrFT<hexColor, [gun, playerLike]>,
            saturated: TOrFT<hexColor, [gun, playerLike]>,
            chambered: TOrFT<hexColor, [gun, playerLike]>;
        };
    }, lifetime: number) {
        const bd = this.#body,
            p5 = gamespace.p5;
        if (!bd) { return; }

        const args: [gun, playerLike] = [this.#emitterInst, this.#shooter];

        if (
            !gamespace.player ||
            +squaredDist(bd.position, (gamespace.player ? gamespace.player.body.position : { x: gamespace.camera.eyeX, y: gamespace.camera.eyeY })) < gamespace.player.renderDist ** 2
        ) {
            p5.push();
            p5.imageMode(p5.CENTER);
            p5.translate(bd.position.x, bd.position.y);
            p5.rotate(this.#angle);
            if (info.projectileInfo.type == "explosive") {
                const dt = (gamespace.currentUpdate - this.#created) / 1000,
                    s = (-info.projectileInfo.heightPeak * dt * (dt - lifetime) / 2) ** 0.75 + 1;

                p5.scale(s, s);
            }
            const c = p5.color(extractValue(info.tints[this.#crit && gamespace.settings.bonusFeatures.headshotsUseSaturatedTracers ? "saturated" : "normal"], args) ?? "#FFF");

            if (extractValue(this.#emitter.suppressed, [this.#emitterInst, this.#shooter])) {
                const min = extractValue(info.alpha.min, args) * 255,
                    max = extractValue(info.alpha.max, args) * 255,
                    rate = extractValue(info.alpha.rate, args),
                    dir = Math.sign(1 - rate) as -1 | 0 | 1;

                if ((min != this.#alpha && dir != -1) || (this.#alpha != max && dir != 1)) {
                    this.#alpha = +clamp(this.#alpha * rate, min, max);
                }

                c.setAlpha(this.#alpha);
            }

            p5.tint(c);

            const h = Math.min(extractValue(info.dimensions.height, args), +distance(bd.position, this.#start)),
                l = extractValue(this.#emitter.ballistics.hitboxLength, args),
                w = extractValue(info.dimensions.width, args),
                o = info.imageOffset;

            p5.image(extractValue(info.projectileInfo.img, args), extractValue(o.perp, args), (h - l) / 2 + extractValue(o.parr, args), w, h);
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

    #info: bulletInfo;
    get info() { return this.#info; }

    #type: bulletInfo["projectileInfo"]["type"];
    get type() { return this.#type; }

    #squaredDistance: number = 0;
    get sqauredDistance() { return this.#squaredDistance; }

    constructor(body: Matter.Body, shooter: playerLike, emitterInst: gun, angle: number, start: { x: number; y: number; }, created: number, crit: boolean, type: typeof bullet.prototype.type) {
        const proto = emitterInst.proto,
            args: [gun, playerLike] = [emitterInst, shooter],
            r = extractValue(proto.ballistics.range, args);

        super(
            body,
            shooter,
            emitterInst,
            angle,
            start,
            {
                x: start.x + r * Math.sin(angle),
                y: start.y - r * Math.cos(angle)
            },
            created,
            crit,
            extractValue(proto.ballistics.damage, args),
            false
        );

        this.#lifetime = r / (extractValue(this.emitter.ballistics.velocity, args) || 0);

        this.#type = type;
        this.#info = gamespace.bulletInfo.get(extractValue(proto.caliber, args))!;
        gamespace.objects.bullets.push(this);
    }

    update() {
        super.update(this.#lifetime, extractValue(this.#info.projectileInfo.spinVel, [this]), this.#type, this.#info.projectileInfo as explosiveProjData);
    }
    draw() {
        if (!this.body) { return; }
        const i: badCodeDesign = this.#info;
        i.dimensions = {
            width: extractValue(this.emitter.ballistics.tracer.width, [this.emitterInst, this.shooter]),
            height: extractValue(this.emitter.ballistics.tracer.height, [this.emitterInst, this.shooter])
        };

        super.draw(i, this.#lifetime);
    }
}

class shrapnel extends projectile {
    #lifetime: number;
    get lifetime() { return this.#lifetime; }

    #range: number;
    get range() { return this.#range; }

    #info: explosionInfo["shrapnel"];
    get info() { return this.#info; }

    constructor(body: Matter.Body, shooter: playerLike, emitterInst: gun, angle: number, start: { x: number, y: number; }, created: number, crit: boolean) {
        const proto = emitterInst.proto,
            args: [gun, playerLike] = [emitterInst, shooter],
            i = gamespace.explosionInfo.get(extractValue((gamespace.bulletInfo.get(extractValue(proto.caliber, args))!.projectileInfo as explosiveProjData).explosionType, []))!.shrapnel,
            r = extractValue(i.range, []);

        super(body,
            shooter,
            emitterInst,
            angle,
            start,
            {
                x: start.x + r * Math.sin(angle),
                y: start.y - r * Math.cos(angle)
            },
            created,
            crit,
            extractValue(i.damage, []),
            true
        );

        this.#lifetime = r / extractValue(i.velocity, []);

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
            c = toHex(extractValue(i.color, []));

        super.draw({
            alpha: {
                rate: 0,
                min: 0.96,
                max: 0.96
            },
            imageOffset: {
                parr: 0,
                perp: 0
            },
            dimensions: {
                width: i.tracer.width,
                height: i.tracer.height
            },
            projectileInfo: {
                type: "bullet",
                img: i.img,
                heightPeak: 0
            },
            tints: {
                normal: c,
                chambered: c,
                saturated: c
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

    #emitterInst: gun;
    get emitterInst() { return this.#emitterInst; }

    #crit: boolean;
    get crit() { return this.#crit; }

    #damage: number;
    get damage() { return this.#damage; }

    #id: number;
    get id() { return this.#id; }

    #info: explosionInfo;
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

    constructor(origin: { x: number, y: number; }, shooter: playerLike, emitterInst: gun, crit: boolean) {
        this.#origin = origin;
        this.#createdAt = gamespace.currentUpdate;
        this.#id = generateId.next().value;
        this.#crit = crit;
        this.#shooter = shooter;
        this.#emitterInst = emitterInst;
        this.#emitter = emitterInst.proto;

        const args: [gun, playerLike] = [this.#emitterInst, this.#shooter];
        this.#info = gamespace.explosionInfo.get(extractValue((gamespace.bulletInfo.get(extractValue(this.#emitter.caliber, args))!.projectileInfo as explosiveProjData).explosionType, []))!;
        this.#damage = extractValue(this.#info.damage, []);
        gamespace.objects.explosions.push(this);

        const max = extractValue(this.#info.radii.damage.max, []);

        gamespace.objects.players
            .map(p => ({ player: p, dist: +squaredDist(p.body.position, origin) }))
            .filter(p => p.dist <= max ** 2 && !p.player.state.invuln)
            .sort((a, b) => b.dist - a.dist)
            .forEach(p => {
                const d = this.#damage * (p.dist < extractValue(this.#info.radii.damage.min, []) ** 2 ? 1 : (1 - (p.dist / (max ** 2)))),
                    target = p.player;

                {
                    const g = this.#shooter.state.hitsGiven.get(target.name),
                        t = this.#shooter.state.hitsGiven.get(target.name);

                    this.#shooter.state.hitsGiven.set(target.name, { hits: (g?.hits ?? 0) + 1, amount: (g?.amount ?? 0) + d });
                    target.state.hitsTaken.set(this.#shooter.name, { hits: (t?.hits ?? 0) + 1, amount: (t?.amount ?? 0) + d });
                }
                target.damage(d, this);
            });

        const s = this.#info.shrapnel,
            count = s.count,
            r = extractValue(this.#info.radii.visual.min, []),
            body = (ang: number, mag: number) => {
                return Matter.Bodies.rectangle(
                    origin.x + mag * Math.sin(ang),
                    origin.y - mag * Math.cos(ang),
                    extractValue(s.tracer.width, []),
                    extractValue(s.tracer.height, []) / 10,
                    { isStatic: false, friction: 1, restitution: 0, density: 1, angle: ang }
                );
            };


        for (let i = 0; i < count; i++) {
            const ang = Math.random() * Math.PI * 2,
                mag = Math.random() * r / 5;

            new shrapnel(
                body(ang, mag),
                shooter,
                emitterInst,
                ang,
                {
                    x: origin.x + mag * Math.sin(ang),
                    y: origin.y - mag * Math.cos(ang)
                },
                gamespace.currentUpdate,
                crit
            );
        }

        new decal(0,
            extractValue(this.#info.decal.img, []),
            {
                width: extractValue(this.#info.decal.width, []),
                height: extractValue(this.#info.decal.height, [])
            },
            extractValue(this.#info.decal.tint, []),
            origin
        );
    }
    update() {
        const dt = gamespace.currentUpdate - this.#createdAt,
            l = extractValue(this.#info.lifetime, []),
            sd = extractValue(this.#info.shakeDuration, []);

        if (dt >= l) {
            gamespace.objects.explosions.splice(gamespace.objects.explosions.findIndex(e => e.#id == this.#id), 1);
        } else {
            gamespace.player.addShake(`explosion${this.#id}`, this.#origin, extractValue(this.#info.shakeStrength, []) * +clamp(Math.max(1 - (dt / sd), 0), 0, 1));
        }
    }
    draw() {
        const l = extractValue(this.#info.lifetime, []);
        if (gamespace.currentUpdate - this.#createdAt < l) {
            const p5 = gamespace.p5,
                { x, y } = this.#origin,
                steps = explosion.#steps,
                alpha = explosion.#alpha,
                d = gamespace.currentUpdate - this.#createdAt,
                rMin = extractValue(this.#info.radii.visual.min, []),
                dr = extractValue(this.#info.radii.visual.max, []) - rMin,
                c = toRGB(extractValue(this.#info.color, []));

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

    #emitterInst: gun;
    get emitterInst() { return this.#emitterInst; }

    // #shooter: playerLike;
    // get shooter() { return this.#shooter; }

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

    #info: bulletInfo["casing"];

    constructor(body: Matter.Body, emitterInst: gun, shooter: playerLike, start: { x: number; y: number; }, created: number, vel: { parr: number, perp: number, angular: number; }) {
        this.#body = body;
        this.#emitterInst = emitterInst;
        this.#emitter = emitterInst.proto;
        this.#angle = this.#trajectory = shooter.angle;
        this.#start = start;
        this.#info = gamespace.bulletInfo.get(extractValue(this.#emitter.caliber, [this.#emitterInst, shooter]))!.casing;
        this.#lifetime = extractValue(this.#info.lifetime, [this]);

        const sin = Math.sin(this.#angle),
            cos = Math.cos(this.#angle);

        this.#end = {
            x: start.x + vel.parr * this.#lifetime / 1000 * sin - vel.perp * this.#lifetime / 1000 * cos,
            y: start.y - vel.parr * this.#lifetime / 1000 * cos - vel.perp * this.#lifetime / 1000 * sin
        };

        this.#created = created;
        this.#velocities = vel;

        gamespace.objects.casings.push(this);
    }

    update() {
        const t = gamespace.currentUpdate - this.#created;

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
            p5.scale(1 - ((gamespace.currentUpdate - this.#created) / this.#lifetime) ** 2);

            p5.image(extractValue(this.#info.img, [this]), 0, 0, extractValue(this.#info.width, [this]), extractValue(this.#info.height, [this]));
            p5.pop();
        }
    }
    destroy() {
        this.#body = this.#emitter = void 0 as badCodeDesign;
    }
}