const test = new Test("AugmentedMap");

test.describe("Constructor does not throw")
    .assertDoesNotThrow(() => new AugmentedMap());

test.group("Initialization tests", () => {
    test.describe("Dependencies: toMap, toArray, size, entries, keys, values");
    const aug = new AugmentedMap();

    test.describe("toMap is empty")
        .assertEquals(aug.toMap().size, 0);

    test.describe("toArray is empty")
        .assertEquals(aug.toArray().length, 0);

    test.describe("size is 0")
        .assertEquals(aug.size, 0);

    test.describe("entries is empty")
        .assertEquals(
            [...aug.entries()],
            [],
            Test.equalityFunctions.arrayEquals
        );

    test.describe("keys is empty")
        .assertEquals(
            [...aug.keys()],
            [],
            Test.equalityFunctions.arrayEquals
        );

    test.describe("values is empty")
        .assertEquals(
            [...aug.values()],
            [],
            Test.equalityFunctions.arrayEquals
        );
});

test.group("set", () => {
    test.describe("Dependencies: clear, get");
    const aug = new AugmentedMap<number, number>();

    test.startAggregate("set spam");
    for (let i = 0; i < 10; i++) {
        const [key, value] = [Math.random(), Math.random()];

        aug.set(key, value);

        test.assertEquals(aug.get(key), value);
    }
    test.stopAggregating();

    aug.clear();

    test.describe("Calling set on the same key replaces the old value");
    const [key1, key2, val1, val2] = [0, 1, 2, 3];

    test.assertTrue(aug.set(key1, val1));
    test.assertTrue(aug.set(key1, val2));
    test.assertEquals(aug.get(key1), val2);
    test.assertNotEquals(aug.get(key1), val1);

    test.describe("Calling set with the same value does nothing to the collection and returns false");
    aug.clear();
    test.assertTrue(aug.set(key1, val1));
    test.assertFalse(aug.set(key2, val1));
    test.assertEquals(aug.get(key1), val1);
    test.assertFalse(aug.has(key2));
});

test.group("get", () => {
    test.describe("Dependencies: set");
    const aug = new AugmentedMap<number, number>();

    test.startAggregate("get spam");
    for (let i = 0; i < 10; i++) {
        const [key, value] = [Math.random(), Math.random()];

        aug.set(key, value);

        test.assertEquals(aug.get(key), value);
    }
    test.stopAggregating();
});

test.group("clear", () => {
    test.describe("Dependencies: toArray, set");
    const aug = new AugmentedMap<number, number>();

    while (Math.random() > 0.9)
        aug.set(Math.random(), Math.random());

    aug.clear();

    test.describe("Clearing the collection effectively reverts it to an empty one")
        .assertEquals(
            aug,
            new AugmentedMap(),
            (a, b) => Test.equalityFunctions.arrayEquals(
                a.toArray(),
                b.toArray()
            )
        );

    const aug1 = new AugmentedMap<number, number>();
    aug1.clear();
    test.describe("Clearing an empty collection does nothing")
        .assertEquals(
            aug1,
            new AugmentedMap(),
            (a, b) => Test.equalityFunctions.arrayEquals(
                a.toArray(),
                b.toArray()
            )
        );
});

test.group("delete", () => {
    test.describe("Dependencies: get, concat");
    const aug = new AugmentedMap<string, number>(),
        [keyA, valueA] = ["a", 2],
        [keyB, valueB] = ["b", 5];

    aug.concat([keyA, valueA], [keyB, valueB]);

    test.describe("delete returns true when deleting an existing key")
        .assertTrue(aug.delete(keyA));

    test.describe("delete doesn't modify any other part of the collection")
        .assertEquals(aug.get(keyB), valueB);

    test.describe("delete returns false when deleting a key with no value")
        .assertFalse(aug.delete(keyA));
});

