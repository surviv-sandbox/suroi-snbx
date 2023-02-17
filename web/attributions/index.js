(async () => {
    const doc = new DocumentFragment(),
        table = document.createElement("table"),
        head = document.createElement("thead"),
        body = document.createElement("tbody");

    doc.appendChild(table).appendChild(head);
    table.id = "assets";
    table.appendChild(body);
    head.innerHTML = `<thead><tr><td><em>Asset</em></td><td><em>Source</em></td><td><em>Renamed?</em></td><td><em>Modified?</em></td></tr></thead>`;

    const attributions = (await (await fetch("attributions.txt")).text()).split("\n");

    let i = 0;
    for (const e of attributions) {
        const row = document.createElement("tr"),
            cellA = document.createElement("td"),
            cellB = document.createElement("td"),
            cellC = document.createElement("td"),
            cellD = document.createElement("td"),
            a = document.createElement("a");

        body.appendChild(row);
        try {
            cellA.textContent = e.match(/".*?"/g)[0].replace(/"/g, "");
            a.title = a.href = e.match(/\(https?:\/\/.*?\)/g)[0].replace(/\(|\)/g, "");
            a.textContent = e.match(/\[.*?\]/g)[0].replace(/\[|\]/g, "");
            cellB.appendChild(a);
            cellC.innerHTML = !!e.match(/".*?".*?\(https?:\/\/.*\) \(Renamed\)/) ? `<span class="yes">yes</span>` : `<span class="no">no</span>`;
            cellD.innerHTML = !!e.match(/".*?".*?\(https?:\/\/.*\) \(Modified\)/) ? `<span class="yes">yes</span>` : `<span class="no">no</span>`;

            row.append(cellA, cellB, cellC, cellD);
            ++i;
        } catch (e) { break; }
    }

    attributions.splice(0, i);

    const p = document.createElement("p");
    p.id = "attr";

    p.append(...attributions.map(v => {
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
                     * @type {{ links: { [key: string]: string }, versions: { version: string, frameworks: { [key: string]: `${number}.${number}.${number}` } }[] }}
                     */
                    const json = await (await fetch("frameworks.json")).json(),
                        links = json.links,
                        values = Object.values(json.versions),
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
                        values.reverse();
                        return frameworks.map(f => {
                            const row = document.createElement("tr");

                            row.append(...[{ frameworks: { [f]: f } }].concat(values).map((v, i, a) => {
                                const td = document.createElement("td"),
                                    change = (() => {
                                        if (i > 1) {
                                            /**
                                             * @type {string}
                                             */
                                            const prev = a[i - 1].frameworks[f] ?? "0.0.0",

                                                b = prev.split(/\./g),
                                                c = (v.frameworks[f] ?? "0.0.0").split(/\./g),
                                                j = b.findIndex((v, i) => v != c[i]);

                                            return { index: j, dir: Math.sign(c[j] - b[j]) };
                                        }

                                        return { index: -1, dir: 0 };
                                    })();

                                if (change.index != -1) {
                                    td.classList.add(`${{ 0: "major", 1: "minor", 2: "patch" }[change.index]}-${{ [-1]: "down", 1: "up" }[change.dir]}`);
                                }

                                if (!i) {
                                    const a = document.createElement("a");
                                    a.href = links[v.frameworks[f]];
                                    a.textContent = v.frameworks[f];
                                    td.appendChild(a);
                                } else {
                                    td.textContent = v.frameworks[f];
                                }
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
    document.getElementById("back").addEventListener("click", e => void (!e.button && window.open("../index.html", "_self")));
})();