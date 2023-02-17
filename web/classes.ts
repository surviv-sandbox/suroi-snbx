/**
 * The types of events `Generic`s receives by default
 */
type BaseGenericEvents = {
    /**
     * Represents a collision
     */
    collision: {
        /**
         * The actual `CollisionEvent` instance
         */
        event: CollisionEvent,
        /**
         * The `Generic` this object has collided with
         */
        args: [Generic];
    };
};

/**
 * Represents a basic game object
 * @abstract This class cannot exist alone
 * @template E The types of events this generic receives
 */
abstract class Generic<E extends BaseGenericEvents = BaseGenericEvents> implements Destroyable {
    /**
     * A reference to the matter.js body this object contains
     */
    #body: Matter.Body;
    /**
     * A reference to the matter.js body this object contains
     */
    get body() { return this.#body; }
    protected set body(b) {
        this.#body = b;
    }

    /**
     * Whether or not this object can currently be collided with
     */
    collidable = true;

    /**
     * A map to collect velocities acting upon this object; these are then compiled into one net velocity each physics tick
     */
    readonly #velocityMap = new ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>(
        (acc, cur) => acc.plus(cur),
        srvsdbx_Geometry.Vector3D.zeroVec()
    );
    /**
     * A map to collect velocities acting upon this object; these are then compiled into one net velocity each physics tick
     */
    get velocityMap() { return this.#velocityMap; }

    /**
     * A map to collect angular velocities acting upon this object; these are then compiled into one net angular velocity each physics tick
     */
    readonly #angularVelocityMap = new ReducibleMap<string, number>((acc, cur) => acc + cur, 0);
    /**
     * A map to collect angular velocities acting upon this object; these are then compiled into one net angular velocity each physics tick
     */
    get angularVelocityMap() { return this.#angularVelocityMap; }

    /**
     * This game object's orientation. **Does not affect its hitbox.**
     */
    #angle = 0;
    /**
     * This game object's orientation. **Does not affect its hitbox.**
     *
     * `get`: Gets this object's location
     *
     * `set`: Sets this object's angle to the provided value if it is not `NaN`
     */
    get angle() { return this.#angle; }
    set angle(v) {
        if (!Number.isNaN(v)) {
            Matter.Body.setAngle(this.#body, this.#angle = v);
        };
    }

    /**
     * This object's z position
     */
    #layer = 0;
    /**
     * This object's z position
     *
     * `get`: This object's position
     *
     * `set`: If the provided value isn't `NaN`, changes this object's z position
     */
    get layer() { return this.#layer; }
    set layer(v) { !Number.isNaN(v) && (this.#layer = v); }

    /**
     * This objet's position in 3D space
     */
    get position() { return { x: this.#body.position.x, y: this.#body.position.y, z: this.layer } as srvsdbx_Geometry.Point3D; }

    /**
     * The color to fill this object with
     */
    fillColor: string;
    /**
     * The color to stroke this shape with
     */
    strokeColor: string;

    /**
     * A user-defined function for drawing this object
     */
    readonly #draw: (p5: import("p5")) => void;

    /**
     * An event target on which listeners can be added
     */
    readonly #events = new SandboxEventTarget<E>;
    /**
     * An event target on which listeners can be added
     */
    get events() { return this.#events; }

    /**
     * Whether or not this Generic has been destroyed (and by extension, whether or not it's safe to call `.update` or `.draw` on it)
     */
    #destroyed = false;
    /**
     * Whether or not this Generic has been destroyed (and by extension, whether or not it's safe to call `.update` or `.draw` on it)
     */
    get destroyed() { return this.#destroyed; }

    /**
     * This generic's id
     */
    readonly #id = generateId();
    /**
     * This generic's id
     */
    get id() { return this.#id; }

    /**
     * The `Generic` to which this object is locked via `follow`
     */
    #parent: srvsdbx_ErrorHandling.Maybe<Generic> = srvsdbx_ErrorHandling.Nothing;
    /**
     * The `Generic` to which this object is locked via `follow`
     */
    get parent() { return this.#parent; }

    /**
     * The offset at which this object will follow its parent, relative to the parent's position
     * - `x`: The offset to apply along the x-axis
     * - `y`: The offset to apply along the y-axis
     * - `z`: The offset to apply along the z-axis
     * - `parr`: The offset to apply along the axis parallel to the parent's orientation
     * - `perp`: The offset to apply along the axis perpendicular to the parent's orientation
     */
    #followOffset: { x: number, y: number, z: number, parr: number, perp: number; } = { x: 0, y: 0, z: 0, parr: 0, perp: 0 };
    /**
     * The offset at which this object will follow its parent, relative to the parent's position
     * - `x`: The offset to apply along the x-axis
     * - `y`: The offset to apply along the y-axis
     * - `z`: The offset to apply along the z-axis
     * - `parr`: The offset to apply along the axis parallel to the parent's orientation
     * - `perp`: The offset to apply along the axis perpendicular to the parent's orientation
     */
    get followOffset() { return this.#followOffset; }

    /**
     * A Map whose values are `Generic`s following this object and whose keys are their corresponding `id`s
     */
    readonly #followers: Map<number, Generic> = new Map;
    /**
     * A Map whose values are `Generic`s following this object and whose keys are their corresponding `id`s
     */
    get followers() { return this.#followers; }

    /**
     * `* It's a constructor. It constructs.`
     * @param body The matter.js body this object will use
     * @param drawFunction A function that'll be invoked in order to draw this object
     * @param position A `Point2D` object dictating this object's starting position
     * @param fillColor Optionally specify this projectile's fill color
     * @param strokeColor Optionally specify this projectile's stroke color
     */
    constructor(body: Matter.Body, drawFunction: (p5: import("p5")) => void, position: srvsdbx_Geometry.Point2D | srvsdbx_Geometry.Point3D, fillColor?: string, strokeColor?: string, angle = 0) {
        if (new.target === Generic) throw new TypeError("Cannot instantiate abstract class 'Generic'.");

        this.#body = body;
        Matter.Body.setPosition(body, position);
        Matter.Body.setAngle(body, angle);

        if ("z" in position) this.layer = position.z;

        this.#draw = drawFunction;

        this.fillColor = fillColor ?? "";
        this.strokeColor = strokeColor ?? "";

        this.#angle = srvsdbx_Math.normalizeAngle(angle, "radians");
    }

    /**
     * A generic method for drawing polygons. Uses `fillColor` and `strokeColor`.
     * @param p5 The gamespace's p5 instance
     */
    static drawPolygon(this: Generic, p5: import("p5")) {
        const bd = this.body;

        p5.push();

        this.strokeColor ? p5.stroke(this.strokeColor) : p5.noStroke();
        this.fillColor ? p5.fill(this.fillColor) : p5.noFill();

        function drawShape(mode?: "close") {
            p5.beginShape();

            for (let i = 0, vertices = bd.vertices, l = vertices.length; i < l; i++)
                p5.vertex(vertices[i].x, vertices[i].y);

            p5.endShape(mode);
        }

        drawShape();

        gamespace.drawDebug(
            p5,
            this.collidable ? "COLLIDABLE" : "DEFAULT",
            () => drawShape("close"),
            void 0,
            this
        );

        p5.pop();
    }

    /**
     * A generic method for drawing circles. Uses `fillColor` and `strokeColor`
     * @param p5 The gamespace's p5 instance
     */
    static drawCircle(this: Generic, p5: import("p5")) {
        const body = this.body,
            radius = body.circleRadius!;

        p5.push();

        this.strokeColor ? p5.stroke(this.strokeColor) : p5.noStroke();
        this.fillColor ? p5.fill(this.fillColor) : p5.noFill();

        p5.circle(0, 0, 2 * radius);

        p5.pop();

        gamespace.drawDebug(
            p5,
            this.collidable ? "COLLIDABLE" : "DEFAULT",
            () => p5.circle(0, 0, 2 * radius),
            void 0,
            this
        );
    }

    /**
     * Modifies this object's position in accordance to its velocities
     */
    update() {
        if (this.#destroyed || this.#parent) return;

        const body = this.#body,
            deltaTime = gamespace.currentUpdate - gamespace.lastUpdate,
            velocity = this.compileVelocities();

        this.setPosition({
            x: body.position.x + velocity.x * deltaTime,
            y: body.position.y + velocity.y * deltaTime
        });

        this.angle += srvsdbx_Math.normalizeAngle(deltaTime * this.compileAngularVelocities() / 1000, "radians");

        this.layer += velocity.z * deltaTime;

        for (const [_, follower] of this.#followers) {
            if (follower.#destroyed) return;

            const pos = srvsdbx_Geometry.Vector3D.fromPoint3D({ x: body.position.x, y: body.position.y, z: this.#layer })
                .plus(follower.#followOffset, true)
                .plus(srvsdbx_Geometry.Vector2D.fromPolarToVec(this.#angle - Math.PI / 2, follower.#followOffset.parr).toPoint3D(), true)
                .plus(srvsdbx_Geometry.Vector2D.fromPolarToVec(this.#angle, follower.#followOffset.perp).toPoint3D(), true);

            follower.setPosition(pos);
            follower.angle = this.#angle;
            follower.#layer = pos.z;
        }
    }

    /**
     * Sets this generic's position instantly
     * @param position The position to place this object at
     */
    setPosition(position: srvsdbx_Geometry.Point2D) {
        Matter.Body.setPosition(this.body, {
            x: position.x,
            y: position.y
        });
    }

    /**
     * Calls the user-defined drawing function in order to draw this object
     * @param p5 The gamespace's p5 instance
     */
    draw(p5: import("p5")) {
        if (this.destroyed) return;

        this.#draw.call(this, p5);
    }

    /**
     * Clears any object attributes from this instance to encourage the GC to clean up
     *
     * It also removes this body from the active `Matter.World` instance and from the appropriate `gamespace.objects` collection
     */
    destroy() {
        this.#destroyed = true;

        // The body shouldn't be removed before this point
        try {
            Matter.World.remove(gamespace.world!, this.#body);
        } catch (_) { }

        for (const [_, follower] of this.#followers)
            follower.unfollow();

        this.unfollow();
        gamespace.objects.obstacles.delete(this.#id);
        //@ts-expect-error
        this.#draw = this.#body = this.#events = this.#velocityMap = this.#followOffset = this.#followers = this.#parent = void 0;
    }

    /**
     * Uses the various velocities currently applied to this object (through `velocityMap`) to determine a net velocity
     *
     * Does not take the time since the last physics update into account.
     */
    compileVelocities() {
        return this.#velocityMap.reduced;
    }

    /**
     * Uses the various angular velocities currently applied to this object (through `angVelocityMap`) to determine a net angular velocity
     *
     * Does not take the time since the last physics update into account.
     */
    compileAngularVelocities() {
        return this.#angularVelocityMap.reduced;
    }

    /**
     * Locks this object's position to that of another's, plus an offset.
     * If it is already following another object, that connection will be severed.
     *
     * While following an object, this object's velocity calculations will be suspended.
     * However, angular calculations will not.
     *
     * Passing this object to itself (`generic.follow(generic)`) does nothing.
     *
     * @param obj The object to which this object will be locked
     * @param offset An offset to apply to the lock, relative to the parent
     * - `x`: The offset to apply along the x-axis
     * - `y`: The offset to apply along the y-axis
     * - `z`: The offset to apply along the z-axis
     * - `parr`: The offset to apply along the axis parallel to the parent's orientation
     * - `perp`: The offset to apply along the axis perpendicular to the parent's orientation
     */
    follow(obj: Generic, offset?: { x: number, y: number, z: number, parr: number, perp: number; }) {
        if (obj == this as unknown as Generic) return;

        this.#parent?.followers.delete(this.#id);
        obj.#followers.set(obj.#id, this as unknown as Generic);
        this.#parent = obj;

        offset ??= { x: 0, y: 0, z: 0, parr: 0, perp: 0 };

        this.#followOffset = {
            x: offset.x,
            y: offset.y,
            z: offset.z,
            parr: offset.parr,
            perp: offset.perp
        };
    }

    /**
     * Removes this object's bondage to another
     */
    unfollow() {
        this.#parent?.followers?.delete?.(this.#id);
        this.#parent = srvsdbx_ErrorHandling.Nothing;
    }
}

/**
 * Represents an imported level
 */
interface Level {
    /**
     * Information about the world this level creates
     */
    readonly world: {
        /**
         * The world's width
         */
        readonly width: number,
        /**
         * The world's height
         */
        readonly height: number,
        /**
         * The ground's color
         */
        readonly color: string,
        /**
         * The color of the overlayed grid lines
         */
        readonly gridColor: string;
    };
    initializer(): void;
}

/**
 * The most generalized expression of an object stored by the game
 */
type GameObject = Generic | Decal | Explosion | Projectile;

/**
 * A central object consolidating classes and the game's global state
 */
const gamespace = new (createSingleton(class Gamespace {
    /**
     * The default radius for a player, in pixels
     */
    get PLAYER_SIZE() { return 50; }

    /**
     * The position of the camera
     */
    #cameraPosition: srvsdbx_Geometry.Point2D = srvsdbx_Geometry.Vector2D.zeroPt();
    /**
     * A copy of the camera's position
     */
    get cameraPosition() {
        return {
            x: this.#cameraPosition.x,
            y: this.#cameraPosition.y,
        };
    }

    /**
     * A reference to the level currently being played
     */
    #currentLevel: Level | undefined;
    /**
     * A reference to the level currently being played
     */
    get currentLevel() { return this.#currentLevel; }

    /**
     * Returns the timestamp of the current tick. Ensures that long updates are consistent.
     */
    #currentUpdate = Date.now();
    /**
     * Returns the timestamp of the current tick. Ensures that long updates are consistent.
     */
    get currentUpdate() { return this.#currentUpdate; }

    /**
     * A reference to the Matter.js Engine object belonging to the current level
     */
    #engine: Matter.Engine | undefined;
    /**
     * A reference to the Matter.js Engine object belonging to the current level
     */
    get engine() { return this.#engine; }

    /**
     * An event target on which listeners can be added
     */
    readonly #events = new SandboxEventTarget<{
        ready: {
            event: Event,
            args: [number];
        };
    }>;
    /**
     * An event target on which listeners can be added
     */
    get events() { return this.#events; }

    /**
     * The last timestamp that an update was performed on
     */
    #lastUpdate = Date.now();
    /**
     * The last timestamp that an update was performed on
     */
    get lastUpdate() { return this.#lastUpdate; }

    /**
     * An array containing the game's levels
     */
    readonly #levels: Level[] = [];
    /**
     * An array containing the game's levels
     */
    get levels() { return this.#levels; }

    /**
     * An object containing data about which keys are currently being pressed
     */
    readonly #keys: { readonly [key: KeyboardEvent["code"]]: boolean; } = {};
    /**
     * An object containing data about which keys are currently being pressed
     */
    get keys() { return this.#keys; }

    /**
     * Returns whether the game has finished loading all its assets and is ready to play
     */
    #isReady = false;
    /**
     * Returns whether the game has finished loading all its assets and is ready to play
     */
    get isReady() { return this.#isReady; }

    /**
     * A reference to every game object currently in the game world
     */
    readonly #objects: {
        /**
         * Every `decal` object currently in the game world
         */
        readonly decals: EventMap<number, Decal>;
        /**
         * Every `explosion` object currently in the game world
         */
        readonly explosions: EventMap<number, Explosion>;
        /**
         * Every 'plain' `generic` object currently in the game world (Other game objects inherit from `generic`, but those are not pushed)
         */
        readonly obstacles: EventMap<number, Generic>;
        /**
         * Every `particle` object currently in the game world
         */
        readonly particles: EventMap<number, Particle>;
        /**
         * Every `playerLike` object currently in the game world
         */
        readonly players: EventMap<number, PlayerLike>;
        /**
         * Every `projectile` object currently in the game world
         */
        readonly projectiles: EventMap<number, Projectile>;
    } = {
            decals: new EventMap,
            explosions: new EventMap,
            obstacles: new EventMap,
            particles: new EventMap,
            players: new EventMap,
            projectiles: new EventMap,
        };
    /**
     * A reference to every game object currently in the game world
     */
    get objects() { return this.#objects; }

    /**
     * Organizes the game objects by layer
     */
    readonly #layeredObjects = new Map<number, {
        decals: Map<number, Decal>,
        explosions: Map<number, Explosion>,
        obstacles: Map<number, Generic>,
        particlesOver: Map<number, Particle>,
        particlesUnder: Map<number, Particle>,
        players: Map<number, PlayerLike>,
        projectilesUnder: Map<number, Projectile>;
        projectilesOver: Map<number, Projectile>;
    }>;

    /**
     * Aggregates every game object
     */
    readonly #objectPool = new Map<number, GameObject>();

    /**
     * A collection of every object prototype registered with the game
     */
    readonly #prototypes: {
        /**
         * A map whose values are ammo types and whose keys are their corresponding internal names
         */
        readonly ammoTypes: Map<string, Ammo>;
        /**
         * A map whose values are decals and whose keys are their corresponding internal names
         */
        readonly decals: Map<string, DecalPrototype>;
        /**
         * A map whose values are explosions and whose keys are their corresponding internal names
         */
        readonly explosions: Map<string, ExplosionPrototype>;
        /**
         * A map whose values are firearms and whose keys are their corresponding internal names
         */
        readonly firearms: Map<string, GunPrototype>;
        /**
         * A map whose values are firearms and whose keys are their corresponding internal names
         */
        readonly melees: Map<string, MeleePrototype>;
        /**
         * A map whose values are particles and whose keys are their corresponding internal names
         */
        readonly particles: Map<string, ParticlePrototype>;
        /**
         * A map whose values are particles and whose keys are their corresponding internal names
         */
        readonly statusEffects: Map<string, StatusEffectPrototype<{}>>;
    } = {
            ammoTypes: new Map,
            decals: new Map,
            explosions: new Map,
            firearms: new Map,
            melees: new Map,
            particles: new Map,
            statusEffects: new Map,
        };
    /**
    * A collection of every object prototype registered with the game
    */
    get prototypes() { return this.#prototypes; }

    /**
     * A reference to the p5 instance currently in use
     */
    #p5: srvsdbx_ErrorHandling.Maybe<import("p5")> = srvsdbx_ErrorHandling.Nothing;

    get p5() { return this.#p5!; }

    /**
     * A reference to the player currently in the game world
     */
    #player: srvsdbx_ErrorHandling.Maybe<Player> = srvsdbx_ErrorHandling.Nothing;
    /**
     * A reference to the player currently in the game world
     */
    get player() { return this.#player; }

    /**
     * Game settings
     */
    readonly #settings: {
        drawHitboxes: boolean;
        drawVelocities: boolean;
        hitboxStyle: "stroke" | "fill" | "both";
        readonly debugColors: {
            COLLIDABLE: string,
            GROUND: string,
            PARTICLE: string,
            DECAL: string,
            AREA_OF_EFFECT: string,
            REFLECTIVE: string,
            DEFAULT: string,
        };
    } = {
            /**
             * Whether or not to trace hitboxes
             */
            drawHitboxes: false,
            /**
             * Whether or not to draw vectors representing velocities
             */
            drawVelocities: false,
            /**
             * Whether hitboxes should be drawn as outlines or partially opaque shapes
             */
            hitboxStyle: "both",
            /**
             * A collection of colors to use depending on an object's type
             */
            debugColors: {
                /**
                 * The color to use for elements that have collision enabled
                 */
                COLLIDABLE: "#F00",
                /**
                 * The color to use for the ground
                 */
                GROUND: "#000",
                /**
                 * The color to use for particles
                 */
                PARTICLE: "#F0F",
                /**
                 * The color to use for decals
                 */
                DECAL: "#FF0",
                /**
                 * The color to use for areas of effect (blast radii, melee ranges, etc)
                 */
                AREA_OF_EFFECT: "#F80",
                /**
                 * The color to use for surfaces that reflect projectiles but have no collision otherwise
                 */
                REFLECTIVE: "#00F",
                /**
                 * The color to use by default
                 */
                DEFAULT: "#0F0",
            }
        };
    /**
     * Game settings
     */
    get settings() { return this.#settings; }

    /**
     * The timestamp at which the gamespace became ready
     */
    #startup = Date.now();
    /**
     * The timestamp at which the gamespace became ready
     */
    get startup() { return this.#startup; }

    /**
     * A reference to the Matter.js World object used by the current level
     */
    get world() { return this.#engine?.world; }

    /**
     * `* It's a constructor. It constructs.`
     */
    constructor() {
        // Add listeners to ensure that the additional maps are kept in-sync
        type GameObjects = Gamespace["objects"];
        type GameObjectTypes = keyof GameObjects;
        type GameObjectEventMaps = GameObjects[GameObjectTypes];

        type LayerMapEntry = {
            decals: Map<number, Decal>,
            explosions: Map<number, Explosion>,
            obstacles: Map<number, Generic>,
            particlesOver: Map<number, Particle>,
            particlesUnder: Map<number, Particle>,
            players: Map<number, PlayerLike>,
            projectilesUnder: Map<number, Projectile>;
            projectilesOver: Map<number, Projectile>;
        };

        function getAndSetIfAbsent(map: Map<number, LayerMapEntry>, key: number) {
            if (map.has(key)) return map.get(key)!;

            const newMap = {
                decals: new Map,
                explosions: new Map,
                obstacles: new Map,
                particlesOver: new Map,
                particlesUnder: new Map,
                players: new Map,
                projectilesUnder: new Map,
                projectilesOver: new Map,
            } as MapValue<typeof map>;

            map.set(key, newMap);

            return newMap;
        };

        function determineLayerMapKey(originalKey: GameObjectTypes, gameObject: GameObject): keyof LayerMapEntry {
            if (gameObject instanceof Particle || gameObject instanceof Projectile) {
                return `${originalKey as "particles" | "projectiles"}${(gameObject.subLayer >= 0 ? "Over" as const : "Under" as const)}`;
            } else {
                return originalKey as keyof LayerMapEntry;
            }
        }

        for (const key in this.#objects) {
            const map: GameObjectEventMaps = this.#objects[key as GameObjectTypes];

            map.addEventListener("set", (_: Event, __: number, gameObject: GameObject) => {
                const destinationMap = getAndSetIfAbsent(this.#layeredObjects, gameObject.position.z);
                this.#objectPool.set(gameObject.id, gameObject);

                destinationMap[determineLayerMapKey(key as GameObjectTypes, gameObject)].set(gameObject.id, gameObject as any);
            });

            map.addEventListener("delete", (_, id, gameObject: GameObject | undefined) => {
                if (!gameObject) return;

                const layer = this.#layeredObjects.get(gameObject.position.z)
                    ?.[determineLayerMapKey(key as GameObjectTypes, gameObject)];

                if (!layer) return;

                layer?.delete?.(id);
                this.#objectPool.delete(id);
            });

            // You probably shouldn't be calling this
            map.addEventListener("clear", () => {
                for (const [_, object] of map)
                    object.destroy();
            });
        }

        // Toggle isReady when the gamespace becomes ready
        this.#events.once("ready", () => {
            this.#startup = Date.now();
            this.#isReady = true;
        });
    }

    /**
     * Starts a given level
     * @param id The level's id
     */
    startLevel(id: number) {
        (this.#currentLevel = gamespace.levels[id]).initializer();
    }

    /**
     * Calls `drawHitboxIfEnabled` and `drawVelocityIfEnabled`
     * @param p5 The game's p5 instance
     * @param style What color to draw the hitbox with. Must be one specified in `hitboxColors`
     * @param hitboxCallback The function to be called to draw the object's hitbox
     * @param transition A function that will be called between hitboxes and velocity. Useful for transforming the canvas in some way before drawing velocities.
     * @param object The generic object whose velocities should be drawn
     */
    drawDebug(
        p5: import("p5"),
        style: keyof typeof this.settings.debugColors,
        hitboxCallback: (p5: import("p5")) => void,
        transition: ((p5: import("p5")) => void) | undefined,
        object: Generic<BaseGenericEvents> | Projectile
    ) {
        this.drawHitboxIfEnabled(p5, style, hitboxCallback);
        transition?.(p5);
        this.drawVelocityIfEnabled(p5, object);
    }

    /**
     * If `drawHitboxes` is on, draws an object's hitbox according to the style and the provided drawing function
     * @param p5 The game's p5 instance
     * @param style What color to draw the hitbox with. Must be one specified in `hitboxColors`
     * @param callback The drawing function to be called to draw the object
     */
    drawHitboxIfEnabled(
        p5: import("p5"),
        style: keyof typeof this.settings.debugColors,
        callback: (p5: import("p5")) => void
    ) {
        if (this.#settings.drawHitboxes) {
            p5.push();

            const settings = this.#settings;
            settings.hitboxStyle == "fill" ? p5.noStroke() : p5.stroke(settings.debugColors[style]);
            settings.hitboxStyle == "stroke" ? p5.noFill() : p5.fill(settings.debugColors[style] + "4");

            callback(p5);
            p5.pop();
        }
    }

    /**
     * If `drawVelocities` is on, draws two vectors representing the object's linear and angular velocities respectively
     * @param p5 The game's p5 instance
     * @param object The generic object whose velocities should be drawn
     */
    drawVelocityIfEnabled(p5: import("p5"), object: Generic | Projectile) {
        if (this.#settings.drawVelocities) {
            p5.push();

            const body = "body" in object ? object.body : object,
                linearScale = object instanceof Particle ? object.drag : 1,
                rotationScale = object instanceof Particle ? object.rotDrag : 1,
                velocity = (() => {
                    if (object instanceof Projectile) { // Projectiles linearly interpolate between their endpoints
                        return srvsdbx_Geometry.Vector2D.fromPoint2D(object.end)
                            .minus(object.start)
                            .scale(1 / object.lifetime);
                    }

                    return object.compileVelocities().toVector2D();
                })().scale(linearScale),
                angularVelocity = (object instanceof Projectile ? object.angularVelocity : object.compileAngularVelocities()) * rotationScale,
                magnitude = velocity.length,
                vectorLength = -1000 * magnitude,
                vectorWidth = 5,
                angularVelocityRadius = 20,
                linearColor = "#0000FF",
                angularColor = "#FF0000";

            p5.translate(body.position.x, body.position.y);
            p5.rotate(velocity.direction + Math.PI / 2);
            p5.rectMode(p5.CENTER);
            p5.fill(linearColor);

            p5.rect(0, vectorLength / 2, vectorWidth, vectorLength);
            // only draw arrowhead for non-zero velocities
            if (magnitude)
                p5.triangle(
                    -2 * vectorWidth,
                    vectorLength,
                    2 * vectorWidth,
                    vectorLength,
                    0,
                    vectorLength - angularVelocityRadius
                );

            p5.noFill();
            p5.strokeWeight(vectorWidth);
            p5.stroke(angularColor);

            if (Math.abs(angularVelocity) > 2 * Math.PI) {
                p5.circle(0, 0, angularVelocityRadius);
            } else {
                p5.arc(
                    0,
                    0,
                    angularVelocityRadius,
                    angularVelocityRadius,
                    ...(() => { // p5 always draws arcs clockwise, so to get a counter-clockwise one, we invert the start and end points
                        const base = -Math.PI / 2;

                        return angularVelocity < 0 ? [base + angularVelocity, base] : [base, base + angularVelocity];
                    })() as [number, number],
                    p5.OPEN
                );
            }

            if (angularVelocity) { // only draw arrowhead for non-zero angular velocities
                const arrowWidth = vectorWidth;

                p5.noStroke();
                p5.fill(angularColor);
                p5.rotate(-Math.PI / 2 + angularVelocity);
                p5.triangle(2 * vectorWidth - arrowWidth, 0, 2 * vectorWidth + arrowWidth, 0, 2 * vectorWidth, 15);
            }

            p5.pop();
        }
    }

    /**
     * A generic function for performing common level setup, like creating the canvas and configuring p5
     * @param p5 The p5 instance used by the current level
     * @param player The player object
     */
    setup(p5: import("p5"), player: Player) {
        this.#p5 = p5;

        this.#engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });

        p5.createCanvas(window.innerWidth, window.innerHeight, p5.WEBGL);

        window.addEventListener("resize", () => p5.resizeCanvas(window.innerWidth, window.innerHeight, false));

        p5.pixelDensity(1);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.imageMode(p5.CENTER);
        p5.angleMode(p5.RADIANS);
        p5.cursor("crosshair");

        gamespace.#player = player;

        UIManager.create();

        this.#currentUpdate = this.#lastUpdate = Date.now();
    }

    /**
     * A generic function for performing common game logic, like physics
     */
    update() {
        this.#currentUpdate = Date.now();

        const deltaTime = this.#currentUpdate - this.#lastUpdate,
            p5 = this.#p5!;

        // Run physics updates on all the game objects
        this.#objectPool.forEach(gameObject => {
            "update" in gameObject && gameObject.update();

            if (gameObject instanceof PlayerLike) {
                gameObject.statusEffects.forEach(s => {
                    s.update();

                    if (!s.destroyed && gamespace.currentUpdate - s.afflictionTime >= s.prototype.decay) s.destroy();
                });
            }

            if (gameObject instanceof Player) {
                gameObject.lookAtMouse(p5);

                const cam: import("p5").Camera = (p5 as any)._elements[0]._curCamera,
                    x = gameObject.body?.position?.x,
                    y = gameObject.body?.position?.y,
                    shake = (() => {
                        // We generate a random unit vector and scale it; no need for sin nor cos
                        // That being said, I don't know if one sqrt is faster than one sin and one cos…
                        const x = 2 * Math.random() - 1;

                        return {
                            x: gameObject.shakeIntensity * x,
                            y: gameObject.shakeIntensity * Math.sign(Math.random() - 0.5) * Math.sqrt(1 - x ** 2)
                        };
                    })(),
                    cameraX = x ?? cam.eyeX,
                    cameraY = y ?? cam.eyeY;

                this.#cameraPosition = {
                    x: x,
                    y: y
                };

                p5.camera(
                    cameraX + shake.x,
                    cameraY + shake.y,
                    gameObject.view,
                    (x ?? cam.centerX) + shake.x,
                    (y ?? cam.centerY) + shake.y,
                    0
                );
            }
        });

        // Dispatch collision events
        const size = gamespace.PLAYER_SIZE,
            filter = [...this.#objectPool.values()].filter((value => value instanceof Generic) as (value: GameObject) => value is Generic),
            bodies = filter.map(v => v.body),
            colliders = filter
                .filter((g): g is PlayerLike => g instanceof PlayerLike)
                .map(player => (
                    [...player.inventory.items.values()].filter(
                        i => i instanceof Melee &&
                            i.prototype.isReflective &&
                            (
                                (i.owner.activeItem != i && i.prototype.holstered?.collider) ||
                                (i.owner.activeItem == i && i.prototype.worldObject?.collider)
                            )
                    ) as Melee[]
                ).map(m => {
                    const collider = m.getCollider()!,
                        reference = m.owner.activeItem == m ? m.prototype.worldObject! : m.prototype.holstered!;

                    Matter.Body.translate(
                        collider,
                        srvsdbx_Geometry.Vector2D.zeroVec()
                            .plus({ direction: player.angle + Math.PI / 2, magnitude: -reference.offset.parr * size }, true)
                            .plus({ direction: player.angle, magnitude: reference.offset.perp * size }, true)
                            .plus({ direction: player.angle + reference.offset.angle, magnitude: -reference.collider!.offsetParr * size }, true)
                            .plus({ direction: player.angle + reference.offset.angle + Math.PI / 2, magnitude: reference.collider!.offsetPerp * size }, true)
                            .plus(player.position, true)
                    );
                    Matter.Body.rotate(collider, player.angle + (reference.offset.angle ?? 0));

                    return [player, collider] as [PlayerLike, Matter.Body];
                }))
                .flat();

        this.#objectPool.forEach(obj => { // todo: optimize this so that we don't do collision math twice
            if (obj instanceof Generic || obj instanceof Projectile) {
                if ("collidable" in obj && !obj.collidable) return;

                const isGeneric = obj instanceof Generic,
                    /**
                     * The matter.js collision output
                     */
                    collision = (
                        isGeneric ?
                            Matter.Query.collides(obj.body, bodies) :
                            Matter.Query.ray(bodies, obj.lastPosition, obj.position)
                    )[0],
                    /**
                     * The Matter.Body that `obj` collided with, if any
                     */
                    collidedBody =
                        /*
                            matter.js does this weird thing where
                            — a body can collide with itself
                            — Matter.Query.ray returns a special Matter.Collision object
                            whose `bodyA` and `bodyB` properties are the same, with an
                            additional `body` property which is more of the same

                            Assume that `body` exists (making `obj` not a `Generic`). If so,
                            return it; if not, return whatever body isn't `obj.body`, and
                            `undefined` if they're both `obj.body`
                        */
                        collision
                            ? (collision as Matter.Collision & { body?: Matter.Body; }).body
                            ?? (
                                collision.bodyA == (obj as Generic).body
                                    ? collision.bodyB == (obj as Generic).body
                                        ? void 0
                                        : collision.bodyB
                                    : collision.bodyA
                            )
                            : void 0,
                    /**
                     * The `GameObject` that `collidedBody` belongs to, if applicable
                     */
                    target = collidedBody && filter.find(v => v.body == collidedBody)!,
                    /**
                     * Stores the point of collision between this projectile and a reflective surface, if it exists
                     */
                    reflectCollision = isGeneric
                        ? void 0
                        : colliders
                            .map(
                                collider =>
                                    srvsdbx_Geometry.collisionFunctions.segmentPolygon(
                                        { start: obj.lastPosition, end: obj.position },
                                        collider[1].vertices
                                    ).map(p => [collider[0], collider[1], p[0], p[1]]) as [PlayerLike, Matter.Body, srvsdbx_Geometry.Point2D, srvsdbx_Geometry.LineSegment][]
                            )
                            .flat()
                            .sort(([, , ptA], [, , ptB]) =>
                                srvsdbx_Geometry.Vector2D.squaredDistBetweenPts(ptA, obj.start) -
                                srvsdbx_Geometry.Vector2D.squaredDistBetweenPts(ptB, obj.start)
                            )[0],
                    /**
                     * Stores the point of collision between this projectile and a player, if it exists
                     */
                    bulletPlayerCollision =
                        collision
                            && obj instanceof Projectile && target instanceof PlayerLike
                            ? [
                                (
                                    srvsdbx_Geometry.collisionFunctions.segmentCircle(
                                        { start: obj.lastPosition, end: obj.position },
                                        { origin: target.position, radius: target.radius }
                                    ) ?? []
                                ) as srvsdbx_Geometry.Point2D[],
                                target
                            ] as const
                            : void 0;

                if (!(collidedBody || reflectCollision)) return;

                if (obj instanceof Projectile) {
                    /**
                     * The collision event that will be honored
                     * (if multiple collisions are detected, only one can happen)
                     */
                    const parsedCollision = (() => {
                        if (reflectCollision && bulletPlayerCollision) {
                            // Find which is closer

                            const [r, b] = [
                                srvsdbx_Geometry.Vector2D.squaredDistBetweenPts(reflectCollision[2], obj.start),
                                srvsdbx_Geometry.Vector2D.squaredDistBetweenPts(
                                    bulletPlayerCollision[0].sort((a, b) =>
                                        srvsdbx_Geometry.Vector2D.squaredDistBetweenPts(a, obj.start) -
                                        srvsdbx_Geometry.Vector2D.squaredDistBetweenPts(b, obj.start)
                                    )[0],
                                    obj.start
                                )
                            ];

                            return r < b ? reflectCollision : bulletPlayerCollision;
                        }

                        return reflectCollision || bulletPlayerCollision;
                    })();

                    // Exit now, no special logic to run
                    if (!parsedCollision) {
                        return obj.events.dispatchEvent(new CollisionEvent(collision), target!);
                    }

                    if (parsedCollision == reflectCollision) {
                        /*

                            We have three things: the vector representing the projectile, from obj.lastPosition
                            to collision[0], stored in `ab`; the vector representing the side that was hit, from
                            collision[1].start to collision[1].end, stored in `cd`; and the intersection point
                            between those two segments, stored in collision[0].

                            To deviate a bullet, we first set its start position to the intersection point, to ensure
                            the interpolation math works correctly

                            Its endpoint has two components: first, its distance from the new start point; that's easy,
                            it's whatever's left of the projectile's range. The direction is harder. As per the laws of
                            reflection everyone definitely remembers from secondary 5 physics, the angle of incidence must
                            match the angle of reflection.

                            These angles are measured with respect to the "normal" of the reflective surface, which is a
                            line perpendicular to the original, and that intersects it at the same spot it intersects the
                            incident ray. The angle between the incident ray (in this case our projectile) must match the
                            angle of the reflected ray (the angle of the reflected projectile).

                            Using this, the intuitive approach is to set about calculating said angles, but there's a better
                            way. Given some point p on the incident ray, draw a segment from it to the normal such that
                            the segment is parallel to the reflective surface, and call it l. If you extend this segment to
                            twice its length, you get a point that will lie on the reflected ray. This is because of the
                            symmetry imposed by the equality of the two angles. Therefore, using this new point, and the
                            intersection point, we can determine the angle of the reflected ray.

                            The exact procedure is as follows:

                            1: Project ab onto cd.
                            2: Add it twice to a
                                This yields a point on the reflected ray
                            3: Use that point and the point of intersection to calculate the new ray's direction

                        */

                        const equal = srvsdbx_Geometry.Vector2D.squaredDistBetweenPts(reflectCollision[2], obj.lastPosition) <= 1e-3 ** 2,
                            a = equal ? srvsdbx_Geometry.Vector2D.minus(obj.lastPosition, obj.position) : obj.lastPosition,
                            b = reflectCollision[2],
                            ab = srvsdbx_Geometry.Vector2D.fromPoint2D(b).minus(a),
                            cd = srvsdbx_Geometry.Vector2D.fromPoint2D(reflectCollision[3].end).minus(reflectCollision[3].start);

                        obj.reflect(
                            reflectCollision[2],
                            ab.projection(cd) // step 1
                                .scale(2, true) // step 2
                                .plus(a, true) // step 2
                                .minus(b, true) // step 3
                                .direction
                            // Reflections aren't perfect
                            + srvsdbx_Math.toRad(srvsdbx_Math.meanDevPM_random(0, 5, true), "degrees"),
                            reflectCollision[0]
                        );
                    } else {
                        obj.events.dispatchEvent(
                            new CollisionEvent(
                                collision,
                                bulletPlayerCollision![0]
                            ),
                            bulletPlayerCollision![1]
                        );
                    }
                }
            }
        });

        // Draw the ground
        p5.clear();

        const level = gamespace.#currentLevel!,
            { width, height } = level.world;

        p5.rectMode(p5.CORNER);
        p5.noStroke();
        p5.fill(level.world.color);
        p5.rect(0, 0, width, height);

        this.drawHitboxIfEnabled(p5, "GROUND", p5 => p5.rect(0, 0, width, height));

        p5.push();
        p5.rectMode(p5.CENTER);
        p5.fill(level.world.gridColor);

        for (let x = 0; x < width; x += gamespace.PLAYER_SIZE * 16) {
            p5.rect(x, height / 2, 6, height);
        }
        for (let y = 0; y < height; y += gamespace.PLAYER_SIZE * 16) {
            p5.rect(width / 2, y, width, 6);
        }

        p5.pop();

        // Draw all game objects
        for (const [_, layer] of this.#layeredObjects) {
            const objects = [
                layer.decals,
                layer.explosions,
                layer.projectilesUnder,
                layer.particlesUnder,
                layer.players,
                layer.projectilesOver,
                layer.particlesOver,
                layer.obstacles
            ];

            for (let i = 0, l = objects.length; i < l; i++)
                for (const [_, object] of objects[i])
                    if ( // Don't render if off-screen
                        srvsdbx_Geometry.Vector2D.squaredDistBetweenPts(
                            this.#cameraPosition,
                            object.position
                        ) < srvsdbx_Geometry.Vector2D.squaredDist({ x: window.innerWidth, y: window.innerHeight })
                        * PlayerLike.superCringeEmpiricallyDerivedPixelToUnitRatio * 1.21
                    ) object.draw(p5);
        }

        Matter.Engine.update(this.#engine!, deltaTime);
        UIManager.update();

        this.#lastUpdate = this.#currentUpdate;
    }
}));

/**
 * A simplified representation of an imported object
 */
interface SimpleImport {
    /**
     * This gun's name
     */
    readonly name: string,
    /**
     * The name this item will be referred to as in the HUD; if omitted, the value for `name` is used.
     */
    readonly displayName?: string,
    /**
     * The version of the sandbox this object was made for
     */
    readonly targetVersion: string,
    /**
     * The namespace this object belongs to
     */
    readonly namespace: string,
    /**
     * From where this object was imported
     */
    readonly includePath: string;
}

/**
 * Represents an object imported from somewhere
 */
class ImportedObject {
    /**
    * This item's name
    */
    #name: string;
    /**
     * This item's name
     */
    get name() { return this.#name; }

    /**
     * What the item will be referred to as in the HUD; if omitted, then `name` is used
     */
    #displayName?: string;
    /**
     * What the item will be referred to as in the HUD; if omitted, then `name` is used
     */
    get displayName() { return this.#displayName; }

    /**
     * The version of the sandbox this item was made for
     */
    #targetVersion: string;
    /**
     * The version of the sandbox this item was made for
     */
    get targetVersion() { return this.#targetVersion; }

    /**
     * The namespace this prototype belongs to
     */
    #namespace: string;
    /**
     * The namespace this prototype belongs to
     */
    get namespace() { return this.#namespace; }

    /**
     * An internal name used to avoid naming conflicts
     */
    get internalName() { return `${this.namespace}::${this.#name}`; }

    /**
     * From where this item was imported
     */
    #includePath: string;
    /**
     * From where this item was imported
     */
    get includePath() { return this.#includePath; }

    /**
     * `It's a constructor. It constructs.`
     * @param name This object's name, as it will appear in-game
     * @param targetVersion The version of the sandbox this object targets
     * @param namespace From where this object was imported
     * @param includePath From where this object was imported
     */
    constructor(
        name: typeof ImportedObject.prototype.name,
        displayName: typeof ImportedObject.prototype.displayName,
        targetVersion: typeof ImportedObject.prototype.targetVersion,
        namespace: typeof ImportedObject.prototype.namespace,
        includePath: typeof ImportedObject.prototype.includePath,
    ) {
        this.#name = name;
        this.#displayName = displayName;
        this.#targetVersion = targetVersion;
        this.#namespace = namespace;
        this.#includePath = includePath;
    }
}

type Gamespace = typeof gamespace;

/*

    tsc util.ts index.ts classes.ts guns.ts projectiles.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration --module esnext --moduleResolution node

    tsc assets/default/levels/level0/level.ts util.d.ts index.d.ts classes.d.ts guns.d.ts projectiles.d.ts libraries/p5/types/index.d.ts libraries/p5/types/global.d.ts libraries/matter/types/index.d.ts libraries/decimaljs/decimal.global.d.ts --target esnext --declaration --module esnext --moduleResolution node

*/