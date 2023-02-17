const bots = [];
export default {
    world: {
        width: 2500,
        height: 2500,
        color: "#80AF49",
        gridColor: "#00000028"
    },
    initializer() {
        new p5(p5 => {
            p5.setup = () => {
                const randomGun = (() => {
                    const val = [...gamespace.prototypes.firearms.values()];
                    return () => pickRandomInArray(val);
                })(), randomMelee = (() => {
                    const val = [...gamespace.prototypes.melees.values()];
                    return () => pickRandomInArray(val);
                })();
                function generateBot(pos) {
                    const bot = new PlayerLike(pos ?? { x: 1250, y: 1250 });
                    bot.inventory.setItem(0, "Main", new Gun(bot, randomGun()));
                    bot.inventory.setItem(1, "Main", new Gun(bot, randomGun()));
                    bot.inventory.setItem(2, "Main", new Melee(bot, randomMelee()));
                    // bot.inventory.setItem(2, "Main", new Melee(bot, gamespace.prototypes.melees.get("srvsdbx::Pan")!));
                    return bot;
                }
                const player = new Player({ x: 1250, y: 1250 });
                gamespace.setup(p5, player);
                player.inventory.setItem(0, "Main", new Gun(player, randomGun()));
                // player.inventory.setItem(0, "Main", new Gun(player, gamespace.prototypes.firearms.get("srvsdbx::Water Gun")!));
                // player.inventory.setItem(1, "Main", new Gun(player, gamespace.prototypes.firearms.get("srvsdbx::M9A17")!));
                player.inventory.setItem(1, "Main", new Gun(player, randomGun()));
                player.inventory.setItem(2, "Main", new Melee(player, randomMelee()));
                for (let i = 0; i < 20; i++) {
                    const bot = generateBot({
                        x: srvsdbx_Math.bounds_random(0, 2500),
                        y: srvsdbx_Math.bounds_random(0, 2500)
                    });
                    bots.push(bot);
                    bot.setActiveItemIndex(Math.round(srvsdbx_Math.bounds_random(0, 2)));
                    bot.events.on("death", () => {
                        bot.setHealth(bot.maxHealth);
                        bot.setPosition({
                            x: srvsdbx_Math.bounds_random(0, 2500),
                            y: srvsdbx_Math.bounds_random(0, 2500)
                        });
                        bot.statusEffects.clear();
                        bot.modifiers.speed.clear();
                        bot.modifiers.damage.clear();
                        bot.modifiers.protection.clear();
                    });
                    bot.angularVelocityMap.set("intrinsic", srvsdbx_Math.meanDevPM_random(0, 3, true));
                    switch (45 * Math.round(srvsdbx_Math.bounds_random(0, 7))) {
                        case 0: {
                            bot.velocityMap.set("forwards", { x: 0, y: 1, z: 0 });
                            break;
                        }
                        case 45: {
                            bot.velocityMap.set("forwards", { x: 0, y: 1, z: 0 });
                            bot.velocityMap.set("strafeR", { x: 1, y: 0, z: 0 });
                            break;
                        }
                        case 90: {
                            bot.velocityMap.set("strafeR", { x: 1, y: 0, z: 0 });
                            break;
                        }
                        case 135: {
                            bot.velocityMap.set("strafeR", { x: 1, y: 0, z: 0 });
                            bot.velocityMap.set("backwards", { x: 0, y: -1, z: 0 });
                            break;
                        }
                        case 180: {
                            bot.velocityMap.set("backwards", { x: 0, y: -1, z: 0 });
                            break;
                        }
                        case 225: {
                            bot.velocityMap.set("backwards", { x: 0, y: -1, z: 0 });
                            bot.velocityMap.set("strafeL", { x: -1, y: 0, z: 0 });
                            break;
                        }
                        case 270: {
                            bot.velocityMap.set("strafeL", { x: -1, y: 0, z: 0 });
                            break;
                        }
                        case 315: {
                            bot.velocityMap.set("strafeL", { x: -1, y: 0, z: 0 });
                            bot.velocityMap.set("forwards", { x: 0, y: 1, z: 0 });
                            break;
                        }
                    }
                }
            };
            p5.draw = () => {
                bots.forEach(bot => {
                    if (bot.position.x >= 2500) {
                        bot.setPosition({ x: 0, y: bot.position.y });
                    }
                    else if (bot.position.x <= 0) {
                        bot.setPosition({ x: 2500, y: bot.position.y });
                    }
                    if (bot.position.y >= 2500) {
                        bot.setPosition({ x: bot.position.x, y: 0 });
                    }
                    else if (bot.position.y <= 0) {
                        bot.setPosition({ x: bot.position.x, y: 2500 });
                    }
                });
                gamespace.update();
            };
        });
    }
};
/*
    tsc assets/default/levels/level0/level.ts util.d.ts index.d.ts classes.d.ts guns.d.ts projectiles.d.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration --module esnext --moduleResolution node
*/ 
//# sourceMappingURL=export.js.map