document.getElementById("back").addEventListener("click", e => void (!e.button && window.open("../", "_self")));

(async () => {
    document.getElementById("main").innerHTML = (await (await (fetch("./changelog.md"))).text())
        .split("\n").map(ln => {
            if (ln.startsWith("<h2>")) {
                const version = ln.replace(/<\/?h2>/g, "");

                return `<h2 id="${version}"><a href="./#${version}" class="no-style" style="color: white; text-decoration: none">${version}</a></h2>`;
            }
            return ln;
        }).join("\n");
})();