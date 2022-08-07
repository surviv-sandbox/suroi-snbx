export function makeSettings() {
    const doc = new DocumentFragment(),
        back = makeElement("button", "back", "surviv-blue-button"),
        menu = $("menu-container") as HTMLDivElement,
        sidebar = makeElement("div", "settings-sidebar"),
        title = makeElement("div", "settings-title"),
        header = makeElement("div", "settings-header"),
        body = makeElement("div", "settings-body");

    Array.from(menu.children).forEach(e => e.remove());

    back.textContent = "Back";
    title.textContent = "Settings";

    back.addEventListener("click", e => void (!e.button && (() => {
        Array.from(menu.children).forEach(e => e.remove());
        gamespace.makeMenu(false);
    })()));

    doc.append(back, sidebar, title, header, body);

    // The real UI code starts here
    // Factories and factories and factories…
    // Must be a lot of air pollution around these parts

    function makeWrapper(name: string, textContent: string) {
        const div = makeElement("div", `settings-${name}-cont`, "setting-cont");
        div.textContent = textContent;

        return div;
    }

    function makeContainer(textContent: string, children: HTMLElement[], contId?: string, folded?: boolean) {
        const cont = makeElement("div", `settings-category-${contId}`),
            button = makeElement("button", `setting-category-${contId}-button`, "setting-cat"),
            div = makeElement("div", `settings-category-${contId}-cont`, "setting-cat-cont");

        button.innerHTML = `<span style="font-family: monospace">▾</span>&nbsp;${textContent}`;

        if (folded) {
            button.innerHTML = button.innerHTML.replace(/▾/, "▴");
            div.style.display = "none";
        }

        button.addEventListener("click", ev => {
            if (!ev.button) {
                if (div.style.display) {
                    button.innerHTML = button.innerHTML.replace(/▴/, "▾");
                    div.style.display = "";
                } else {
                    button.innerHTML = button.innerHTML.replace(/▾/, "▴");
                    div.style.display = "none";
                }
            }
        });

        cont.append(button, div);

        div.append(...children);

        return cont;
    }

    function _makeSelectMenu(name: string, options: { text: string, value?: string, selected?: boolean; }[], inputCallback: Parameters<typeof HTMLElement.prototype.addEventListener/* Makes the typescript compiler (but not VSCode) freak out => <"input"> */>[1]) {
        const select = makeElement("select", `settings-${name}-select`, "setting-select");

        select.append(...options.map(o => {
            const op = makeElement("option", `settings-${name}-select-opt-${o.text}`);

            op.textContent = o.text;
            op.value = o.value ?? o.text;
            op.selected = o.selected ?? false;

            return op;
        }));

        select.addEventListener("input", function (ev) {
            (typeof inputCallback == "function" ? inputCallback : inputCallback.handleEvent).call(this, ev);
            memoryManager.setItem("settings", gamespace.settings);
        });

        return select;
    }

    function _makeCheckbox(name: string, checked: boolean, inputCallback?: Parameters<typeof HTMLInputElement.prototype.addEventListener>[1]) {
        const checkbox = makeElement("input", `settings-${name}-checkbox`, "setting-checkbox");

        checkbox.type = "checkbox";
        checkbox.checked = checked;

        if (inputCallback) {
            checkbox.addEventListener("input", function (ev) {
                (typeof inputCallback == "function" ? inputCallback : inputCallback.handleEvent).call(this, ev);
                memoryManager.setItem("settings", gamespace.settings);
            });
        }

        return checkbox;
    }

    function assignAtPath(path: string[], value: any) {
        let o: badCodeDesign = gamespace.settings;

        for (const i in path) {
            const p = path[i];

            if (+i == path.length - 1) {
                o[p] = value;
            } else {
                o = o[p];
            }
        }
    }

    function _setupToggleListeners(cont: HTMLDivElement, checkbox: HTMLInputElement, path: string[], inverted: boolean, additionalCallback?: (this: HTMLInputElement) => void) {
        cont.classList.add("checkbox-cont");

        [cont, checkbox].forEach((ele, i) => {
            ele.addEventListener(i ? "input" : "click", function (ev) {
                if (ev instanceof MouseEvent && (ev.target as HTMLElement).id == checkbox.id) {
                    return;
                }

                if (ev instanceof MouseEvent && !ev.button) {
                    checkbox.checked = !checkbox.checked;
                }

                if (!(ev instanceof MouseEvent) || !ev.button) {
                    assignAtPath(path, inverted ? !checkbox.checked : checkbox.checked);
                    additionalCallback?.call?.(this);
                }

                memoryManager.setItem("settings", gamespace.settings);
            });
        });

        cont.appendChild(checkbox);
    }

    function _makeNumericField(name: string, min: number, max: number, initialValue: number, integersOnly: boolean, path: string[], changeCallback?: Parameters<typeof HTMLInputElement.prototype.addEventListener>[1]) {
        const input = makeElement("input", `settings-${name}-numeric-field`, "setting-numeric-field");

        input.type = "text";
        input.value = `${initialValue}`;

        input.addEventListener("change", function (ev) {
            const v = (() => {
                const v = +(input.value || Infinity);
                return Number.isNaN(v) ? 0 : v;
            })();

            if (!checkBounds(v, min, max, { inclusion: { lower: false } })) {
                input.value = `${clamp(v, 0)}`;
            }

            if (integersOnly) {
                input.value = `${Math.round(+input.value)}`;
            }

            assignAtPath(path, +input.value);

            if (changeCallback) {
                (typeof changeCallback == "function" ? changeCallback : changeCallback.handleEvent).call(this, ev);
            }

            memoryManager.setItem("settings", gamespace.settings);
        });

        return input;
    }

    function makeToggleSetting(name: string, textContent: string, checked: boolean, path: string[], inverted: boolean, additionalCallback?: (this: HTMLInputElement) => void) {
        const wrapper = makeWrapper(name, textContent),
            checkbox = _makeCheckbox(name, checked);

        _setupToggleListeners(wrapper, checkbox, path, inverted, additionalCallback);

        return wrapper;
    }

    function makeSelectSetting(name: string, textContent: string, options: { text: string, value?: string, selected?: boolean; }[], path: string[], additionalCallback?: (this: HTMLSelectElement) => void) {
        const wrapper = makeWrapper(name, textContent),
            select = _makeSelectMenu(name, options,
                function (this: HTMLSelectElement) {
                    assignAtPath(path, +this.selectedOptions.item(0)!.value);
                    additionalCallback?.call?.(this);
                }
            );

        wrapper.appendChild(select);

        return wrapper;
    }

    function makeNumericFieldSetting(name: string, textContent: string, min: number, max: number, initialValue: number, integersOnly: boolean, path: string[], changeCallback?: Parameters<typeof HTMLInputElement.prototype.addEventListener>[1]) {
        const wrapper = makeWrapper(name, textContent),
            field = _makeNumericField(name, min, max, initialValue, integersOnly, path, changeCallback);

        wrapper.appendChild(field);

        return wrapper;
    }

    const tabNames = ["Visual", "Balance changes", "Bonus features", "Technical"],
        tabs: HTMLButtonElement[] = [],
        initializers = {
            visual() {
                const f = (v: string) => gamespace.settings.visual.graphicsQuality == +v;

                body.append(
                    makeSelectSetting(
                        "graphicsQuality",
                        "Graphics Quality",
                        [
                            { text: "Ultra Low", value: "0.25", selected: f("0.25") },
                            { text: "Very Low", value: "0.5", selected: f("0.5") },
                            { text: "Low", value: "1", selected: f("1") },
                            { text: "Normal", value: "1.5", selected: f("1.5") },
                            { text: "High", value: "2", selected: f("2") },
                            { text: "Very High", value: "3", selected: f("3") },
                            { text: "Ultra High", value: "4", selected: f("4") }
                        ],
                        ["visual", "graphicsQuality"]
                    ),
                    makeToggleSetting("hud", "HUD", gamespace.settings.visual.hud, ["visual", "hud"], false),
                    makeNumericFieldSetting("decals", "Maximum decal count", 0, Infinity, gamespace.settings.visual.maxDecals, true, ["visual", "decals"])
                );
            },
            balance_changes() {
                const w = gamespace.settings.balanceChanges.weapons,
                    f = (v: string) => gamespace.settings.balanceChanges.weapons.general.quickswitch == +v;

                body.append(
                    makeContainer(
                        "Weapon balance",
                        [
                            makeContainer(
                                "General",
                                [
                                    makeToggleSetting("no_ns", "No noslow", !w.general.noslow, ["balanceChanges", "weapons", "general", "noslow"], true),
                                    makeSelectSetting("qs",
                                        "Quickswitch",
                                        [
                                            { text: "Disabled", value: "0", selected: f("0") },
                                            { text: "Different non-zero deployGroups", value: "1", selected: f("1") },
                                            { text: "All", value: "2", selected: f("2") },
                                        ],
                                        ["balanceChanges", "weapons", "general", "quickswitch"]
                                    ),
                                    makeToggleSetting("no_hs", "No headshots", !w.general.headshots, ["balanceChanges", "weapons", "general", "headshots"], true),
                                    makeToggleSetting("no_bsv", "Buckshot spawn variance", !w.general.noBuckshotSpawnVar, ["balanceChanges", "weapons", "general", "headshots"], true)
                                ],
                                "balance-general"
                            ),
                            makeContainer(
                                "M79", [
                                makeToggleSetting("m79_spin", "No grenade spin", !w.m79.grenadeSpin, ["balanceChanges", "weapons", "m79", "grenadeSpin"], true),
                                makeToggleSetting("m79_move", "No movement penalty", !w.m79.moveSpeedPenalty, ["balanceChanges", "weapons", "m79", "moveSpeedPenalty"], true),
                                makeToggleSetting("m79_casing", "Spawn casing on reload", w.m79.spawnCasingOnReload, ["balanceChanges", "weapons", "m79", "spawnCasingOnReload"], true)
                            ],
                                "balance-m79"
                            ),
                            makeContainer(
                                "MP220",
                                [
                                    makeToggleSetting("mp_trig", "Pull both triggers on fire", w.mp220.pullBothTriggers, ["balanceChanges", "weapons", "mp220", "pullBothTriggers"], true)
                                ],
                                "balance-mp220"
                            )
                        ],
                        "weapon-balance")
                );


            },
            bonus_features() {
                const nameMap = {
                    botDebug: "Bot debug",
                    csgoStyleKillfeed: "CSGO-style killfeed",
                    damageNumbersStack: "Damage numbers stack",
                    headshotsUseSaturatedTracers: "Headshots use saturated tracers",
                    showDamageNumbers: "Show damage numbers",
                    useInterpolatedSaturatedTracers: "Use interpolated saturated tracers"
                };

                body.append(
                    ...Object.keys(gamespace.settings.bonusFeatures).map(f => makeToggleSetting(f, nameMap[f], gamespace.settings.bonusFeatures[f], ["bonusFeatures", f], false))
                );
            },
            technical() {
                body.append(
                    makeToggleSetting("draw-hitboxes", "Draw hitboxes", gamespace.settings.visual.debug, ["visual", "debug"], false),
                    ...["tps", "fps"].map((e, i) => {
                        const f = (v: string) => perf.mode[e] == +v;

                        return makeSelectSetting(
                            e,
                            `Show ${e.toUpperCase()}`,
                            [
                                { text: "No", value: "0", selected: f("0") },
                                { text: "Text only", value: "1", selected: f("1") },
                                { text: "Text & graph", value: "2", selected: f("2") }
                            ],
                            ["visual", "monitors", `${i}`],
                            function () {
                                perf.showMeters(...gamespace.settings.visual.monitors);
                            }
                        );
                    })
                );
            }
        };

    let active = tabNames[0];

    for (const name of tabNames) {
        const tab = makeElement("button", `settings-tab-${name.toLowerCase().replace(/ /g, "-")}`, "settings-tab");

        tab.textContent = name;

        if (name == active) {
            tab.classList.add("active");
            initializers[active.toLowerCase().replace(/ /g, "_")]();
        }

        tab.addEventListener("click", ev => {
            if (!ev.button && name != active) {
                tabs.find(t => t.classList.contains("active"))!.classList.remove("active");

                tab.classList.add("active");
                active = name;

                Array.from(body.children).forEach(e => e.remove());
                initializers[active.toLowerCase().replace(/ /g, "_")]();
            }
        });

        tabs.push(tab);
        header.append(tab);
    }

    menu.appendChild(doc);
}