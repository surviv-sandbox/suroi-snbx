function makeMenu(first: boolean) {
    if (memoryManager.getItem("sawPopup", "boolean") || window.confirm("This build of surviv.io sandbox is an alpha build, and may therefore be unstable. No garantees about this build's quality or fitness for any given purpose are given.")) {
        memoryManager.has("sawPopup") || memoryManager.setItem("sawPopup", true);

        {
            const s = memoryManager.getItem("settings") as void | JSONObject;

            if (s) {
                gamespace.settings = overrideObject(gamespace.settings, s as any);
            } else {
                memoryManager.setItem("settings", gamespace.settings);
            }
        }

        const container = makeElement("div", "menu-container"),
            play = makeElement("button", "play", "main-menu-button surviv-purple-button"),
            settings = makeElement("button", "settings", "main-menu-button surviv-purple-button"),
            changelog = makeElement("button", "changelog", "main-menu-button surviv-grey-button"),
            attributions = makeElement("button", "attributions", "main-menu-button surviv-grey-button"),
            ver = makeElement("p", "version"),
            title = makeElement("h1", "title"),
            nameField = makeElement("div", "name-field", "main-menu-button surviv-outline-button");

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

            gamespace.events.addEventListener("levelsLoaded", (ev, ...args) => {
                play.disabled = false;
                play.style.opacity = "";
            }, { once: true });
        }

        (first ? document.body.appendChild(container) : $("menu-container")).append(
            title,
            play,
            settings,
            changelog,
            attributions,
            ver,
            nameField
        );

        document.body.style.backgroundColor = "#83AF50";

        nameField.addEventListener("keydown", e => e.key == "Enter" && nameField.blur());

        nameField.addEventListener("blur", () => {
            gamespace.settings.name = nameField.textContent;
            memoryManager.setItem("settings", gamespace.settings);
        });

        play.addEventListener("click", e => {
            if (!e.button) {
                const menu = $("menu-container"),
                    back = makeElement("button", "back", "surviv-blue-button"),
                    can = makeElement("canvas", "levelsel-bg"),
                    ctx = can.getContext("2d");

                Array.from(menu.children).forEach(e => e.remove());
                $("settings-cont")?.remove();

                can.width = window.innerWidth;
                can.height = window.innerHeight;
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
                    const button = makeElement("button", `level-${l.name}`, "level-card"),
                        levelTitle = makeElement("p", `level-${l.name}-title`, "level-title"),
                        desc = makeElement("p", `level-${l.name}-desc`, "level-desc");

                    button.style.left = `${(17 * (i % 5)) + 11}%`;
                    button.style.top = `calc(${(Math.floor(i / 5) * 22) + 100 / 9 + 2}%)`;
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

        // I'll have to re-do this when there are like, actual settings, but this'll do for now
        settings.addEventListener("click", e => void (!e.button && (() => {
            if ($("settings-cont")) {
                return $("settings-cont").remove();
            }

            const doc = new DocumentFragment(),
                cont = makeElement("div", "settings-cont"),
                switches = (() => {
                    const b: HTMLButtonElement[] = [],
                        f = (bonus: boolean) => bonus ? gamespace.settings.bonus_features : gamespace.settings;

                    Object.keys(gamespace.settings)
                        .filter(k => !["graphicsQuality", "useNativeMath", "bonus_features", "name"].includes(k))
                        .map(k => ({ bonus: false, key: k }))
                        .concat(
                            Object.keys(gamespace.settings.bonus_features)
                                .map(k => ({ bonus: true, key: k }))
                        )
                        .forEach(feature => {
                            const button = makeElement("button", `setting-${feature.key}-switch`, "setting-switch surviv-outline-button");

                            button.textContent = feature.key.replace(/_/g, " ");

                            button.style.borderColor = f(feature.bonus)[feature.key] ? "#0F0" : "";
                            button.style.backgroundColor = f(feature.bonus)[feature.key] ? "#0108" : "";

                            button.addEventListener("click", e => void (!e.button && (() => {
                                f(feature.bonus)[feature.key] = !f(feature.bonus)[feature.key];

                                memoryManager.setItem("settings", gamespace.settings);
                                button.style.borderColor = f(feature.bonus)[feature.key] ? "#0F0" : "";
                                button.style.backgroundColor = f(feature.bonus)[feature.key] ? "#0108" : "";
                            })()));
                            b.push(button);
                        });

                    return b;
                })();

            doc.appendChild(cont).append(...switches);

            document.body.appendChild(doc);
        })()));

        changelog.addEventListener("click", e => void (!e.button && window.open("./changelog/", "_self")));

        attributions.addEventListener("click", e => void (!e.button && window.open("./attributions/", "_self")));

        function startGame(index: number) {
            document.body.style.backgroundColor = "rgb(20, 20, 20)";
            container.remove();

            const ob = JSON.parse(localStorage.surviv_sandbox ?? "{}") as JSONObject;

            memoryManager.setItem("levels", (() => {
                const o: { [key: string]: JSONContent; } = {};

                gamespace.levels.forEach(l => void (o[`level-${l.name}`] = ob.levels?.[`level-${l.name}`] ?? {}));

                return o;
            })());

            gamespace._currentLevel = gamespace.levels[index];
            gamespace.levels[index].initializer();
        }
    }
};

makeMenu(true);