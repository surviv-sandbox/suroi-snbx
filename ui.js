class uiManager {
    static #initialized = false;
    #elements = [];
    get elements() { return Object.values(this.#elements).map(e => e.name); }
    #core = [];
    constructor() {
        if (uiManager.#initialized) {
            throw new Error(`uiManager already initialized.`);
        }
        uiManager.#initialized = true;
    }
    add(...items) {
        items.forEach(i => {
            if (i.callCreateImmediately) {
                i.create?.($("ui-container"));
            }
        });
        const itemsMapped = items.map(i => (delete i.callCreateImmediately, i));
        this.#elements.push(...itemsMapped);
        this.#core.push(...itemsMapped.filter(v => v.core));
    }
    remove(item) {
        this.#elements = this.#elements.filter(e => e.name != item);
    }
    clear() {
        this.#elements = [...this.#core.map(v => ({ ...v }))];
    }
    create() {
        const p = gamespace.player;
        if (!p) {
            return;
        }
        const container = makeElement("div", "ui-container", `ui ${gamespace.settings.ui ? "" : "hidden"}`);
        document.body.appendChild(container);
        this.#elements.forEach(e => e.create?.(container));
    }
    update() {
        const p = gamespace.player, i = p?.inventory?.activeItem;
        if (!p) {
            return;
        }
        this.#elements.forEach(e => e.update?.(p, i));
    }
}
const ui = new uiManager();
ui.add({
    name: "ammo",
    create(container) {
        const cont = makeElement("div", "ui-ammo-cont", `ui ammo`), ammo = makeElement("div", "ui-ammo-counter-main", `ui ammo`), resAmmo = makeElement("div", "ui-ammo-counter-res", `ui ammo`);
        container.appendChild(cont).append(ammo, resAmmo);
    },
    update(p, i) {
        const ammo = $("ui-ammo-counter-main"), resAmmo = $("ui-ammo-counter-res");
        if (!i) {
            ammo.style.display = resAmmo.style.display = "none";
        }
        else {
            ammo.style.display = resAmmo.style.display = "";
            ammo.style.color = i.ammo ? "" : "red";
            ammo.textContent = `${Number.isFinite(i.ammo) ? i.ammo : "∞"}`;
            resAmmo.textContent = "∞";
        }
    },
    core: true
}, {
    name: "HP",
    create(container) {
        const doc = new DocumentFragment(), cont = makeElement("div", "ui-hp-cont", `hud hp`), innerCont = makeElement("div", "ui-hp-inner-cont", `hud hp`), bar = makeElement("div", "ui-hp-bar", `hud hp`), lag = makeElement("div", "ui-hp-bar-lag", `hud hp`);
        doc.appendChild(cont).appendChild(innerCont).appendChild(bar);
        innerCont.appendChild(lag);
        container.appendChild(doc);
    },
    update(p) {
        const lag = $("ui-hp-bar-lag"), bar = $("ui-hp-bar"), percent = p.health == Infinity ? 100 : Math.max(0, 100 * p.health / p.maxHealth);
        lag.style.width = bar.style.width = `${percent}%`;
        bar.style.animation = "";
        if (percent == 100) {
            bar.style.backgroundColor = "";
        }
        else if (percent <= 24) {
            bar.style.backgroundColor = "#F00";
            bar.style.animation = "HP-critical 0.5s ease-out alternate infinite";
        }
        else if (percent <= 75) {
            bar.style.backgroundColor = `rgb(255, ${255 * (percent - 24) / 51}, ${255 * (percent - 24) / 51})`;
        }
        else {
            bar.style.backgroundColor = "#FFF";
        }
    },
    core: true
}, {
    name: "reloading",
    update(p, i) {
        if (p.state.reloading) {
            if (!$("ui-reload-cont")) {
                const cont = makeElement("div", "ui-reload-cont", `ui reload`), canvas = makeElement("canvas", "ui-reload-spin", `ui reload`), text = makeElement("div", "ui-reload-text", `ui reload`);
                canvas.width = canvas.height = 850;
                text.textContent = "Reloading";
                $("ui-container").appendChild(cont).append(canvas, text);
            }
            const can = $("ui-reload-spin"), ctx = can.getContext("2d");
            ctx.clearRect(0, 0, 850, 850);
            ctx.beginPath();
            ctx.fillStyle = "#0004";
            ctx.arc(425, 425, 400, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.lineWidth = 70;
            ctx.strokeStyle = "#FFF";
            ctx.arc(425, 425, 390, -Math.PI / 2, ((gamespace._currentUpdate - p.state.reloading) / i.proto[i.proto.altReload && !i.ammo ? "altReload" : "reload"].duration) * 2 * Math.PI - Math.PI / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = 30;
            ctx.font = "bold 300px roboto";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.strokeStyle = "#000";
            ctx.fillStyle = "#FFF";
            const a = gamespace.player.inventory.activeItem, t = Math.round((a.proto[`${a.proto.altReload && !a.ammo ? "altR" : "r"}eload`].duration - (gamespace._currentUpdate - p.state.reloading)) / 100) / 10, s = t % 1 ? `${t}` : `${t}.0`;
            ctx.strokeText(s, 425, 600);
            ctx.fillText(s, 425, 600);
        }
        else {
            $("ui-reload-cont")?.remove?.();
        }
    },
    core: true
}, {
    name: "killfeed",
    update(p, i) {
        if (gamespace.kills.length) {
            if (!$("killfeed-container")) {
                const cont = makeElement("div", "killfeed-container");
                $("ui-container").appendChild(cont);
            }
            gamespace.kills.filter(k => gamespace._currentUpdate - k.timestamp > 2000).forEach(k => $(`killfeed-kill-${k.id}`)?.remove?.());
            gamespace.kills = gamespace.kills.filter(k => gamespace._currentUpdate - k.timestamp <= 2000);
            const doc = new DocumentFragment();
            gamespace.kills.forEach((k, i) => {
                const p = ($(`killfeed-kill-${k.id}`) ?? makeElement("div", `killfeed-kill-${k.id}`, "killfeed-entry"));
                if (!$(`killfeed-kill-${k.id}`)) {
                    if (gamespace.settings.bonus_features.csgo_style_killfeed) {
                        p.innerHTML = `${k.killer}&nbsp;&nbsp;&nbsp;<img src="${gamespace.guns.find(g => g.name == k.weapon).images.silhouette.src}" class="killfeed-image"${k.crit ? ` style="background: content-box radial-gradient(#f00, transparent);"` : ""}/>&nbsp;&nbsp;&nbsp;${k.killed}`;
                        p.style.backgroundColor = k.killed == gamespace.settings.name ? "#8008" : "";
                        p.style.outline = k.killer == gamespace.settings.name ? "calc(2vh / 9) solid #C00" : "";
                    }
                    else {
                        const involved = k.killer == gamespace.player.name || k.killed == gamespace.player.name;
                        p.innerHTML = `${involved ? `<span style="color: ${k.killer == gamespace.player.name ? "#03BEFF" : "#D1777C"}">` : ""}${k.killer} killed ${k.killed} with ${k.weapon}${involved ? "</span>" : ""}`;
                    }
                    doc.appendChild(p);
                }
                p.style.top = `${3.9 * i + 5}%`;
                p.style.opacity = `${gamespace._currentUpdate - k.timestamp >= 1250 ? 1 - (((gamespace._currentUpdate - k.timestamp) - 1250) / 750) : 1}`;
            });
            $("killfeed-container").appendChild(doc);
        }
        else {
            $("killfeed-container")?.remove?.();
        }
    },
    core: true
});
