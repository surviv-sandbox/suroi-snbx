"use strict";
{
    const f = () => { gamespace.startLevel(0); };
    if (gamespace.isReady) {
        f();
    }
    else {
        gamespace.events.once("ready", f);
    }
}
//# sourceMappingURL=index.js.map