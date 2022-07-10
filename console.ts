interface cslData {
    timestamp: timestamp,
    type: "log" | "important" | "warn" | "warn_severe" | "error" | "fatal_error",
    content: string | {
        main: string,
        detail: string;
    };
}

class csl {
    static #initialized = false;
    #content: cslData[] = [];
    get content() { return [...this.#content.map(v => ({ ...v }))]; }

    #opened: boolean = false;
    get opened() { return this.#opened; }

    #position: {
        x: number,
        y: number;
    } = {
            x: window.innerWidth / 4,
            y: window.innerHeight / 4
        };
    get position() { return this.#position; }

    constructor() {
        if (csl.#initialized) {
            throw new Error(`Console alrady initialized.`);
        }

        csl.#initialized = true;
        //@ts-expect-error
        (cslData as { time: timestamp, content: cslData["content"]; }[]).forEach(c => {
            const e = createCSLEntry(c.content);
            e.timestamp = c.time;
            this.#pushAndLog(e);
        });

        this.log(`Press § to toggle the console, or Escape to close it.\nUse ${!!navigator.platform.match(/mac|darwin/ig) ? "Cmd" : "Ctrl"} + K to clear it.`, true);

        //@ts-expect-error
        delete window.cslData;
    }

    open() {
        if ($("console-wrapper")) {
            this.warn("Console already open.");
            return;
        }

        this.#opened = true;

        const wrapper = makeElement("div", "console-wrapper"),
            header = makeElement("div", "console-header"),
            body = makeElement("div", "console-body");


        const pos = memoryManager.getItem("console-pos") as { x: number, y: number; };
        this.#position = {
            x: pos?.x ?? window.innerWidth / 4,
            y: pos?.y ?? window.innerHeight / 4
        };

        wrapper.style.left = `${this.#position.x}px`;
        wrapper.style.top = `${this.#position.y}px`;

        header.textContent = "Console";

        body.append(...this.content.map(c => this.#generateHTML(c)));
        wrapper.append(header, body);

        const drag = (ev: MouseEvent) => {
            const sty = getComputedStyle(wrapper),
                offsetX = parseInt(sty.left, 10) - ev.clientX,
                offsetY = parseInt(sty.top, 10) - ev.clientY;

            document.addEventListener("mouseup", function remove() {
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", remove);
            });

            const move = (e: MouseEvent) => {
                wrapper.style.left = `${this.position.x = +clamp(e.clientX + offsetX, 0, window.innerWidth - parseInt(sty.width) - 6)}px`;
                wrapper.style.top = `${this.position.y = +clamp(e.clientY + offsetY, 0, window.innerHeight - parseInt(sty.height) - 6)}px`;
                memoryManager.setItem("console-pos", this.#position);
            };

            document.addEventListener("mousemove", move);
        };

        header.addEventListener("mousedown", drag);

        document.body.appendChild(wrapper);
    }

    close() {
        this.#opened = false;
        $("console-wrapper")?.remove?.();
    }

    log(message: cslData["content"] | string, important = false) {
        const m = createCSLEntry(message, important ? "important" : "log");

        this.#pushAndLog(m);
    }

    warn(message: cslData["content"] | string, severe = false) {
        const m = createCSLEntry(message, severe ? "warn_severe" : "warn");

        this.#pushAndLog(m);
    }

    error(message: cslData["content"] | string, fatal = false) {
        const m = createCSLEntry(message, fatal ? "fatal_error" : "error");

        this.#pushAndLog(m);
    }

    clear() {
        this.#content = [];
        if (this.#opened && $("console-body")) {
            Array.from($("console-body")!.children).forEach(e => e.remove());
            [...(document.querySelector("div#menu-container button#console")?.children ?? [])].forEach(e => e.remove());
        }
    }

    #pushAndLog(message: cslData) {
        this.#content.push(message);

        if (["warn", "warn_severe", "error", "fatal_error"].includes(message.type)) {
            const csl = document.querySelector("div#menu-container button#console") as HTMLButtonElement;

            if (csl) {
                Array.from(csl.children).forEach(e => e.remove());

                const div = this.generateWarningWidget();
                div.id = "csl-marker-cont";

                if (div.children.length) {
                    csl.appendChild(div);
                }
            }
        }

        if (this.#opened) {
            $("console-body")?.appendChild?.(this.#generateHTML(message));
        }
    }

    #generateHTML(data: cslData) {
        const entry = makeElement("div", "", `console-entry console-entry-${data.type}`),
            timestamp = makeElement("div", "", "console-entry-tstp"),
            main = makeElement("div", "", "console-entry-cont");

        const d = (() => {
            const d = new Date(data.timestamp);

            return {
                hr: `${d.getHours()}`.padStart(2, "0"),
                min: `${d.getMinutes()}`.padStart(2, "0"),
                sec: `${d.getSeconds()}`.padStart(2, "0"),
                mil: `${d.getMilliseconds()}`.padStart(3, "0")
            };
        })();

        entry.append(timestamp);

        if (typeof data.content != "object" && data.content !== null) {
            main.innerText = data.content;
            entry.append(main);
        } else {
            entry.classList.add("console-entry-expand");
            const expand = makeElement("span", "", "console-detail-toggle"),
                c = data.content as { main: string, detail: string; };

            let expanded = false;

            expand.textContent = "▶";
            main.innerText = c.main;

            entry.addEventListener("click", ev => {
                if (!ev.button) {
                    if (expanded) {
                        expand.textContent = "▶";
                        main.innerText = c.main;
                    } else {
                        const s = makeElement("span");
                        s.style.fontSize = "0.8em";
                        s.innerText = c.detail;

                        main.innerText = `${c.main}\n  `;
                        expand.textContent = "▾";
                        main.appendChild(s);
                    }

                    expanded = !expanded;
                }
            });
            entry.append(expand, main);
        }

        timestamp.textContent = `${d.hr}:${d.min}:${d.sec}:${d.mil}`;

        return entry;
    }

    generateWarningWidget() {
        const div = makeElement("div");
        if (this.content.some(c => ["warn", "warn_severe", "error", "fatal_error"].includes(c.type))) {
            const warns = this.content.filter(c => c.type == "warn").length,
                severeWarns = this.content.filter(c => c.type == "warn_severe").length,
                errors = this.content.filter(c => c.type == "error").length,
                fatalErrors = this.content.filter(c => c.type == "fatal_error").length;

            div.append(
                ...[
                    { count: warns, type: "warn" },
                    { count: severeWarns, type: "swarn" },
                    { count: errors, type: "error" },
                    { count: fatalErrors, type: "ferror" }
                ].filter(v => v.count)
                    .map((v, i) => {
                        const s = makeElement("span", "", "csl-marker");

                        s.textContent = `${v.count}`;
                        s.style.backgroundImage = `url("./assets/gui/console-${v.type}-marker.png")`;
                        return s;
                    })
            );

        }
        return div;
    }
}