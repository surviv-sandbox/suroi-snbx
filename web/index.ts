gamespace.invokeWhenReady(async () => {
    function onlyOnMouseDown(cb: (this: Node, ev: MouseEvent) => void) {
        return function(this: Node, ev: MouseEvent) {
            if (!ev.button) cb.call(this, ev);
        };
    }

    document.querySelectorAll(".loading").forEach(e => e.remove());

    document.body.appendChild(
        makeElement(
            "div",
            {
                id: "main-menu-cont"
            },
            [
                await (async () => {
                    const img = makeElement(
                        "img",
                        {
                            src: "./global_assets/background.png",
                            id: "background-image"
                        }
                    );
                    document.body.appendChild(img);

                    const p = new WatchablePromise(img.decode());

                    if (p.isPending) await p.promise;

                    document.body.style.backgroundColor = "#80AF49";
                    document.body.style.overflow = "hidden";
                    document.body.scrollLeft = 0;
                    document.body.scrollTop = 0;

                    function resizeToFit() {
                        const aspectRatio = img.width / img.height;

                        if (window.innerHeight * aspectRatio >= window.innerWidth) {
                            img.style.height = "100%";
                            img.style.width = "auto";
                        } else {
                            img.style.width = "100%";
                            img.style.height = "auto";
                        }
                    }

                    window.addEventListener("resize", resizeToFit);
                    resizeToFit();

                    return img;
                })(),
                makeElement(
                    "h1",
                    {
                        id: "title",
                        textContent: "surviv"
                    },
                    [
                        makeElement(
                            "span",
                            {
                                textContent: ".io"
                            }
                        ),
                        " sandbox"
                    ]
                ),
                makeElement(
                    "div",
                    {
                        id: "main-menu-buttons"
                    },
                    [
                        makeElement(
                            "button",
                            {
                                className: "surviv-button surviv-purple-button",
                                textContent: "Play"
                            },
                            void 0,
                            {
                                click: onlyOnMouseDown(() => {
                                    gamespace.startLevel(0);
                                })
                            }
                        ),
                        makeElement(
                            "button",
                            {
                                className: "surviv-button surviv-grey-button",
                                textContent: "Attributions"
                            },
                            void 0,
                            {
                                click: onlyOnMouseDown(() => {
                                    window.open("./attributions/index.html");
                                })
                            }
                        ),
                        makeElement(
                            "button",
                            {
                                className: "surviv-button surviv-grey-button",
                                textContent: "Changelog"
                            },
                            void 0,
                            {
                                click: onlyOnMouseDown(() => {
                                    window.open("./changelog/index.html");
                                })
                            }
                        )
                    ]
                ),
                makeElement(
                    "p",
                    {
                        textContent: `version ${gamespace.VERSION}`,
                        id: "version-text"
                    }
                )
            ]
        )
    );
});