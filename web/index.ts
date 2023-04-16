gamespace.invokeWhenReady(async () => {
    const DOMCache = {
        mainMenu: void 0 as any as HTMLDivElement
    };

    document.querySelectorAll(".loading").forEach(e => e.remove());

    function onlyOnMouseDown<E extends HTMLElement>(cb: (this: E, ev: MouseEvent) => void) {
        return function(this: E, ev: MouseEvent) {
            if (!ev.button) cb.call(this, ev);
        };
    }

    makeMainMenu();

    async function makeMainMenu() {
        document.body.style.backgroundColor = "#80AF49";
        document.body.style.overflow = "hidden";
        document.body.scrollLeft = 0;
        document.body.scrollTop = 0;

        document.body.appendChild(
            DOMCache.mainMenu ??= makeElement(
                "div",
                {
                    id: "main-menu-cont"
                },
                [
                    await (async () => {
                        const image = makeElement(
                            "img",
                            {
                                src: "./global_assets/background.png",
                                id: "background-image"
                            }
                        );

                        const promise = new WatchablePromise(image.decode());

                        if (promise.isPending) await promise.promise;

                        function resizeToFit() {
                            const aspectRatio = image.width / image.height;

                            if (window.innerHeight * aspectRatio >= window.innerWidth) {
                                image.style.height = "100%";
                                image.style.width = "auto";
                            } else {
                                image.style.width = "100%";
                                image.style.height = "auto";
                            }
                        }

                        window.addEventListener("resize", resizeToFit);
                        resizeToFit();

                        return image;
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
                                    click: onlyOnMouseDown(() => gamespace.startLevel(0))
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
                                    click: onlyOnMouseDown(() => window.open("./attributions/index.html"))
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
                                    click: onlyOnMouseDown(() => window.open("./changelog/index.html"))
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
    }
});