const botConfig = {
    detectionRange: 2500,
    maxTurnSpeed: Math.PI / 180 * 15,
    noslowDelay: 50,
    noslowSpeed: 400
};
class AI {
    #state = "idle";
    get state() { return this.#state; }
    #subState = "default";
    get subState() { return this.#subState; }
    #player;
    get player() { return this.#player; }
    #target;
    get target() { return this.#target; }
    #memory = {
        cancelReloadOnSpot: false,
        lastPosition: void 0,
        lastTargetPos: void 0,
        strafe: {
            dir: [false, false, false, false],
            timestamp: 0
        },
        wanderTarget: void 0,
        weaponLoadState: [true, true]
    };
    get memory() { return clone(this.#memory); }
    constructor(player) {
        this.#player = player;
        this.#memory.lastPosition = { ...this.#player.body.position };
    }
    debug() {
        if (!$(`ai-${this.#player.body.id}-debug-cont`)) {
            const doc = new DocumentFragment(), cont = makeElement("div", `ai-${this.#player.body.id}-debug-cont`), logger = makeElement("p", `ai-${this.#player.body.id}-debug`, "debug");
            logger.style.userSelect = logger.style.pointerEvents = "none";
            doc.appendChild(cont).appendChild(logger);
            document.body.appendChild(doc);
        }
        const l = $(`ai-${this.#player.body.id}-debug`);
        l.innerText = [
            `state: ${this.#state}`,
            `subState: ${this.#subState}`,
            `targetPos: (${Math.round(100 * this.#target?.body?.position?.x) / 100}, ${Math.round(100 * this.#target?.body?.position?.y) / 100})`,
            `position: (${Math.round(100 * this.#player.body.position.x) / 100}, ${Math.round(100 * this.#player.body.position.y) / 100})`,
            `wanderTarget: ${this.#memory.wanderTarget ? `(${this.#memory.wanderTarget.x}, ${this.#memory.wanderTarget.y})` : "none"}`,
            `angle: ${Math.round(100 * this.#player.angle) / 100}`,
            `distToTarget: ${this.#target ? Math.round(+distance(this.#player.body.position, this.#target.body.position) * 100) / 100 : "NA"}`,
            `strafeDirection: ${this.#memory.strafe.dir}`,
            `ammo: ${this.#player.inventory.activeItem.ammo}`,
            `reloading: ${this.#player.state.reloading}`,
            `activeWeapon: ${this.#player.inventory.activeItem.proto.name}`,
            `activeIndex: ${this.#player.inventory.activeIndex}`,
            `aimTarget: (${Math.round(100 * this.#player?.aimTarget?.x) / 100}, ${Math.round(100 * this.#player?.aimTarget?.y) / 100})`
        ]
            .join("\n");
    }
    update() {
        if (!this.#player.body) {
            return;
        }
        const pl = this.#player, i = pl.inventory.activeItem, ip = i.proto;
        switch (this.state) {
            case "idle": {
                this.#pickIdealWeapon();
                this.#resolveTargets();
                break;
            }
            case "wander": {
                if (i.ammo != ip.magazineCapacity.normal) {
                    this.#memory.cancelReloadOnSpot = true;
                    i.reload(pl);
                }
                else if (!this.#memory.weaponLoadState[1 - pl.inventory.activeIndex]) {
                    pl.switchSlots(1 - pl.inventory.activeIndex);
                }
                if (this.#memory.wanderTarget && squaredDist(this.#memory.wanderTarget, this.#player.body.position) >= 6000) {
                    this.#moveTowardsPoint(this.#memory.wanderTarget);
                    this.#lookInDirection(Math.atan2(this.#memory.lastPosition.y - this.#player.body.position.y, this.#memory.lastPosition.x - this.#player.body.position.x) - Math.PI / 2);
                    this.#memory.lastPosition = { ...this.#player.body.position };
                }
                else {
                    this.#moveTowardsPoint(this.#memory.wanderTarget = {
                        x: +clamp(Math.round(100 * (this.#player.body.position.x + ((Math.abs(this.#player.body.position.x - gamespace.currentLevel.world.width / 2) >= 7 * gamespace.currentLevel.world.width / 16)
                            ? -Math.sign(this.#player.body.position.x - gamespace.currentLevel.world.width / 2)
                            : (2 * Math.round(Math.random()) - 1))
                            * (Math.random() * 2000 + 500))) / 100, 0, gamespace.currentLevel.world.width),
                        y: +clamp(Math.round(100 * (this.#player.body.position.y + ((Math.abs(this.#player.body.position.y - gamespace.currentLevel.world.height / 2) >= 7 * gamespace.currentLevel.world.height / 16)
                            ? -Math.sign(this.#player.body.position.y - gamespace.currentLevel.world.height / 2)
                            : (2 * Math.round(Math.random()) - 1))
                            * (Math.random() * 2000 + 500))) / 100, 0, gamespace.currentLevel.world.height)
                    });
                }
                this.#resolveTargets();
                if (this.#state != "wander") {
                    this.#memory.wanderTarget = void 0;
                }
                break;
            }
            case "engage": {
                if (!this.#target || this.#target.body == void 0) {
                    this.#state = "idle";
                    break;
                }
                const d = +squaredDist(this.#player.body.position, this.#target.body.position), pos = this.#target.body.position, f = () => !!Math.round(Math.random()), args = [i, this.#player], r = extractValue(ip[`${ip.altReload && !i.ammo ? "altR" : "r"}eload`].duration, args);
                if (pl.state.reloading) {
                    this.#memory.weaponLoadState[pl.inventory.activeIndex] = false;
                    if ((d < (ip.summary.class == "sniper_rifle" ? 1000 : 750) ** 2 || (this.#memory.cancelReloadOnSpot && r - gamespace.currentUpdate + pl.state.reloading >= 1500))
                        && r >= 1000
                        && this.#memory.weaponLoadState[1 - pl.inventory.activeIndex]) {
                        if (this.#memory.cancelReloadOnSpot && i.ammo) {
                            i.stopReload(pl);
                        }
                        else {
                            pl.switchSlots(1 - pl.inventory.activeIndex);
                        }
                        this.#memory.cancelReloadOnSpot = false;
                    }
                    else {
                        this.#subState = "reloading";
                    }
                }
                else if (this.#subState == "reloading") {
                    if (d >= 2000 ** 2 && r >= 1000 && this.#memory.weaponLoadState[1 - pl.inventory.activeIndex]) {
                        pl.switchSlots(1 - pl.inventory.activeIndex);
                    }
                    else {
                        this.#subState = "default";
                    }
                }
                else {
                    this.#memory.weaponLoadState[pl.inventory.activeIndex] = true;
                }
                if (gamespace.currentUpdate - this.#memory.strafe.timestamp >= (this.#subState == "reloading" ? (Math.random() * 500 + 100) : (Math.random() * 1000 + 250))) {
                    const dy = Math.round((pl.body.position.y - this.#target.body.position.y) / 10) * 10, dx = Math.round((pl.body.position.x - this.#target.body.position.x) / 10) * 10, r = this.#subState == "reloading";
                    this.#memory.strafe = {
                        dir: [
                            r && Math.random() > 0.3 ? Math.sign(dy) != 1 : f(),
                            r && Math.random() > 0.3 ? Math.sign(dx) != 1 : f(),
                            r && Math.random() > 0.3 ? Math.sign(dy) != -1 : f(),
                            r && Math.random() > 0.3 ? Math.sign(dx) != -1 : f()
                        ],
                        timestamp: gamespace.currentUpdate
                    };
                }
                if (["shotgun", "sniper_rifle", "semi_pistol_move"].includes(extractValue(ip.summary.class, [])) ||
                    ["strafe", "reloading"].includes(this.#subState) &&
                        !["moveTowards", "moveAway"].includes(this.#subState)) {
                    this.#player.move(...this.#memory.strafe.dir);
                }
                if (this.#subState == "noslow") {
                    break;
                }
                if (this.#subState != "strafe" && this.#subState != "reloading") {
                    this.#subState = "default";
                }
                if (d >= ((this.#subState == "moveTowards" ? 0.9 : 1) * extractValue(ip.summary.engagementDistance.max, [])) ** 2) {
                    this.#subState = "moveTowards";
                    this.#moveTowardsPoint(pos);
                }
                if (d <= (this.#subState == "moveAway" ? 1.25 : 1) * extractValue(ip.summary.engagementDistance.min, []) ** 2) {
                    this.#subState = "moveAway";
                    this.#moveTowardsPoint(pos, true);
                }
                pl.state.attacking = false;
                this.#lookAtPoint(pos);
                if (this.#subState != "moveTowards" && this.#subState != "strafe") {
                    this.#lookAtPoint(this.#target.state.moving ? {
                        // x: pos.x + Math.sign(pos.x - this.#memory.lastTargetPos?.x ?? pos.x) * (d / (ip.ballistics.velocity ** 2)) * 1000 * Math.abs((pos.x - this.#memory.lastTargetPos?.x ?? pos.x) / gamespace.deltaTime),
                        // y: pos.y + Math.sign(pos.y - this.#memory.lastTargetPos?.y ?? pos.y) * (d / (ip.ballistics.velocity ** 2)) * 1000 * Math.abs((pos.y - this.#memory.lastTargetPos?.y ?? pos.y) / gamespace.deltaTime)
                        x: pos.x,
                        y: pos.y
                    } : pos);
                    if (ip.summary.class == "assault_rifle" && pl.state.fired > extractValue(ip.magazineCapacity.normal, []) * (Math.random() * 0.2 + 0.3)) {
                        this.#subState = "strafe";
                        setTimeout(() => {
                            if (this.#subState == "strafe") {
                                this.#subState = "default";
                            }
                        }, Math.random() * 400 + 500);
                    }
                    if (ip.summary.class == "burst_ar" && pl.state.fired >= +i.activeFireMode.replace("burst-", "")) {
                        this.#subState = "strafe";
                        setTimeout(() => {
                            if (this.#subState == "strafe") {
                                this.#subState = "default";
                            }
                        }, Math.random() * 200 + 400);
                    }
                    if ((gamespace.currentUpdate - pl.state.lastSwitch >= pl.state.eSwitchDelay)) {
                        pl.state.attacking = true;
                        if (!pl.state.firing) {
                            pl.inventory.activeItem.primary(pl);
                            if (!i.ammo && this.#memory.weaponLoadState[1 - pl.inventory.activeIndex] && Math.random() > 0.4) {
                                pl.switchSlots(1 - pl.inventory.activeIndex);
                            }
                            if (ip.summary.shouldNoslow && !pl.state.noSlow) {
                                setTimeout(() => {
                                    pl.switchSlots(1 - pl.inventory.activeIndex);
                                    this.#subState = "noslow";
                                    setTimeout(() => {
                                        this.#subState = "default";
                                    }, botConfig.noslowSpeed * (Math.random() * 0.2 + 0.9));
                                }, botConfig.noslowDelay);
                            }
                        }
                    }
                }
                this.#memory.lastTargetPos = {
                    x: pos.x,
                    y: pos.y
                };
                this.#resolveTargets();
                break;
            }
        }
    }
    #pickIdealWeapon() {
        const pl = this.#player, t = this.#target, weapon0 = pl.inventory.slot0.proto, weapon1 = pl.inventory.slot1.proto, role0 = weapon0.summary.role, role1 = weapon1.summary.role, range0 = weapon0.ballistics.range, range1 = weapon1.ballistics.range;
        if (role0 != role1) {
            pl.switchSlots(+(role1 == "primary"));
            return;
        }
        if (!t || t.body === void 0) {
            pl.switchSlots(+(range1 > range0));
            return;
        }
        const d = +squaredDist(pl.body.position, t.body.position), r0 = (extractValue(weapon0.summary.engagementDistance.max, []) / 2) ** 2 - d, r1 = (extractValue(weapon1.summary.engagementDistance.max, []) / 2) ** 2 - d;
        pl.switchSlots(+(r1 > r0));
    }
    #resolveTargets() {
        const candidate = gamespace.objects.players
            .filter(b => b.body.id != this.#player.body.id && !b.aiIgnore && !b.state.frozen)
            .map(b => ({ player: b, dist: +squaredDist(this.#player.body.position, b.body.position) }))
            .sort((a, b) => a.dist - b.dist)[0], t = this.#target, d = t?.body ? +squaredDist(t.body.position, this.#player.body.position) : Infinity;
        if (!candidate) {
            this.#state = "wander";
            return;
        }
        if (candidate.dist <= botConfig.detectionRange ** 2) {
            if (candidate.player.body.id != t?.body?.id && candidate.dist / d <= 0.8) {
                this.#target = candidate.player;
                this.#player.aimTarget = candidate.player.body.position;
            }
            this.#state = "engage";
        }
        else {
            this.#target = void 0;
            this.#player.aimTarget = {
                x: this.#player.body.position.x + Math.sin(this.#player.angle) * 100,
                y: this.#player.body.position.y - Math.cos(this.#player.angle) * 100
            };
            ;
            this.#state = "wander";
        }
    }
    #moveTowardsPoint(pt, away = false) {
        const dy = Math.round((this.#player.body.position.y - pt.y) / 10) * 10, dx = Math.round((this.#player.body.position.x - pt.x) / 10) * 10, sign = 1 - 2 * +away;
        this.#player.move(Math.sign(dy) != -sign, Math.sign(dx) != -sign, Math.sign(dy) != sign, Math.sign(dx) != sign);
    }
    #lookInDirection(dir) {
        const d = dir - this.#player.angle, e = Math.abs(d);
        this.#player.angle += Math.sign(d) * +clamp(e >= Math.PI ? e - 2 * Math.PI : e, void 0, botConfig.maxTurnSpeed);
        if (this.#state != "engage") {
            this.#player.aimTarget = {
                x: this.#player.body.position.x + Math.sin(this.#player.angle) * 100,
                y: this.#player.body.position.y - Math.cos(this.#player.angle) * 100
            };
        }
    }
    #lookAtPoint(pt) {
        this.#lookInDirection(+normalizeAngle(Math.atan2(pt.y - this.player.body.position.y, pt.x - this.player.body.position.x) + Math.PI / 2, { normalizeTo: "radians" }));
    }
}
export default AI;
