"use strict";
{
    function makeElement(key, properties, children, listeners) {
        const element = document.createElement(key);
        for (const [key, value] of Object.entries(properties ?? {})) {
            if (typeof element[key] == "object")
                for (const [objKey, objVal] of Object.entries(value))
                    element[key][objKey] = objVal;
            else
                element[key] = value;
        }
        children && element.append(...[children].flat().filter(v => v !== void 0));
        for (const [event, lis] of Object.entries(listeners ?? {}))
            for (const li of [lis].flat())
                element.addEventListener /* forgive me for I have sinned */(event, ...(typeof li == "function" ? [li] : [li.callback, li.options]));
        return element;
    }
    document.getElementById("back").addEventListener("click", e => void (!e.button && window.open("../index.html", "_self")));
    const updates = [...document.querySelectorAll("div.update")].map(update => {
        const [header, content] = [...update.children], [version, date] = [...header.children];
        version.id = `${version.textContent}`;
        version.innerHTML = `<a href="./index.html#${version.textContent}" class="no-style" style="color: inherit; text-decoration: none">${version.innerHTML}</a>`;
        return {
            get version() { return version; },
            get date() { return date; },
            get content() { return content; }
        };
    });
    const sidebar = document.getElementById("sidebar");
    updates.forEach(u => {
        sidebar.appendChild(makeElement("a", {
            href: `./index.html#${u.version.textContent}`,
            textContent: u.version.textContent
        }));
    });
}
//# sourceMappingURL=index.js.map