test.group("concat", () => {
    test.describe("Dependencies: get, set, entries");
    const aug1 = new AugmentedMap<number, number>(),
        aug2 = new AugmentedMap<number, number>(),
        count = 20,
        entries = new Array<[number, number]>(count)
            .fill([0, 0])
            .map((_, i) => [i, Math.random()] as const);

    test.describe("concat appends entries that are unique and therefore returns an array of true")
        .assertEquals(
            aug1.concat(...entries),
            new Array(count).fill(true),
            Test.equalityFunctions.arrayEquals
        );

    for (const [key, value] of entries) {
        aug2.set(key, value);
    }

    test.describe("concat appends the entries to the collection in the correct order, and is equivalent to calling set on each entry")
        .assertEquals(
            aug1,
            aug2,
            (a, b) => Test.equalityFunctions.arrayEquals(
                [...a.entries()],
                [...b.entries()]
            )
        );
});

test.group("toArray", () => {
    test.describe("Dependencies: get, set, delete, keys");
    const aug = new AugmentedMap<number, number>(),
        values: number[] = [];

    test.describe("toArray returns an empty array when the collection is empty")
        .assertEquals(aug.toArray().length, 0);

    test.describe("toArray returns an array of the collection's values (insert)")
        .startAggregate("Element insertion");

    for (let i = 0; i < 20; i++) {
        let value: number;

        do {
            value = Math.random();
        } while (values.includes(value));

        aug.set(i, value);
        values.push(value);
        test.assertEquals(
            aug.toArray(),
            values,
            Test.equalityFunctions.arrayEquals
        );
    }
    test.stopAggregating();

    test.describe("toArray returns an array of the collection's values (remove)")
        .startAggregate("Element removal");

    while (aug.toArray().length) {
        const index = pickRandomInArray([...aug.keys()]),
            ele = aug.get(index)!;

        aug.delete(index);
        values.splice(values.indexOf(ele), 1);
        test.assertEquals(
            aug.toArray(),
            values,
            Test.equalityFunctions.arrayEquals
        );
    }
    test.stopAggregating();

});

test.group("toMap", () => {
    test.describe("Dependencies: set, delete");
    const aug = new AugmentedMap<number, number>(),
        values: number[] = [];

    test.describe("toMap returns an empty map when the collection is empty")
        .assertEquals(aug.toMap().size, 0);

    test.describe("tMap returns an map of the collection's values, in insertion order (insert)")
        .startAggregate("Element insertion");

    for (let i = 0; i < 20; i++) {
        let value;

        do {
            value = Math.random();
        } while (values.includes(value));

        aug.set(i, value);
        values.push(value);
        test.assertEquals(
            [...aug.toMap().entries()],
            values.map((v, i) => [i, v] as const),
            Test.equalityFunctions.arrayEquals
        );
    }
    test.stopAggregating();

    test.describe("toMap returns an map of the collection's values, in insertion order (remove)")
        .startAggregate("Element removal");

    for (let i = 19; i >= 0; i--) {
        aug.delete(i);
        values.pop();
        test.assertEquals(
            [...aug.toMap().entries()],
            values.map((v, i) => [i, v] as const),
            Test.equalityFunctions.arrayEquals
        );
    }
    test.stopAggregating();
});

test.group("forEach", () => {
    test.describe("Dependencies: set");
    const aug = new AugmentedMap<number, number>();

    let i = 0;

    aug.forEach(() => ++i);
    test.describe("An empty collection doesn't call the forEach callback")
        .assertEquals(i, 0);

    const values: number[] = [],
        visited: boolean[] = [];

    for (let i = 0; i < 20; i++) {
        let value;

        do {
            value = Math.random();
        } while (values.includes(value));

        aug.set(i, value);
        values.push(value);
        visited.push(false);
    }

    aug.forEach((_, i) => visited[i] = true);
    test.describe("forEach visits each key/value")
        .assertEquals(
            visited,
            new Array<true>(visited.length).fill(true),
            Test.equalityFunctions.arrayEquals
        );

    {
        let res = true;
        aug.forEach((e, i) => res &&= values[i] == e);
        test.describe("forEach is invoked with the correct keys/values")
            .assertTrue(res);
    }

    {
        let res = true;
        aug.forEach((e, i, c) => res &&= c == aug);
        test.describe("forEach receives the collection being iterated through as its last argument")
            .assertTrue(res);
    }

    {
        let res = true;
        aug.forEach<{ confirm(): void; }>(
            function() {
                try {
                    this.confirm();
                } catch {
                    res = false;
                }
            },
            { confirm() { res &&= true; } }
        );
        test.describe("forEach is invoked with the correct this argument")
            .assertTrue(res);
    }
});

