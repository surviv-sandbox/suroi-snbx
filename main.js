function makeMenu(first) {
    if (memoryManager.getItem("sawPopup", "boolean") || window.confirm("This build of surviv.io sandbox is an alpha build, and may therefore be unstable. No garantees about this build's quality or fitness for any given purpose are given.")) {
        memoryManager.has("sawPopup") || memoryManager.setItem("sawPopup", true);
        {
            function fetchGun(name) {
                return gamespace.guns.find(g => g.name == name);
            }
            function fetchOldGun(name) {
                return gamespace._oldStats.guns.find(g => g.name == name);
            }
            const b = gamespace.settings.balanceChanges;
            {
                const g = fetchGun("M79"), a = g?.caliber ? gamespace.bulletInfo[g.caliber] : void 0;
                if (g) {
                    g.moveSpeedPenalties.active = b.weapons.m79.moveSpeedPenalty ? fetchOldGun("M79")?.moveSpeedPenalties?.active ?? 0 : 0;
                    a && (a.projectileInfo.spinVel = b.weapons.m79.grenadeSpin ? gamespace._oldStats.ammo[g.caliber]?.projectileInfo?.spinVel ?? 0 : 0);
                    g.casing.spawnOn = b.weapons.m79.spawnCasingOnReload ? "reload" : fetchOldGun("M79")?.casing?.spawnOn ?? "fire";
                }
            }
            {
                const g = fetchGun("MP220"), p = b.weapons.mp220.pullBothTriggers;
                if (g) {
                    g.accuracy.default = p ? 13 * Math.PI / 180 : fetchGun("MP220")?.accuracy.default ?? 10 * Math.PI / 180;
                    g.accuracy.moving = p ? 16 * Math.PI / 180 : fetchGun("MP220")?.accuracy.moving ?? 12 * Math.PI / 180;
                    g.fireModes = p ? ["burst-2"] : fetchGun("MP220")?.fireModes ?? ["semi"];
                    g.recoilImpulse.y = p ? 0.3 : fetchGun("MP220")?.recoilImpulse?.y ?? 0.25;
                    g.recoilImpulse.duration = p ? 120 : fetchGun("MP220")?.recoilImpulse?.duration ?? 100;
                }
            }
        }
        const container = makeElement("div", "menu-container"), play = makeElement("button", "play", "main-menu-button surviv-purple-button"), settings = makeElement("button", "settings", "main-menu-button surviv-purple-button"), changelog = makeElement("button", "changelog", "main-menu-button surviv-grey-button"), attributions = makeElement("button", "attributions", "main-menu-button surviv-grey-button"), ver = makeElement("p", "version"), title = makeElement("h1", "title"), nameField = makeElement("div", "name-field", "main-menu-button surviv-outline-button");
        title.innerHTML = `SURVIV<span style="color: #FFE400">.IO</span> SANDBOX`;
        play.textContent = "Play";
        settings.textContent = "Settings";
        changelog.textContent = "Changelog";
        attributions.textContent = "Attributions";
        nameField.textContent = gamespace.settings.name;
        nameField.contentEditable = "true";
        ver.innerHTML = `SURVIV.IO sandbox v${gamespace.version}`;
        if (!gamespace.levels.length) {
            play.disabled = true;
            play.style.opacity = "0.5";
            play.style.pointerEvents = "none";
            gamespace.events.addEventListener("levelsLoaded", () => {
                play.style.pointerEvents = "";
                play.disabled = false;
                play.style.opacity = "";
            }, { once: true });
        }
        (first ? document.body.appendChild(container) : $("menu-container")).append(title, play, settings, changelog, attributions, ver, nameField);
        document.body.style.backgroundColor = "#83AF50";
        nameField.addEventListener("keydown", e => e.key == "Enter" && nameField.blur());
        nameField.addEventListener("blur", () => {
            gamespace.settings.name = nameField.textContent;
            memoryManager.setItem("settings", gamespace.settings);
        });
        play.addEventListener("click", e => {
            if (!e.button) {
                const menu = $("menu-container"), back = makeElement("button", "back", "surviv-blue-button"), can = makeElement("canvas", "levelsel-bg"), ctx = can.getContext("2d");
                Array.from(menu.children).forEach(e => e.remove());
                can.width = window.innerWidth;
                can.height = window.innerHeight;
                can.style.width = can.style.height = "100%";
                ctx.fillStyle = "#547033";
                ctx.fillRect(0, 0, can.width / 10, can.height);
                ctx.fillRect(0, 0, can.width, can.height / 9);
                back.textContent = "Back";
                menu.append(back, can);
                back.addEventListener("click", e => void (!e.button && (() => {
                    Array.from(menu.children).forEach(e => e.remove());
                    makeMenu(false);
                })()));
                gamespace.levels.forEach((l, i) => {
                    const button = makeElement("button", `level-${l.name}`, "level-card"), levelTitle = makeElement("p", `level-${l.name}-title`, "level-title"), desc = makeElement("p", `level-${l.name}-desc`, "level-desc");
                    button.style.left = `${(17 * (i % 5)) + 11}%`;
                    button.style.top = `${(Math.floor(i / 5) * 22) + 100 / 9 + 2}%`;
                    button.style[`background${l.thumbnail ? "Image" : "Color"}`] = l.thumbnail ? `url(${l.thumbnail})` : (l.color || "#333333");
                    levelTitle.textContent = l.name;
                    if (l.description) {
                        desc.textContent = l.description;
                        button.appendChild(desc);
                    }
                    menu.appendChild(button).appendChild(levelTitle);
                    button.addEventListener("click", e => void (!e.button && startGame(i)));
                });
            }
        });
        settings.addEventListener("click", async (e) => {
            if (!e.button) {
                (await import("./settings.js")).makeSettings();
            }
        });
        changelog.addEventListener("click", e => void (!e.button && window.open("./changelog/", "_self")));
        attributions.addEventListener("click", e => void (!e.button && window.open("./attributions/", "_self")));
        function startGame(index) {
            document.body.style.backgroundColor = "rgb(20, 20, 20)";
            $("menu-container").remove();
            const ob = JSON.parse(localStorage.surviv_sandbox ?? "{}");
            memoryManager.setItem("levels", (() => {
                const o = {};
                gamespace.levels.forEach(l => void (o[`level-${l.name}`] = ob.levels?.[`level-${l.name}`] ?? {}));
                return o;
            })());
            gamespace._currentLevel = gamespace.levels[index];
            gamespace.levels[index].initializer();
        }
    }
}
;
(() => {
    function fetchGun(name) {
        return gamespace.guns.find(g => g.name == name);
    }
    const s = memoryManager.getItem("settings");
    if (s) {
        gamespace.settings = {
            visual: {
                debug: s.visual?.debug ?? s.debug ?? false,
                graphicsQuality: s.visual?.graphicsQuality ?? s.graphicsQuality ?? 1.5,
                monitors: s.visual?.monitors ?? s.monitors ?? [0, 0],
                hud: s.visual?.hud ?? s.ui ?? true,
                maxDecals: s.visual?.maxDecals ?? Infinity
            },
            balanceChanges: {
                weapons: {
                    general: {
                        noslow: s.balanceChanges?.weapons?.general?.noslow ?? true,
                        quickswitch: s.balanceChanges?.weapons?.general?.quickswitch ?? true,
                        headshots: s.balanceChanges?.weapons?.general?.headshots ?? true
                    },
                    m79: {
                        grenadeSpin: s.balanceChanges?.weapons?.m79?.grenadeSpin ?? true,
                        moveSpeedPenalty: s.balanceChanges?.weapons?.m79?.moveSpeedPenalty ?? true,
                        spawnCasingOnReload: s.balanceChanges?.weapons?.m79?.spawnCasingOnReload ?? false
                    },
                    mp220: {
                        pullBothTriggers: s.balanceChanges?.weapons?.mp220?.pullBothTriggers ?? false
                    }
                }
            },
            bonusFeatures: {
                botDebug: s.bonusFeatures?.botDebug ?? s.bonus_features?.bot_debug ?? false,
                csgoStyleKillfeed: s.bonusFeatures?.csgoStyleKillfeed ?? s.bonus_features?.csgo_style_killfeed ?? false,
                damageNumbersStack: s.bonusFeatures?.damageNumbersStack ?? s.bonus_features?.damage_numbers_stack ?? false,
                headshotsUseSaturatedTracers: s.bonusFeatures?.headshotsUseSaturatedTracers ?? s.bonus_features?.headshots_use_saturated_tracers ?? false,
                showDamageNumbers: s.bonusFeatures?.showDamageNumbers ?? s.bonus_features?.show_damage_numbers ?? false,
                useInterpolatedSaturatedTracers: s.bonusFeatures?.useInterpolatedSaturatedTracers ?? s.bonus_features?.use_interpolated_tracer_colors ?? false,
            },
            name: s.name?.toString?.() ?? "Player",
            useNativeMath: s.useNativeMath ?? true
        };
    }
    else {
        memoryManager.setItem("settings", gamespace.settings);
    }
    {
        const g = fetchGun("M79"), a = g?.caliber ? gamespace.bulletInfo[g.caliber] : void 0;
        if (g) {
            gamespace._oldStats.guns.push({
                name: g.name,
                moveSpeedPenalties: {
                    active: g.moveSpeedPenalties.active
                }
            });
            gamespace._oldStats.ammo[g.caliber] = {
                projectileInfo: {
                    spinVel: a.projectileInfo.spinVel
                }
            };
        }
    }
    {
        const g = fetchGun("MP220");
        if (g) {
            gamespace._oldStats.guns.push({
                accuracy: {
                    default: g.accuracy.default,
                    moving: g.accuracy.moving
                },
                fireModes: g.fireModes,
                recoilImpulse: {
                    x: g.recoilImpulse.x,
                    y: g.recoilImpulse.y,
                    duration: g.recoilImpulse.duration,
                }
            });
        }
    }
    perf.showMeters(...gamespace.settings.visual.monitors);
})();
makeMenu(true);
