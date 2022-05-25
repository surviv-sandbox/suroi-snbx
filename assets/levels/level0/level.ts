export const level = await (async () => {
    const json: JSONLevel = await (await fetch("assets/levels/level0/data.json")).json();

    const levelData = parseLevelData(json),
        level = {
            name: "bot 1v1",
            description: "aa",
            levelData: levelData,
            world: {
                width: 5000,
                height: 5000,
                colour: "#80AF49",
                gridColor: "#00000028",
            },
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
                        engine.gravity.y = 0;
                        gamespace.engine = engine;
                        gamespace.world = world;

                        document.addEventListener("contextmenu", e => e.preventDefault());

                        p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
                        $("defaultCanvas0").style.display = "none";

                        gamespace.lastUpdate = gamespace._currentUpdate = Date.now();

                        p5.imageMode(p5.CENTER);
                        p5.angleMode(p5.RADIANS);
                        p5.textFont(p5.loadFont("assets/fonts/Jura-Bold.ttf"), 80);

                        {
                            function makeBound(x: number, y: number, w: number, h: number): obstacle {
                                //@ts-ignore
                                return new obstacle(Matter.Bodies.rectangle(x, y, w, h, { isStatic: true }), 0, gamespace.images.blank, { width: 1, height: 1 }, "#FFFFFF", 1, { x: 0, y: 0, angle: 0 }, p5.CENTER);
                            }

                            const w = level.world.width,
                                h = level.world.height;

                            levelData.obstacles.concat(levelData.players as any,
                                ...[
                                    [-50, h / 2, 100, h],
                                    [w + 50, h / 2, 100, h],
                                    [w / 2, -50, w, 100],
                                    [w / 2, h + 50, w, 100]
                                ].map(v => makeBound(...v as [number, number, number, number]))
                                //@ts-ignore
                            ).forEach(ob => void Matter.World.add(world, ob.body));

                            gamespace.objects.obstacles = levelData.obstacles;
                            gamespace.objects.players = levelData.players;
                        }

                        p5.cursor("crosshair");
                        $("defaultCanvas0").style.display = "";
                        document.addEventListener("resize", () => void p5.resizeCanvas(p5.windowWidth, p5.windowHeight));
                        p5.pixelDensity(gamespace.settings.graphicsQuality);
                        p5.textAlign(p5.CENTER, p5.CENTER);

                        gamespace.player = gamespace.objects.players[0];

                        gamespace.player.angle = Math.PI / 2 + Math.atan2(p5.mouseY - p5.height / 2, p5.mouseX - p5.width / 2);

                        w = gamespace.objects.players.map(p => p.inventory.activeItem.proto.name);

                        createUI();
                    };

                    // Don't do AI like this, it's stupid
                    function AIupdate(bot: playerLike) {
                        const dy = bot.body.position.y - gamespace.player.body.position.y,
                            dx = bot.body.position.x - gamespace.player.body.position.x,
                            f = (weight?: number) => weight ? Math.random() > weight : !!Math.round(Math.random()),
                            custom = bot.state.custom;

                        custom.strafe ??= {
                            val: true,
                            dir: [f(), f(), f(), f()],
                            timestamp: gamespace._currentUpdate
                        };

                        if (bot.state.reloading) {
                            custom.intent = "reloading";
                        } else {
                            if (!custom.intent || custom.intent == "reloading") {
                                custom.intent = custom.strafe.val ? "moving" : "shooting";
                            }
                        }

                        bot.angle = 3 * Math.PI / 2 + Math.atan2(dy, dx);
                        const d = sqauredDist(bot.body.position, gamespace.player.body.position),
                            r = bot.inventory.activeItem.proto.ballistics.range ** 2;

                        if (custom.intent == "approaching") {
                            if (d < Math.min(r, (1900 + Math.random() * 200) ** 2)) {
                                custom.intent = custom.strafe.val ? "moving" : "shooting";
                            }
                        } else if (d > (2900 + Math.random() * 200) ** 2 && !bot.state.reloading) {
                            custom.intent = "approaching";
                        }

                        switch (custom.intent) {
                            case "shooting":
                            case "moving": {
                                if (custom.strafe.val) {
                                    custom.action = "moving";
                                    bot.state.attacking = false;
                                    bot.move(...custom.strafe.dir as [boolean, boolean, boolean, boolean]);
                                } else {
                                    custom.action = "shooting";

                                    if (r < d) {
                                        custom.action = "approaching";
                                        bot.move(Math.sign(dy) == 1, Math.sign(dx) == 1, Math.sign(dy) == -1, Math.sign(dx) == -1);
                                    }
                                    bot.state.attacking = true;
                                    !bot.state.firing && bot.inventory.activeItem.primary(bot);
                                }

                                if (gamespace._currentUpdate - custom.strafe.timestamp >= Math.random() * 1000 + 250) {
                                    custom.strafe = {
                                        val: !custom.strafe.val,
                                        dir: [f(), f(), f(), f()],
                                        timestamp: gamespace._currentUpdate
                                    };
                                }
                                break;
                            }
                            case "reloading": {
                                const away = d < (Math.random() * 1000 + 1000) ** 2;

                                bot.move(away ? Math.sign(dy) == -1 : custom.strafe.dir[0],
                                    away ? Math.sign(dx) == -1 : custom.strafe.dir[1],
                                    away ? Math.sign(dy) == 1 : custom.strafe.dir[2],
                                    away ? Math.sign(dx) == 1 : custom.strafe.dir[3]
                                );
                                break;
                            }
                            case "approaching": {
                                bot.move(Math.sign(dy) == 1, Math.sign(dx) == 1, Math.sign(dy) == -1, Math.sign(dx) == -1);
                                break;
                            }
                        }
                    }

                    let done = false;

                    let w: string[];

                    p5.draw = function () {
                        gamespace.update(p5);
                        if (!done) {
                            gamespace.objects.players.forEach(p => {
                                if (p.body.id != gamespace.player.body.id) {
                                    AIupdate(p);
                                }
                            });

                            if (gamespace.objects.players.length == 1) {
                                done = true;
                                gamespace.freeze();

                                const winBanner = makeElement("p", "winner-text");

                                winBanner.style.font = "calc(250vw / 72) roboto";
                                winBanner.style.color = "#FF0";
                                winBanner.style.left = "50%";
                                winBanner.style.top = "20%";
                                winBanner.style.position = "absolute";
                                winBanner.style.transform = "translate(-50%, 0)";
                                winBanner.style.textShadow = "calc(10vw / 72) calc(2vh / 9) black";
                                winBanner.style.pointerEvents = "none";
                                winBanner.style.userSelect = "none";
                                winBanner.style.textAlign = "center";

                                winBanner.innerHTML = `You ${gamespace.player.body.circleRadius /* identify the rendering hack */ ? "win!" : "lose."} Remaining HP: ${gamespace.objects.players[0].health}<br><span style="font-size: calc(225vw / 72)">${w[0]} vs ${w[1]}</span>`;

                                setTimeout(() => {
                                    winBanner.innerHTML += `<br><span style="font-size: calc(200vw / 72)">Press Escape to restart.</span>`;
                                    document.addEventListener("keydown", e => e.key == "Escape" && (e.preventDefault(), window.location.reload()));
                                }, 250);


                                document.body.appendChild(winBanner);
                            }
                        }
                    };
                };

                (() => { // Terrible, awful UI code, don't write this either
                    $("menu-container").remove();
                    const doc = new DocumentFragment(),
                        cont = makeElement("div", "game-start-cont"),
                        overlay = makeElement("canvas", "gme-start-overlay");

                    document.body.style.backgroundColor = "#80AF49";

                    overlay.style.aspectRatio = cont.style.aspectRatio = "1";
                    cont.style.width = "50%";
                    cont.style.borderRadius = "calc(50vw / 72)";
                    cont.style.backgroundColor = "#0008";
                    overlay.style.position = cont.style.position = "absolute";
                    cont.style.transform = "translate(-50%, -50%)";
                    cont.style.left = "50%";
                    cont.style.top = "50%";

                    overlay.style.width = "100%";
                    overlay.width = 1000;
                    overlay.height = 1000;

                    const otx = overlay.getContext("2d");
                    otx.lineWidth = 1;
                    otx.strokeStyle = "#FFF";

                    otx.moveTo(500, 0);
                    otx.lineTo(500, 450);
                    otx.moveTo(500, 550);
                    otx.lineTo(500, 900);
                    otx.stroke();
                    otx.beginPath();
                    otx.moveTo(0, 900);
                    otx.lineTo(1000, 900);
                    otx.stroke();

                    otx.font = "calc(250vw / 72) roboto";
                    otx.textAlign = "center";
                    otx.textBaseline = "bottom";
                    otx.strokeText("YOU", 250, 100);
                    otx.strokeText("BOT", 750, 100);

                    otx.fillStyle = "#FFF";
                    otx.textBaseline = "middle";
                    otx.fillText("VS", 500, 500);

                    const buttons: [HTMLButtonElement[], HTMLButtonElement[]] = [[], []],
                        inputs: HTMLInputElement[] = [];

                    for (let i = 0; i <= 1; i++) {
                        const entity = levelData.players[1 - i],
                            s = localStorage.getItem(`sriv_sndbx_level0: ${i ? "player" : "bot"}-weapon-preset`);

                        entity.inventory.guns = gamespace.guns.map(g => new gun(g));

                        if (s) {
                            entity.inventory.activeIndex = s == "Random" ? Math.floor(Math.random() * entity.inventory.guns.length) : entity.inventory.guns.findIndex(gu => gu.proto.name == s);
                        }

                        otx.textBaseline = "bottom";
                        otx.font = "calc(180vw / 72) roboto";
                        otx.fillText("Weapon", i ? 250 : 750, 150);

                        gamespace.guns.concat({ name: "Random" } as any).forEach((g, j) => {
                            const b = makeElement("button", `gun-${i ? "player" : "bot"}-${g.name}`, "surviv-outline-button"),
                                currentlySelected = entity.inventory.activeItem.proto.name == g.name && s != "Random",
                                iCopy = i; // I love closures

                            if (currentlySelected) {
                                localStorage.setItem(`sriv_sndbx_level0: ${i ? "player" : "bot"}-weapon-preset`, g.name);
                            }

                            b.textContent = g.name;

                            b.style.borderColor = (currentlySelected || (s + g.name) == "RandomRandom") ? "#0F0" : "";
                            b.style.backgroundColor = (currentlySelected || (s + g.name) == "RandomRandom") ? "#0108" : "";
                            b.style.position = "absolute";
                            b.style[i ? "right" : "left"] = `${53 + (j % 4) * 12}%`;
                            b.style.width = "10%";
                            b.style.height = "7.5%";
                            b.style.top = `${8.5 * Math.floor(j / 4) + 18}%`;

                            b.addEventListener("click", e => (!e.button && (() => {
                                if (entity.inventory.activeItem.proto.name == g.name) { return; }

                                entity.inventory.activeIndex = g instanceof gunPrototype ? entity.inventory.guns.findIndex(gu => gu.proto.name == g.name) : Math.floor(Math.random() * entity.inventory.guns.length);
                                localStorage.setItem(`sriv_sndbx_level0: ${i ? "player" : "bot"}-weapon-preset`, g.name);

                                buttons[iCopy].forEach(b => b.style.borderColor = b.style.backgroundColor = "");

                                b.style.borderColor = "#0F0";
                                b.style.backgroundColor = "#0108";
                            })()));

                            buttons[i].push(b);
                        });

                        otx.fillText("Health", i ? 250 : 750, 500);

                        const input = makeElement("input", `healh-${i ? "player" : "bot"}`);

                        input.type = "number";
                        input.min = "1";
                        input.max = "Infinity";
                        input.value = `${entity.health}`;

                        input.style.position = "absolute";
                        input.style.left = i ? "25%" : "75%";
                        input.style.transform = "translate(-50%, 0)";
                        input.style.top = "50%";
                        input.style.backgroundColor = "#0008";
                        input.style.color = "white";
                        input.style.font = "calc(14vh / 9) roboto";
                        input.style.border = "calc(5vw / 72) solid white";
                        input.style.borderRadius = "calc(25vw / 72)";
                        input.style.outline = "none";

                        input.addEventListener("input", () => {
                            const v = +input.value;

                            if (!checkBounds(v, 1, "inf")) {
                                input.value = `${clamp(v, 1)}`;
                            }

                            entity.maxHealth = Math.max(100, entity.health = v);
                        });

                        inputs.push(input);
                    }

                    const battle = makeElement("button", "battle", "surviv-purple-button");

                    battle.textContent = "Battle";

                    battle.style.width = "15%";
                    battle.style.left = "50%";
                    battle.style.top = "92%";
                    battle.style.transform = "translate(-50%, 0)";

                    battle.addEventListener("click", e => void (!e.button && (() => {
                        cont.remove();

                        new p5(s, void 0);
                    })()));

                    doc.appendChild(cont).append(overlay, ...buttons.flat(), ...inputs, battle);

                    document.body.appendChild(doc);

                })();
            }
        };
    return level;
})();