test.group("map", () => {
    test.describe("Dependencies: set, entries");
    const aug = new AugmentedMap<number, number>();

    let i = 0;

    aug.map(() => ++i);
    test.describe("An empty collection doesn't call the map callback")
        .assertEquals(i, 0);

    const values: number[] = [],
        visited: boolean[] = [];

    for (let i = 0; i < 20; i++) {
        let value;

        do {
            value = Math.random();
        } while (values.includes(value));

        aug.set(i, value);
        values.push(value);
        visited.push(false);
    }

    aug.map((_, i) => visited[i] = true);
    test.describe("map visits each key/value")
        .assertEquals(
            visited,
            new Array<true>(visited.length).fill(true),
            Test.equalityFunctions.arrayEquals
        );

    {
        let res = true;
        aug.map((e, i) => res &&= values[i] == e);
        test.describe("map is invoked with the correct keys/values")
            .assertTrue(res);
    }

    {
        let res = true;
        aug.map((e, i, c) => res &&= c == aug);
        test.describe("map receives the collection being iterated through as its last argument")
            .assertTrue(res);
    }

    {
        let res = true;
        aug.map<void, { confirm(): void; }>(
            function() {
                try {
                    this.confirm();
                } catch {
                    res = false;
                }
            },
            { confirm() { res &&= true; } }
        );
        test.describe("map is invoked with the correct this argument")
            .assertTrue(res);
    }

    const transformer = (e: number) => 2 * e,
        aug1 = aug.map(transformer);

    test.describe("map correctly maps old values into new ones")
        .assertEquals(
            [...aug.entries()].map(([key, value]) => [key, transformer(value)]),
            [...aug1.entries()],
            Test.equalityFunctions.arrayEquals
        );
});

test.group("filter", () => {
    test.describe("Dependencies: set, entries");
    const aug = new AugmentedMap<number, number>();

    let i = 0;

    aug.filter(() => ++i);
    test.describe("An empty collection doesn't call the filter callback")
        .assertEquals(i, 0);

    const values: number[] = [],
        visited: boolean[] = [];

    for (let i = 0; i < 20; i++) {
        let value;

        do {
            value = Math.random();
        } while (values.includes(value));

        aug.set(i, value);
        values.push(value);
        visited.push(false);
    }

    aug.filter((_, i) => visited[i] = true);
    test.describe("filter visits each key/value")
        .assertEquals(
            visited,
            new Array<true>(visited.length).fill(true),
            Test.equalityFunctions.arrayEquals
        );

    {
        let res = true;
        aug.filter((e, i) => res &&= values[i] == e);
        test.describe("filter is invoked with the correct keys/values")
            .assertTrue(res);
    }

    {
        let res = true;
        aug.filter((e, i, c) => res &&= c == aug);
        test.describe("filter receives the collection being iterated through as its last argument")
            .assertTrue(res);
    }

    {
        let res = true;
        aug.filter<{ confirm(): void; }>(
            function() {
                try {
                    this.confirm();
                } catch {
                    res = false;
                }
            },
            { confirm() { res &&= true; } }
        );
        test.describe("filter is invoked with the correct this argument")
            .assertTrue(res);
    }

    const filter = (e: number) => e > 0.5,
        aug1 = aug.filter(filter);

    test.describe("filter correctly filters old values into new ones")
        .assertEquals(
            [...aug.entries()].filter(([, value]) => filter(value)),
            [...aug1.entries()],
            Test.equalityFunctions.arrayEquals
        );
});

