const keyBindings = (() => {
    return {
        "forward": {
            key: "w",
            allowedModifiers: [],
            callback() { }
        },
        "backward": {
            key: "s",
            allowedModifiers: [],
            callback() { }
        },
        "strafe-left": {
            key: "a",
            allowedModifiers: [],
            callback() { }
        },
        "strafe-right": {
            key: "d",
            allowedModifiers: [],
            callback() { }
        },
        "reload": {
            key: "r",
            allowedModifiers: [],
            callback(type) {
                const p = gamespace.player;
                if (type.endsWith("down") && p) {
                    if (gamespace.currentUpdate - p.state.lastSwitch > p.state.eSwitchDelay) {
                        p.inventory.activeItem.reload(p);
                    }
                }
            }
        },
        "primary_fire": {
            key: "mouse0",
            allowedModifiers: [],
            callback(type) {
                gamespace.player && (gamespace.player.state.attacking = type.endsWith("down"));
                type.endsWith("down") && gamespace?.player?.inventory?.activeItem?.primary?.(gamespace?.player);
            }
        },
        "secondary_fire": {
            key: "mouse2",
            allowedModifiers: [],
            callback() { }
        },
        "slot0": {
            key: "1",
            allowedModifiers: [],
            callback(type) {
                if (type.endsWith("down") && gamespace.player !== void 0) {
                    gamespace.player.switchSlots(0);
                }
                ;
            }
        },
        "slot1": {
            key: "2",
            allowedModifiers: [],
            callback(type) {
                if (type.endsWith("down") && gamespace.player !== void 0) {
                    gamespace.player.switchSlots(1);
                }
                ;
            }
        },
        "slot2": {
            key: "3",
            allowedModifiers: [],
            callback() { }
        },
        "slot3": {
            key: "4",
            allowedModifiers: [],
            callback() { }
        },
        "last_item": {
            key: "q",
            allowedModifiers: [],
            callback(type) {
                if (type.endsWith("down") && gamespace.player !== void 0) {
                    gamespace.player.switchSlots((1 - gamespace.player.inventory.activeIndex));
                }
                ;
            }
        },
        "next_item": {
            key: "mwheelup",
            allowedModifiers: [],
            callback() {
                if (gamespace.player !== void 0) {
                    gamespace.player.switchSlots((gamespace.player.inventory.activeIndex + 1) % 2);
                }
                ;
            }
        },
        "prev_item": {
            key: "mwheeldown",
            allowedModifiers: [],
            callback() {
                if (gamespace.player !== void 0) {
                    gamespace.player.switchSlots(Math.abs((gamespace.player.inventory.activeIndex - 1) % 2));
                }
                ;
            }
        },
        "interact": {
            key: "e",
            allowedModifiers: [],
            callback() { }
        },
        "cancel": {
            key: "x",
            allowedModifiers: [],
            callback(type) {
                if (type.endsWith("down") && gamespace.player !== void 0) {
                    gamespace.player?.inventory?.activeItem?.stopReload?.(gamespace.player);
                }
                ;
            }
        },
        "other_gun": {
            key: "e",
            allowedModifiers: [],
            callback(type) {
                if (type.endsWith("down") && gamespace.player !== void 0) {
                    gamespace.player.switchSlots((1 - gamespace.player.inventory.activeIndex));
                }
                ;
            }
        },
        "switch_guns": {
            key: "t",
            allowedModifiers: [],
            callback(type) {
                if (type.endsWith("down") && gamespace.player !== void 0) {
                    [gamespace.player.inventory.slot0, gamespace.player.inventory.slot1] = [gamespace.player.inventory.slot1, gamespace.player.inventory.slot0];
                    gamespace.player.inventory.activeIndex = 1 - gamespace.player.inventory.activeIndex;
                }
                ;
            }
        },
        "map": {
            key: "m",
            allowedModifiers: [],
            callback() { }
        },
        "minimap": {
            key: "v",
            allowedModifiers: [],
            callback() { }
        },
        "hide_ui": {
            key: "p",
            allowedModifiers: [],
            callback(type) {
                if (type.endsWith("down")) {
                    gamespace.settings.visual.hud = !gamespace.settings.visual.hud;
                    document.querySelectorAll(".ui").forEach(e => e.classList[gamespace.settings.visual.hud ? "remove" : "add"]("hidden"));
                }
            }
        },
        "escape": {
            key: "escape",
            allowedModifiers: [],
            callback(type) {
                if (type.endsWith("down")) {
                    if (gamespace.currentLevel) {
                        ui.add({
                            name: "pause menu",
                            create(uiContainer) {
                                if (!uiContainer) {
                                    return;
                                }
                                if (!$("pause-menu-cont")) {
                                    const cont = makeElement("div", "pause-menu-cont", "ui"), resume = makeElement("button", "resume-game", "ui surviv-blue-button"), exit = makeElement("button", "exit-game", "ui surviv-blue-button");
                                    resume.textContent = "Return to Game";
                                    exit.textContent = "Quit Game";
                                    exit.style.pointerEvents = resume.style.pointerEvents = "all";
                                    resume.addEventListener("click", e => void (!e.button && cont.remove()));
                                    exit.addEventListener("click", e => {
                                        if (!e.button) {
                                            cont.remove();
                                            gamespace.exitLevel();
                                        }
                                    });
                                    uiContainer.appendChild(cont).append(resume, exit);
                                }
                                else {
                                    $("pause-menu-cont")?.remove?.();
                                }
                            },
                            callCreateImmediately: true
                        });
                    }
                    else if (gamespace.console.opened) {
                        gamespace.console.close();
                    }
                }
            }
        },
        "console": {
            key: "§",
            allowedModifiers: [],
            callback(type) {
                if (type.endsWith("down")) {
                    gamespace.console[gamespace.console.opened ? "close" : "open"]();
                }
            },
        },
        "clear_console": {
            key: "k",
            allowedModifiers: ["meta"],
            callback(type, modifers) {
                if (gamespace.console.opened && modifers.metaKey) {
                    gamespace.console.clear();
                }
            },
        }
    };
})();
//@ts-expect-error
cslData.push({ time: Date.now(), content: "Initialized keybinds" });
function registerInput(event) {
    const o = { altKey: event.altKey, ctrlKey: event.ctrlKey, metaKey: event.metaKey, shiftKey: event.shiftKey };
    function validateModifiers(allowedModifiers) {
        return Object.keys(o).map(key => !o[key] || allowedModifiers.includes(key.replace("Key", "")));
    }
    if (event instanceof KeyboardEvent) {
        gamespace.keys[event.key.toLowerCase()] = event.type == "keydown";
        for (const action in keyBindings) {
            const k = keyBindings[action];
            if (k.key == event.key.toLowerCase() && validateModifiers(k.allowedModifiers)) {
                k.callback(event.type, o);
            }
        }
    }
    else if (event instanceof MouseEvent && !(event instanceof WheelEvent)) {
        gamespace.keys[`mouse${event.button}`] = event.type == "mousedown";
        if (["exit-game", "resume-game"].every(v => v != event.target.id)) {
            for (const action in keyBindings) {
                const k = keyBindings[action];
                if (k.key == `mouse${event.button}` && validateModifiers(k.allowedModifiers)) {
                    k.callback(event.type, o);
                }
            }
        }
    }
    else {
        const m = (function cleanUpMWheelName(event) {
            return `mwheel${(() => {
                if (event.deltaY > 0) {
                    return "down";
                }
                else if (event.deltaY < 0) {
                    return "up";
                }
                else if (event.deltaX > 0) {
                    return "left";
                }
                else if (event.deltaX < 0) {
                    return "right";
                }
                else if (event.deltaZ > 0) {
                    return "backwards";
                }
                else if (event.deltaZ < 0) {
                    return "forwards";
                }
            })()}`;
        })(event);
        gamespace.keys[m] = true;
        for (const action in keyBindings) {
            const k = keyBindings[action];
            if (k.key == m && validateModifiers(k.allowedModifiers)) {
                if (m == "mwheelright" || m == "mwheelleft") {
                    event.preventDefault();
                }
                k.callback(event.type, o);
            }
        }
    }
}
unfreezeInputs();
function freezeAllInputs() {
    document.removeEventListener("keydown", registerInput);
    document.removeEventListener("keyup", registerInput);
    document.removeEventListener("mousedown", registerInput);
    document.removeEventListener("mouseup", registerInput);
    document.removeEventListener("wheel", registerInput);
}
function unfreezeInputs() {
    document.addEventListener("keydown", registerInput);
    document.addEventListener("keyup", registerInput);
    document.addEventListener("mousedown", registerInput);
    document.addEventListener("mouseup", registerInput);
    document.addEventListener("wheel", registerInput);
}
