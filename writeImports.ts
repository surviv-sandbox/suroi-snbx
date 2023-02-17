const fs = require("fs") as typeof import("fs"),
    fsp = require("fs/promises") as typeof import("fs/promises");

function prependDirName(path: string) { return `${__dirname}/${path}`; }


(async () => {
    let start = Date.now();
    const getInterval = () => Date.now() - start,
        table: { [key: string]: number; } = {},
        addToTable = (key: string) => {
            table[key] = getInterval();
            console.log(`${key}: ${getInterval()}`);
        };

    fs.writeFileSync(prependDirName("./web/import.js"), "");

    addToTable("File cleared");
    const fh = await fsp.open(prependDirName("./web/import.js"), "a"),
        namespaces = (await fsp.readdir("web/assets")).filter(v => !v.startsWith(".")),
        object: {
            ammos: [string, string][],
            decals: [string, string][],
            explosions: [string, string][],
            firearms: [string, string][],
            levels: [string, string][],
            particles: [string, string][],
            status_effects: [string, string][],
            melees: [string, string][];
        } = {
            ammos: [],
            decals: [],
            explosions: [],
            firearms: [],
            levels: [],
            particles: [],
            status_effects: [],
            melees: [],
        };

    const f = (ns: string) => async (path: string) => (await fsp.readdir(`web/assets/${ns}/${path}`)).filter(v => !v.startsWith(".")).map(v => [ns, v] as [string, string]);

    addToTable("Compiling object imports");
    for (const namespace of namespaces) {
        const g = f(namespace);

        object.ammos.push(...(await g(`ammos`)));
        object.decals.push(...(await g(`decals`)));
        object.explosions.push(...(await g(`explosions`)));
        object.firearms.push(...(await g(`firearms`)));
        object.levels.push(...(await g(`levels`)));
        object.particles.push(...(await g(`particles`)));
        object.status_effects.push(...(await g(`status_effects`)));
        object.melees.push(...(await g(`melees`)));
    }

    const entries = Object.entries(object) as [keyof typeof object, typeof object[keyof typeof object]][];

    let str: string[] = [];

    addToTable("Starting imports");
    const determineNamespaceName = (name: string) => name == "default" ? "srvsdbx" : name;

    const names: {
        [key in keyof typeof object]: string
    } = {
        ammos: "parseAmmoData",
        decals: "parseDecalData",
        explosions: "parseExplosionData",
        firearms: "parseGunData",
        levels: "",
        melees: "parseMeleeData",
        particles: "parseParticleData",
        status_effects: "parseStatusEffectData"
    };

    for (let i = 0, l = entries.length; i < l; i++) {
        const [objectType, objects] = entries[i],
            name = (i: number) => `${objectType.slice(0, -1)}${i}`;

        await fh.write(objects.map((p, i) => `import*as ${name(i)} from"./assets/${p[0]}/${objectType}/${p[1]}/export.js"`).join("\n") + "\n");

        const args = `([${objects.map((p, i) => `{...${name(i)}.default,namespace:"${determineNamespaceName(p[0])}",includePath:"./assets/${p[0]}/${objectType}/${p[1]}"}`).join(",")}])`;

        if (objectType == "levels") {
            addToTable("Imported levels");
            str.push(`gamespace.levels.push(${objects.map((p, i) => `${name(i)}.default`).join(",")})`);
        } else {
            addToTable(`Imported ${objectType}`);
            str.push(`parseFunctions.${names[objectType]}${args}`);
        }
    }

    addToTable("Writing preface");
    await fh.write("{const s=Date.now();");

    await fh.write(`await Promise.allSettled([${[str.join(",")]}]);`);
    addToTable("Wrote all imports");

    await fh.write(`gamespace.events.dispatchEvent("ready",Date.now()-s)}`);
    addToTable("Wrote conclusion");

    await fh.close();
    addToTable("WriteStream closed successfully");

    addToTable("Finished");

    console.clear();
    console.table(table);
})();