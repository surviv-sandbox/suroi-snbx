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

class decal {
    image: import("p5").Image;
    width: number;
    height: number;
    tint: string;
    angle: number;
    position: { x: number; y: number; } = { x: 0, y: 0 };

    constructor(angle: number, image: import("p5").Image, dimensions: { width: number; height: number; }, tint: string, position: { x: number; y: number; }) {
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
    #body: Matter.Body;
    get body() { return this.#body; }

    aiIgnore: boolean = false;
    angle: number;
    events = new customEvent();
    health: number;
    maxHealth: number;
    name: string;
    inventory: inventory;
    options: { friction: number; restitution: number; inertia?: number; density: number; };
    #renderDist: number;
    get renderDist() { return this.#renderDist; }
    state: {
        attacking: boolean,
        eSwitchDelay: number,
        fired: number,
        firing: boolean,
        frozen: boolean,
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
        this.options = options;
        this.view = view;
        this.name = name;

        this.inventory = new inventory(this);
        this.inventory.slot0 = new gun(gamespace.guns.find(g => g.name == loadout.guns[0]) as gunPrototype);
        loadout.guns[1] && (this.inventory.slot1 = new gun(gamespace.guns.find(g => g.name == loadout.guns[1]) as gunPrototype));
        this.inventory.activeIndex = Math.round(+clamp(loadout.activeIndex, 0, 1)) as 0 | 1;

        this.health = health;
        this.maxHealth = Math.max(100, health);
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
                radius = 50,
                d = Math.min(item?.recoilImpulse?.duration ?? 0, gamespace.lastUpdate - this.state.lastShot[this.inventory.activeIndex]),
                op = this.state.invuln ? "80" : "";

            function drawBody() {
                p5.fill(`#F8C574${op}`);
                p5.ellipse(0, 0, 2 * radius, 2 * radius, 70);
            }

            function drawItem() {
                p5.tint(`${item.tint ?? "#FFFFFF"}${op}`);
                p5.image(
                    (item.images.held as badCodeDesign).img,
                    (item.offset.x + (ac.recoilImpulseParity == 1 ? item.recoilImpulse.x * (1 - (d / item.recoilImpulse.duration)) : 0)) * radius,
                    (item.offset.y - (ac.recoilImpulseParity == 1 ? item.recoilImpulse.y * (1 - (d / item.recoilImpulse.duration)) : 0)) * radius,
                    item.dimensions.width * radius,
                    item.dimensions.height * radius
                );

                if (item.dual) {
                    p5.image(
                        (item.images.held as badCodeDesign).img,
                        -(item.offset.x + (ac.recoilImpulseParity == -1 ? item.recoilImpulse.x * (1 - (d / item.recoilImpulse.duration)) : 0)) * radius,
                        (item.offset.y - (ac.recoilImpulseParity == -1 ? item.recoilImpulse.y * (1 - (d / item.recoilImpulse.duration)) : 0)) * radius,
                        item.dimensions.width * radius,
                        item.dimensions.height * radius
                    );
                }
                p5.noTint();
            }

            function drawHands() {
                for (let i = 0; i <= 1; i++) {
                    p5.fill(`${["#302719", "#F8C574"][i]}${op}`);
                    Object.values(item.hands).filter(v => v).forEach((hand, index) => {
                        p5.ellipse(
                            (hand.x + (!item.dual || ac.recoilImpulseParity == (1 - 2 * index) ? item?.recoilImpulse?.x ?? 0 : 0) * (1 - (d / (item?.recoilImpulse?.duration ?? d)))) * radius,
                            (hand.y - (!item.dual || ac.recoilImpulseParity == (1 - 2 * index) ? item?.recoilImpulse?.y ?? 0 : 0) * (1 - (d / (item?.recoilImpulse?.duration ?? d)))) * radius,
                            radius * (i ? 0.525 : 0.75),
                            radius * (i ? 0.525 : 0.75),
                            50
                        );
                    });
                }
            }

            [
                [drawItem, drawBody, drawHands], // 0 (default) — item, body, hands
                [drawBody, drawItem, drawHands], // 1 (guns like FAMAS) — body, item, hands
                [drawBody, drawHands, drawItem]  // 2 (guns like M79) — body, hands, item
            ][item.dimensions.layer].forEach(f => f());


            p5.rotate(-this.angle);
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
        const i = this.inventory,
            ip = i.activeItem.proto,
            f = gamespace._currentUpdate - this.state.lastFreeSwitch >= 1000;

        i.activeItem.stopReload(this);
        this.state.attacking = false;
        this.state.noSlow = true;
        this.state.eSwitchDelay = ip.switchDelay;

        if (
            f &&
            ((gamespace._currentUpdate - this.state.lastShot[i.activeIndex]) < ip.delay) &&
            !ip.deployGroup ||
            ip.deployGroup != (i[`slot${1 - i.activeIndex}`] as gun)?.proto.deployGroup
        ) {
            this.state.eSwitchDelay = 250;
        }

        if (f) {
            this.state.lastFreeSwitch = gamespace._currentUpdate;
        }

        this.state.lastSwitch = gamespace._currentUpdate;
        i.activeIndex = index;

        if (!i.activeItem.ammo) {
            this.timers.anticipatedReload && clearTimeout(this.timers.anticipatedReload);

            const n = i.activeItem.proto.name;

            this.timers.anticipatedReload = setTimeout(() => {
                i.activeItem.proto.name == n && i.activeItem.reload(this);
            }, this.state.eSwitchDelay) as any as number;
        }
    }
    damage(amount: number, source: bullet | explosion | shrapnel) {
        const lethal = amount >= this.health;

        this.health -= amount;

        if (gamespace.settings.bonus_features.show_damage_numbers) {
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

            if (gamespace.settings.bonus_features.damage_numbers_stack) {
                const prev = gamespace.objects.damageNumbers.find(da => da.targetId == this.body.id);
                if (prev) {
                    prev.amount += amount;
                    prev.createdTimestamp = gamespace._currentUpdate;
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
                timestamp: gamespace._currentUpdate
            },
                simpl = {
                    crit: source.crit,
                    killer: data.killer.name,
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
                    gamespace.player = void 0 as badCodeDesign;
                }

                this.destroy();
                gamespace.objects.players.splice(index, 1);
            }

        }
    }
    #determineMoveSpeed() {
        if (this.state.firing ||
            gamespace._currentUpdate - this.state.lastShot[this.inventory.activeIndex] < (!!this.inventory.activeItem.activeFireMode.match(/(auto-)?burst-/) ? this.inventory.activeItem.proto.burstProps.burstDelay : this.inventory.activeItem.proto.delay)
            && !this.state.noSlow
        ) {
            return (this.speed.base + this.inventory.activeItem.proto.moveSpeedPenalties.firing) / 2;
        } else {
            return this.speed.base + this.inventory.activeItem.proto.moveSpeedPenalties.active - 1;
        }
    }
}

class player extends playerLike {
    constructor(body: Matter.Body, angle: number, health: number, loadout: { guns: string[]; activeIndex: number; }, options: { friction: number; restitution: number; inertia?: number; density: number; }, view: number) {
        super(body, angle, health, loadout, options, view, gamespace.settings.name);
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
    offset: { x: number; y: number; } = { x: 0, y: 0 };
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
    fireMode: ("automatic" | "semi" | `${"auto-" | ""}burst-${number}`)[] = ["automatic"];
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
        summary: {
            class: string,
            engagementDistance: {
                min: number,
                max: number;
            },
            shouldNoslow: boolean,
            role: "primary" | "secondary";
        },
        dual: boolean,
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
        },
        tint: string,
        ballistics: {
            damage: number,
            velocity: number,
            range: number,
            obstacleMult: number,
            headshotMult: number,
            tracer: {
                width: number,
                height: number,
            },
            projectiles: number,
            falloff: number,
            fsaCooldown: number;
        },
        caliber: string,
        delay: number,
        accuracy: { default: number, moving: number; },
        offset: { x: number, y: number; },
        dimensions: { width: number, height: number, layer: 0 | 1 | 2; },
        hands: { lefthand: { x: number, y: number; }, righthand?: { x: number, y: number; }; },
        spawnOffset: { x: number, y: number; },
        suppressed: boolean,
        recoilImpulse: { x: number, y: number, duration: number; },
        fireMode: ("automatic" | "semi" | `burst-${number}`)[],
        burstProps: { shotDelay: number, burstDelay: number; },
        reload: {
            duration: number,
            ammoReloaded: number | "all",
            chain: boolean;
        },
        capacity: {
            normal: number,
            firepower: number;
        },
        switchDelay: number,
        casing: typeof gunPrototype.prototype.casing,
        moveSpeedPenalties: {
            active: number,
            firing: number;
        },
        deployGroup: number,
        altReload?: {
            duration: number,
            ammoReloaded: number | "all",
            chain: boolean;
        }
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
        this.offset = offset;
        this.suppressed = suppressed;
        this.dimensions = dimensions;
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
        const f = this.proto.fireMode;
        this.#activeFireMode = f[this.#activeFireModeIndex = v % f.length];
    };

    #activeFireMode: (typeof gunPrototype.prototype.fireMode)[number];
    get activeFireMode() { return this.#activeFireMode; }

    #ammo: number = 0;
    get ammo() { return this.#ammo; }
    set ammo(v) { this.#ammo = Math.max(0, v); }

    recoilImpulseParity: -1 | 1;

    constructor(proto: gunPrototype) {
        this.#proto = proto;
        this.#activeFireMode = proto.fireMode[this.activeFireModeIndex];
        this.ammo = proto.magazineCapacity.normal;
        this.recoilImpulseParity = 1;
    }
    primary(shooter: playerLike) {
        const p = shooter,
            b = p.body,
            ip = this.#proto,
            fire = this.activeFireMode,
            burst = !!fire.match(/(auto-)?burst-/);

        if ((gamespace._currentUpdate - p.state.lastShot[p.inventory.activeIndex]) >= (burst ? (ip.burstProps.burstDelay ?? ip.delay) : ip.delay) &&
            this.#ammo &&
            !shooter.state.frozen &&
            !shooter.timers.firing
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
                    clearTimeout(shooter.timers.firing as number);
                    shooter.timers.firing = false;
                    if (
                        (p.state.reloading && p.timers.reloading.all) ||
                        (gamespace._currentUpdate - p.state.lastSwitch < p.state.eSwitchDelay)
                    ) {
                        shooter.timers.firing = setTimeout(() => {
                            shooter.timers.firing = false;
                            shooter.inventory.activeItem.primary(shooter);
                        }, (p.state.reloading && p.timers.reloading.all) ? weapon.#proto[`${weapon.#proto.altReload && !weapon.#ammo ? "altR" : "r"}eload` as badCodeDesign].duration - (gamespace._currentUpdate - p.state.reloading) : p.state.eSwitchDelay - (gamespace._currentUpdate - p.state.lastSwitch)) as any as number;
                    }
                    return;
                }

                if (burst && fire.startsWith("auto-burst-") && exceed) {
                    p.state.fired = 0;
                    p.state.firing = false;
                    setTimeout(a, weapon.#proto.burstProps.burstDelay, weapon);
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
                            Math.min(100, ip.spawnOffset.y),
                            { isStatic: false, friction: 1, restitution: 0, density: 1, angle: dev }
                        );

                    new bullet(body, p, ip, dev, start, gamespace._currentUpdate, weapon.#proto.ballistics.headshotMult != 1 && Math.random() >= 0.85, gamespace.bulletInfo[ip.caliber].projectileInfo.type);
                }

                if (ip.casing.spawnOn == "fire" && !shooter.state.noSlow) {
                    try {
                        if (!ip.casing.spawnDelay) {
                            weapon.makeCasing(shooter);
                        } else {
                            setTimeout(() => {
                                if (shooter.inventory.activeItem.#proto.name == weapon.#proto.name) {
                                    weapon.makeCasing(shooter);
                                }
                            }, ip.casing.spawnDelay);
                        }
                    } catch { }
                }

                if (!weapon.#ammo) {
                    return weapon.reload(shooter);
                }

                if (fire == "semi") {
                    shooter.state.firing = false;
                    shooter.timers.firing = false;
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
        shooter.timers.firing = false;
        shooter.state.reloading = gamespace._currentUpdate;
        const reloadToUse = this.#proto[`${this.#proto.altReload && !this.#ammo ? "altR" : "r"}eload`] as { duration: number; ammoReloaded: number | "all"; chain: boolean; };

        shooter.timers.reloading.timer && clearTimeout(shooter.timers.reloading.timer);

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
                }

                shooter.timers.reloading.timer = shooter.timers.reloading.all = false;
            }, reloadToUse.duration) as badCodeDesign as number,
            all: reloadToUse.ammoReloaded == "all"
        };
    }
    stopReload(shooter: playerLike) {
        if (shooter.state.reloading) {
            clearTimeout(shooter.timers.reloading.timer as badCodeDesign);
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
            start = {
                x: b.position.x + (50 + ip.spawnOffset.y) * Math.sin(p.angle) + +((ip.casing.spawnOn == "fire") && (this.recoilImpulseParity * ip.spawnOffset.x) * Math.cos(p.angle)),
                y: b.position.y - (50 + ip.spawnOffset.y) * Math.cos(p.angle) + +((ip.casing.spawnOn == "fire") && (this.recoilImpulseParity * ip.spawnOffset.x) * Math.sin(p.angle))
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
                perp: +meanDevPM_random(ip.casing.velocity.perp.value, ip.casing.velocity.perp.variation.value, ip.casing.velocity.perp.variation.plusOrMinus),
                parr: +meanDevPM_random(ip.casing.velocity.parr.value, ip.casing.velocity.parr.variation.value, ip.casing.velocity.parr.variation.plusOrMinus),
                angular: +meanDevPM_random(ip.casing.velocity.angular.value, ip.casing.velocity.angular.variation.value, ip.casing.velocity.angular.variation.plusOrMinus)
            }
        );
    }
}

class bullet {
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

    #created: timestamp;
    get created() { return this.#created; }

    #crit: boolean;
    get crit() { return this.#crit; }

    #alpha: number;
    get alpha() { return this.#alpha; }

    #info: typeof gamespace.bulletInfo[string];
    get info() { return this.#info; }

    #type: typeof gamespace.bulletInfo[string]["projectileInfo"]["type"];
    get type() { return this.#type; }

    #squaredDistance: number = 0;
    get sqauredDistance() { return this.#squaredDistance; }

    #damage: number;
    get damage() { return this.#damage; }

    #lastFalloffStep: number = 0;

    constructor(body: Matter.Body, shooter: playerLike, emitter: gunPrototype, angle: number, start: { x: number; y: number; }, created: number, crit: boolean, type: typeof bullet.prototype.type) {
        this.#body = body;
        this.#shooter = shooter;
        this.#emitter = emitter;
        this.#angle = angle;
        this.#trajectory = angle;
        this.#start = start;
        this.#created = created;
        this.#crit = crit;
        this.#damage = this.#emitter.ballistics.damage;
        this.#type = type;
        this.#alpha = 255;
        this.#info = gamespace.bulletInfo[this.#emitter.caliber];
        gamespace.objects.bullets.push(this);
    }

    update() {
        const bd = this.#body,
            removeBullet = () => {
                Matter.World.remove(gamespace.world, this.#body);
                gamespace.objects.bullets.splice(gamespace.objects.bullets.findIndex(b => b.body.id == this.#body.id), 1);
                this.destroy();
            },
            v = this.#emitter.ballistics.velocity * (gamespace._currentUpdate - this.#created) / 1000,
            makeExplosion = () => {
                new explosion(this.#body.position, this.#shooter, this.#emitter, this.#crit);
            };

        this.#angle = this.#trajectory + (gamespace._currentUpdate - this.#created) * this.#info.projectileInfo.spinVel / 1000;

        Matter.Body.setPosition(bd, { x: this.#start.x + Math.sin(this.#trajectory) * v, y: this.#start.y - Math.cos(this.#trajectory) * v });
        this.#squaredDistance = +squaredDist(this.#start, bd.position);

        if (this.#squaredDistance > Math.min(this.#emitter.ballistics.range, this.#info.projectileInfo.type == "explosive" ? this.#info.projectileInfo.maxDist : Infinity) ** 2) {
            if (this.#type == "explosive") {
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
            if (this.#type == "explosive" && (this.#info.projectileInfo as { explodeOnContact: boolean; }).explodeOnContact) {
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

                if (this.#type == "explosive" && (this.#info.projectileInfo as { explodeOnContact: boolean; }).explodeOnContact) {
                    makeExplosion();
                } else if (!target.state.invuln) {
                    target.damage(d, this);
                }

                removeBullet();
            }
        }
    }
    draw() {
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
            if (this.#info.projectileInfo.type == "explosive") {
                const m = this.#emitter.ballistics.range / this.#emitter.ballistics.velocity,
                    d = (gamespace._currentUpdate - this.#created) / 1000,
                    s = (-this.#info.projectileInfo.heightPeak * d * (d - m) / 2) ** 0.75 + 1;

                p5.scale(s, s);
            }
            const c = p5.color(this.#info.tints[this.#crit && gamespace.settings.bonus_features.headshots_use_saturated_tracers ? (gamespace.settings.bonus_features.use_interpolated_saturated_tracers && this.#info.tints.saturated_alt) ? "saturated_alt" : "saturated" : "normal"] ?? "#FFF");

            if (this.#emitter.suppressed) {
                const min = this.#info.alpha.min * 255,
                    max = this.#info.alpha.max * 255,
                    dir = Math.sign(1 - this.#info.alpha.rate) as -1 | 0 | 1;

                if ((min != this.#alpha && dir != -1) || (this.#alpha != max && dir != 1)) {
                    this.#alpha = +clamp(this.#alpha * this.#info.alpha.rate, min, max);
                }

                c.setAlpha(this.#alpha);
            }

            p5.tint(c);

            const l = Math.min(this.#emitter.ballistics.tracer.height, +distance(bd.position, this.#start)),
                w = this.#emitter.ballistics.tracer.width,
                o = this.#info.imageOffset;

            p5.image(this.#info.projectileInfo.img, o.perp * w, o.parr * l, w, l);
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
    destroy() { // Free up the memory by clearing references to objects, since we no longer need the references
        this.#body = this.#shooter = this.#emitter = this.#info = void 0 as badCodeDesign;
    }
}

class shrapnel {
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

    #origin: { x: number; y: number; };
    get origin() { return this.#origin; }

    #start: { x: number; y: number; };
    get start() { return this.#start; }

    #created: timestamp;
    get created() { return this.#created; }

    #crit: boolean;
    get crit() { return this.#crit; }

    #range: number;
    get range() { return this.#range; }

    #info: typeof gamespace.explosionInfo[string]["shrapnel"];
    get info() { return this.#info; }

    #squaredDistance: number = 0;
    get sqauredDistance() { return this.#squaredDistance; }

    #damage: number;
    get damage() { return this.#damage; }

    #lastFalloffStep: number = 0;

    constructor(body: Matter.Body, shooter: playerLike, emitter: gunPrototype, angle: number, origin: { x: number; y: number; }, start: { x: number, y: number; }, created: number, crit: boolean) {
        this.#body = body;
        this.#shooter = shooter;
        this.#emitter = emitter;
        this.#angle = angle;
        this.#trajectory = angle;
        this.#origin = origin;
        this.#start = start;
        this.#created = created;
        this.#crit = crit;
        this.#info = gamespace.explosionInfo[(gamespace.bulletInfo[this.#emitter.caliber].projectileInfo as { explosionType: string; }).explosionType].shrapnel;
        this.#range = +meanDevPM_random(this.#info.range.value, this.#info.range.variation.value, this.#info.range.variation.plusOrMinus);
        this.#damage = this.#info.damage;
        gamespace.objects.bullets.push(this);
    }
    update() {
        const bd = this.#body,
            removeBullet = () => {
                Matter.World.remove(gamespace.world, this.#body);
                gamespace.objects.bullets.splice(gamespace.objects.bullets.findIndex(b => b.body.id == this.#body.id), 1);
                this.destroy();
            },
            v = this.#info.velocity * (gamespace._currentUpdate - this.#created) / 1000;

        Matter.Body.setPosition(bd, { x: this.#start.x + Math.sin(this.#trajectory) * v, y: this.#start.y - Math.cos(this.#trajectory) * v });
        this.#squaredDistance = +squaredDist(this.#start, bd.position);

        if (this.#squaredDistance > this.#range ** 2) {
            removeBullet();
            return;
        }

        const d = Math.sqrt(this.#squaredDistance);

        if (d - this.#lastFalloffStep > 5000) {
            this.#lastFalloffStep = 5000 * Math.floor(d / 5000);

            this.#damage = sigFigIshMult(this.#damage, this.#info.falloff);
        }

        if (Matter.Query.collides(bd, gamespace.objects.obstacles.map(o => o.body)).length) {
            removeBullet();
            return;
        }

        {
            const p = Matter.Query.collides(bd, gamespace.objects.players.map(o => o.body))[0];

            if (p) {
                const f = (pl: playerLike) => pl.body.id == p.bodyA.id,
                    target = gamespace.objects.players.find(f) as playerLike,
                    d = sigFigIshMult(this.#damage, this.#crit ? this.#emitter.ballistics.headshotMult : 1);

                target.damage(d, this);
                removeBullet();
            }
        }
    }
    draw() {
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
            const c = p5.color(this.#info.color ?? "#FFF");

            p5.tint(c);

            const l = Math.min(this.#info.tracer.height, +distance(bd.position, this.#origin)),
                w = this.#info.tracer.width;

            p5.image(this.#info.img, 0, l / 2, w, l);
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
        this.#body = this.#emitter = this.#info = this.#shooter = void 0 as badCodeDesign;
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
            .filter(p => p.dist <= 600 ** 2)
            .sort((a, b) => b.dist - a.dist)
            .forEach(p => {
                const d = this.#info.damage * (p.dist < this.#info.radii.damage.min ? 1 : (1 - (p.dist / (this.#info.radii.damage.max ** 2)))),
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
                { ...origin },
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
        this.#created = created;
        this.#velocities = vel;
        this.#info = gamespace.bulletInfo[this.#emitter.caliber].casing;

        const l = this.#info.lifetime;
        this.#lifetime = +meanDevPM_random(l.value, l.variation, l.plusOrMinus);
        gamespace.objects.casings.push(this);
    }

    update() {
        const t = (gamespace._currentUpdate - this.#created);

        Matter.Body.setPosition(this.#body, {
            x: this.#start.x + (Math.sin(this.#trajectory) * this.#velocities.parr - Math.cos(this.#trajectory) * this.#velocities.perp) * t / this.#lifetime,
            y: this.#start.y + (Math.cos(this.#trajectory) * this.#velocities.parr - Math.sin(this.#trajectory) * this.#velocities.perp) * t / this.#lifetime
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

            p5.tint(255, 255 - (255 * ((gamespace._currentUpdate - this.#created) / this.#lifetime) ** 2));
            p5.image(this.#info.img, 0, 0, this.#info.width, this.#info.height);
            p5.pop();
        }
    }
    destroy() {
        this.#body = this.#emitter = void 0 as badCodeDesign;
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

const gamespace: {
    readonly version: string,
    bots: InstanceType<typeof import("./assets/scripts/std_ai").default>[],
    bulletInfo: {
        [key: string]: {
            tints: {
                normal: string,
                saturated: string,
                saturated_alt?: string,
                chambered: string;
            },
            alpha: {
                rate: number,
                min: number,
                max: number;
            },
            spawnVar: {
                mean: number,
                variation: number,
                plusOrMinus: boolean;
            },
            imageOffset: {
                parr: number,
                perp: number;
            },
            projectileInfo: ({
                type: "explosive",
                explosionType: string,
                explodeOnContact: boolean,
                maxDist: number,
                heightPeak: number;
            } | {
                type: "bullet";
            }) & {
                img: import("p5").Image,
                spinVel: number;
            },
            casing: {
                img: import("p5").Image,
                lifetime: {
                    value: number,
                    variation: number,
                    plusOrMinus: boolean;
                },
                width: number,
                height: number;
            };
        };
    },
    camera: import("p5").Camera,
    cleanUp(options?: { reloadJSONBasedFields?: boolean, reloadFontsAndImages?: boolean, clearEvents?: boolean; }): void,
    _currentLevel: {
        color?: string,
        description: string,
        initializer: () => void,
        jsonPath: string,
        levelData: ReturnType<typeof parseLevelData>,
        name: string,
        thumbnail?: string,
        world: {
            width: number,
            height: number,
            color: string,
            gridColor: hexColor;
        };
    };
    created: timestamp,
    _currentUpdate: timestamp,
    currentUpdate: timestamp,
    deltaTime: number,
    engine: Matter.Engine,
    events: customEvent,
    explosionInfo: {
        [key: string]: {
            damage: number,
            obstacleMult: number,
            radii: {
                visual: {
                    min: number,
                    max: number;
                },
                damage: {
                    min: number,
                    max: number;
                };
            },
            lifetime: number,
            color: [number, number, number],
            decal: {
                img: import("p5").Image,
                width: number,
                height: number,
                tint: hexColor;
            },
            shrapnel: {
                count: number,
                damage: number,
                color: hexColor,
                img: import("p5").Image,
                velocity: number,
                range: {
                    value: number,
                    variation: {
                        value: number,
                        plusOrMinus: boolean;
                    };
                },
                falloff: number,
                tracer: {
                    width: number,
                    height: number;
                };
            };
        };
    },
    fonts: {
        [key: string]: {
            src: string,
            font: import("p5").Font;
        };
    };
    freeze: () => void,
    _frozen: boolean,
    readonly frozen: boolean,
    guns: gunPrototype[],
    images: {
        [key: string]: {
            src: string,
            img: import("p5").Image;
        };
    },
    keys: { [key: number]: boolean; },
    kills: {
        crit: boolean,
        killed: string,
        killer: string,
        timestamp: timestamp,
        weapon: string,
        id: number;
    }[],
    lastUpdate: timestamp,
    levels: {
        color?: string,
        description: string,
        initializer: () => void,
        jsonPath: string,
        levelData: ReturnType<typeof parseLevelData>,
        name: string,
        thumbnail?: string,
        world: {
            width: number,
            height: number,
            color: string,
            gridColor: hexColor;
        };
    }[],
    objects: {
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
        players: playerLike[],
    },
    player: playerLike,
    p5: import("p5"),
    settings: {
        graphicsQuality: number,
        debug: boolean,
        useNativeMath: boolean,
        name: string,
        bonus_features: {
            bot_debug: boolean,
            csgo_style_killfeed: boolean,
            damage_numbers_stack: boolean,
            headshots_use_saturated_tracers: boolean,
            show_damage_numbers: boolean,
            use_interpolated_saturated_tracers: boolean;
        },
        ui: boolean;
    },
    update: (p5: import("p5")) => void,
    world: Matter.Composite;
} = {
    get version() { return `0.6.0`; },
    bots: [],
    bulletInfo: {},
    camera: void 0 as badCodeDesign,
    created: 0,
    cleanUp(options: { reloadJSONBasedFields: boolean, reloadFontsAndImages: boolean, clearEvents: boolean; }) {
        const t = (setTimeout(() => { }) as any as number);
        for (let i = 0; i < t; i++) { clearTimeout(i); }

        gamespace.p5.remove();
        gamespace.bots = [];
        gamespace._currentUpdate = 0;

        if (gamespace._frozen) { unfreezeInputs(); }

        (async () => { gamespace._currentLevel.levelData = parseLevelData(await (await fetch(gamespace._currentLevel.jsonPath)).json()); })();

        gamespace._currentLevel = void 0 as badCodeDesign;
        gamespace.created = 0;
        gamespace.camera = void 0 as badCodeDesign;
        gamespace.deltaTime = 0;
        gamespace.engine = void 0 as badCodeDesign;
        options?.clearEvents && (gamespace.events.removeAllListeners());
        gamespace._frozen = false;
        gamespace.keys = {};
        gamespace.kills = [];
        gamespace.lastUpdate = 0;
        gamespace.objects = { // Let's pray the GC is good enough to prevent memory leaks, since we're not explicitly destroying any of these objects
            bullets: [],
            casings: [],
            damageNumbers: [],
            decals: [],
            explosions: [],
            obstacles: [],
            players: []
        };
        gamespace.player = void 0 as badCodeDesign;
        gamespace.p5 = void 0 as badCodeDesign;
        gamespace.world = void 0 as badCodeDesign;
        ui.clear();

        options?.reloadJSONBasedFields && loadJSONBasedGamespaceFields();

        if (options?.reloadFontsAndImages) {
            type IHaveNoGoodNameIdeas = ({ src: string; } & ({ font: import("p5").Font; } | { img: import("p5").Image; }));

            for (const a of ["fonts", "images"]) {
                const k = Object.keys(gamespace[a]),
                    f: IHaveNoGoodNameIdeas[] = (Object.values(gamespace[a]) as IHaveNoGoodNameIdeas[]).map((f: { src: string; } & ({ font: import("p5").Font; } | { img: import("p5").Image; })) => ({ src: f.src, [a == "fonts" ? "font" : "img"]: (a == "fonts" ? loadFnt : loadImg)(f.src) })) as any,
                    o: IHaveNoGoodNameIdeas = {} as IHaveNoGoodNameIdeas;

                for (const i in k) { o[k[i]] = f[i]; }
            }
        }
    },
    _currentLevel: void 0 as badCodeDesign,
    _currentUpdate: 0,
    get currentUpdate() { return gamespace._currentUpdate; },
    set currentUpdate(v) {
        [gamespace.lastUpdate, gamespace._currentUpdate, gamespace.deltaTime] = [gamespace._currentUpdate, v, v - gamespace._currentUpdate];
    },
    deltaTime: 0,
    engine: void 0 as badCodeDesign,
    events: new customEvent(),
    explosionInfo: {},
    fonts: {},
    freeze() {
        if (!gamespace._frozen) {
            freezeAllInputs();
            gamespace._frozen = true;

            const t = (setTimeout(() => { }) as any as number);
            for (let i = 0; i < t; i++) { clearTimeout(i); }
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
    player: void 0 as badCodeDesign,
    p5: void 0 as badCodeDesign,
    settings: {
        graphicsQuality: 1,
        debug: false,
        useNativeMath: true,
        name: "Player",
        bonus_features: {
            bot_debug: false,
            csgo_style_killfeed: false,
            damage_numbers_stack: true,
            headshots_use_saturated_tracers: true,
            show_damage_numbers: true,
            use_interpolated_saturated_tracers: true
        },
        ui: true
    },
    update() {
        const p5 = gamespace.p5;

        function drawObjects(layer: number) {
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

        p5.clear(void 0 as badCodeDesign, void 0 as badCodeDesign, void 0 as badCodeDesign, void 0 as badCodeDesign);

        const p = gamespace.player,
            b = p.body;

        p5.camera(
            b ? Math.round(b.position.x) : gamespace.camera.eyeX,
            b ? Math.round(b.position.y) : gamespace.camera.eyeY,
            p.view,
            b ? Math.round(b.position.x) : gamespace.camera.centerX,
            b ? Math.round(b.position.y) : gamespace.camera.centerY,
            0
        );
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

        if (gamespace.settings.bonus_features.show_damage_numbers) {
            gamespace.objects.damageNumbers.forEach((d, i) => {
                const t = (gamespace._currentUpdate - d.createdTimestamp),
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

                    p5.text(`${d.amount}${d.lethal ? "!" : ""}`, 10, -10);
                }

                const c = p5.color(255, 0, 0);
                c.setAlpha(255 * (1 - t / lifetime));
                p5.fill(c);

                p5.text(`${d.amount}${d.lethal ? "!" : ""}`, 0, 0);
                p5.pop();

                if (t > lifetime) { gamespace.objects.damageNumbers.splice(i, 1); }
            });
        }

        !gamespace._frozen && ui.update();

        if ((p5.mouseX != p5.pmouseX || p5.mouseY != p5.pmouseY) && !gamespace._frozen) {
            p.angle = Math.PI / 2 + Math.atan2(p5.mouseY - p5.height / 2, p5.mouseX - p5.width / 2);
        }
    },
    world: void 0 as badCodeDesign
};

loadJSONBasedGamespaceFields();

/*

    tsc classes.ts main.ts perf.ts util.ts input.ts ui.ts memory.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration

    tsc assets/levels/level0/level.ts classes.d.ts main.d.ts perf.d.ts util.d.ts input.d.ts ui.d.ts memory.d.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration

    tsc assets/levels/level1/level.ts classes.d.ts main.d.ts perf.d.ts util.d.ts input.d.ts ui.d.ts memory.d.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration

    tsc assets/levels/level2/level.ts classes.d.ts main.d.ts perf.d.ts util.d.ts input.d.ts ui.d.ts memory.d.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration

    tsc assets/scripts/std_ai.ts classes.d.ts main.d.ts perf.d.ts util.d.ts input.d.ts ui.d.ts memory.d.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration

    tsc assets/scripts/std_level_setup.ts classes.d.ts main.d.ts perf.d.ts util.d.ts input.d.ts ui.d.ts memory.d.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaratio

*/