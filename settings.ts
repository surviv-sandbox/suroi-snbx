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
        makeMenu(false);
    })()));

    doc.append(back, sidebar, title, header, body);

    function makeWrapper(name: string, textContent: string) {
        const div = makeElement("div", `settings-${name}-cont`, "setting-cont");
        div.textContent = textContent;

        return div;
    }

    function makeContainer(textContent: string, contId?: string, folded?: boolean) {
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

        return { cont, button, div };
    }

    function makeSelectMenu(name: string, options: { text: string, value?: string, selected?: boolean; }[], inputCallback: Parameters<typeof HTMLElement.prototype.addEventListener/* Makes the typescript compiler (but not VSCode) freak out => <"input"> */>[1]) {
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

    function makeCheckbox(name: string, checked: boolean, inputCallback?: Parameters<typeof HTMLInputElement.prototype.addEventListener>[1]) {
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

    function setupToggleListeners(cont: HTMLDivElement, checkbox: HTMLInputElement, path: string[], inverted: boolean) {
        cont.classList.add("checkbox-cont");

        [cont, checkbox].forEach((ele, i) => {
            ele.addEventListener(i ? "input" : "click", ev => {
                if (ev instanceof MouseEvent && (ev.target as HTMLElement).id == checkbox.id) {
                    return;
                }

                if (ev instanceof MouseEvent && !ev.button) {
                    checkbox.checked = !checkbox.checked;
                }

                if (!(ev instanceof MouseEvent) || !ev.button) {
                    let o: badCodeDesign = gamespace.settings;

                    for (const i in path) {
                        const p = path[i];

                        if (+i == path.length - 1) {
                            o[p] = inverted ? !checkbox.checked : checkbox.checked;
                        } else {
                            o = o[p];
                        }
                    }
                }

                memoryManager.setItem("settings", gamespace.settings);
            });
        });

        cont.appendChild(checkbox);
    }

    function makeNumericField(name: string, min: number, max: number, initialValue: number, integersOnly: boolean, changeCallback?: Parameters<typeof HTMLInputElement.prototype.addEventListener>[1]) {
        const input = makeElement("input", `settings-${name}-numeric-field`, "setting-numeric-field");

        input.type = "text";
        input.value = `${initialValue}`;

        input.addEventListener("change", function (ev) {
            const v = (() => {
                const v = +(input.value || Infinity);
                return Number.isNaN(v) ? 0 : v;
            })();

            if (!checkBounds(v, 0, "inf", { inclusion: { lower: false } })) {
                input.value = `${clamp(v, 0)}`;
            }

            if (integersOnly) {
                input.value = `${Math.round(+input.value)}`;
            }

            if (changeCallback) {
                (typeof changeCallback == "function" ? changeCallback : changeCallback.handleEvent).call(this, ev);
            }

            memoryManager.setItem("settings", gamespace.settings);
        });

        return input;
    }

    const tabNames = ["Visual", "Balance changes", "Bonus features", "Technical"],
        tabs: HTMLButtonElement[] = [],
        initializers = {
            visual() {
                {
                    const cont = makeWrapper("graphicsQuality", "Graphics quality"),
                        f = (v: string) => gamespace.settings.visual.graphicsQuality == +v;

                    cont.appendChild(
                        makeSelectMenu("graphicsQuality", [
                            { text: "Ultra Low", value: "0.25", selected: f("0.25") },
                            { text: "Very Low", value: "0.5", selected: f("0.5") },
                            { text: "Low", value: "1", selected: f("1") },
                            { text: "Normal", value: "1.5", selected: f("1.5") },
                            { text: "High", value: "2", selected: f("2") },
                            { text: "Very High", value: "3", selected: f("3") },
                            { text: "Ultra High", value: "4", selected: f("4") }
                        ],
                            function (this: HTMLSelectElement) {
                                gamespace.settings.visual.graphicsQuality = +this.selectedOptions.item(0)!.value;
                            }
                        )
                    );

                    body.append(cont);
                }

                {
                    const cont = makeWrapper("hud", "HUD");

                    setupToggleListeners(cont, makeCheckbox("hud", gamespace.settings.visual.hud), ["visual", "hud"], false);

                    body.append(cont);
                }

                {
                    const cont = makeWrapper("decals", "Maximum decal count");

                    cont.append(makeNumericField("decals", 0, Infinity, gamespace.settings.visual.maxDecals, true,
                        function (this: HTMLInputElement) {
                            gamespace.settings.visual.maxDecals = +(this.value || Infinity);
                        }
                    ));

                    body.append(cont);
                }
            },
            balance_changes() {
                const cont = makeContainer("Weapon balance", "weapon-balance"),
                    general = makeContainer("General", "balance-general"),
                    m79Fixes = makeContainer("M79", "balance-m79"),
                    mp220 = makeContainer("MP220", "balance-mp220");

                {
                    const
                        noNS = makeWrapper("no_ns", "No noslow"),
                        noQS = makeWrapper("no_qs", "No quickswitch"),
                        noHS = makeWrapper("no_hs", "No headshots"),
                        spin = makeWrapper("m79_spin", "No grenade spin"),
                        move = makeWrapper("m79_move", "No movement penalty"),
                        casing = makeWrapper("m79_casing", "Spawn casing on reload"),
                        dual = makeWrapper("mp220_trig", "Pull both triggers on fire"),
                        w = gamespace.settings.balanceChanges.weapons;

                    [
                        { cont: noNS, checkbox: makeCheckbox("no_ns", !w.general.noslow), path: ["balanceChanges", "weapons", "general", "noslow"], inverted: true },
                        { cont: noQS, checkbox: makeCheckbox("no_qs", !w.general.quickswitch), path: ["balanceChanges", "weapons", "general", "quickswitch"], inverted: true },
                        { cont: noHS, checkbox: makeCheckbox("no_hs", !w.general.headshots), path: ["balanceChanges", "weapons", "general", "headshots"], inverted: true },
                        { cont: spin, checkbox: makeCheckbox("m79_spin", !w.m79.grenadeSpin), path: ["balanceChanges", "weapons", "m79", "grenadeSpin"], inverted: true },
                        { cont: move, checkbox: makeCheckbox("m79_move", !w.m79.moveSpeedPenalty), path: ["balanceChanges", "weapons", "m79", "moveSpeedPenalty"], inverted: true },
                        { cont: casing, checkbox: makeCheckbox("m79_casing", w.m79.spawnCasingOnReload), path: ["balanceChanges", "weapons", "m79", "spawnCasingOnReload"], inverted: false },
                        { cont: dual, checkbox: makeCheckbox("mp_trig", w.mp220.pullBothTriggers), path: ["balanceChanges", "weapons", "mp220", "pullBothTriggers"], inverted: false }
                    ].forEach(e => {
                        setupToggleListeners(e.cont, e.checkbox, e.path, e.inverted);
                    });

                    general.div.append(noNS, noQS, noHS);
                    m79Fixes.div.append(spin, move, casing);
                    mp220.div.append(dual);
                }


                cont.div.append(general.cont, m79Fixes.cont, mp220.cont);

                body.append(cont.cont);
            },
            bonus_features() {
                const arr: HTMLDivElement[] = [],
                    nameMap = {
                        botDebug: "Bot debug",
                        csgoStyleKillfeed: "CSGO-style killfeed",
                        damageNumbersStack: "Damage numbers stack",
                        headshotsUseSaturatedTracers: "Headshots use saturated tracers",
                        showDamageNumbers: "SHow damage numbers",
                        useInterpolatedSaturatedTracers: "Use interpolated saturated tracers"
                    };

                for (const f in gamespace.settings.bonusFeatures) {
                    const cont = makeWrapper(f, nameMap[f]);

                    setupToggleListeners(cont, makeCheckbox(f, gamespace.settings.bonusFeatures[f]), ["bonusFeatures", f], false);

                    arr.push(cont);
                }

                body.append(...arr);
            },
            technical() {
                {
                    const cont = makeWrapper("draw-hitboxes", "Draw hitboxes");

                    setupToggleListeners(cont, makeCheckbox("draw-hitboxes", gamespace.settings.visual.debug), ["visual", "debug"], false);

                    body.append(cont);
                }

                ["tps", "fps"].forEach((e, i) => {
                    const cont = makeWrapper(e, `Show ${e.toUpperCase()}`),
                        f = (v: string) => perf.mode[e] == +v;

                    cont.appendChild(
                        makeSelectMenu(e, [
                            { text: "No", value: "0", selected: f("0") },
                            { text: "Text only", value: "1", selected: f("1") },
                            { text: "Text & graph", value: "2", selected: f("2") }
                        ],
                            function (this: HTMLSelectElement) {
                                gamespace.settings.visual.monitors[i] = +this.selectedOptions.item(0)!.value as 0 | 1 | 2;
                                perf.showMeters(...gamespace.settings.visual.monitors);
                            }
                        )
                    );

                    body.append(cont);
                });
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