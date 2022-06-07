import AI from "./std_ai.js";

function std_setup(engine: Matter.Engine, world: Matter.World, p5: import("p5"), level: typeof import("../levels/level0/level").level, font?: { font: string | import("p5").Font, size?: number; }) {
    engine.gravity.y = 0;
    gamespace.engine = engine;
    gamespace.world = world;
    gamespace.p5 = p5;

    window.addEventListener("contextmenu", e => e.preventDefault());
    window.addEventListener("resize", () => void p5.resizeCanvas(p5.windowWidth, p5.windowHeight));

    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
    gamespace.camera = (p5 as any)._elements[0]._curCamera;

    $("defaultCanvas0").style.display = "none";

    gamespace.created = gamespace.lastUpdate = gamespace._currentUpdate = Date.now();

    p5.pixelDensity(gamespace.settings.graphicsQuality);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.imageMode(p5.CENTER);
    p5.angleMode(p5.RADIANS);
    p5.cursor("crosshair");

    if (font) {
        p5.textFont(typeof font.font == "string" ? p5.loadFont(font.font) : font.font, font.size);
    }

    {
        function makeBound(x: number, y: number, w: number, h: number) {
            // @ts-ignore
            return new obstacle(Matter.Bodies.rectangle(x, y, w, h, { isStatic: true }), 0, gamespace.images.blank, { width: 1, height: 1 }, "#FFF", 1, { x: 0, y: 0, angle: 0 }, p5.CENTER);
        }

        const w = level.world.width,
            h = level.world.height,
            t = 1000;

        level.levelData.obstacles.concat(
            ...level.levelData.players as any,
            ...[
                [
                    -t / 2,
                    h / 2,
                    t,
                    h + t
                ],
                [
                    w + t / 2,
                    h / 2,
                    t,
                    h + t
                ],
                [
                    w / 2,
                    -t / 2,
                    w + t,
                    t
                ],
                [
                    w / 2,
                    h + t / 2,
                    w + t,
                    t
                ]
            ].map(v => makeBound(...v as [number, number, number, number]))
            // @ts-ignore
        ).forEach(ob => void Matter.World.add(world, ob.body));
    }

    gamespace.objects.players = level.levelData.players;
    gamespace.objects.obstacles = level.levelData.obstacles;
    gamespace.bots = gamespace.objects.players.slice(1).map(p => new AI(p));

    gamespace.player = gamespace.objects.players[0];
    gamespace.player.name = gamespace.settings.name;
    gamespace.player.angle = Math.PI / 2 + Math.atan2(p5.mouseY - p5.height / 2, p5.mouseX - p5.width / 2);

    $("defaultCanvas0").style.display = "";
    ui.create();
}

export default std_setup;