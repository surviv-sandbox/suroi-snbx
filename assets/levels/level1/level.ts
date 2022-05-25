export const level = await (async () => {
    const json: JSONLevel = await (await fetch("assets/levels/level1/data.json")).json();

    const levelData = parseLevelData(json),
        level = {
            name: "temp",
            description: "literally a blank level",
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

                        $("menu-container").remove();
                        $("defaultCanvas0").style.display = "";

                        document.addEventListener("resize", () => void p5.resizeCanvas(p5.windowWidth, p5.windowHeight));
                        p5.pixelDensity(gamespace.settings.graphicsQuality);
                        p5.textAlign(p5.CENTER, p5.CENTER);

                        gamespace.player = gamespace.objects.players[0];

                        gamespace.player.angle = Math.PI / 2 + Math.atan2(p5.mouseY - p5.height / 2, p5.mouseX - p5.width / 2);

                        createUI();
                    };

                    p5.draw = function () {
                        gamespace.update(p5);
                    };

                };

                new p5(s, void 0);
            }
        };
    return level;
})();