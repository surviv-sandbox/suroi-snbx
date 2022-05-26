(async () => {
    const doc = new DocumentFragment(),
        table = document.createElement("table"),
        head = document.createElement("thead"),
        body = document.createElement("tbody");

    doc.appendChild(table).appendChild(head);
    table.appendChild(body);
    head.innerHTML = `<tr><td><em>Asset</em></td><td><em>Source</em></td></tr>`;

    const arr = (await (await fetch("attributions.txt")).text()).split("\n");

    let i = 0;
    for (const e of arr) {
        const row = document.createElement("tr"),
            cellA = document.createElement("td"),
            cellB = document.createElement("td"),
            a = document.createElement("a");

        body.appendChild(row);
        try {
            cellA.textContent = e.match(/".*?"/g)[0].replace(/"/g, "");
            a.title = a.href = e.match(/\(https?:\/\/.*\)/g)[0].replace(/\(|\)/g, "");
            a.textContent = e.match(/\[.*?\]/g)[0].replace(/[\[\]]/g, "");
            cellB.appendChild(a);

            row.appendChild(cellA);
            row.appendChild(cellB);
            ++i;
        } catch (e) { break; }
    }

    arr.splice(0, i);

    const p = document.createElement("p");
    p.id = "attr";
    p.innerHTML = arr.map(v =>
        v.startsWith("-") ? `<span class="category">${v.replace(/- /, "")}</span>` : v
    ).map(v => {
        if (v.match(/\[.*?\]/)) {
            const os = v.indexOf("["),
                cs = v.indexOf("]"),
                o = v.indexOf("(", os),
                c = v.indexOf(")", cs);

            return `<a href="${v.slice(o + 1, c)}" title="${v.slice(o + 1, c)}">${v.slice(os + 1, cs)}</a>${v.slice(c + 1)}`;
        }
        return v;
    }).join("\n").replace(/\n/g, "<br>");

    doc.appendChild(p);

    document.body.appendChild(doc);

    document.getElementById("back").addEventListener("click", e => void (!e.button && window.open("../", "_self")));
})();