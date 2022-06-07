const keyBindings = (() => {
    return {
        "forward": {
            key: "w",
            callback() { }
        },
        "backward": {
            key: "s",
            callback() { }
        },
        "strafe-left": {
            key: "a",
            callback() { }
        },
        "strafe-right": {
            key: "d",
            callback() { }
        },
        "reload": {
            key: "r",
            callback(type) {
                type.endsWith("down") && gamespace?.player?.inventory?.activeItem?.reload?.(gamespace?.player);
            }
        },
        "primary_fire": {
            key: "mouse0",
            callback(type) {
                gamespace.player && (gamespace.player.state.attacking = type.endsWith("down"));
                type.endsWith("down") && gamespace?.player?.inventory?.activeItem?.primary?.(gamespace?.player);
            }
        },
        "secondary_fire": {
            key: "mouse2",
            callback() { }
        },
        "slot0": {
            key: "1",
            callback(type) {
                if (type.endsWith("down") && gamespace.player !== void 0) {
                    gamespace.player.switchSlots(0);
                }
                ;
            }
        },
        "slot1": {
            key: "2",
            callback(type) {
                if (type.endsWith("down") && gamespace.player !== void 0) {
                    gamespace.player.switchSlots(1);
                }
                ;
            }
        },
        "slot2": {
            key: "3",
            callback() { }
        },
        "slot3": {
            key: "4",
            callback() { }
        },
        "last_item": {
            key: "q",
            callback(type) {
                if (type.endsWith("down") && gamespace.player !== void 0) {
                    gamespace.player.switchSlots((1 - gamespace.player.inventory.activeIndex));
                }
                ;
            }
        },
        "next_item": {
            key: "mwheelup",
            callback() {
                if (gamespace.player !== void 0) {
                    gamespace.player.switchSlots((gamespace.player.inventory.activeIndex + 1) % 2);
                }
                ;
            }
        },
        "prev_item": {
            key: "mwheeldown",
            callback() {
                if (gamespace.player !== void 0) {
                    gamespace.player.switchSlots(Math.abs((gamespace.player.inventory.activeIndex - 1) % 2));
                }
                ;
            }
        },
        "interact": {
            key: "e",
            callback() { }
        },
        "cancel": {
            key: "x",
            callback(type) {
                if (type.endsWith("down") && gamespace.player !== void 0) {
                    gamespace.player?.inventory?.activeItem?.stopReload?.(gamespace.player);
                }
                ;
            }
        },
        "other_gun": {
            key: "",
            callback() { }
        },
        "switch_guns": {
            key: "",
            callback() { }
        },
        "map": {
            key: "m",
            callback() { }
        },
        "minimap": {
            key: "v",
            callback() { }
        },
        "hide_ui": {
            key: "p",
            callback(type) {
                if (type.endsWith("down")) {
                    gamespace.settings.ui = !gamespace.settings.ui;
                    document.querySelectorAll(".ui").forEach(e => e.classList[gamespace.settings.ui ? "remove" : "add"]("hidden"));
                }
            }
        },
        "escape": {
            key: "escape",
            callback(type) {
                if (type.endsWith("down")) {
                    if (gamespace._currentLevel) {
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
                                            ui.elements.forEach(e => {
                                                if (!["ammo", "HP", "reloading", "killfeed"].includes(e)) {
                                                    ui.remove(e);
                                                }
                                            });
                                            cont.remove();
                                            gamespace.cleanUp(gamespace.p5, { clearEvents: true });
                                            Array.from(document.body.children).forEach(n => n.remove());
                                            makeMenu(true);
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
                }
            }
        }
    };
})();
function registerInput(event) {
    if (event.ctrlKey && event.key == "Control" &&
        event.altKey && event.key == "Alt" &&
        event.shiftKey && event.key == "Shift" &&
        event.metaKey && event.key == "Meta") {
        return;
    }
    if (event instanceof KeyboardEvent) {
        gamespace.keys[event.key.toLowerCase()] = event.type == "keydown";
        for (const action in keyBindings) {
            if (keyBindings[action].key == event.key.toLowerCase()) {
                keyBindings[action].callback(event.type);
            }
        }
    }
    else if (event instanceof MouseEvent && !(event instanceof WheelEvent)) {
        gamespace.keys[`mouse${event.button}`] = event.type == "mousedown";
        if (["exit-game", "resume-game"].every(v => v != event.target.id)) {
            for (const action in keyBindings) {
                if (keyBindings[action].key == `mouse${event.button}`) {
                    keyBindings[action].callback(event.type);
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
            if (keyBindings[action].key == m) {
                if (m == "mwheelright" || m == "mwheelleft") {
                    event.preventDefault();
                }
                keyBindings[action].callback();
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
