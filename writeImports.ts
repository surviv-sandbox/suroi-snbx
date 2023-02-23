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
            firearms = await g("firearms"),
            levels = await g("levels"),
            particles = await g("particles"),
            status_effects = await g("status_effects"),
            melees = await g("melees");

        const cnt = ammos.length + decals.length + explosions.length + firearms.length + levels.length + particles.length + status_effects.length + melees.length;

        totalObjects += cnt;

        namespaceObjects.push({
            name: namespace,
            count: cnt,
            objects: {
                ammos: ammos,
                decals: decals,
                explosions: explosions,
                firearms: firearms,
                levels: levels,
                particles: particles,
                status_effects: status_effects,
                melees: melees
            }
        });

        object.ammos.push(...ammos);
        object.decals.push(...decals);
        object.explosions.push(...explosions);
        object.firearms.push(...firearms);
        object.levels.push(...levels);
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
        firearms: "parseGunData",
        levels: "parseLevelData",
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
        `{let s=Date.now(),c,m=new Map,n=new Map,o=new Map,d=new DocumentFragment,h,l=0,t=${totalObjects},y=[];` +
        `document.body.append(makeElement("h1",{textContent:"Loading assets… ",className:"loading"},h=makeElement("span",{textContent:\`(\${l} / ${totalObjects}, 0.00s)\`,style:{color:\`hsl(\${l/t*120},100%,50%)\`}})),` +
        `makeElement("h2",{textContent:"This may take a while",className:"loading"}),c=makeElement("div",{id: "loading-container",className:"loading"}));` +
        `gamespace.events.on("fragmentLoaded",(_, f)=>{let a=f.res??f.err,e=m.get(a.includePath),i="err"in f,g=n.get(a.namespace),c=o.get(\`\${a.namespace}.\${a.objectType}\`);` +
        `e&&(e.classList.add(i?"failure":"success"),e.classList.remove("unknown")),` +
        `(e||i)&&(h.textContent=\`(\${++l} / ${totalObjects}, \${(Math.round(100*(Date.now()-s))/1e5).toFixed(2)}s)\`,h.style.color=\`hsl(\${l/t*120},100%,50%)\`),` +
        `(g||i)&&(g[0].textContent=\`(\${++g[1]} / \${g[2]})\`,g[0].style.color=\`hsl(\${g[1]/g[2]*120},100%,50%)\`),` +
        `(c||i)&&(c[0].textContent=\`(\${++c[1]} / \${c[2]})\`,c[0].style.color=\`hsl(\${c[1]/c[2]*120},100%,50%)\`),` +
        `i&&(y.push([a.internalName,a.err]))` +
        `});`
    );

    function write(namespace: typeof namespaceObjects[number]) {
        const obj = namespace.objects;
        let str: string[] = [];

        addToTable(`Writing namespace ${namespace.name} (objects)`);
        for (const [objectType, objects] of Object.entries(obj)) {
            str.push(
                `{let s,f;e.appendChild(f=makeElement("div",{className:"loading-obj-type"},makeElement("p",{textContent:"${objectType} "},` +
                `(s=makeElement("span",{textContent:"(0 / ${objects.length})",style:{color:\`hsl(\${l/t*120},100%,50%)\`}}),` +
                `o.set("${namespace.name}.${objectType}",[s,0,${objects.length}]),s))));`
            );

            for (const o of objects) {
                str.push(`m.set("./assets/${o[0]}/${objectType}/${o[1]}",f.appendChild(makeElement("div",{className:"loading-indicator unknown",dataset:{name:"${o[0]}::${o[1]}"}})));`);
            }
            str.push("}");
        }

        return str;
    }

    for (const namespace of namespaceObjects) {
        addToTable(`Writing namespace ${namespace.name} (HTML)`);
        await fh.write(
            `{let s,e=d.appendChild(makeElement("div",{className:"loading-namespace"},makeElement("p",{textContent:"Namespace: ${namespace.name} "},` +
            `(s=makeElement("span",{textContent:"(0 / ${namespace.count})",style:{color:\`hsl(\${l/t*120},100%,50%)\`}}),n.set("${namespace.name}",[s,0,${namespace.count}]),s))));` +
            `${write(namespace).join("")}}`
        );
    }

    addToTable("Writing conclusion (1 / 3)");
    await fh.write("c.appendChild(d);await Promise.allSettled([");

    let str: string[] = [];

    addToTable("Writing conclusion (2 / 3)");
    for (let i = 0, l = entries.length; i < l; i++) {
        const [objectType, objects] = entries[i],
            name = (i: number) => `${objectType.slice(0, -1)}${i}`;

        addToTable(`Imported ${objectType}`);
        str.push(`parseFunctions.${names[objectType]}([${objects.map((p, i) => `{...${name(i)}.default,namespace:"${p[0]}",includePath:"./assets/${p[0]}/${objectType}/${p[1]}",objectType:"${objectType}"}`).join(",")}])`);
    }

    addToTable("Writing conclusion (3 / 3)");
    await fh.write(
        `${str.join()}]),y.length?(h.parentElement.childNodes[0].textContent=h.parentElement.childNodes[0].textContent.replace("Loading assets…","Finished loading"),document.querySelector("body h2.loading").remove(),` +
        `c.appendChild(makeElement("div",{id:"errors-container"},[makeElement("h3",{textContent:"Some items failed to load properly…"}),makeElement("ul",void 0,y.map(v=>makeElement("li",{textContent:v[0]},` +
        `makeElement("ul",void 0,v[1].map(w=>makeElement("li",{textContent:w})))))),makeElement("a",{className:"surviv-button surviv-purple-button",textContent:"Refresh",href:"./index.html",title:"./index.html"` +
        `})]))):gamespace.events.dispatchEvent("ready",Date.now()-s)}`
    );
    await fh.close();

    console.clear();
    console.table(table);
})();