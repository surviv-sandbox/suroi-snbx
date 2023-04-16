const Test = (() => {
    abstract class Common {
        #name: string;
        get name() { return this.#name; }

        readonly dom: {
            readonly wrapper: HTMLDivElement,
            readonly header: HTMLDivElement,
            readonly container: HTMLDivElement,
            readonly counter: HTMLSpanElement;
        };

        #state = {
            total: 0,
            pass: 0,
            get passing() { return this.pass == this.total; }
        };
        get state() { return this.#state; }

        isAggregating = false;
        aggregate = null as unknown as Aggregate;

        isGrouping = false;
        group = null as unknown as Group;

        constructor(name: string, className: string) {
            this.#name = name;

            const counter = makeElement(
                "h3",
                {
                    className: "test-counter",
                    textContent: "0 / 0"
                }
            ),
                container = makeElement(
                    "div",
                    {
                        className: "test-body",
                    }
                ),
                header = makeElement(
                    "div",
                    {
                        className: "test-header"
                    },
                    [
                        makeElement(
                            "h2",
                            {
                                className: "test-title",
                                textContent: name
                            }
                        ),
                        counter
                    ]
                );

            this.dom = {
                wrapper: makeElement(
                    "div",
                    {
                        className: className
                    },
                    [
                        header,
                        container
                    ]
                ),
                header: header,
                container: container,
                counter: counter
            };
        }

        describe(description: string) {
            if (this.isGrouping) {
                this.group.describe(description);
            } else if (this.isAggregating) {
                this.aggregate.describe(description);
            } else {
                this.dom.container.appendChild(
                    makeElement(
                        "div",
                        {
                            className: `test-description`,
                            innerText: description
                        }
                    )
                );
            }
        }

        startAggregate(name: string) {
            if (this.isGrouping) {
                this.group.startAggregate(name);
            } else if (this.isAggregating) {
                this.aggregate.startAggregate(name);
            } else {
                this.isAggregating = true;
                this.aggregate = new Aggregate(name);
            }
        }

        updateCounter() {
            this.dom.counter.style.color = `hsl(${120 * this.state.pass / this.state.total}, 60%, 40%)`;
            this.dom.counter.innerText = `${this.state.pass} / ${this.state.total}`;
        }
    }

    class Test extends Common {
        constructor(title: string) {
            super(title, "test");

            document.body.appendChild(this.dom.wrapper);
        }

        addResult(result: boolean, errorMessage: string, caller: Function) {
            if (this.isGrouping) return this.group.addResult(result, errorMessage, caller);
            if (this.isAggregating) return this.aggregate.addResult(result, errorMessage, caller);

            result && this.state.pass++;
            this.state.total++;

            this.dom.container.appendChild(
                makeElement(
                    "div",
                    {
                        className: `test-result ${result ? "test-pass" : "test-fail"}`,
                        innerText: result ? "Pass" : `${caller!.name}:\n  ${errorMessage.replace(/\n/g, "\n  ")}`.replace(/ /g, "\u00a0")
                    }
                )
            );

            this.updateCounter();
        }

        stopAggregating() {
            if (this.isGrouping && this.group.isAggregating) {
                this.group.stopAggregating();
            } else if (this.aggregate.isAggregating) {
                this.aggregate.stopAggregating();
            } else {
                this.isAggregating = false;

                this.dom.container.appendChild(this.aggregate.dom.wrapper);
                ++this.state.total;
                if (this.aggregate.state.passing) ++this.state.pass;

                this.updateCounter();

                this.aggregate = null as any;
            }
        }

        startGroup(name: string) {
            if (this.isAggregating) {
                throw new TypeError("Cannot start a group while aggregating");
            }

            if (this.isGrouping) {
                this.group.startGroup(name);
            } else {
                this.isGrouping = true;
                this.group = new Group(name, this);
            }
        }

        endGroup() {
            if (this.isGrouping && this.group.isGrouping) {
                this.group.endGroup();
            } else {
                this.isGrouping = false;
                this.dom.container.appendChild(this.group.dom.wrapper);
                this.group = null as any;
            }
        }
    };

    class Group extends Common {
        #parent: Test;

        #hidden = false;

        constructor(name: string, parent: Test) {
            super(name, "test-group");

            this.#parent = parent;

            const fold = () => {
                this.dom.container.style.display = (this.#hidden = !this.#hidden) ? "none" : "";
            };

            this.dom.header.tabIndex = 0;
            this.dom.header.addEventListener("click", ev => {
                if (!ev.button) fold();
            });
            this.dom.header.addEventListener("keydown", ev => {
                if (ev.key == "Enter") fold();
            });
        }

        addResult(result: boolean, errorMessage: string, caller: Function): void {
            if (this.isGrouping) return this.group.addResult(result, errorMessage, caller);
            if (this.isAggregating) return this.aggregate.addResult(result, errorMessage, caller);

            if (result) {
                this.#parent.state.pass++;
                this.state.pass++;
            }
            this.#parent.state.total++;
            this.state.total++;

            this.dom.container.appendChild(
                makeElement(
                    "div",
                    {
                        className: `test-result ${result ? "test-pass" : "test-fail"}`,
                        innerText: result ? "Pass" : `${caller!.name}:\n  ${errorMessage.replace(/\n/g, "\n  ")}`.replace(/ /g, "\u00a0")
                    }
                )
            );

            this.#parent.updateCounter();
            this.updateCounter();
        }

        stopAggregating() {
            if (this.isGrouping && this.group.isAggregating) {
                this.group.stopAggregating();
            } else if (this.aggregate.isAggregating) {
                this.aggregate.stopAggregating();
            } else {
                this.isAggregating = false;

                this.dom.container.appendChild(this.aggregate.dom.wrapper);
                ++this.#parent.state.total;
                ++this.state.total;
                if (this.aggregate.state.passing) {
                    ++this.#parent.state.pass;
                    ++this.state.pass;
                }

                this.#parent.updateCounter();
                this.updateCounter();

                this.aggregate = null as any;
            }
        }

        startGroup(name: string) {
            if (this.isAggregating) {
                throw new TypeError("Cannot start a group while aggregating");
            }

            if (this.isGrouping) {
                this.group.startGroup(name);
            } else {
                this.isGrouping = true;
                this.group = new Group(name, this.#parent);
            }
        }

        endGroup() {
            if (this.isGrouping && this.group.isGrouping) {
                this.group.endGroup();
            } else {
                this.isGrouping = false;
                this.dom.container.appendChild(this.group.dom.wrapper);
                this.group = null as any;
            }
        }
    }

    class Aggregate extends Common {
        constructor(name: string) {
            super(name, "test-aggregate aggregate-pass");
        }

        addResult(result: boolean, errorMessage: string, caller: Function): void {
            if (this.isAggregating) return this.aggregate.addResult(result, errorMessage, caller);

            result && this.state.pass++;
            this.state.total++;

            if (!result) {
                this.dom.container.classList.remove("aggregate-pass");
                this.dom.container.classList.add("aggregate-fail");

                this.dom.container.appendChild(
                    makeElement(
                        "div",
                        {
                            className: "test-result test-fail",
                            innerText: `${caller!.name}:\n  ${errorMessage.replace(/\n/g, "\n  ")}`.replace(/ /g, "\u00a0")
                        }
                    )
                );
            }

            this.updateCounter();
        }

        override startAggregate(name: string) {
            if (this.isAggregating) {
                this.aggregate.startAggregate(name);
            } else {
                this.isAggregating = true;
                this.aggregate = new Aggregate(name);
            }
        }

        stopAggregating() {
            if (this.aggregate.isAggregating) {
                this.aggregate.stopAggregating();
            } else {
                this.isAggregating = false;

                this.dom.container.appendChild(this.aggregate.dom.wrapper);
                ++this.state.total;
                if (this.aggregate.state.passing) ++this.state.pass;

                this.updateCounter();

                this.aggregate = null as any;
            }
        }
    }

    class Wrapper {
        readonly #internal: Test;

        static readonly equalityFunctions: {
            arrayEquals<T>(arrayA: T[] | ReadonlyArray<T>, arrayB: T[] | ReadonlyArray<T>, elementEquality?: (a: T, b: T) => boolean): boolean;
        } = {
            arrayEquals<T>(
                arrayA: T[],
                arrayB: T[],
                elementEquality: (a: T, b: T) => boolean = (a, b) => Array.isArray(a) && Array.isArray(b) ? Wrapper.equalityFunctions.arrayEquals(a, b) : a === b
            ) {
                return arrayA.length == arrayB.length
                    && arrayA.every((e, i) => elementEquality(e, arrayB[i]));
            }
        } as const;

        constructor(name: string) {
            this.#internal = new Test(name);
        }

        #toString(value: unknown) {
            switch (value) {
                case void 0: return "undefined";
                case null: return "null";
                default: {
                    if (typeof value == "object" && "toString" in value! && typeof value!.toString == "function") {
                        try {
                            const str = value!.toString();
                            if (typeof str == "string") return str;
                        } catch { }
                    }

                    return `${value}`;
                }
            }
        }

        #getPrototypeName(object: object) {
            return Object.getPrototypeOf(object)?.constructor?.name;
        }

        assertEquals<T>(actual: T, expected: T): this;
        assertEquals<T>(actual: T, expected: T, equalityFunction: (a: T, b: T) => boolean): this;
        assertEquals<T>(actual: T, expected: T, equalityFunction?: (a: T, b: T) => boolean) {
            const res = (equalityFunction ?? ((a: T, b: T) => a === b))(actual, expected);

            this.#internal.addResult(
                res,
                `Assertion failed:\n  Received: ${this.#toString(actual)}\n  Expected: ${this.#toString(expected)}`,
                this.assertEquals
            );

            return this;
        }

        assertNotEquals<T>(actual: T, expected: T): this;
        assertNotEquals<T>(actual: T, expected: T, inequalityFunction: (a: T, b: T) => boolean): this;
        assertNotEquals<T>(actual: T, avoided: T, inequalityFunction?: (a: T, b: T) => boolean) {
            const res = (inequalityFunction ?? ((a: T, b: T) => a !== b))(actual, avoided);

            this.#internal.addResult(
                res,
                `Assertion failed:\n  Received: ${this.#toString(actual)}\n  Avoided : ${this.#toString(avoided)}`,
                this.assertNotEquals
            );

            return this;
        }

        assertTrue(value: boolean) {
            this.#internal.addResult(
                value,
                `Assertion failed:\n  Received: ${this.#toString(value)}\n  Expected: true`,
                this.assertTrue
            );

            return this;
        }

        assertFalse(value: boolean) {
            this.#internal.addResult(
                !value,
                `Assertion failed:\n  Received: ${this.#toString(value)}\n  Expected: false`,
                this.assertFalse
            );

            return this;
        }

        assertThrows(executor: () => void) {
            try {
                executor();
            } catch (e) {
                this.#internal.addResult(
                    true,
                    "",
                    this.assertThrows
                );

                return this;
            }

            this.#internal.addResult(
                false,
                `Assertion failed: \n  No error thrown\n  Expected an error`,
                this.assertThrows
            );

            return this;
        }

        assertThrowsValue(executor: () => void, errors: unknown[]): this;
        assertThrowsValue(executor: () => void, errors: unknown[], equalityFunction: (a: unknown, b: unknown) => boolean): this;
        assertThrowsValue(executor: () => void, errors: unknown[], equalityFunction?: (a: unknown, b: unknown) => boolean) {
            equalityFunction ??= (a: unknown, b: unknown) => a === b;

            const errorStr = errors.length > 1 ? `\n    ${errors.map(this.#toString).join("\n    ")}` : ` ${this.#toString(errors[0]) ?? "none"}`;

            try {
                executor();
            } catch (e) {
                this.#internal.addResult(
                    errors.some(err => equalityFunction!(err, e)),
                    `Assertion failed: \n  Error received: ${this.#toString(e)}\n  Error expected:${errorStr}`,
                    this.assertThrowsValue
                );

                return this;
            }

            this.#internal.addResult(
                false,
                `Assertion failed: \n  No error was thrown\n  Error expected:${errorStr}`,
                this.assertThrowsValue
            );

            return this;
        }

        assertThrowsInstance(executor: () => void, errors: (new (...args: any[]) => object)[]): this;
        assertThrowsInstance(executor: () => void, errors: (new (...args: any[]) => object)[], instanceCheck: (possibleInstance: unknown, prototype: new (...args: any[]) => object) => boolean): this;
        assertThrowsInstance(executor: () => void, errors: (new (...args: any[]) => object)[], instanceCheck?: (possibleInstance: unknown, prototype: new (...args: any[]) => object) => boolean) {
            instanceCheck ??= (possibleInstance: unknown, prototype: new (...args: any[]) => object) => {
                return possibleInstance !== undefined
                    && possibleInstance !== null
                    && Object.getPrototypeOf(possibleInstance) === prototype.prototype;
            };

            const errorStr = errors.length > 1 ? `\n    ${errors.map(f => f.name).join("\n    ")}` : ` ${errors[0].name ?? "none"}`;

            try {
                executor();
            } catch (e) {
                this.#internal.addResult(
                    errors.some(err => instanceCheck!(e, err)),
                    `Assertion failed: \n  Error type received: ${e === undefined || e === null ? this.#toString(e) : this.#getPrototypeName(e)}\n  Error type expected:${errorStr}`,
                    this.assertThrowsInstance
                );

                return this;
            }

            this.#internal.addResult(
                false,
                `Assertion failed: \n  No error was thrown\n  Error type expected:${errorStr}`,
                this.assertThrowsInstance
            );

            return this;
        }

        assertDoesNotThrow(executor: () => void, silent = false) {
            try {
                executor();
            } catch (e) {
                console.error(e);
                this.#internal.addResult(
                    false,
                    `Assertion failed: \n  Error type received: ${e === undefined || e === null ? this.#toString(e) : this.#getPrototypeName(e)}\n  Expected no error`,
                    this.assertDoesNotThrow
                );

                return this;
            }

            if (!silent) {
                this.#internal.addResult(
                    true,
                    "",
                    this.assertDoesNotThrow
                );
            }

            return this;
        }

        assertDoesNotThrowValue(executor: () => void, errors: unknown[]): this;
        assertDoesNotThrowValue(executor: () => void, errors: unknown[], inequalityFunction: (a: unknown, b: unknown) => boolean): this;
        assertDoesNotThrowValue(executor: () => void, errors: unknown[], inequalityFunction?: (a: unknown, b: unknown) => boolean) {
            inequalityFunction ??= (a: unknown, b: unknown) => a !== b;

            const errorStr = errors.length > 1 ? `\n    ${errors.map(this.#toString).join("\n    ")}` : ` ${this.#toString(errors[0]) ?? "none"}`;

            try {
                executor();
            } catch (e) {
                console.error(e);
                this.#internal.addResult(
                    errors.every(err => inequalityFunction!(err, e)),
                    `Assertion failed: \n  Error received: ${this.#toString(e)}\n  Error avoided :${errorStr}`,
                    this.assertDoesNotThrowValue
                );

                return this;
            }

            this.#internal.addResult(
                true,
                "",
                this.assertDoesNotThrowValue
            );

            return this;
        }

        assertDoesNotThrowInstance(executor: () => void, errors: (new (...args: any[]) => object)[]): this;
        assertDoesNotThrowInstance(executor: () => void, errors: (new (...args: any[]) => object)[], instanceCheck: (possibleInstance: unknown, prototype: new (...args: any[]) => object) => boolean): this;
        assertDoesNotThrowInstance(executor: () => void, errors: (new (...args: any[]) => object)[], instanceCheck?: (possibleInstance: unknown, prototype: new (...args: any[]) => object) => boolean) {
            instanceCheck ??= (possibleInstance: unknown, prototype: new (...args: any[]) => object) => {
                return possibleInstance === undefined
                    || possibleInstance === null
                    || Object.getPrototypeOf(possibleInstance) !== prototype.prototype;
            };

            const errorStr = errors.length > 1 ? `\n    ${errors.map(f => f.name).join("\n    ")}` : ` ${errors[0].name ?? "none"}`;

            try {
                executor();
            } catch (e) {
                console.error(e);
                this.#internal.addResult(
                    errors.some(err => instanceCheck!(e, err)),
                    `Assertion failed: \n  Error type received: ${e === undefined || e === null ? this.#toString(e) : this.#getPrototypeName(e)}\n  Error type avoided :${errorStr}`,
                    this.assertDoesNotThrowInstance
                );

                return this;
            }

            this.#internal.addResult(
                true,
                "",
                this.assertDoesNotThrowInstance
            );

            return this;
        }

        describe(description: string) {
            this.#internal.describe(description);
            return this;
        }

        startAggregate(name: string) {
            this.#internal.startAggregate(name);
            return this;
        }

        stopAggregating() {
            this.#internal.stopAggregating();
            return this;
        }

        group(name: string, cb: () => void) {
            this.#internal.startGroup(name);
            this.assertDoesNotThrow(cb, true);
            this.#internal.endGroup();
        }
    };

    return Wrapper;
})();