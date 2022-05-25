document.getElementById("back").addEventListener("click", e => void (!e.button && window.open("../", "_self")));

(async () => { document.getElementById("main").innerHTML = await (await (fetch("./changelog.md"))).text(); })();
// Ok look, yes this is bad practice.
// But consider: