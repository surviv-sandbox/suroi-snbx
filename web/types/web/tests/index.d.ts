declare const test: {
    readonly "__#46@#internal": {
        addResult(result: boolean, errorMessage: string, caller: Function): void;
        stopAggregating(): void;
        startGroup(name: string): void;
        endGroup(): void;
        "__#44@#name": string;
        readonly name: string;
        readonly dom: {
            readonly wrapper: HTMLDivElement;
            readonly header: HTMLDivElement;
            readonly container: HTMLDivElement;
            readonly counter: HTMLSpanElement;
        };
        "__#44@#state": {
            total: number;
            pass: number;
            readonly passing: boolean;
        };
        readonly state: {
            total: number;
            pass: number;
            readonly passing: boolean;
        };
        isAggregating: boolean;
        aggregate: {
            addResult(result: boolean, errorMessage: string, caller: Function): void;
            startAggregate(name: string): void;
            stopAggregating(): void;
            "__#44@#name": string;
            readonly name: string;
            readonly dom: {
                readonly wrapper: HTMLDivElement;
                readonly header: HTMLDivElement;
                readonly container: HTMLDivElement;
                readonly counter: HTMLSpanElement;
            };
            "__#44@#state": {
                total: number;
                pass: number;
                readonly passing: boolean;
            };
            readonly state: {
                total: number;
                pass: number;
                readonly passing: boolean;
            };
            isAggregating: boolean;
            aggregate: any;
            isGrouping: boolean;
            group: {
                "__#45@#parent": any;
                "__#45@#hidden": boolean;
                addResult(result: boolean, errorMessage: string, caller: Function): void;
                stopAggregating(): void;
                startGroup(name: string): void;
                endGroup(): void;
                "__#44@#name": string;
                readonly name: string;
                readonly dom: {
                    readonly wrapper: HTMLDivElement;
                    readonly header: HTMLDivElement;
                    readonly container: HTMLDivElement;
                    readonly counter: HTMLSpanElement;
                };
                "__#44@#state": {
                    total: number;
                    pass: number;
                    readonly passing: boolean;
                };
                readonly state: {
                    total: number;
                    pass: number;
                    readonly passing: boolean;
                };
                isAggregating: boolean;
                aggregate: any;
                isGrouping: boolean;
                group: any;
                describe(description: string): void;
                startAggregate(name: string): void;
                updateCounter(): void;
            };
            describe(description: string): void;
            updateCounter(): void;
        };
        isGrouping: boolean;
        group: {
            "__#45@#parent": any;
            "__#45@#hidden": boolean;
            addResult(result: boolean, errorMessage: string, caller: Function): void;
            stopAggregating(): void;
            startGroup(name: string): void;
            endGroup(): void;
            "__#44@#name": string;
            readonly name: string;
            readonly dom: {
                readonly wrapper: HTMLDivElement;
                readonly header: HTMLDivElement;
                readonly container: HTMLDivElement;
                readonly counter: HTMLSpanElement;
            };
            "__#44@#state": {
                total: number;
                pass: number;
                readonly passing: boolean;
            };
            readonly state: {
                total: number;
                pass: number;
                readonly passing: boolean;
            };
            isAggregating: boolean;
            aggregate: any;
            isGrouping: boolean;
            group: any;
            describe(description: string): void;
            startAggregate(name: string): void;
            updateCounter(): void;
        };
        describe(description: string): void;
        startAggregate(name: string): void;
        updateCounter(): void;
    };
    "__#46@#toString"(value: unknown): string;
    "__#46@#getPrototypeName"(object: object): any;
    assertEquals<T>(actual: T, expected: T): any;
    assertEquals<T_1>(actual: T_1, expected: T_1, equalityFunction: (a: T_1, b: T_1) => boolean): any;
    assertNotEquals<T_2>(actual: T_2, expected: T_2): any;
    assertNotEquals<T_3>(actual: T_3, expected: T_3, inequalityFunction: (a: T_3, b: T_3) => boolean): any;
    assertTrue(value: boolean): any;
    assertFalse(value: boolean): any;
    assertThrows(executor: () => void): any;
    assertThrowsValue(executor: () => void, errors: unknown[]): any;
    assertThrowsValue(executor: () => void, errors: unknown[], equalityFunction: (a: unknown, b: unknown) => boolean): any;
    assertThrowsInstance(executor: () => void, errors: (new (...args: any[]) => object)[]): any;
    assertThrowsInstance(executor: () => void, errors: (new (...args: any[]) => object)[], instanceCheck: (possibleInstance: unknown, prototype: new (...args: any[]) => object) => boolean): any;
    assertDoesNotThrow(executor: () => void, silent?: boolean): any;
    assertDoesNotThrowValue(executor: () => void, errors: unknown[]): any;
    assertDoesNotThrowValue(executor: () => void, errors: unknown[], inequalityFunction: (a: unknown, b: unknown) => boolean): any;
    assertDoesNotThrowInstance(executor: () => void, errors: (new (...args: any[]) => object)[]): any;
    assertDoesNotThrowInstance(executor: () => void, errors: (new (...args: any[]) => object)[], instanceCheck: (possibleInstance: unknown, prototype: new (...args: any[]) => object) => boolean): any;
    describe(description: string): any;
    startAggregate(name: string): any;
    stopAggregating(): any;
    group(name: string, cb: () => void): void;
};
