import std_setup from "../../scripts/std_level_setup.js";
export const level = await (async () => {
    const json: JSONLevel = await (await fetch("assets/levels/level2/data.json")).json();

    const name = "Deathmatch",
        path = ["levels", `level-${name}`],
        level = {
            name: name,
            jsonPath: "assets/levels/level2/data.json",
            description: "Fight bots for 5 minutes.",
            levelData: parseLevelData(json),
            world: {
                width: 15000,
                height: 15000,
                color: "#4B5B39",
                gridColor: "#00000028",
            },
            color: "#0F800F",
            initializer: () => {
                const s = (p5: import("p5")) => {
                    //@ts-ignore
                    const engine = Matter.Engine.create(void 0, {
                        gravity: {
                            y: 0 // For some reason, this doesn't work
                        }
                    }),
                        world = engine.world;

                    p5.setup = function () {
                        std_setup(engine, world, p5, level, { font: "assets/fonts/RobotoCondensed-Bold.ttf", size: 80 });

                        const randomWeapon = () => new gun(gamespace.guns[Math.floor(Math.random() * gamespace.guns.length)]),
                            //@ts-ignore
                            teleportToRandomPos = (p: playerLike) => Matter.Body.setPosition(p.body, { x: Math.random() * level.world.width, y: Math.random() * level.world.height }),
                            setInvuln = (p: playerLike) => {
                                p.aiIgnore = p.state.invuln = true;

                                const revoke = () => void (p.aiIgnore = p.state.invuln = false, clearTimeout(timer)),
                                    timer = setTimeout((() => {
                                        revoke();
                                        p.events.removeListener("firing", "revokeInvuln");
                                        p.events.removeListener("move", "revokeInvuln");
                                        p.events.removeListener("reloading", "revokeInvuln");
                                    }), 10000) as any as number;

                                p.events.once("firing", function revokeInvuln() {
                                    revoke();
                                    p.events.removeListener("move", "revokeInvuln");
                                    p.events.removeListener("reloading", "revokeInvuln");
                                });

                                p.events.on("move", function revokeInvuln(ev, dir) {
                                    if (dir) {
                                        revoke();
                                        p.events.removeListener("move", "revokeInvuln");
                                        p.events.removeListener("firing", "revokeInvuln");
                                        p.events.removeListener("reloading", "revokeInvuln");
                                    }
                                });

                                p.events.once("reloading", function revokeInvuln() {
                                    revoke();
                                    p.events.removeListener("firing", "revokeInvuln");
                                    p.events.removeListener("move", "revokeInvuln");
                                });
                            };

                        gamespace.objects.players.forEach(p => {
                            teleportToRandomPos(p);
                            setInvuln(p);

                            p.angle = Math.random() * Math.PI * 2;
                            p.inventory.slot0 = randomWeapon();
                            p.inventory.slot1 = randomWeapon();

                            p.events.on("killed", (e, d: { killer: playerLike, killed: playerLike, weapon: string, timestamp: number; }) => {
                                e.preventDefault();
                                p.health = p.maxHealth;
                                p.state.frozen = true;
                                setTimeout(() => {
                                    p.state.frozen = false;
                                }, 1000);

                                try {
                                    (p.inventory.slot0 as gun)?.stopReload?.(p);
                                    (p.inventory.slot1 as gun)?.stopReload?.(p);

                                    p.inventory.slot0 = randomWeapon();
                                    p.inventory.slot1 = randomWeapon();
                                } catch { }

                                d.killer.state.custom.kills = (d.killer.state.custom.kills ?? 0) as number + 1;
                                d.killer.state.custom.score = (d.killer.state.custom.score ?? 0) as number + ((className: string): number => {
                                    switch (className) {
                                        case "assault_rifle": return 5;
                                        case "shotgun": return 8;
                                        case "lmg": return 2;
                                        case "semi_pistol": return 6;
                                        case "dual_semi_pistol": return 4;
                                        case "sniper_rifle": return 2;
                                        case "dmr": return 4;
                                        case "burst_ar": return 6;
                                        case "semi_pistol_move": return 6;
                                        case "grenade_launcher": return 7;
                                        default: return 1;
                                    }
                                })((gamespace.guns.find(g => g.name == d.weapon) as gunPrototype).summary.class);
                                p.state.custom.deaths = (d.killer.state.custom.deaths ?? 0) as number + 1;

                                teleportToRandomPos(p);
                                setInvuln(p);
                            });
                        });

                        ui.add({
                            name: "deathmatch-scoreboard",
                            create(uiContainer) {
                                const cont = makeElement("div", "deathmatch-scoreboard-cont", "ui deathmatch-scoreboard"),
                                    icons = gamespace.objects.players.slice(0, 10).map((p, i) => {
                                        const div = makeElement("div", `deathmatch-scoreboard-entry-${i}`, "ui deathmatch-scoreboard-entry");

                                        div.style.position = "absolute";
                                        div.style.width = "10%";
                                        div.style.height = "100%";
                                        div.style.backgroundColor = "#0008";
                                        div.style.color = "#FFFA";
                                        div.style.fontFamily = "roboto, Arial, sans-serif";
                                        div.style.fontSize = "calc(5vw / 4)";
                                        div.style.left = `${10 * i}%`;
                                        div.style.top = "0";
                                        div.style.textAlign = "center";
                                        div.style.outline = "solid calc(10vw / 72) #FFF8";
                                        div.innerText = `${p.name}\n${p.state.custom.kills ?? 0}`;

                                        return div;
                                    });

                                cont.style.width = "50%";
                                cont.style.height = "9%";
                                cont.style.left = "25%";
                                cont.style.position = "absolute";
                                cont.style.top = "0";

                                uiContainer.appendChild(cont).append(...icons);
                            },
                            update() {
                                gamespace.objects.players.map(p => ({ score: p.state.custom.score as number ?? 0, name: p.name })).sort((a, b) => b.score - a.score).slice(0, 10).forEach((s, i) => {
                                    const ele = $(`deathmatch-scoreboard-entry-${i}`) as HTMLDivElement,
                                        isPlayer = s.name == gamespace.player.name;

                                    ele.innerText = `${s.name}\n${s.score}`;
                                    ele.style.backgroundColor = isPlayer ? "#000A" : "#0008";
                                    ele.style.color = isPlayer ? "#CFC" : "#FFF";
                                    ele.style.borderColor = isPlayer ? "#CFC" : "#FFF8";
                                });
                            },
                            callCreateImmediately: true
                        },
                            {
                                name: "deathmatch-countdown",
                                create(uiContainer) {
                                    const timer = makeElement("div", "deathmatch-countdown", "ui");

                                    timer.textContent = "5:00";

                                    timer.style.position = "absolute";
                                    timer.style.top = "calc(9% + calc(10vw / 72))";
                                    timer.style.height = "3%";
                                    timer.style.display = "flex";
                                    timer.style.alignItems = "center";
                                    timer.style.justifyContent = "center";
                                    timer.style.width = "5%";
                                    timer.style.left = "47.5%";
                                    timer.style.fontFamily = "roboto, Arial, sans-serif";
                                    timer.style.fontSize = "calc(1.1vw)";
                                    timer.style.backgroundColor = "#0008";
                                    timer.style.color = "#FFF";
                                    timer.style.textAlign = "center";
                                    timer.style.outline = "solid calc(10vw / 72) #FFF8";

                                    uiContainer.appendChild(timer);
                                },
                                update() {
                                    const e = $("deathmatch-countdown") as HTMLDivElement,
                                        d = 300000 - (gamespace._currentUpdate - gamespace.created),
                                        m = Math.floor(d / 60000),
                                        s = Math.ceil((d - 60000 * m) / 1000);

                                    e.style.fontWeight = "bolder";
                                    e.textContent = `${m + +(s == 60)}:${`${s == 60 ? 0 : s}`.padStart(2, "0")}`;
                                    (s <= 10 && !m) && (e.style.color = "red");
                                },
                                callCreateImmediately: true
                            }
                        );
                    };

                    p5.draw = function () {
                        gamespace.update(p5);

                        gamespace.bots.forEach(b => {
                            if (b.player.body !== void 0) {
                                b.update();
                            }
                        });

                        if (gamespace._currentUpdate - gamespace.created >= 300000) {
                            gamespace.freeze();
                            p5.noLoop();
                            p5.draw = void 0 as badCodeDesign;

                            const leaderbord = makeElement("table", "leaderboard"),
                                body = makeElement("tbody");

                            leaderbord.style.position = "absolute";
                            leaderbord.style.width = "60%";
                            leaderbord.style.height = "60%";
                            leaderbord.style.left = "20%";
                            leaderbord.style.top = "20%";
                            leaderbord.style.backgroundColor = "#0008";
                            leaderbord.style.color = "white";
                            leaderbord.style.fontFamily = "roboto, Arial, sans-serif";
                            leaderbord.style.fontSize = "calc(25vh / 9)";
                            leaderbord.style.userSelect = "none";
                            leaderbord.innerHTML = `<thead><tr><th colspan="4"><b>RESULTS</b></th></tr><tr style="outline: calc(1vh / 9) solid #888"><td style="outline: calc(1vh / 9) solid #888"><b>NAME</b></td><td style="outline: calc(1vh / 9) solid #888"><b>SCORE</b></td><td style="outline: calc(1vh / 9) solid #888"><b>KILLS</b></td><td style="outline: calc(1vh / 9) solid #888"><b>DEATHS</b></td></tr></thead>`;

                            leaderbord.appendChild(body);

                            gamespace.objects.players.map(p => ({ kills: p.state.custom.kills as number ?? 0, deaths: p.state.custom.deaths as number ?? 0, score: p.state.custom.score as number ?? 0, name: p.name })).sort((a, b) => (b.score - a.score) || (b.kills - a.kills) || (a.deaths - b.deaths)).forEach(s => {
                                const row = makeElement("tr"),
                                    name = makeElement("td"),
                                    score = makeElement("td"),
                                    kills = makeElement("td"),
                                    deaths = makeElement("td");

                                row.style.outline = name.style.outline = score.style.outline = kills.style.outline = deaths.style.outline = "calc(1vh / 9) solid #888";

                                name.style.fontFamily = score.style.fontFamily = kills.style.fontFamily = deaths.style.fontFamily = "roboto, Arial, sans-serif";
                                name.style.fontSize = score.style.fontSize = kills.style.fontSize = deaths.style.fontSize = "calc(20vh / 9)";
                                name.style.color = score.style.color = kills.style.color = deaths.style.color = s.name == gamespace.settings.name ? "#CFC" : "";
                                name.style.backgroundColor = score.style.backgroundColor = kills.style.backgroundColor = deaths.style.backgroundColor = s.name == gamespace.settings.name ? "#0002" : "";

                                name.textContent = s.name;
                                score.textContent = `${s.score}`;
                                kills.textContent = `${s.kills}`;
                                deaths.textContent = `${s.deaths}`;

                                body.appendChild(row).append(name, score, kills, deaths);
                            });

                            leaderbord.innerHTML += `<tfoot><tr><th colspan="4" style="font-size: calc(12vh / 9);">Press Escape to restart.</th></tr></tfoot>`;

                            document.body.appendChild(leaderbord);

                            document.addEventListener("keydown", function exit(e) {
                                if (e.key == "Escape") {
                                    document.removeEventListener("keydown", exit);
                                    e.preventDefault();
                                    gamespace.exitLevel();
                                }
                            });
                        }
                    };
                };

                new p5(s, void 0 as badCodeDesign);
            }
        };
    return level;
})();