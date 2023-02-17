"use strict";

{
    type DeepPartial<T extends object> = {
        [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
    };

    type SimpleListener<T extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap> = (this: HTMLElementTagNameMap[T], ev: HTMLElementEventMap[K]) => void;

    type OptionsListener<T extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap> = {
        callback: SimpleListener<T, K>;
        options?: boolean | AddEventListenerOptions;
    };

    function makeElement<K extends keyof HTMLElementTagNameMap>(
        key: K,
        properties?: DeepPartial<HTMLElementTagNameMap[K]>,
        children?: string | Node | (string | Node)[],
        listeners?: {
            [key in keyof HTMLElementEventMap]?: SimpleListener<K, key> | OptionsListener<K, key> | (SimpleListener<K, key> | OptionsListener<K, key>)[];
        }
    ): HTMLElementTagNameMap[K] {
        type Element = HTMLElementTagNameMap[K];
        type ElementAttribute = Element[keyof Element];

        const element = document.createElement(key);

        for (const [key, value] of Object.entries(properties ?? {}) as [keyof Element, ElementAttribute][]) {
            if (typeof element[key] == "object")

                for (
                    const [
                        objKey,
                        objVal
                    ] of
                    Object.entries(value as object) as [keyof ElementAttribute, ElementAttribute[keyof ElementAttribute]][]
                )
                    element[key][objKey] = objVal;

            else element[key] = value;
        }

        children && element.append(...[children].flat().filter(v => v !== void 0));

        for (const [event, lis] of Object.entries(listeners ?? {}))
            for (const li of [lis].flat())
                (element.addEventListener as any /* forgive me for I have sinned */)(event, ...(typeof li == "function" ? [li] : [li.callback, li.options]));

        return element;
    }

    document.getElementById("back")!.addEventListener("click", e => void (!e.button && window.open("../index.html", "_self")));

    const updates = [...document.querySelectorAll("div.update")].map(update => {
        const [header, content] = [...update.children] as [HTMLDivElement, HTMLDivElement],
            [version, date] = [...header.children] as [HTMLAnchorElement, HTMLHeadingElement];

        version.id = `${version.textContent}`;
        version.innerHTML = `<a href="./index.html#${version.textContent}" class="no-style" style="color: inherit; text-decoration: none">${version.innerHTML}</a>`;

        return {
            get version() { return version; },
            get date() { return date; },
            get content() { return content; }
        } as const;
    });

    const sidebar = document.getElementById("sidebar") as HTMLElement;

    updates.forEach(u => {
        sidebar.appendChild(
            makeElement(
                "a",
                {
                    href: `./index.html#${u.version.textContent}`,
                    textContent: u.version.textContent
                }
            )
        );
    });
}