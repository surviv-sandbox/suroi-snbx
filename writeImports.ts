const fsp = require("fs/promises") as typeof import("fs/promises");

function prependDirName(path: string) { return `${__dirname}/${path}`; }

(async () => {
    let start = Date.now();
    const getInterval = () => Date.now() - start,
        table: { [key: string]: number; } = {},
        addToTable = (key: string) => {
            table[key] = getInterval();
            console.log(`${key}: ${getInterval()}`);
        };

    fsp.writeFile(prependDirName("./web/import.js"), "");

    addToTable("File cleared");
    const fh = await fsp.open(prependDirName("./web/import.js"), "a"),
        namespaces = (
            await fsp.readdir("web/assets", { withFileTypes: true })
        )
            .filter(v => !v.name.startsWith(".") && v.isDirectory())
            .map(v => v.name)
            .sort((a, b) => a == "srvsdbx" ? -1 : b == "srvsdbx" ? 1 : 0),
        object: {
            ammos: [string, string][],
            decals: [string, string][],
            explosions: [string, string][],
            equipment: [string, string][],
            firearms: [string, string][],
            levels: [string, string][],
            obstacles: [string, string][],
            particles: [string, string][],
            status_effects: [string, string][],
            melees: [string, string][];
        } = {
            ammos: [],
            decals: [],
            explosions: [],
            equipment: [],
            firearms: [],
            levels: [],
            obstacles: [],
            particles: [],
            status_effects: [],
            melees: [],
        },
        namespaceObjects: {
            name: string,
            count: number,
            objects: typeof object;
        }[] = [];

    const f = (ns: string) => async (path: string) => {
        try {
            return (await fsp.readdir(`web/assets/${ns}/${path}`)).filter(v => !v.startsWith(".")).map(v => [ns, v] as [string, string]);
        } catch {
            return [];
        }
    };

    let totalObjects = 0;

    addToTable("Compiling object imports");
    for (const namespace of namespaces) {
        const g = f(namespace);

        const ammos = await g("ammos"),
            decals = await g("decals"),
            explosions = await g("explosions"),
            equipment = await g("equipment"),
            firearms = await g("firearms"),
            levels = await g("levels"),
            obstacles = await g("obstacles"),
            particles = await g("particles"),
            status_effects = await g("status_effects"),
            melees = await g("melees");

        const cnt = ammos.length
            + decals.length
            + explosions.length
            + equipment.length
            + firearms.length
            + levels.length
            + obstacles.length
            + particles.length
            + status_effects.length
            + melees.length;

        totalObjects += cnt;

        namespaceObjects.push({
            name: namespace,
            count: cnt,
            objects: {
                ammos: ammos,
                decals: decals,
                explosions: explosions,
                equipment: equipment,
                firearms: firearms,
                levels: levels,
                obstacles: obstacles,
                particles: particles,
                status_effects: status_effects,
                melees: melees
            }
        });

        object.ammos.push(...ammos);
        object.decals.push(...decals);
        object.explosions.push(...explosions);
        object.equipment.push(...equipment);
        object.firearms.push(...firearms);
        object.levels.push(...levels);
        object.obstacles.push(...obstacles);
        object.particles.push(...particles);
        object.status_effects.push(...status_effects);
        object.melees.push(...melees);
    }

    const entries = Object.entries(object) as [keyof typeof object, typeof object[keyof typeof object]][];

    addToTable("Starting imports");
    const names: {
        [key in keyof typeof object]: string
    } = {
        ammos: "parseAmmoData",
        decals: "parseDecalData",
        explosions: "parseExplosionData",
        equipment: "parseEquipmentData",
        firearms: "parseGunData",
        levels: "parseLevelData",
        obstacles: "parseObstacleData",
        melees: "parseMeleeData",
        particles: "parseParticleData",
        status_effects: "parseStatusEffectData"
    };

    for (let i = 0, l = entries.length; i < l; i++) {
        const [objectType, objects] = entries[i],
            name = (i: number) => `${objectType.slice(0, -1)}${i}`;

        await fh.write(objects.map((p, i) => `import*as ${name(i)} from"./assets/${p[0]}/${objectType}/${p[1]}/export.js"`).join("\n") + "\n");
    }

    addToTable("Writing loading screen boilerplate");
    await fh.write(
        `{let s=Date.now(),c,m=new Map,n=new Map,o=new Map,d=new DocumentFragment,h,l=0,t=${totalObjects},y=[],k="loading-indicator unknown",j=makeElement,r="textContent",q="className",v="loading-obj-type",w="dataset",u="appendChild";` +
        `document.body.append(j("h1",{[r]:"Loading assets… ",[q]:"loading"},h=j("span",{[r]:\`(\${l} / ${totalObjects}, 0.00s)\`,style:{color:\`hsl(\${l/t*120},100%,50%)\`}})),` +
        `j("h2",{[r]:"This may take a while",[q]:"loading"}),c=j("div",{id: "loading-container",[q]:"loading"}));` +
        `gamespace.events.on("fragmentLoaded",(_, f)=>{let a=f.res??f.err,e=m.get(a.includePath),i="err"in f,g=n.get(a.namespace),c=o.get(\`\${a.namespace}.\${a.objectType}\`);` +
        `e&&(e.classList.add(i?"failure":"success"),e.classList.remove("unknown")),` +
        `(e||i)&&(h[r]=\`(\${++l} / ${totalObjects}, \${(Math.round(100*(Date.now()-s))/1e5).toFixed(2)}s)\`,h.style.color=\`hsl(\${l/t*120},100%,50%)\`),` +
        `(g||i)&&(g[0][r]=\`(\${++g[1]} / \${g[2]})\`,g[0].style.color=\`hsl(\${g[1]/g[2]*120},100%,50%)\`),` +
        `(c||i)&&(c[0][r]=\`(\${++c[1]} / \${c[2]})\`,c[0].style.color=\`hsl(\${c[1]/c[2]*120},100%,50%)\`),` +
        `i&&(y.push([a.internalName,a.err]))` +
        `});`
    );

    function write(namespace: typeof namespaceObjects[number]) {
        const obj = namespace.objects;
        let str: string[] = [];

        addToTable(`Writing namespace ${namespace.name} (objects)`);
        for (const [objectType, objects] of Object.entries(obj)) {
            str.push(
                `{let s,f;e[u](f=j("div",{[q]:v},j("p",{[r]:"${objectType} "},` +
                `(s=j("span",{[r]:"(0 / ${objects.length})",style:{color:\`hsl(\${l/t*120},100%,50%)\`}}),` +
                `o.set("${namespace.name}.${objectType}",[s,0,${objects.length}]),s))));`
            );

            for (const o of objects) {
                str.push(`m.set("./assets/${o[0]}/${objectType}/${o[1]}",f[u](j("div",{[q]:k,[w]:{name:"${o[0]}::${o[1]}"}})));`);
            }
            str.push("}");
        }

        return str;
    }

    for (const namespace of namespaceObjects) {
        addToTable(`Writing namespace ${namespace.name} (HTML)`);
        await fh.write(
            `{let s,e=d[u](j("div",{[q]:"loading-namespace"},j("p",{[r]:"Namespace: ${namespace.name} "},` +
            `(s=j("span",{[r]:"(0 / ${namespace.count})",style:{color:\`hsl(\${l/t*120},100%,50%)\`}}),n.set("${namespace.name}",[s,0,${namespace.count}]),s))));` +
            `${write(namespace).join("")}}`
        );
    }

    addToTable("Writing conclusion (1 / 3)");
    await fh.write(`c[u](d);{let n="namespace",i="includePath",o="objectType";await Promise.allSettled([`);

    let str: string[] = [];

    addToTable("Writing conclusion (2 / 3)");
    for (let i = 0, l = entries.length; i < l; i++) {
        const [objectType, objects] = entries[i],
            name = (i: number) => `${objectType.slice(0, -1)}${i}`;

        addToTable(`Imported ${objectType}`);
        str.push(`parseFunctions.${names[objectType]}([${objects.map((p, i) => `{...${name(i)}.default,[n]:"${p[0]}",[i]:"./assets/${p[0]}/${objectType}/${p[1]}",[o]:"${objectType}"}`).join(",")}])`);
    }

    addToTable("Writing conclusion (3 / 3)");
    await fh.write(
        `${str.join()}])};y.length?(h.parentElement.childNodes[0][r]=h.parentElement.childNodes[0][r].replace("Loading assets…","Finished loading"),document.querySelector("body h2.loading").remove(),` +
        `c[u](j("div",{id:"errors-container"},[j("h3",{[r]:"Some items failed to load properly…"}),j("ul",void 0,y.map(v=>j("li",{[r]:v[0]},` +
        `j("ul",void 0,v[1].map(w=>j("li",{[r]:w})))))),j("a",{[q]:"surviv-button surviv-purple-button",[r]:"Refresh",href:"./index.html",title:"./index.html"` +
        `})]))):gamespace.events.dispatchEvent("ready",Date.now()-s)}`
    );
    await fh.close();

    console.clear();
    console.table(table);
})();