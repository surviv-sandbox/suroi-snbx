declare const p5: typeof import("../../../../libraries/p5/types/index");

const bots: PlayerLike[] = [];

export default {
    name: "Level0",
    targetVersion: "0.10.0",
    world: {
        width: 2500,
        height: 2500,
        color: "#80AF49",
        gridColor: "#00000028"
    },
    initializer() {
        new p5(
            p5 => {
                p5.setup = () => {
                    const randomGun = (() => {
                        const val = [...gamespace.prototypes.firearms.values()];

                        return () => pickRandomInArray(val);
                    })(),
                        randomMelee = (() => {
                            const val = [...gamespace.prototypes.melees.values()];

                            return () => pickRandomInArray(val);
                        })();

                    function generateBot(pos?: { x: number, y: number; }) {
                        const bot = new PlayerLike(pos ?? { x: 1250, y: 1250 });

                        bot.inventory.containers.main.set(0, randomGun());
                        bot.inventory.containers.main.set(1, randomGun());
                        bot.inventory.containers.main.set(2, randomMelee());

                        if (Math.random() > 0.2) {
                            bot.inventory.containers.equipment.set("vest", gamespace.prototypes.equipments.get(`srvsdbx::Level ${Math.round(srvsdbx_Math.bounds_random(1, 4))} Vest`));
                        } else {
                            bot.inventory.containers.equipment.delete("vest");
                        }

                        if (Math.random() > 0.2) {
                            bot.inventory.containers.equipment.set("helmet", pickRandomInArray([...gamespace.prototypes.equipments.values()].filter(v => v.type == "helmet")));
                        } else {
                            bot.inventory.containers.equipment.delete("helmet");
                        }

                        bot.inventory.containers.equipment.set("backpack", gamespace.prototypes.equipments.get(`srvsdbx::${pickRandomInArray(["Pouch", "Small Pack", "Regular Pack", "Military Pack"])}`));

                        return bot;
                    }

                    const player = new Player({ x: 1250, y: 1250 });

                    gamespace.setup(p5, player);

                    function setRandomItems() {
                        player.inventory.containers.main.set(0, randomGun());
                        player.inventory.containers.main.set(1, randomGun());
                        player.inventory.containers.main.set(2, randomMelee());

                        if (Math.random() > 0.2) {
                            player.inventory.containers.equipment.set("vest", gamespace.prototypes.equipments.get(`srvsdbx::Level ${Math.round(srvsdbx_Math.bounds_random(1, 4))} Vest`)!);
                        } else {
                            player.inventory.containers.equipment.delete("vest");
                        }

                        if (Math.random() > 0.2) {
                            player.inventory.containers.equipment.set("helmet", pickRandomInArray([...gamespace.prototypes.equipments.values()].filter(v => v.type == "helmet")));
                        } else {
                            player.inventory.containers.equipment.delete("helmet");
                        }

                        player.inventory.containers.equipment.set("backpack", gamespace.prototypes.equipments.get(`srvsdbx::${pickRandomInArray(["Pouch", "Small Pack", "Regular Pack", "Military Pack"])}`)!);
                    }

                    setRandomItems();
                    InputManager.register.onlyOnStart("KeyG", setRandomItems);

                    for (let i = 0; i < 30; i++) {
                        gamespace.prototypes.obstacles.get(`srvsdbx::${pickRandomInArray(["rock", "crate", "bush", "tree", "barrel", "ammoCrate", "hardstone"])}`).create({
                            x: srvsdbx_Math.bounds_random(200, 2300),
                            y: srvsdbx_Math.bounds_random(200, 2300)
                        });
                    }

                    for (let i = 0; i < 20; i++) {
                        const bot = generateBot({
                            x: srvsdbx_Math.bounds_random(0, 2500),
                            y: srvsdbx_Math.bounds_random(0, 2500)
                        });

                        bots.push(bot);
                        // bot.setActiveItemIndex(Math.round(srvsdbx_Math.bounds_random(0, 2)));
                        bot.events.on("death", () => {
                            bot.setHealth(bot.maxHealth);
                            bot.setPosition({
                                x: srvsdbx_Math.bounds_random(0, 2500),
                                y: srvsdbx_Math.bounds_random(0, 2500)
                            });
                            bot.statusEffects.clear();
                            bot.modifiers.speedMultipliers.clear();
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
                        } else if (bot.position.x <= 0) {
                            bot.setPosition({ x: 2500, y: bot.position.y });
                        }

                        if (bot.position.y >= 2500) {
                            bot.setPosition({ x: bot.position.x, y: 0 });
                        } else if (bot.position.y <= 0) {
                            bot.setPosition({ x: bot.position.x, y: 2500 });
                        }
                    });

                    gamespace.update();
                };
            }
        );
    }
} satisfies ExportInterface<SimpleLevel>;;