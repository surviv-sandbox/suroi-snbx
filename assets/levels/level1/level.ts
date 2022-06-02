import AI from "../../scripts/std_ai.js";
export const level = await (async () => {
    const json: JSONLevel = await (await fetch("assets/levels/level1/data.json")).json();

    const levelData = parseLevelData(json),
        name = "Bot War",
        path = ["levels", `level-${name}`],
        level = {
            name: name,
            description: "100 bots. 1 winner. And you as a spectator.",
            levelData: levelData,
            world: {
                width: 10000,
                height: 10000,
                color: "#80AF49",
                gridColor: "#00000028",
            },
            color: "#0080FF",
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
                        p5.textFont(p5.loadFont("assets/fonts/RobotoCondensed-Bold.ttf"), 80);

                        {
                            function makeBound(x: number, y: number, w: number, h: number): obstacle {
                                //@ts-ignore
                                return new obstacle(Matter.Bodies.rectangle(x, y, w, h, { isStatic: true }), 0, gamespace.images.blank, { width: 1, height: 1 }, "#FFFFFF", 1, { x: 0, y: 0, angle: 0 }, p5.CENTER);
                            }

                            const w = level.world.width,
                                h = level.world.height;

                            levelData.obstacles.concat(levelData.players as any,
                                ...[
                                    [-500, h / 2, 1000, h + 1000],
                                    [w + 500, h / 2, 1000, h + 1000],
                                    [w / 2, -500, w + 1000, 1000],
                                    [w / 2, h + 500, w + 1000, 1000]
                                ].map(v => makeBound(...v as [number, number, number, number]))
                                //@ts-ignore
                            ).forEach(ob => void Matter.World.add(world, ob.body));

                            gamespace.objects.obstacles = levelData.obstacles;
                            gamespace.objects.players = levelData.players;

                            gamespace.objects.players.slice(1).forEach(p => {
                                //@ts-ignore
                                Matter.Body.setPosition(p.body, {
                                    x: Math.random() * level.world.width,
                                    y: Math.random() * level.world.height
                                });

                                p.angle = Math.random() * Math.PI * 2;
                            });
                        }

                        p5.cursor("crosshair");
                        $("defaultCanvas0").style.display = "";
                        window.addEventListener("resize", () => void p5.resizeCanvas(p5.windowWidth, p5.windowHeight));
                        p5.pixelDensity(gamespace.settings.graphicsQuality);
                        p5.textAlign(p5.CENTER, p5.CENTER);

                        gamespace.player = gamespace.objects.players[0];
                        gamespace.player.name = gamespace.settings.name;
                        gamespace.player.angle = Math.PI / 2 + Math.atan2(p5.mouseY - p5.height / 2, p5.mouseX - p5.width / 2);

                        gamespace.bots = gamespace.objects.players.map(p => new AI(p));

                        const r = () => new gun(gamespace.guns[Math.floor(Math.random() * gamespace.guns.length)]);
                        // const r = () => new gun(gamespace.guns.find(g => g.name == ""));

                        gamespace.objects.players.slice(1).forEach(p => {
                            p.name = `BOT ${p.name}`;
                            p.inventory.slot0 = r();
                            p.inventory.slot1 = r();
                        });

                        gamespace.player.aiIgnore = true;

                        createUI();
                    };

                    let done = false;

                    p5.draw = function () {
                        gamespace.update(p5);
                        if (!done) {
                            if (gamespace.objects.players.length == 2) {
                                done = true;
                                gamespace.freeze();

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

                                winBanner.innerHTML = `${gamespace.objects.players[1].name} wins!</span>`;

                                setTimeout(() => {
                                    winBanner.innerHTML += `<br><span style="font-size: calc(180vw / 72)">Press Escape to restart.</span>`;
                                    document.addEventListener("keydown", e => e.key == "Escape" && (e.preventDefault(), window.location.reload()));
                                }, 250);


                                document.body.appendChild(winBanner);
                                return;
                            }

                            gamespace.bots.forEach(b => {
                                if (b.player.body !== void 0 && b.player.body.id != gamespace.player.body.id) {
                                    // b.debug();
                                    b.update();
                                }
                            });
                        }
                    };
                };

                new p5(s, void 0);
            }
        };
    return level;
})();