test.group("sort", () => {
    test.describe("Dependencies: set, values");
    const aug = new AugmentedMap<number, number>();

    let i = 0;

    aug.sort(() => ++i);
    test.describe("An empty collection doesn't call the sort callback")
        .assertEquals(i, 0);

    const values: number[] = [],
        visited: Map<number, boolean> = new Map;

    for (let i = 0; i < 20; i++) {
        let value;

        do {
            value = Math.random();
        } while (values.includes(value));

        aug.set(i, value);
        values.push(value);
        visited.set(value, false);
    }

    aug.sort((a, b) => {
        visited.set(a, true);
        visited.set(b, true);
        return 0;
    });
    test.describe("sort visits each key/value")
        .assertEquals(
            [...visited.values()],
            new Array<true>(visited.size).fill(true),
            Test.equalityFunctions.arrayEquals
        );

    const sort = (a: number, b: number) => a - b,
        aug1 = aug.sort(sort);

    test.describe("sort correctly sorts this collection's values")
        .assertEquals(
            [...aug.values()].sort(sort),
            aug1,
            Test.equalityFunctions.arrayEquals
        );
});

test.group("findEntry", () => {
    test.describe("Dependencies: set");
    const aug = new AugmentedMap<number, number>();

    let i = 0;
    aug.findEntry(() => ++i);
    test.describe("findEntry on empty collection doesn't call predicate")
        .assertEquals(i, 0);

    test.describe("findEntry on empty collection returns undefined")
        .assertEquals(aug.findEntry(() => true), void 0);

    const entries: [number, number][] = [];

    for (let i = 0; i < 10; i++) {
        let entry: [number, number];

        do {
            entry = [Math.random(), Math.random()];
        } while (entries.some(e => e[0] === entry[0] && e[1] === entry[1]));

        aug.set(entry[0], entry[1]);
        entries.push(entry);
    }

    {
        let res = true;
        aug.findEntry((v, k, c) => {
            res &&= c == aug;
        });
        test.describe("findEntry receives the collection being iterated through as its last argument")
            .assertTrue(res);
    }

    test.describe("Each entry within the collection can be found by value")
        .startAggregate("By value");
    for (const [key, value] of entries) {
        test.assertEquals(
            aug.findEntry(v => v == value)!,
            [key, value],
            Test.equalityFunctions.arrayEquals
        );
    }
    test.stopAggregating();

    test.describe("Each entry within the collection can be found by key")
        .startAggregate("By key");
    for (const [key, value] of entries) {
        test.assertEquals(
            aug.findEntry((_, k) => k == key)!,
            [key, value],
            Test.equalityFunctions.arrayEquals
        );
    }
    test.stopAggregating();

    test.describe("findEntry returns undefined if no entry matches the predicate")
        .assertEquals(
            aug.findEntry(() => false),
            void 0,
        );

    let j = 0;
    aug.findEntry(() => (++j, true));
    test.describe("findEntry returns a value as soon as the predicate returns true")
        .assertEquals(j, 1);
});

test.group("find", () => {
    test.describe("Dependencies: set");
    const aug = new AugmentedMap<number, number>();

    let i = 0;
    aug.find(() => ++i);
    test.describe("find on empty collection doesn't call predicate")
        .assertEquals(i, 0);

    test.describe("find on empty collection returns undefined")
        .assertEquals(aug.find(() => true), void 0);

    const entries: [number, number][] = [];

    for (let i = 0; i < 10; i++) {
        let entry: [number, number];

        do {
            entry = [Math.random(), Math.random()];
        } while (entries.some(e => e[0] === entry[0] && e[1] === entry[1]));

        aug.set(entry[0], entry[1]);
        entries.push(entry);
    }

    {
        let res = true;
        aug.find((v, k, c) => {
            res &&= c == aug;
        });
        test.describe("find receives the collection being iterated through as its last argument")
            .assertTrue(res);
    }

    test.describe("Each entry within the collection can be found by value")
        .startAggregate("By value");
    for (const [key, value] of entries) {
        test.assertEquals(
            aug.find(v => v == value)!,
            value
        );
    }
    test.stopAggregating();

    test.describe("Each entry within the collection can be found by key")
        .startAggregate("By key");
    for (const [key, value] of entries) {
        test.assertEquals(
            aug.find((_, k) => k == key)!,
            value
        );
    }
    test.stopAggregating();

    test.describe("find returns undefined if no entry matches the predicate")
        .assertEquals(
            aug.find(() => false),
            void 0
        );

    let j = 0;
    aug.find(() => (++j, true));
    test.describe("find returns a value as soon as the predicate returns true")
        .assertEquals(j, 1);
});

test.group("some", () => {
    test.describe("Dependencies: set");
    const aug = new AugmentedMap<number, number>();

    let i = 0;
    aug.some(() => ++i);
    test.describe("some on empty collection doesn't call predicate")
        .assertEquals(i, 0);

    test.describe("some on empty collection returns false")
        .assertEquals(aug.some(() => true), false);

    const entries: [number, number][] = [];

    for (let i = 0; i < 10; i++) {
        aug.set(i, i);
        entries.push([i, i]);
    }

    {
        let res = true;
        aug.some((v, k, c) => {
            res &&= c == aug;
        });
        test.describe("some receives the collection being iterated through as its last argument")
            .assertTrue(res);
    }

    test.describe("some returns false if every invocation of the predicate returns false")
        .assertFalse(aug.some(() => false));

    let j = 0;
    test.describe("some returns true if any invocation of the predicate returns true")
        .assertTrue(aug.some(() => ++j > 2));

    let k = 0;
    aug.some(() => (++k, true));
    test.describe("some exits as soon as the predicate returns true")
        .assertEquals(k, 1);
});

test.group("every", () => {
    test.describe("Dependencies: set");
    const aug = new AugmentedMap<number, number>();

    let i = 0;
    aug.every(() => ++i);
    test.describe("every on empty collection doesn't call predicate")
        .assertEquals(i, 0);

    test.describe("every on empty collection returns true")
        .assertTrue(aug.every(() => true));

    const entries: [number, number][] = [];

    for (let i = 0; i < 10; i++) {
        aug.set(i, i);
        entries.push([i, i]);
    }

    {
        let res = true;
        aug.every((v, k, c) => {
            res &&= c == aug;
        });
        test.describe("every receives the collection being iterated through as its last argument")
            .assertTrue(res);
    }

    test.describe("every returns true if every invocation of the predicate returns true")
        .assertTrue(aug.every(() => true));

    let j = 0;
    test.describe("every returns false if any invocation of the predicate returns false")
        .assertFalse(aug.every(() => ++j < 2));

    let k = 0;
    aug.every(() => (++k, false));
    test.describe("every exits as soon as the predicate returns false")
        .assertEquals(k, 1);
});

test.group("has", () => {
    test.describe("Dependencies: concat");
    const aug = new AugmentedMap<number, number>(),
        count = 20;

    test.describe("has returns false on an empty collection")
        .assertFalse(aug.has(0));

    aug.concat(...new Array<[number, number]>(count).fill([0, 0]).map((_, i) => [i, i] as const));

    test.describe("Every key inserted in the collection can be found using has");
    test.startAggregate("Valid keys");
    for (let i = 0; i < count; i++) {
        test.assertTrue(aug.has(i));
    }
    test.stopAggregating();

    test.describe("Keys not in the collection return false");
    test.startAggregate("Invalid keys");
    for (let i = -count; i < 2 * count; i++) {
        if (0 <= i && i < count) continue;

        test.assertFalse(aug.has(i));
    }
    test.stopAggregating();
});

test.group("includes", () => {
    test.describe("Dependencies: concat");
    const aug = new AugmentedMap<number, number>(),
        count = 20;

    test.describe("includes returns false on an empty collection")
        .assertFalse(aug.includes(0));

    aug.concat(...new Array<[number, number]>(count).fill([0, 0]).map((_, i) => [i, i] as const));

    test.describe("Every values inserted in the collection can be found using includes");
    test.startAggregate("Valid values");
    for (let i = 0; i < count; i++) {
        test.assertTrue(aug.includes(i));
    }
    test.stopAggregating();

    test.describe("Values not in the collection return false");
    test.startAggregate("Invalid values");
    for (let i = -count; i < 2 * count; i++) {
        if (0 <= i && i < count) continue;

        test.assertFalse(aug.includes(i));
    }
    test.stopAggregating();
});

