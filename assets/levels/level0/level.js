import AI from "../../scripts/std_ai.js";
export const level = await (async () => {
    const json = await (await fetch("assets/levels/level0/data.json")).json(), name = "Bot 1v1", path = ["levels", `level-${name}`], level = {
        name: name,
        jsonPath: "assets/levels/level0/data.json",
        description: "Fight a very advanced and totally state-of-the art bot.",
        world: {
            width: 5000,
            height: 5000,
            color: "#80AF49",
            gridColor: "#00000028",
        },
        color: "#FF8000",
        initializer: () => {
            const levelData = parseLevelData(json), s = (p5) => {
                //@ts-ignore
                const engine = Matter.Engine.create(void 0, {
                    gravity: {
                        y: 0 // For some reason, this doesn't work
                    }
                }), world = engine.world;
                p5.setup = function () {
                    gamespace.stdLevelSetup(engine, world, p5, level, levelData, AI, { font: "assets/fonts/RobotoCondensed-Bold.ttf", size: 80 });
                    // @ts-ignore
                    Matter.Body.setPosition(gamespace.objects.players[1].body, {
                        x: Math.random() * level.world.width,
                        y: Math.random() * level.world.height
                    });
                    w = gamespace.objects.players.map(p => [p.inventory.slot0, p.inventory.slot1].map(g => g.proto.name));
                    doAI = !memoryManager.getItem([...path, "ai-disable"], "boolean");
                    gamespace.player.aiIgnore = memoryManager.getItem([...path, "ai-ignore"], "boolean");
                };
                let w, doAI = true;
                p5.draw = function () {
                    gamespace.update();
                    if (gamespace.objects.players.length < 2) {
                        gamespace.freeze();
                        gamespace.player?.events?.dispatchEvent?.("dumpHitInfo");
                        p5.noLoop();
                        p5.draw = void 0;
                        const winBanner = makeElement("p", "winner-text");
                        winBanner.style.font = "calc(250vw / 72) roboto";
                        winBanner.style.color = "#FF0";
                        winBanner.style.width = "100%";
                        winBanner.style.left = "50%";
                        winBanner.style.top = "20%";
                        winBanner.style.position = "absolute";
                        winBanner.style.transform = "translate(-50%, 0)";
                        winBanner.style.textShadow = "calc(10vw / 72) calc(2vh / 9) black";
                        winBanner.style.pointerEvents = "none";
                        winBanner.style.userSelect = "none";
                        winBanner.style.textAlign = "center";
                        winBanner.innerHTML = (gamespace.objects.players.length
                            ? `You ${gamespace.player ? "win!" : "lose."} Remaining HP: ${Math.round(100 * gamespace.objects.players[0].health) / 100}`
                            : `Stalemate; you all lose`) + `<br><span style="font-size: calc(200vw / 72)">${w[0][0]}/${w[0][1]} vs ${w[1][0]}/${w[1][1]}</span>`;
                        setTimeout(() => {
                            winBanner.innerHTML += `<br><span style="font-size: calc(180vw / 72)">Press Escape to restart.</span>`;
                            document.addEventListener("keydown", function exit(e) {
                                if (e.key == "Escape") {
                                    document.removeEventListener("keydown", exit);
                                    e.preventDefault();
                                    gamespace.exitLevel();
                                }
                            });
                        }, 250);
                        document.body.appendChild(winBanner);
                        return;
                    }
                    gamespace.bots.forEach(b => {
                        if (b.player.body !== void 0 && b.player.body.id != gamespace.player.body.id && doAI) {
                            gamespace.settings.bonusFeatures.botDebug && b.debug();
                            b.update();
                        }
                    });
                };
            };
            (() => {
                const doc = new DocumentFragment(), cont = makeElement("div", "game-start-cont"), overlay = makeElement("canvas", "gme-start-overlay");
                document.body.style.backgroundColor = "#80AF49";
                cont.style.width = "75%";
                cont.style.height = "90%";
                overlay.style.width = overlay.style.height = "100%";
                cont.style.borderRadius = "calc(50vw / 72)";
                cont.style.backgroundColor = "#0008";
                overlay.style.position = cont.style.position = "absolute";
                cont.style.transform = "translate(-50%, -50%)";
                cont.style.left = "50%";
                cont.style.top = "50%";
                overlay.width = 1500;
                overlay.height = 1125;
                const otx = overlay.getContext("2d");
                otx.fillStyle = "#FFF1";
                otx.fillRect(0, 56.25, 1500, 56.25);
                otx.fillRect(0, 393.75, 1500, 56.25);
                otx.lineWidth = 1;
                otx.strokeStyle = "#FFF";
                otx.moveTo(750, 0);
                otx.lineTo(750, 506.25);
                otx.moveTo(750, 618.75);
                otx.lineTo(750, 1040.625);
                otx.stroke();
                otx.beginPath();
                otx.moveTo(0, 1040.625);
                otx.lineTo(1500, 1040.625);
                otx.stroke();
                otx.font = "calc(250vw / 72) roboto";
                otx.textAlign = "center";
                otx.textBaseline = "bottom";
                otx.strokeText("YOU", 375, 61.875);
                otx.strokeText("BOT", 1125, 61.875);
                otx.fillStyle = "#FFF";
                otx.textBaseline = "middle";
                otx.fillText("VS", 750, 61.875);
                const buttonContainers = [
                    makeElement("div", "bot-weapon-primary-cont"),
                    makeElement("div", "player-weapon-primary-cont"),
                    makeElement("div", "bot-weapon-secondary-cont"),
                    makeElement("div", "player-weapon-secondary-cont")
                ], buttons = [[], [], [], []], inputs = [];
                const sa = memoryManager.getItem([...path, "saw-akm"], "number") || 0, a = Math.random() < (sa + 1) / 5;
                a && memoryManager.setItem([...path, "saw-akm"], sa + 1, true);
                for (let i = 0; i <= 1; i++) {
                    const entity = levelData.players[1 - i];
                    for (let h = 0; h <= 1; h++) {
                        const hCopy = h, s = memoryManager.getItem([...path, "weapon-presets", i ? "player" : "bot", `${h}`]);
                        if (s) {
                            entity.inventory[`slot${h}`] = new gun(gamespace.guns.get(s == "Random"
                                ? Array.from(gamespace.guns.keys())[Math.floor(Math.random() * gamespace.guns.size)]
                                : s == "AKM" && !a ? "AK-47" : s));
                        }
                        otx.textBaseline = "bottom";
                        otx.font = "calc(180vw / 72) roboto";
                        otx.fillText(`${h ? "Secondary" : "Primary"} Weapon`, i ? 375 : 1125, 112.5 + h * 337.5);
                        Array.from(gamespace.guns.entries())
                            .map(v => v[1])
                            .filter(v => v.name != "AKM" || a)
                            .concat({ name: "Random" })
                            .forEach((g, j) => {
                            const b = makeElement("button", `gun-${i ? "player" : "bot"}-${g.name}-${h}`, "surviv-outline-button"), name = g.name, currentlySelected = entity.inventory[`slot${hCopy}`].proto.name == name && s != "Random", iCopy = i; // I love closures
                            if (currentlySelected && (!s || (s == "AKM" && a))) {
                                memoryManager.setItem([...path, "weapon-presets", i ? "player" : "bot", `${h}`], name, true);
                            }
                            b.textContent = name;
                            b.style.borderColor = (currentlySelected || (s + name) == "RandomRandom") ? "#0F0" : "";
                            b.style.backgroundColor = (currentlySelected || (s + name) == "RandomRandom") ? "#0108" : "";
                            b.style.position = "absolute";
                            b.style.left = `${(j % 5) * 20 + 0.5}%`;
                            b.style.width = `19%`;
                            b.style.height = `${76 / 3}%`;
                            b.style.top = `${(76 / 3 + 1) * Math.floor(j / 5)}%`;
                            b.addEventListener("click", e => (!e.button && (() => {
                                if (entity.inventory[`slot${hCopy}`].name == name) {
                                    return;
                                }
                                entity.inventory[`slot${h}`] = new gun(gamespace.guns.get(name == "Random"
                                    ? Array.from(gamespace.guns.keys())[Math.floor(Math.random() * gamespace.guns.size)]
                                    : name));
                                memoryManager.setItem([...path, "weapon-presets", i ? "player" : "bot", `${hCopy}`], name, true);
                                buttons[iCopy + 2 * hCopy].forEach(b => b.style.borderColor = b.style.backgroundColor = "");
                                b.style.borderColor = "#0F0";
                                b.style.backgroundColor = "#0108";
                            })()));
                            buttons[i + 2 * h].push(b);
                        });
                    }
                    otx.fillText("Health", i ? 375 : 1125, 871.875);
                    const input = makeElement("input", `health-${i ? "player" : "bot"}`), h = memoryManager.getItem([...path, `health-${i ? "player" : "bot"}-preset`]);
                    input.type = "text";
                    input.value = `${h ?? entity.health}`;
                    input.autocomplete = "off";
                    input.style.position = "absolute";
                    input.style.left = i ? "25%" : "75%";
                    input.style.transform = "translate(-50%, 0)";
                    input.style.top = "77.5%";
                    input.style.backgroundColor = "#0008";
                    input.style.color = "white";
                    input.style.font = "calc(14vh / 9) roboto";
                    input.style.border = "calc(5vw / 72) solid white";
                    input.style.borderRadius = "calc(25vw / 72)";
                    input.style.outline = "none";
                    entity.maxHealth = Math.max(100, entity.health = +input.value);
                    input.addEventListener("change", () => {
                        const v = (() => {
                            const v = +input.value;
                            return Number.isNaN(v) ? 0 : v;
                        })();
                        input.value = `${+clamp(v, Number.MIN_VALUE)}`;
                        memoryManager.setItem([...path, `health-${i ? "player" : "bot"}-preset`], input.value, true);
                        entity.maxHealth = Math.max(100, entity.health = v);
                    });
                    inputs.push(input);
                    {
                        const a = `ai-${i ? "ignore" : "disable"}`, input = makeElement("input", a), d = memoryManager.getItem([...path, a], "boolean");
                        otx.fillText(`${i ? "Ignored by" : "Disable"} AI`, 1125 - 750 * i, 787.5);
                        input.type = "checkbox";
                        input.checked = d;
                        input.style.aspectRatio = "1";
                        input.style.width = "2%";
                        input.style.top = "70%";
                        input.style.left = `${75 - 50 * i}%`;
                        input.style.transform = "translate(-50%, 0)";
                        input.addEventListener("change", () => {
                            memoryManager.setItem([...path, a], input.checked, true);
                        });
                        inputs.push(input);
                    }
                }
                const battle = makeElement("button", "battle", "surviv-purple-button");
                battle.textContent = "Battle";
                battle.style.width = "15%";
                battle.style.left = "50%";
                battle.style.top = "93.5%";
                battle.style.transform = "translate(-50%, 0)";
                battle.addEventListener("click", e => void (!e.button && (() => {
                    cont.remove();
                    new p5(s, void 0);
                })()));
                buttonContainers.forEach((b, i) => {
                    b.style.width = "50%";
                    b.style.height = "25%";
                    b.style.overflow = "scroll";
                    b.style.position = "absolute";
                    b.style.left = `${50 - 50 * (i % 2)}%`;
                    b.style.top = `${30 * Math.floor(i / 2) + 10}%`;
                    b.append(...buttons[i]);
                });
                const scopes = makeElement("div", "player-scope-cont"), p = (memoryManager.getItem([...path, "player-scope-pref"], "number")), preset = Number.isNaN(p) ? 1 : p;
                levelData.players[0].view = ({
                    1: 1330,
                    2: 1680,
                    4: 2359,
                    8: 3230,
                    15: 4940
                })[preset];
                [1, 2, 4, 8, 15].forEach((n, i) => {
                    const button = makeElement("button", `scope-option-${i}`, "surviv-outline-button");
                    button.style.background = `url("./assets/items/scopes/loot-scope-${`${n}`.padStart(2, "0")}.svg") center center / 80% 80% no-repeat #0008`;
                    button.style.aspectRatio = "1";
                    button.style.width = "5%";
                    button.style.left = `${2.5 + 10 * i}%`;
                    button.style.top = "82.5%";
                    button.style.borderColor = (preset == n) ? "#0F0" : "";
                    button.style.backgroundColor = (preset == n) ? "#0108" : "";
                    button.addEventListener("click", e => void (!e.button && (() => {
                        memoryManager.setItem([...path, "player-scope-pref"], n, true);
                        Array.from(scopes.children).forEach(b => b.style.backgroundColor = b.style.borderColor = "");
                        button.style.borderColor = "#0F0";
                        button.style.backgroundColor = "#0108";
                        levelData.players[0].view = ({
                            1: 1330,
                            2: 1680,
                            4: 2359,
                            8: 3230,
                            15: 4940
                        })[n];
                    })()));
                    scopes.appendChild(button);
                });
                doc.appendChild(cont).append(overlay, ...buttonContainers, ...inputs, battle, scopes);
                document.body.appendChild(doc);
            })();
        }
    };
    return level;
})();
