const keyBindings: {
    [key: string]: {
        key: string,
        callback: Function;
    };
} = (() => {
    const invSlotCommon = () => {
        const p = gamespace.player,
            i = p.inventory,
            ip = i.activeItem.proto,
            f = gamespace._currentUpdate - p.state.lastFreeSwitch >= 1000;

        i.activeItem.stopReload(p);
        p.state.attacking = false;
        p.state.noSlow = true;
        p.state.eSwitchDelay = ip.switchDelay;

        if (f && (gamespace._currentUpdate - p.state.lastShot[p.inventory.activeIndex]) < ip.delay) {
            p.state.eSwitchDelay = 250;
        }

        if (f) {
            p.state.lastFreeSwitch = gamespace._currentUpdate;
        }

        p.state.lastSwitch = gamespace._currentUpdate;
    };

    return {
        "forward": {
            key: "w",
            callback: () => { }
        },
        "backward": {
            key: "s",
            callback: () => { }
        },
        "strafe-left": {
            key: "a",
            callback: () => { }
        },
        "strafe-right": {
            key: "d",
            callback: () => { }
        },
        "reload": {
            key: "r",
            callback: (type: `${string}${"down" | "up"}`) => {
                type.endsWith("down") && gamespace?.player?.inventory?.activeItem?.reload?.(gamespace?.player);
            }
        },
        "primary_fire": {
            key: "mouse0",
            callback: (type: `${string}${"down" | "up"}`) => {
                gamespace.player && (gamespace.player.state.attacking = type.endsWith("down"));
                type.endsWith("down") && gamespace?.player?.inventory?.activeItem?.primary?.(gamespace?.player);
            }
        },
        "secondary_fire": {
            key: "mouse2",
            callback: () => { }
        },
        "slot0": {
            key: "1",
            callback: (type: `${string}${"down" | "up"}`) => {
                if (type.endsWith("down") && gamespace.player !== void 0) {
                    const p = gamespace.player,
                        i = p.inventory;

                    invSlotCommon();
                    i.activeIndex = 0;
                    if (!i.activeItem.ammo) {
                        i.activeItem.reload(p);
                    }
                };
            }
        },
        "slot1": {
            key: "2",
            callback: (type: `${string}${"down" | "up"}`) => {
                if (type.endsWith("down") && gamespace.player !== void 0) {
                    const p = gamespace.player,
                        i = p.inventory;

                    invSlotCommon();
                    i.activeIndex = 1;
                    if (!i.activeItem.ammo) {
                        i.activeItem.reload(p);
                    }
                };
            }
        },
        "slot2": {
            key: "3",
            callback: () => { }
        },
        "slot3": {
            key: "4",
            callback: () => { }
        },
        "last_item": {
            key: "q",
            callback: (type: `${string}${"down" | "up"}`) => {
                if (type.endsWith("down") && gamespace.player !== void 0) {
                    const p = gamespace.player,
                        i = p.inventory;

                    invSlotCommon();
                    i.activeIndex = (1 - i.activeIndex) as 0 | 1;
                    if (!i.activeItem.ammo) {
                        i.activeItem.reload(p);
                    }
                };
            }
        },
        "next_item": {
            key: "mwheelup",
            callback: (type: `${string}${"down" | "up"}`) => {
                if (type.endsWith("down") && gamespace.player !== void 0) {
                    const p = gamespace.player,
                        i = p.inventory;

                    invSlotCommon();
                    i.activeIndex = (i.activeIndex + 1) % 2 as 0 | 1;
                    if (!i.activeItem.ammo) {
                        i.activeItem.reload(p);
                    }
                };
            }
        },
        "prev_item": {
            key: "mwheeldown",
            callback: (type: `${string}${"down" | "up"}`) => {
                if (type.endsWith("down") && gamespace.player !== void 0) {
                    const p = gamespace.player,
                        i = p.inventory;

                    invSlotCommon();
                    i.activeIndex = (i.activeIndex - 1) % 2 as 0 | 1;
                    if (!i.activeItem.ammo) {
                        i.activeItem.reload(p);
                    }
                };
            }
        },
        "interact": {
            key: "e",
            callback: () => { }
        },
        "cancel": {
            key: "x",
            callback: () => { }
        },
        "other_gun": {
            key: "",
            callback: () => { }
        },
        "switch_guns": {
            key: "",
            callback: () => { }
        },
        "map": {
            key: "m",
            callback: () => { }
        },
        "minimap": {
            key: "v",
            callback: () => { }
        },
        "hide_ui": {
            key: "p",
            callback: () => { }
        },
    };
})();

document.addEventListener("keydown", registerInput);
document.addEventListener("keyup", registerInput);
document.addEventListener("mousedown", registerInput);
document.addEventListener("mouseup", registerInput);

function registerInput(event: KeyboardEvent | MouseEvent) {
    if (event.ctrlKey && (event as KeyboardEvent).key == "Control" &&
        event.altKey && (event as KeyboardEvent).key == "Alt" &&
        event.shiftKey && (event as KeyboardEvent).key == "Shift" &&
        event.metaKey && (event as KeyboardEvent).key == "Meta") { return; }

    if (event instanceof KeyboardEvent) {
        gamespace.keys[event.key.toLowerCase()] = event.type == "keydown";
        for (const action in keyBindings) {
            if (keyBindings[action].key == event.key.toLowerCase()) {
                keyBindings[action].callback(event.type);
            }
        }
    }
    else if (event instanceof MouseEvent) {
        gamespace.keys[`mouse${event.button}`] = event.type == "mousedown";
        for (const action in keyBindings) {
            if (keyBindings[action].key == `mouse${event.button}`) {
                keyBindings[action].callback(event.type);
            }
        }
    }
}


function freezeAllInputs() {
    document.removeEventListener("keydown", registerInput);
    document.removeEventListener("keyup", registerInput);
    document.removeEventListener("mousedown", registerInput);
    document.removeEventListener("mouseup", registerInput);
}