document.getElementById("back").addEventListener("click", e => void (!e.button && window.open("../index.html", "_self")));

(() => {
    document.querySelectorAll("h2").forEach((e, i) => {
        e.id = `h2-${i}`;
        e.innerHTML = `<a href="./#${e.textContent}" class="no-style" style="color: inherit; text-decoration: none">${e.innerHTML}</a>`;
    });

    /**
     * @type {HTMLButtonElement[]}
     */
    const toggles = Array.from(document.querySelectorAll("button.tech-changes-toggle")),
        /**
         * @type {HTMLDivElement[]}
         */
        fields = Array.from(document.querySelectorAll("div.tech-changes"));

    toggles.forEach((e, i) => {
        const f = fields[i];

        e.addEventListener("click", ev => {
            if (!ev.button) {
                if (f.style.maxHeight) {
                    e.innerHTML = e.innerHTML.replace(/▾/, "▴");
                    e.style.borderBottomLeftRadius = e.style.borderBottomRightRadius = "";
                    f.style.maxHeight = "";
                } else {
                    e.innerHTML = e.innerHTML.replace(/▴/, "▾");
                    e.style.borderBottomLeftRadius = e.style.borderBottomRightRadius = "0";

                    f.style.maxHeight = "max-content";
                }
            }
        });
    });
})();