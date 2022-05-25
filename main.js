(function makeMenu() {
    if (localStorage.getItem("sawPopup") == "true" || window.confirm("This build of surviv.io sandbox could stop existing at any given moment and should therefore be considered volatile.\n\nBy pressing \"OK\", you're accepting the very real possibility of being let down once again.")) {
        localStorage.setItem("sawPopup", "true");
        const container = makeElement("div", "menu-container"), play = makeElement("button", "play", "main-menu-button surviv-purple-button"), settings = makeElement("button", "settings", "main-menu-button surviv-purple-button"), changelog = makeElement("button", "changelog", "main-menu-button surviv-grey-button"), ver = makeElement("p", "version"), title = makeElement("h1", "title");
        title.innerHTML = `SURVIV<span style="color: #FFE400">.IO</span> SANDBOX`;
        play.textContent = "Play";
        settings.textContent = "Settings";
        changelog.textContent = "Changelog";
        ver.innerHTML = `SURVIV.IO sandbox v${gamespace.version}`;
        document.body.appendChild(container).append(title, play, settings, changelog, ver);
        document.body.style.backgroundColor = "#83AF50";
        play.addEventListener("click", e => void (!e.button && startGame()));
        // I'll have to re-do this when there are like, actual settings, but this'll do for now
        settings.addEventListener("click", e => void (!e.button && (() => {
            if ($("settings-cont")) {
                return $("settings-cont").remove();
            }
            const doc = new DocumentFragment(), cont = makeElement("div", "settings-cont"), switches = (() => {
                const b = [];
                for (const feature in gamespace.settings.bonus_features) {
                    const button = makeElement("button", `setting-${feature}-switch`, "setting-switch surviv-outline-button");
                    button.textContent = feature.replace(/_/g, " ");
                    button.style.borderColor = gamespace.settings.bonus_features[feature] ? "#0F0" : "";
                    button.style.backgroundColor = gamespace.settings.bonus_features[feature] ? "#0108" : "";
                    button.addEventListener("click", e => void (!e.button && (() => {
                        gamespace.settings.bonus_features[feature] = !gamespace.settings.bonus_features[feature];
                        button.style.borderColor = gamespace.settings.bonus_features[feature] ? "#0F0" : "";
                        button.style.backgroundColor = gamespace.settings.bonus_features[feature] ? "#0108" : "";
                    })()));
                    b.push(button);
                }
                return b;
            })();
            doc.appendChild(cont).append(...switches);
            document.body.appendChild(doc);
        })()));
        changelog.addEventListener("click", e => void (!e.button && window.open("./changelog/changelog.html", "_self")));
        function startGame() {
            $("settings-cont")?.remove();
            const load = makeElement("p", "loading");
            document.body.style.backgroundColor = "rgb(20, 20, 20)";
            load.textContent = "Loading...";
            Array.from(container.children).forEach(e => e.remove());
            container.appendChild(load);
            gamespace._currentLevel = gamespace.levels[0];
            gamespace.levels[0].initializer();
        }
    }
})();
