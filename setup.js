"use strict";
{
    const Colors = {
        BlackFG: 30,
        RedFG: 31,
        GreenFG: 32,
        YellowFG: 33,
        BlueFG: 34,
        MagentaFG: 35,
        CyanFG: 36,
        WhiteFG: 37,
        DefaultFG: 39,
        BlackBG: 40,
        RedBG: 41,
        GreenBG: 42,
        YellowBG: 43,
        BlueBG: 44,
        MagentaBG: 45,
        CyanBG: 46,
        WhiteBG: 47,
        DefaultBG: 49,
        BlackBrightFG: 90,
        RedBrightFG: 91,
        GreenBrightFG: 92,
        YellowBrightFG: 93,
        BlueBrightFG: 94,
        MagentaBrightFG: 95,
        CyanBrightFG: 96,
        WhiteBrightFG: 97,
        BlackBrightBG: 100,
        RedBrightBG: 101,
        GreenBrightBG: 102,
        YellowBrightBG: 103,
        BlueBrightBG: 104,
        MagentaBrightBG: 105,
        CyanBrightBG: 106,
        WhiteBrightBG: 107,
        Reset: 0
    };
    function color(string, color) {
        return `\u001B[${Colors[color]}m${string}\u001B[0m`;
    }
    (async () => {
        const electron = require("electron"), path = require("path");
        await electron.app.whenReady();
        console.clear();
        console.log(`Running Electron ${color(process.versions.electron ?? "", "GreenBrightFG")} with node ${color(process.version, "GreenBrightFG")} and Chrome ${color(process.versions.chrome ?? "", "GreenBrightFG")}`);
        console.log("Creating the window…");
        new electron.BrowserWindow({
            backgroundColor: "#000",
            icon: "icon.png",
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                sandbox: true,
                devTools: true
            },
        }).loadFile("web/index.html");
        //@ts-expect-error
        await import("./writeImports.js");
        electron.app.once("window-all-closed", electron.app.exit);
    })();
}
//# sourceMappingURL=setup.js.map