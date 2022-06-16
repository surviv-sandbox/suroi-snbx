(async () => {
    const doc = new DocumentFragment(),
        table = document.createElement("table"),
        head = document.createElement("thead"),
        body = document.createElement("tbody");

    doc.appendChild(table).appendChild(head);
    table.id = "assets";
    table.appendChild(body);
    head.innerHTML = `<thead><tr><td><em>Asset</em></td><td><em>Source</em></td><td><em>Renamed?</em></td></tr></thead>`;

    const arr = (await (await fetch("attributions.txt")).text()).split("\n");

    let i = 0;
    for (const e of arr) {
        const row = document.createElement("tr"),
            cellA = document.createElement("td"),
            cellB = document.createElement("td"),
            cellC = document.createElement("td"),
            a = document.createElement("a");

        body.appendChild(row);
        try {
            cellA.textContent = e.match(/".*?"/g)[0].replace(/"/g, "");
            a.title = a.href = e.match(/\(https?:\/\/.*?\)/g)[0].replace(/\(|\)/g, "");
            a.textContent = e.match(/\[.*?\]/g)[0].replace(/\[|\]/g, "");
            cellB.appendChild(a);
            cellC.innerHTML = !!e.match(/".*?".*?\(https?:\/\/.*\) \(Renamed\)/) ? `<span style="color: #8F8">yes</span>` : `<span style="color: #F88">no</span>`;

            row.append(cellA, cellB, cellC);
            ++i;
        } catch (e) { break; }
    }

    arr.splice(0, i);

    const p = document.createElement("p");
    p.id = "attr";

    p.append(...arr.map(v => {
        if (v.startsWith("-")) {
            const span = document.createElement("span");
            span.className = "category";
            span.textContent = v.replace(/- /, "");

            if (v == "- Frameworks used") {
                const table = document.createElement("table"),
                    cont = document.createElement("div");

                table.id = "frameworks";
                cont.id = "table-cont";

                (async () => {
                    /**
                     * @type {{ version: string, frameworks: { [key: string]: `${number}.${number}.${number}` } }[]}
                     */
                    const json = await (await fetch("frameworks.json")).json(),
                        values = Object.values(json),
                        frameworks = values
                            .map(v => Object.keys(v.frameworks))
                            .flat()
                            .map((v, i, a) => [v][+!(a.indexOf(v) == i)])
                            .filter(v => v);

                    table.appendChild(document.createElement("thead")).appendChild(document.createElement("tr")).append(
                        ...values.reverse().concat({ version: "Framework" }).reverse().map(v => {
                            const td = document.createElement("td");

                            td.textContent = v.version;
                            td.className = "td-center";
                            return td;
                        })
                    );

                    table.appendChild(document.createElement("tbody")).append(...(() => {
                        return frameworks.map((f, i) => {
                            const row = document.createElement("tr");

                            row.append(...values.reverse().concat({ frameworks: { [f]: f } }).reverse().map(v => {
                                const td = document.createElement("td");

                                td.textContent = v.frameworks[f];
                                return td;
                            }));

                            return row;
                        });
                    })());

                })();

                cont.appendChild(table);

                return [span, cont];
            }

            return span;
        }

        if (v.match(/\[.*?\] ?\(.*?\)/)) {
            const os = v.indexOf("["),
                cs = v.indexOf("]"),
                o = v.indexOf("(", cs),
                c = v.indexOf(")", o),
                href = v.slice(o + 1, c),
                textContent = v.slice(os + 1, cs),
                after = v.slice(c + 1),
                a = document.createElement("a");

            a.href = href;
            a.title = href;
            a.textContent = textContent;

            return [a, document.createTextNode(after)];
        }

        return document.createTextNode(v);
    }).map(v => [v, document.createElement("br")]).flat(2));

    doc.appendChild(p);

    document.body.appendChild(doc);
    document.getElementById("back").addEventListener("click", e => void (!e.button && window.open("../", "_self")));
})();