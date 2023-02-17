"use strict";
/**
 * An object for managing UI elements
 */
const UIManager = new (createSingleton(class UIManager {
    /**
     * The `HTMLDivElement` containing the UI
     */
    #container = makeElement("div", {
        id: "ui-container",
        className: "ui"
    });
    /**
     * The `HTMLDivElement` containing the UI
     */
    get container() { return this.#container; }
    /**
     * A Map whose values correspond to this manager's elements and whose keys are their corresponding names
     */
    #elements = new Map;
    /**
     * A Map whose valuess correspond to this manager's elements and whose keys are their corresponding names
     */
    get elements() { return this.#elements; }
    /**
     * UI elements marked as `core` won't be cleared when calling `UIManager.clear()` unless `force` is set to `true`.
     */
    get core() { return [...this.#elements.values()].filter(e => e.core); }
    /**
     * Adds UI elements to the manager
     * @param items An array of `UIElement`s to append
     * @param items[].instantiateImmediately - Whether to call the element's `create` function immediately
     */
    add(...items) {
        for (let i = 0, l = items.length; i < l; i++) {
            const item = items[i];
            this.#elements.set(item.name, item);
            item.instantiateImmediately && item.create?.(this.#container);
            delete item.instantiateImmediately;
        }
    }
    /**
     * Removes the item with the specified name
     * @param item The UI element's name
     */
    remove(item) {
        this.#elements.delete(item);
    }
    /**
     * Removes all UI elements not marked as `core`.
     *
     * If `force` is set to true, `core` elements will be cleared as well
     */
    clear(force) {
        this.#elements = new Map([...this.#elements.entries()].filter(([_, e]) => {
            if (force || !e.core)
                return e.destroy();
            return true;
        }));
    }
    /**
     * Calls every UI element's `create` method.
     *
     * This method does nothing if there is no `Player` present
     */
    create() {
        if (!gamespace.player)
            return;
        document.body.appendChild(this.#container);
        for (const [_, ele] of this.#elements)
            ele.create?.(this.#container);
    }
    /**
     * Calls every UI element's `update` method
     *
     * This method does nothing if there is no `Player` present
     */
    update() {
        if (!gamespace.player)
            return;
        for (const [_, ele] of this.#elements)
            ele.update?.();
    }
}));
{
    UIManager.add((() => {
        const ui = {
            container: void 0,
            counter: void 0,
            reserve: void 0,
        };
        ui.container = makeElement("div", {
            id: "ui-ammo-cont",
            className: "ui ammo"
        }, [
            ui.counter = makeElement("div", {
                id: "ui-ammo-counter-main",
                className: "ui ammo"
            }),
            ui.reserve = makeElement("div", {
                id: "ui-ammo-counter-res",
                className: "ui ammo"
            })
        ]);
        let count = srvsdbx_ErrorHandling.Nothing;
        return {
            name: "ammo",
            create(cont) {
                cont.appendChild(ui.container);
            },
            update() {
                const activeItem = gamespace.player?.activeItem, ammo = activeItem?.ammo ?? srvsdbx_ErrorHandling.Nothing;
                if (ammo == count)
                    return;
                count = ammo;
                if (activeItem instanceof Gun) {
                    ui.counter.style.display = ui.reserve.style.display = "";
                    ui.counter.style.color = activeItem.ammo ? "" : "red";
                    ui.counter.textContent = `${Number.isFinite(activeItem.ammo) ? activeItem.ammo : "∞"}`;
                    ui.reserve.textContent = "∞";
                }
                else
                    ui.counter.style.display = ui.reserve.style.display = "none";
            },
            destroy() { ui.container.remove(); },
            core: true
        };
    })(), (() => {
        const ui = {
            container: void 0,
            background: void 0,
            inner: void 0,
            mainBar: void 0,
            lagBar: void 0,
        };
        ui.container = makeElement("div", {
            id: "ui-hp-cont",
            className: "ui hp"
        }, [
            ui.background = makeElement("img", {
                id: "ui-hp-bg",
                className: "ui hp"
            }),
            ui.inner = makeElement("div", {
                id: "ui-hp-inner-cont",
                className: "ui hp"
            }, [
                ui.lagBar = makeElement("div", {
                    id: "ui-hp-bar-lag",
                    className: "ui hp"
                }),
                ui.mainBar = makeElement("div", {
                    id: "ui-hp-bar",
                    className: "ui hp"
                })
            ])
        ]);
        let health = srvsdbx_ErrorHandling.Nothing, effectLength = 0;
        return {
            name: "HP",
            create(cont) {
                cont.appendChild(ui.container);
            },
            update() {
                const player = gamespace.player, percent = player.health == Infinity ? 100 : Math.max(0, 100 * player.health / player.maxHealth);
                if (player.health != health) {
                    health = player.health;
                    ui.mainBar.style.width = ui.lagBar.style.width = `${percent}%`;
                    ui.mainBar.style.animation = "";
                    if (percent == 100) {
                        ui.mainBar.style.backgroundColor = "";
                    }
                    else if (percent <= 24) {
                        ui.mainBar.style.backgroundColor = "#F00";
                        ui.mainBar.style.animation = "HP-critical 0.5s ease-out alternate infinite";
                    }
                    else if (percent <= 75) {
                        ui.mainBar.style.backgroundColor = `rgb(255, ${255 * (percent - 24) / 51}, ${255 * (percent - 24) / 51})`;
                    }
                    else {
                        ui.mainBar.style.backgroundColor = "#FFF";
                    }
                }
                const effects = [...player.statusEffects.values()].filter(s => s.prototype.healthBarDecoration);
                if (effects.length != effectLength) {
                    effectLength = effects.length;
                    if (effects.length) {
                        // Display the first effect, because… there's not really an
                        // alternative. surviv never envisioned having multiple
                        // status effects at once
                        const effect = effects[0], prototype = effect.prototype, interp = 100 * (1 - (gamespace.currentUpdate - effect.afflictionTime) / (prototype.decay ?? Infinity));
                        ui.background.style.display = "block";
                        if (ui.background.src != prototype.healthBarDecoration.src) {
                            ui.background.src = prototype.healthBarDecoration.src;
                        }
                        ui.background.style.clipPath = `polygon(0 0, ${interp}% 0, ${interp}% 100%, 0 100%)`;
                    }
                    else {
                        ui.background.style.display = "";
                        ui.background.src = "";
                    }
                }
            },
            destroy() { ui.container.remove(); },
            core: true
        };
    })(), (() => {
        const ui = {
            container: void 0,
            spinner: void 0,
            text: void 0,
        };
        ui.container = makeElement("div", {
            id: "ui-reload-cont",
            className: "ui reload"
        }, [
            ui.spinner = makeElement("canvas", {
                id: "ui-reload-spin",
                className: "ui hp",
                width: 850,
                height: 850,
            }),
            ui.text = makeElement("div", {
                id: "ui-reload-text",
                className: "ui hp",
                textContent: "Reloading"
            })
        ]);
        const ctx = ui.spinner.getContext("2d");
        return {
            name: "reloading",
            update() {
                const p = gamespace.player, item = p?.activeItem, duration = item?.determineReloadType?.()?.duration * (p?.modifiers?.ergonomics?.reduced ?? 1);
                if (p?.state?.reloading) {
                    if (!UIManager.container.contains(ui.container))
                        UIManager.container.appendChild(ui.container);
                    ctx.clearRect(0, 0, 850, 850);
                    ctx.beginPath();
                    ctx.fillStyle = "#0004";
                    ctx.arc(425, 425, 400, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.lineWidth = 70;
                    ctx.strokeStyle = "#FFF";
                    ctx.arc(425, 425, 390, -Math.PI / 2, ((gamespace.currentUpdate - p.state.reloading) / duration) * 2 * Math.PI - Math.PI / 2);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.lineWidth = 30;
                    ctx.font = "bold 300px roboto";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "bottom";
                    ctx.strokeStyle = "#000";
                    ctx.fillStyle = "#FFF";
                    const t = Math.round((duration - gamespace.currentUpdate + p.state.reloading) / 100) / 10, s = t % 1 ? `${t}` : `${t}.0`;
                    ctx.strokeText(s, 425, 600);
                    ctx.fillText(s, 425, 600);
                }
                else
                    ui.container.remove();
            },
            destroy() { ui.container.remove(); },
            core: true
        };
    })(), (() => {
        const slots = 4, ui = {
            container: void 0
        };
        for (let i = 0; i < slots; i++) {
            ui[`slot${i}`] = void 0;
        }
        function makeSlot(id) {
            const slot = {
                container: void 0,
                itemImage: void 0,
                background: void 0,
                number: void 0,
                itemName: void 0
            };
            slot.container = makeElement("div", {
                id: `ui-inv-main-slot${id}`,
                className: "ui inv-main inv-main-slot"
            }, [
                slot.number = makeElement("div", {
                    className: "ui inv-main-slot-number",
                    textContent: `${id + 1}`
                }),
                slot.itemImage = makeElement("img", {
                    className: "ui inv-main-slot-img"
                }),
                slot.background = makeElement("img", {
                    className: "ui inv-main-slot-bg"
                }),
                slot.itemName = makeElement("div", {
                    className: "ui inv-main-slot-name"
                })
            ], {
                mousedown(ev) { ev.stopPropagation(); },
                click(ev) {
                    if (!ev.button && gamespace.player) {
                        ev.stopPropagation();
                        gamespace.player.setActiveItemIndex(id);
                    }
                }
            });
            return slot;
        }
        ui.container = makeElement("div", {
            id: "ui-inv-main-cont",
            className: "ui inv-main"
        }, new Array(slots).fill(0).map((_, i) => (ui[`slot${i}`] = makeSlot(i)).container));
        // Doing sot updates every frame is wasteful, so we'll only do
        // them when items change
        const cache = new Array(slots).fill("");
        let active, activeChanged = false;
        return {
            name: "inv-main",
            create(cont) {
                cont.appendChild(ui.container);
            },
            update() {
                const player = gamespace.player, inventory = player.inventory;
                activeChanged = false;
                if (active != player.activeItemIndex) {
                    active = player.activeItemIndex;
                    activeChanged = true;
                }
                for (let i = 0; i < slots; i++) {
                    const slot = ui[`slot${i}`], item = inventory.getItem(i, "Main"), prototype = item?.prototype;
                    if (activeChanged) {
                        if (item == player.activeItem)
                            slot.container.classList.add("active");
                        else
                            slot.container.classList.remove("active");
                    }
                    // Only re-render the background thingy from charges
                    // if the item hasn't changed
                    if (cache[i] == prototype?.internalName ?? "") {
                        renderSlotBackground();
                        continue;
                    }
                    cache[i] = prototype?.internalName ?? "";
                    function renderSlotBackground() {
                        function clear() {
                            slot.background.style.display = "none";
                            slot.background.src = "";
                        }
                        if (prototype instanceof GunPrototype
                            && item instanceof Gun
                            && prototype.fireMode.includes("charge")
                            && (item.isCharging || item.charged)
                            && prototype.chargeProps?.chargeImageHUD) {
                            const chargeProps = prototype.chargeProps, HUDImage = chargeProps.chargeImageHUD;
                            const interp = 100 * Math.clamp((gamespace.currentUpdate - item.chargeStart) / (chargeProps?.chargeTime ?? Infinity), 0, 1);
                            slot.background.style.clipPath = "";
                            slot.background.style.display = "";
                            slot.background.src = HUDImage.image.src;
                            if (HUDImage.growStyle == "clip")
                                slot.background.style.clipPath = `polygon(0 0, ${interp}% 0, ${interp}% 100%, 0 100%)`;
                        }
                        else
                            clear();
                    }
                    if (item) {
                        const aspectRatio = prototype.images.loot.asset.width / prototype.images.loot.asset.height;
                        slot.itemImage.src = prototype.images.loot.src;
                        if (aspectRatio != 1) {
                            const width = prototype.images.loot.asset.width, height = prototype.images.loot.asset.height;
                            slot.itemImage.style.aspectRatio = `${width / height}`;
                            if (aspectRatio >= 1) { // If the image is longer than it is wide, set its width to 60
                                slot.itemImage.style.width = "calc(60vh / 9)";
                                slot.itemImage.style.height = "auto";
                            }
                            else { // Otherwise set its height to 60
                                slot.itemImage.style.width = "auto";
                                slot.itemImage.style.height = "calc(60vh / 9)";
                            }
                        }
                        renderSlotBackground();
                        slot.itemName.textContent = prototype.displayName ?? prototype.name;
                    }
                    else {
                        slot.container.classList.remove("active");
                        slot.itemImage.style.display = "none";
                        slot.itemImage.style.aspectRatio = "";
                        slot.background.style.display = "none";
                        slot.background.style.aspectRatio = "";
                        slot.itemName.textContent = "";
                    }
                }
            },
            destroy() { ui.container.remove(); },
            core: true
        };
    })());
}
//# sourceMappingURL=ui.js.map