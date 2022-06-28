import std_setup from "../../scripts/std_level_setup.js";
export const level = await (async () => {
    const json: JSONLevel = await (await fetch("assets/levels/level1/data.json")).json();

    const name = "Bot War",
        path = ["levels", `level-${name}`],
        level = {
            name: name,
            jsonPath: "assets/levels/level1/data.json",
            description: "50 bots. 1 winner. And you as a spectator.",
            levelData: parseLevelData(json),
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
                        std_setup(engine, world, p5, level, { font: "assets/fonts/RobotoCondensed-Bold.ttf", size: 80 });

                        gamespace.bots.forEach(b => {
                            //@ts-ignore
                            Matter.Body.setPosition(b.player.body, {
                                x: Math.random() * level.world.width,
                                y: Math.random() * level.world.height
                            });

                            b.player.angle = Math.random() * Math.PI * 2;
                        });

                        const r = () => new gun(gamespace.guns[Math.floor(Math.random() * gamespace.guns.length)]);
                        // const r = () => new gun(gamespace.guns.find(g => g.name == ""));

                        gamespace.bots.forEach(b => {
                            b.player.inventory.slot0 = r();
                            b.player.inventory.slot1 = r();
                        });

                        gamespace.player.aiIgnore = true;
                    };


                    p5.draw = function () {
                        gamespace.update(p5);
                        if (gamespace.objects.players.length == 2) {
                            gamespace.freeze();
                            p5.noLoop();
                            p5.draw = void 0 as badCodeDesign;

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
                            if (b.player.body !== void 0 && b.player.body.id != gamespace.player.body.id) {
                                // b.debug();
                                b.update();
                            }
                        });
                    };
                };

                new p5(s, void 0 as badCodeDesign);
            }
        };
    return level;
})();