test.group("reduce", () => {
    test.describe("Dependencies: concat, values");
    const aug = new AugmentedMap<number, number>(),
        count = 20;

    test.describe("reduce throws an error on an empty collection with no default value")
        .assertThrowsInstance(() => aug.reduce(() => 0), [srvsdbx_Errors.IllegalOperation]);

    {
        let r = 1;
        test.describe("reduce returns the default value when called on an empty collection with a default value")
            .assertDoesNotThrow(() => r = aug.reduce(() => 0, -1))
            .assertEquals(r, -1);
    }

    {
        let i = 0;
        test.describe("reduce doesn't call the reducer when passed an empty collection")
            .assertDoesNotThrow(() => aug.reduce(() => ++i, -1))
            .assertEquals(i, 0);
    }

    aug.concat(...new Array<[number, number]>(count).fill([0, 0]).map((_, i) => [i + 1, i + 1] as const));

    {
        let res = true;
        aug.reduce(
            (acc, cur, key, col) => {
                res &&= col == aug;
                return 0;
            },
            0
        );
        test.describe("reduce receives the collection being iterated through as its last argument")
            .assertTrue(res);
    }

    const reducer = (acc: number, cur: number) => acc + cur;
    test.describe("reduce correctly reduces the collection")
        .assertEquals(
            aug.reduce(reducer),
            [...aug.values()].reduce(reducer)
        );
});

test.group("entries", () => {
    test.describe("Dependencies: concat");
    const aug = new AugmentedMap<number, number>(),
        count = 20,
        entries = new Array<[number, number]>(count)
            .fill([0, 0])
            .map((_, i) => [i, Math.random()] as const);

    test.describe("entries returns an empty iterator when called on an empty collection")
        .assertEquals([...aug.entries()].length, 0);

    aug.concat(...entries);

    test.describe("entries returns the collection's entries")
        .assertEquals(
            [...aug.entries()],
            entries,
            Test.equalityFunctions.arrayEquals
        );
});

test.group("keys", () => {
    test.describe("Dependencies: concat");
    const aug = new AugmentedMap<number, number>(),
        count = 20,
        entries = new Array<[number, number]>(count)
            .fill([0, 0])
            .map((_, i) => [i, Math.random()] as const);

    test.describe("keys returns an empty iterator when called on an empty collection")
        .assertEquals([...aug.keys()].length, 0);

    aug.concat(...entries);

    test.describe("keys returns the collection's keys")
        .assertEquals(
            [...aug.keys()],
            entries.map(([key]) => key),
            Test.equalityFunctions.arrayEquals
        );
});

test.group("values", () => {
    test.describe("Dependencies: concat");
    const aug = new AugmentedMap<number, number>(),
        count = 20,
        entries = new Array<[number, number]>(count)
            .fill([0, 0])
            .map((_, i) => [i, Math.random()] as const);

    test.describe("values returns an empty iterator when called on an empty collection")
        .assertEquals([...aug.values()].length, 0);

    aug.concat(...entries);

    test.describe("values returns the collection's values")
        .assertEquals(
            [...aug.values()],
            entries.map(([, value]) => value),
            Test.equalityFunctions.arrayEquals
        );
});

test.group("Symbol.iterator", () => {
    test.describe("Dependencies: concat, toMap");
    const aug = new AugmentedMap<number, number>(),
        map = new Map<number, number>(),
        count = 20,
        entries = new Array<[number, number]>(count)
            .fill([0, 0])
            .map((_, i) => [i, Math.random()] as const);

    aug.concat(...entries);
    for (const [key, value] of entries) {
        map.set(key, value);
    }

    test.describe("Symbol.iterator returns the same iterator as that of a regular Map with identical entries")
        .assertEquals(
            [...aug[Symbol.iterator]()],
            [...map[Symbol.iterator]()],
            Test.equalityFunctions.arrayEquals
        );
});