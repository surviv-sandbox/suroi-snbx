/**
 * Represents a singular UI element
 */
interface UIElement {
    /**
     * The element's name
     */
    readonly name: string;
    /**
     * A function that'll be called to create this element in the DOM
     * @param uiContainer The `HTMLDivElement` containing the other UI elements
    */
    create?(uiContainer: HTMLDivElement): void;
    /**
     * A function that will be called to update this UI element
     * @param uiContainer The `HTMLDivElement` containing the other UI elements
     *
     * _It is recommended to first check that an update is actually required before
     * making any DOM operations; for example, a health bar only needs to be updated
     * when the user's health changes_
     */
    update?(uiContainer: HTMLDivElement): void;
    /**
     * A method that will be invoked in order to remove this UI element
     */
    destroy(): void;
    /**
     * Elements deemed 'essential'. When clearing the UI, these elements will persist unless the `force` option is specified.
     */
    readonly core: boolean;
}

/**
 * An object for managing UI elements
 */
const UIManager = new (srvsdbx_OOP.createSingleton(class UIManager {
    /**
     * The `HTMLDivElement` containing the UI
     */
    readonly #container = makeElement(
        "div",
        {
            id: "ui-container",
            className: "ui"
        }
    );

    /**
     * A Map whose values correspond to this manager's elements and whose keys are their corresponding names
     */
    #elements: Map<string, UIElement> = new Map;
    /**
     * A Map whose values correspond to this manager's elements and whose keys are their corresponding names
     */
    get elements() { return this.#elements; }

    /**
     * UI elements marked as `core` won't be cleared when calling `UIManager.clear()` unless `force` is set to `true`.
     */
    get core() { return [...this.#elements.values()].filter(e => e.core); }

    /**
     * Whether or not the HUD is currently being hidden
     */
    #hidden = false;
    /**
     * Whether or not the HUD is currently being hidden
     */
    get hidden() { return this.#hidden; }

    /**
     * Adds UI elements to the manager
     * @param items An array of `UIElement`s to append
     * @param items[].instantiateImmediately - Whether to call the element's `create` function immediately
     */
    add(...items: (UIElement & { instantiateImmediately?: boolean; })[]) {
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
    remove(item: string) {
        this.#elements.delete(item);
    }

    /**
     * Removes all UI elements not marked as `core`.
     *
     * If `force` is set to true, `core` elements will be cleared as well
     */
    clear(force?: boolean) {
        this.#elements = new Map([...this.#elements.entries()].filter(([_, e]) => {
            if (force || !e.core) return e.destroy();
            return true;
        }));
    }

    /**
     * Calls every UI element's `create` method.
     *
     * This method does nothing if there is no `Player` present
     */
    create() {
        if (!gamespace.player) return;

        document.body.appendChild(this.#container);

        for (const [, element] of this.#elements)
            element.create?.(this.#container);

        if (this.#hidden)
            this.#container.style.display = "none";
    }

    /**
     * Calls every UI element's `update` method
     *
     * This method does nothing if there is no `Player` present
     */
    update() {
        if (!gamespace.player || this.#hidden) return;

        for (const [, element] of this.#elements)
            element.update?.(this.#container);
    }

    /**
     * Shows HUD elements that haven't otherwise been hidden
     */
    show() {
        this.#hidden = false;
        this.#container.style.display = "";
    }

    /**
     * Hides every HUD element from view
    */
    hide() {
        this.#hidden = true;
        this.#container.style.display = "none";
    }

    /**
     * Shows the HUD if it is currently hidden and hides it otherwise
     */
    toggle() {
        (this.#hidden = !this.#hidden) ? this.hide() : this.show();
    }
}));

{
    UIManager.add(
        (() => {
            const ui = {
                container: void 0 as any as HTMLDivElement,
                counter: void 0 as any as HTMLDivElement,
                reserve: void 0 as any as HTMLDivElement,
            };

            ui.container = makeElement(
                "div",
                {
                    id: "ui-ammo-cont",
                    className: "ui ammo"
                },
                [
                    ui.counter = makeElement(
                        "div",
                        {
                            id: "ui-ammo-counter-main",
                            className: "ui ammo",
                            style: {
                                display: "none"
                            }
                        }
                    ),
                    ui.reserve = makeElement(
                        "div",
                        {
                            id: "ui-ammo-counter-res",
                            className: "ui ammo",
                            style: {
                                display: "none"
                            }
                        }
                    )
                ]
            );

            let count: number | undefined;

            return {
                name: "ammo",
                create(container) { container.appendChild(ui.container); },
                update() {
                    const activeItem = gamespace.player?.activeItem,
                        ammo = (activeItem as srvsdbx_ErrorHandling.Maybe<Gun>)?.ammo;

                    if (ammo === count) return;

                    count = ammo;
                    if (activeItem instanceof Gun) {
                        ui.counter.style.display = ui.reserve.style.display = "";
                        ui.counter.style.color = activeItem.ammo ? "" : "red";

                        ui.counter.textContent = `${Number.isFinite(activeItem.ammo) ? activeItem.ammo : "∞"}`;
                        ui.reserve.textContent = "∞";
                    } else ui.counter.style.display = ui.reserve.style.display = "none";
                },
                destroy() { ui.container.remove(); },
                core: true
            };
        })(),
        (() => {
            const ui = {
                container: void 0 as any as HTMLDivElement,
                background: void 0 as any as HTMLImageElement,
                inner: void 0 as any as HTMLDivElement,
                mainBar: void 0 as any as HTMLDivElement,
                lagBar: void 0 as any as HTMLDivElement,
            };

            ui.container = makeElement(
                "div",
                {
                    id: "ui-hp-cont",
                    className: "ui hp"
                },
                [
                    ui.background = makeElement(
                        "img",
                        {
                            id: "ui-hp-bg",
                            className: "ui hp"
                        }
                    ),
                    ui.inner = makeElement(
                        "div",
                        {
                            id: "ui-hp-inner-cont",
                            className: "ui hp"
                        },
                        [
                            ui.lagBar = makeElement(
                                "div",
                                {
                                    id: "ui-hp-bar-lag",
                                    className: "ui hp"
                                }
                            ),
                            ui.mainBar = makeElement(
                                "div",
                                {
                                    id: "ui-hp-bar",
                                    className: "ui hp"
                                }
                            )
                        ]
                    )
                ]
            );

            let health: number | undefined,
                effectLength = 0;

            return {
                name: "HP",
                create(container) { container.appendChild(ui.container); },
                update() {
                    const player = gamespace.player!,
                        percent = player.health == Infinity ? 100 : Math.max(0, 100 * player.health / player.maxHealth);

                    if (player.health != health) {
                        health = player.health;

                        ui.mainBar.style.width = ui.lagBar.style.width = `${percent}%`;

                        ui.mainBar.style.animation = "";

                        if (percent == 100) {
                            ui.mainBar.style.backgroundColor = "";
                        } else if (percent <= 25) {
                            ui.mainBar.style.backgroundColor = "#F00";
                            ui.mainBar.style.animation = "HP-critical 0.5s ease-out alternate infinite";
                        } else if (percent <= 75) {
                            ui.mainBar.style.backgroundColor = `rgb(255, ${255 * (percent - 25) / 50}, ${255 * (percent - 25) / 50})`;
                        } else {
                            ui.mainBar.style.backgroundColor = "#FFF";
                        }
                    }

                    const effects = [...player.statusEffects.values()].filter(s => s.prototype.healthBarDecoration),
                        diff = effects.length != effectLength;

                    if (effects.length) {
                        // Display the first effect, because… there's not really an
                        // alternative. surviv never envisioned having multiple
                        // status effects at once
                        const effect = effects[0],
                            prototype = effect.prototype,
                            interp = 100 * (1 - (gamespace.currentUpdate - effect.afflictionTime) / (prototype.decay ?? Infinity));

                        ui.background.style.clipPath = `polygon(0 0, ${interp}% 0, ${interp}% 100%, 0 100%)`;

                        if (diff) {
                            effectLength = effects.length;

                            ui.background.style.display = "block";

                            if (ui.background.src != prototype.healthBarDecoration!.src)
                                ui.background.src = prototype.healthBarDecoration!.src;
                        }
                    } else if (diff) {
                        ui.background.style.display = "";
                        ui.background.src = "";
                    }
                },
                destroy() { ui.container.remove(); },
                core: true
            };
        })(),
        (() => {
            const ui = {
                container: void 0 as any as HTMLDivElement,
                spinner: void 0 as any as HTMLCanvasElement,
                text: void 0 as any as HTMLDivElement,
            };

            ui.container = makeElement(
                "div",
                {
                    id: "ui-reload-cont",
                    className: "ui reload"
                },
                [
                    ui.spinner = makeElement(
                        "canvas",
                        {
                            id: "ui-reload-spin",
                            className: "ui reload",
                            width: 850,
                            height: 850,
                        }
                    ),
                    ui.text = makeElement(
                        "div",
                        {
                            id: "ui-reload-text",
                            className: "ui reload",
                            textContent: "Reloading"
                        }
                    )
                ]
            );

            const ctx = ui.spinner.getContext("2d") as CanvasRenderingContext2D;

            return {
                name: "reloading",
                update(container) {
                    const player = gamespace.player,
                        item = player?.activeItem as Gun,
                        duration = item?.determineReloadType?.()?.duration * (player?.modifiers?.ergonomics?.reduced ?? 1);

                    if (player?.state?.reloading) {
                        if (!container.contains(ui.container))
                            container.appendChild(ui.container);

                        ctx.clearRect(0, 0, 850, 850);

                        ctx.beginPath();
                        ctx.fillStyle = "#0004";
                        ctx.arc(425, 425, 400, 0, 2 * Math.PI);
                        ctx.fill();

                        ctx.beginPath();
                        ctx.lineWidth = 70;
                        ctx.strokeStyle = "#FFF";
                        ctx.arc(425, 425, 390, -Math.PI / 2, ((gamespace.currentUpdate - player.state.reloading) / duration) * 2 * Math.PI - Math.PI / 2);
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.lineWidth = 30;
                        ctx.font = "bold 300px roboto";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "bottom";
                        ctx.strokeStyle = "#000";
                        ctx.fillStyle = "#FFF";

                        const time = Math.round((duration - gamespace.currentUpdate + player.state.reloading) / 100) / 10,
                            toString = time % 1 ? `${time}` : `${time}.0`;

                        ctx.strokeText(toString, 425, 600);
                        ctx.fillText(toString, 425, 600);
                    } else ui.container.remove();
                },
                destroy() { ui.container.remove(); },
                core: true
            };
        })(),
        (() => {
            const slots = Inventory.MAIN_SLOTS,
                ui: {
                    container: HTMLDivElement,
                    [key: `slot${number}`]: ReturnType<typeof makeSlot>;
                } = { container: void 0 as any as HTMLDivElement };

            for (let i = 0; i < slots; i++)
                ui[`slot${i}`] = void 0 as any as ReturnType<typeof makeSlot>;

            function makeSlot(id: number) {
                const slot = {
                    container: void 0 as any as HTMLDivElement,
                    itemImage: void 0 as any as HTMLImageElement,
                    background: void 0 as any as HTMLImageElement,
                    number: void 0 as any as HTMLDivElement,
                    itemName: void 0 as any as HTMLDivElement
                };

                slot.container = makeElement(
                    "div",
                    {
                        id: `ui-inv-main-slot${id}`,
                        className: "ui inv-main inv-main-slot"
                    },
                    [
                        slot.number = makeElement(
                            "div",
                            {
                                className: "ui inv-main-slot-number",
                                textContent: `${id + 1}`
                            }
                        ),
                        slot.itemImage = makeElement(
                            "img",
                            {
                                className: "ui inv-main-slot-img"
                            }
                        ),
                        slot.background = makeElement(
                            "img",
                            {
                                className: "ui inv-main-slot-bg"
                            }
                        ),
                        slot.itemName = makeElement(
                            "div",
                            {
                                className: "ui inv-main-slot-name"
                            }
                        )
                    ],
                    {
                        mousedown(ev) { ev.stopPropagation(); },
                        click(ev) {
                            if (!ev.button && gamespace.player) {
                                ev.stopPropagation();
                                gamespace.player.setActiveItemIndex(id);
                            }
                        }
                    }
                );

                return slot;
            }

            ui.container = makeElement(
                "div",
                {
                    id: "ui-inv-main-cont",
                    className: "ui inv-main"
                },
                new Array(slots).fill(0).map((_, i) => (ui[`slot${i}`] = makeSlot(i)).container)
            );

            const cache = new Array<string>(slots).fill("");
            let active: number,
                activeChanged = false;

            return {
                name: "inv-main",
                create(cont) {
                    cont.appendChild(ui.container);
                },
                update() {
                    const player = gamespace.player!,
                        inventory = player.inventory;

                    activeChanged = false;

                    if (active != player.activeItemIndex) {
                        active = player.activeItemIndex;
                        activeChanged = true;
                    }

                    for (let i = 0; i < slots; i++) {
                        const slot = ui[`slot${i}`],
                            item = inventory.containers.main.get(i),
                            prototype = item?.prototype!;

                        if (activeChanged) {
                            if (item == player.activeItem) slot.container.classList.add("active");
                            else slot.container.classList.remove("active");
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

                            if (
                                prototype instanceof GunPrototype
                                && item instanceof Gun
                                && prototype.fireMode.includes("charge")
                                && (item.isCharging || item.charged)
                                && prototype.chargeProps?.chargeImageHUD
                            ) {
                                const chargeProps = prototype.chargeProps!,
                                    HUDImage = chargeProps.chargeImageHUD!;

                                const interp = 100 * Math.clamp((gamespace.currentUpdate - item.chargeStart) / (chargeProps?.chargeTime ?? Infinity), 0, 1);

                                slot.background.style.clipPath = "";
                                slot.background.style.display = "";
                                slot.background.src = HUDImage.image.src;

                                if (HUDImage.growStyle == "clip")
                                    slot.background.style.clipPath = `polygon(0 0, ${interp}% 0, ${interp}% 100%, 0 100%)`;

                            } else clear();
                        }

                        if (item) {
                            const aspectRatio = prototype.images.loot.asset.width / prototype.images.loot.asset.height;

                            slot.itemImage.src = prototype.images.loot.src;

                            if (aspectRatio != 1) {
                                const width = prototype.images.loot.asset.width,
                                    height = prototype.images.loot.asset.height;

                                slot.itemImage.style.aspectRatio = `${width}/${height}`;

                                if (aspectRatio >= 1) { // If the image is longer than it is wide, set its width to 60
                                    slot.itemImage.style.width = "calc(60vh / 9)";
                                    slot.itemImage.style.height = "auto";
                                } else { // Otherwise set its height to 60
                                    slot.itemImage.style.width = "auto";
                                    slot.itemImage.style.height = "calc(60vh / 9)";
                                }
                            }

                            renderSlotBackground();

                            slot.itemName.textContent = prototype.displayName ?? prototype.name;
                        } else {
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
        })(),
        (() => {
            const ui: {
                container: HTMLDivElement,
            } & Record<EquipmentTypes, ReturnType<typeof generateSlot>> = {
                container: void 0 as any as HTMLDivElement,
                vest: void 0 as any,
                helmet: void 0 as any,
                backpack: void 0 as any
            },
                equipments = [
                    "helmet",
                    "vest",
                    "backpack"
                ] as EquipmentTypes[];

            function generateSlot(slot: EquipmentTypes) {
                let img: HTMLImageElement,
                    txt: HTMLParagraphElement,
                    cont = makeElement(
                        "div",
                        {
                            id: `ui-equip-slot-${slot}`,
                            className: "ui equip equip-slot",
                            style: {
                                display: "none"
                            }
                        },
                        [
                            img = makeElement(
                                "img",
                                {
                                    id: `ui-equip-slot-${slot}-img`,
                                    className: "ui equip equip-img"
                                }
                            ),
                            txt = makeElement(
                                "p",
                                {
                                    id: `up-equip-slot-${slot}-txt`,
                                    className: "ui equip equip-txt"
                                }
                            )
                        ]
                    );

                return {
                    cont: cont,
                    img: img,
                    txt: txt
                };
            }

            ui.container = makeElement(
                "div",
                {
                    id: "ui-equip-cont",
                    className: "ui equip"
                },
                equipments.map(slot => ui[slot] = generateSlot(slot)).map(o => o.cont)
            );

            let cache = "";

            function serialize(equipment: PlayerLike["inventory"]["containers"]["equipment"]) {
                let result = "";

                equipment.forEach(val => result += val.prototype.internalName);

                return result;
            }

            return {
                name: "equipment",
                create(container) { container.appendChild(ui.container); },
                update() {
                    const player = gamespace.player!,
                        equipment = player.inventory.containers.equipment,
                        serialized = serialize(equipment);

                    if (cache != serialized) {
                        cache = serialized;

                        equipments.forEach(slotName => {
                            const piece = equipment.get(slotName),
                                slot = ui[slotName];

                            if (piece && !piece.prototype.noShow) {
                                slot.cont.style.opacity = "";
                                slot.cont.style.pointerEvents = "";

                                const image = piece.prototype.images.loot;

                                if (slot.img.src != image.src)
                                    slot.img.src = image.src;

                                const aspectRatio = image.asset.width / image.asset.height;

                                if (aspectRatio >= 1) {
                                    slot.img.style.width = "calc(36vh / 9)";
                                    slot.img.style.height = "auto";
                                } else {
                                    slot.img.style.width = "auto";
                                    slot.img.style.height = "calc(36vh / 9)";
                                }

                                slot.img.style.aspectRatio = `${image.asset.width}/${image.asset.height}`;
                                slot.txt.style.color = piece.prototype.maxLevel ? "#F90" : "";
                                slot.txt.textContent = `Lvl. ${piece.prototype.level}`;
                            } else {
                                slot.cont.style.opacity = "0";
                                slot.cont.style.pointerEvents = "none";
                                slot.img.src = "";
                            }
                        });
                    }
                },
                destroy() { ui.container.remove(); },
                core: true
            };
        })(),
        (() => {
            const ui = {
                container: void 0 as any as HTMLDivElement,
                counter: void 0 as any as HTMLParagraphElement
            };

            ui.container = makeElement(
                "div",
                {
                    className: "ui debug fps-count"
                },
                ui.counter = makeElement(
                    "p",
                    {
                        className: "fps-count-text"
                    }
                )
            );

            let hidden = true;

            function toggleHidden() {
                ui.container.style.opacity = (hidden = !hidden) ? "" : "0.6";
            }

            const frameRates: number[] = [];

            return {
                name: "FPS counter",
                create(container) { container.appendChild(ui.container); },
                update() {
                    if (gamespace.p5) {
                        const p5 = gamespace.p5;

                        (hidden != p5.focused) && toggleHidden();

                        if (p5.focused) {
                            frameRates.push(p5.frameRate());

                            if (frameRates.length >= 100)
                                frameRates.splice(0, frameRates.length - 100);

                            ui.counter.textContent = `${srvsdbx_Math.mean(frameRates).toFixed(2)} ± ${srvsdbx_Math.standardDeviation(frameRates).toFixed(2)}`;
                        }
                    }
                },
                destroy() { ui.container.remove(); },
                core: true,
                instantiateImmediately: true
            };
        })()
    );
}