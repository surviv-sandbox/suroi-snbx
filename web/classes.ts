/**
 * The types of events `Generic`s receives by default
 */
type BaseGenericEvents = {
    /**
     * Represents a collision
     */
    collision: [Generic, srvsdbx_Geometry.Point2D[]];
};

/**
 * Represents different collision levels
 */
const CollisionLevels = (() => {
    type CollisionLevel = {
        /**
         * Returns the name of the hitbox color associated with this level
         */
        getHitboxName(): keyof Gamespace["settings"]["debugColors"],
        /**
         * Returns the hitbox color associated with this level
         */
        getHitboxColor(): Gamespace["settings"]["debugColors"][ReturnType<CollisionLevel["getHitboxName"]>];
    };

    type Levels = "NONE" | "NO_PLAYER" | "ALL";

    return {
        NONE: {
            getHitboxName() { return "DEFAULT"; },
            getHitboxColor() { return gamespace.settings.debugColors[this.getHitboxName()]; },
        },
        NO_PLAYER: {
            getHitboxName() { return "SEMI_COLLIDABLE"; },
            getHitboxColor() { return gamespace.settings.debugColors[this.getHitboxName()]; },
        },
        ALL: {
            getHitboxName() { return "COLLIDABLE"; },
            getHitboxColor() { return gamespace.settings.debugColors[this.getHitboxName()]; },
        }
    } satisfies Record<Levels, CollisionLevel> as {
        /**
         * Absolutely no collisions will be registered for this object
         */
        readonly NONE: CollisionLevel,
        /**
         * No collisions with players will be registered
         */
        readonly NO_PLAYER: CollisionLevel,
        /**
         * All collisions will be processed
         */
        readonly ALL: CollisionLevel;
    };
})();
/**
 * Represents different collision levels
 */
type CollisionLevel = typeof CollisionLevels[keyof typeof CollisionLevels];


/**
 * Represents a basic game object
 * @abstract This class cannot exist alone
 * @template E The types of events this generic receives
 */
const Generic = (() => {
    abstract class Generic<E extends BaseGenericEvents = BaseGenericEvents> implements Destroyable {
        /**
         * A shape representing this object's hitbox
         */
        readonly #body: srvsdbx_Geometry.Shape;
        /**
         * A shape representing this object's hitbox
         */
        get body() { return this.#body; }

        /**
         * What kind of objects this object can collide with
         */
        collidable: CollisionLevel = CollisionLevels.ALL;

        /**
         * A map to collect velocities acting upon this object; these are then compiled into one net velocity
         * each physics tick. Velocities are specified in pixels/ms
         *
         * There are no restrictions on keys, although it should be noted that most ingame objects that inherit
         * from this class and use this system—such as particles—will use the key `intrinsic`; it is therefore
         * not a good idea to use this key yourself
         *
         * Particles spawned by emitters will also use the key `emitter` for this purpose
         */
        readonly #velocityMap = new ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>(
            (acc, cur) => acc.plus(cur),
            srvsdbx_Geometry.Vector3D.zeroVector()
        );
        /**
         * A map to collect velocities acting upon this object; these are then compiled into one net velocity
         * each physics tick. Velocities are specified in pixels/ms
         *
         * There are no restrictions on keys, although it should be noted that most ingame objects that inherit
         * from this class and use this system—such as particles—will use the key `intrinsic`; it is therefore
         * not a good idea to use this key yourself
         *
         * Particles spawned by emitters will also use the key `emitter` for this purpose
         */
        get velocityMap() { return this.#velocityMap; }

        /**
         * A map to collect angular velocities acting upon this object; these are then compiled into one
         * net angular velocity each physics tick. Angular velocities are specified in radians/second
         *
         * There are no restrictions on keys, although it should be noted that most ingame objects that inherit
         * from this class and use this system—such as particles—will use the key `intrinsic`; it is therefore
         * not a good idea to use this key yourself
         *
         * Particles spawned by emitters will also use the key `emitter` for this purpose
         */
        readonly #angularVelocityMap = new ReducibleMap<string, number>((acc, cur) => acc + cur, 0);
        /**
         * A map to collect angular velocities acting upon this object; these are then compiled into one
         * net angular velocity each physics tick. Angular velocities are specified in radians/second
         *
         * There are no restrictions on keys, although it should be noted that most ingame objects that inherit
         * from this class and use this system—such as particles—will use the key `intrinsic`; it is therefore
         * not a good idea to use this key yourself
         *
         * Particles spawned by emitters will also use the key `emitter` for this purpose
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
        set angle(angle) {
            if (!Number.isNaN(angle))
                this.#angle = angle;
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
        set layer(layer) {
            if (!Number.isNaN(layer))
                this.#layer = layer;
        }

        /**
         * This objet's position in 3D space
         */
        get position() { return { x: this.#body.origin.x, y: this.#body.origin.y, z: this.layer } as srvsdbx_Geometry.Point3D; }

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
        readonly #followers: Map<ObjectId, Generic> = new Map;
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
        constructor(
            body: srvsdbx_Geometry.Shape,
            drawFunction: (p5: import("p5")) => void,
            position: srvsdbx_Geometry.Point2D | srvsdbx_Geometry.Point3D,
            angle = 0
        ) {
            this.#body = body;
            body.moveTo(position);

            if ("z" in position) this.layer = position.z;

            this.#draw = drawFunction;

            this.#angle = srvsdbx_Math.normalizeAngle(angle, "radians");
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
                x: body.origin.x + velocity.x * deltaTime,
                y: body.origin.y + velocity.y * deltaTime
            });

            this.angle += srvsdbx_Math.normalizeAngle(deltaTime * this.compileAngularVelocities() / 1000, "radians");

            this.layer += velocity.z * deltaTime;

            this.updateFollowers();
        }

        /**
         * Sets this generic's position instantly
         * @param position The position to place this object at
         */
        setPosition(position: srvsdbx_Geometry.Point2D) {
            this.#body.moveTo({
                x: position.x,
                y: position.y
            });

            this.updateFollowers();
        }

        /**
         * Updates the positions and angles of this generic's followers
         */
        updateFollowers() {
            for (const [key, follower] of this.#followers) {
                if (follower.#destroyed) {
                    this.#followers.delete(key);
                    continue;
                }

                const position = srvsdbx_Geometry.Vector3D.fromPoint3D({ x: this.position.x, y: this.position.y, z: this.#layer })
                    .plus(follower.#followOffset, true)
                    .plus(srvsdbx_Geometry.Vector2D.fromPolarToVec(this.#angle - Math.PI / 2, follower.#followOffset.parr).toPoint3D(), true)
                    .plus(srvsdbx_Geometry.Vector2D.fromPolarToVec(this.#angle, follower.#followOffset.perp).toPoint3D(), true);

                follower.setPosition(position);
                follower.#layer = position.z;
            }
        }

        /**
         * Calls the user-defined drawing function in order to draw this object
         * @param p5 The gamespace's p5 instance
         */
        draw(p5: import("p5")) {
            if (this.#destroyed) return;

            this.#draw.call(this, p5);
        }

        /**
         * Clears any object attributes from this instance to encourage the GC to clean up
         *
         * It also removes this body from the active `Matter.World` instance and from the appropriate `gamespace.objects` collection
         */
        destroy() {
            if (this.#destroyed) return;
            this.#destroyed = true;

            for (const [, follower] of this.#followers)
                follower.unfollow();

            this.unfollow();
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
         * @param object The object to which this object will be locked
         * @param offset An offset to apply to the lock, relative to the parent
         * - `x`: The offset to apply along the x-axis
         * - `y`: The offset to apply along the y-axis
         * - `z`: The offset to apply along the z-axis
         * - `parr`: The offset to apply along the axis parallel to the parent's orientation
         * - `perp`: The offset to apply along the axis perpendicular to the parent's orientation
         */
        follow(object: Generic, offset?: { x: number, y: number, z: number, parr: number, perp: number; }) {
            if (object == this as unknown as Generic) return;

            if (this.#parent != object) {
                this.#parent?.followers.delete(this.#id);
                object.#followers.set(this.#id, this as unknown as Generic);
                this.#parent = object;
            };

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
            if (this.#parent) {
                this.#parent.#followers.delete(this.#id);
                this.#parent = srvsdbx_ErrorHandling.Nothing;
            };
        }
    }

    return srvsdbx_OOP.makeAbstract(Generic);
})();
type Generic<E extends BaseGenericEvents = BaseGenericEvents> = InstanceType<typeof Generic<E>>;

/**
 * The most generalized expression of an object stored by the game
 */
type GameObject = Generic | Decal | Explosion | Projectile | ParticleEmitter;

/**
 * A central object consolidating classes and the game's global state
 */
const gamespace = new (srvsdbx_OOP.createSingleton(class Gamespace {
    /**
     * The game's version
     */
    get VERSION() { return "0.10.0 beta 3"; }

    /**
     * The default radius for a player, in pixels
     */
    get PLAYER_SIZE() { return 50; }

    /**
     * The position of the camera
     */
    readonly #cameraPosition: srvsdbx_Geometry.Point2D = srvsdbx_Geometry.Vector2D.zeroPoint();
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
    #currentLevel: SimpleLevel | undefined;
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
     * An event target on which listeners can be added
     */
    readonly #events = new SandboxEventTarget<{
        /**
         * Fired when the gamespace becomes ready to work with
         */
        ready: [number],
        /**
         * Fired when an item is registered by the game. No `fragmentLoaded`
         * event should be fired after the `ready` event
        */
        fragmentLoaded: [
            srvsdbx_ErrorHandling.Result<
                MapValue<Gamespace["prototypes"][keyof Gamespace["prototypes"]]> | Level,
                {
                    /**
                     * The internal name of the object which just failed
                     */
                    readonly internalName: string,
                    /**
                     * The path the failed object was imported from
                     */
                    readonly includePath: string,
                    /**
                     * The namespace the failed object belongs to
                     */
                    readonly namespace: string,
                    /**
                     * The type of the failed object
                     */
                    readonly objectType: string,
                    /**
                     * An array of errors relating to this object's failure
                     */
                    readonly err: srvsdbx_Errors.SandboxError[];
                }
            >
        ];
    }>;
    /**
     * An event target on which listeners can be added
     */
    get events() { return this.#events; }

    /**
     * Returns whether the game has finished loading all its assets and is ready to play
     */
    #isReady = false;
    /**
     * Returns whether the game has finished loading all its assets and is ready to play
     */
    get isReady() { return this.#isReady; }

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
     * A reference to every game object currently in the game world
     */
    readonly #objects: {
        /**
         * Every `Decal` object currently in the game world
         */
        readonly decals: AugmentedEventMap<ObjectId, Decal>;
        /**
         * Every `ParticleEmitter` object currently in the game world
         */
        readonly emitters: AugmentedEventMap<ObjectId, ParticleEmitter<any>>;
        /**
         * Every `Explosion` object currently in the game world
         */
        readonly explosions: AugmentedEventMap<ObjectId, Explosion>;
        /**
         * Every 'plain' `Generic` object currently in the game world (Other game objects inherit from `generic`, but those are not pushed)
         */
        readonly obstacles: AugmentedEventMap<ObjectId, Obstacle<ObstacleTypes, any>>;
        /**
         * Every `Particle` object currently in the game world
         */
        readonly particles: AugmentedEventMap<ObjectId, Particle>;
        /**
         * Every `PlayerLike` object currently in the game world
         */
        readonly players: AugmentedEventMap<ObjectId, PlayerLike>;
        /**
         * Every `Projectile` object currently in the game world
         */
        readonly projectiles: AugmentedEventMap<ObjectId, Projectile>;
    } = {
            decals: new AugmentedEventMap,
            emitters: new AugmentedEventMap,
            explosions: new AugmentedEventMap,
            obstacles: new AugmentedEventMap,
            particles: new AugmentedEventMap,
            players: new AugmentedEventMap,
            projectiles: new AugmentedEventMap,
        };
    /**
     * A reference to every game object currently in the game world
     */
    get objects() { return this.#objects; }

    /**
     * Organizes the game objects by layer
     */
    readonly #layeredObjects = new Map<number, {
        readonly decals: Map<ObjectId, Decal>,
        readonly emitters: Map<ObjectId, ParticleEmitter<any>>;
        readonly explosions: Map<ObjectId, Explosion>,
        readonly obstaclesOver: Map<ObjectId, Obstacle>,
        readonly obstaclesUnder: Map<ObjectId, Obstacle>,
        readonly particlesOver: ReducibleMap<ObjectId, Particle, Array<Particle>>,
        readonly particlesUnder: ReducibleMap<ObjectId, Particle, Array<Particle>>,
        readonly players: Map<ObjectId, PlayerLike>,
        readonly projectilesUnder: ReducibleMap<ObjectId, Projectile, Array<Projectile>>,
        readonly projectilesOver: ReducibleMap<ObjectId, Projectile, Array<Projectile>>;
    }>;

    /**
     * Aggregates every game object
     */
    readonly #objectPool = new AugmentedMap<ObjectId, GameObject>();

    /**
     * A collection of every object prototype registered with the game
     */
    readonly #prototypes = (() => {
        function generate<K, V>(collectionName: string) {
            const map = new Map<K, V>(),
                nativeGet = map.get.bind(map);

            map.get = (key: K) => {
                const value = nativeGet(key);

                if (value === void 0)
                    throw new srvsdbx_Errors.PrototypalReferenceError(`Attempted to fetch non-existant object '${key}' from collection '${collectionName}'`);

                return value!;
            };

            return map as Omit<Map<K, V>, "get"> & {
                /**
                 * Returns the element located at a certain key.
                 *
                 * **If there is no item at the specified key, _an error is thrown!_**
                 * @param key The key to fetch
                 * @returns The item located there. If this method does not throw, this value is
                 * guaranteed not to be `undefined`.
                 * @throws {srvsdbx_Errors.PrototypalReferenceError} If there is no item at the given key
                 */
                get(key: K): NonNullable<V>;
            };
        }

        return {
            /**
             * A map whose values are ammo types and whose keys are their corresponding internal names
             */
            ammos: generate<string, Ammo>("ammos"),
            /**
             * A map whose values are decals and whose keys are their corresponding internal names
             */
            decals: generate<string, DecalPrototype>("decals"),
            /**
             * A map whose values are equipments and whose keys are their corresponding internal names
             */
            equipments: generate<string, EquipmentPrototype>("equipments"),
            /**
             * A map whose values are explosions and whose keys are their corresponding internal names
             */
            explosions: generate<string, ExplosionPrototype>("explosions"),
            /**
             * A map whose values are firearms and whose keys are their corresponding internal names
             */
            firearms: generate<string, GunPrototype>("firearms"),
            /**
             * A map whose values are firearms and whose keys are their corresponding internal names
             */
            melees: generate<string, MeleePrototype>("melees"),
            /**
             * A map whose values are obstacles and whose keys are their corresponding internal names
             */
            obstacles: generate<string, ObstaclePrototype>("obstacles"),
            /**
             * A map whose values are particles and whose keys are their corresponding internal names
             */
            particles: generate<string, ParticlePrototype>("particles"),
            /**
             * A map whose values are particles and whose keys are their corresponding internal names
             */
            statusEffects: generate<string, StatusEffectPrototype<{}>>("statusEffects"),
        } as const;
    })();
    /**
    * A collection of every object prototype registered with the game
    */
    get prototypes() { return this.#prototypes; }

    /**
     * A reference to the p5 instance currently in use
     */
    #p5: srvsdbx_ErrorHandling.Maybe<import("p5")> = srvsdbx_ErrorHandling.Nothing;
    /**
     * A reference to the p5 instance currently in use
     */
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
        /**
         * Whether or not to trace hitboxes
         */
        drawHitboxes: boolean,
        /**
         * Whether or not to draw vectors representing velocities
         */
        drawVelocities: boolean,
        /**
         * Whether hitboxes should be drawn as outlines or partially opaque shapes
         */
        hitboxStyle: "stroke" | "fill" | "both",
        /**
         * At what visual quality to run the game
         */
        visualQuality: number,
        /**
         * A collection of colors to use depending on an object's type
         */
        readonly debugColors: {
            /**
             * The color to use for elements that have collision enabled
             */
            COLLIDABLE: string,
            /**
             * The color to use for elements that only collide with certain others
             */
            SEMI_COLLIDABLE: string,
            /**
             * The color to use for the ground
             */
            GROUND: string,
            /**
             * The color to use for particles
             */
            PARTICLE: string,
            /**
             * The color to use for decals
             */
            DECAL: string,
            /**
             * The color to use for areas of effect (blast radii, melee ranges, etc)
             */
            AREA_OF_EFFECT: string,
            /**
             * The color to use for surfaces that reflect projectiles but have no collision otherwise
             */
            REFLECTIVE: string,
            /**
             * The color to use by default
             */
            DEFAULT: string,
        };
    } = (() => {
        let visualQuality = 1;

        return {
            drawHitboxes: false,
            drawVelocities: false,
            hitboxStyle: "both",
            get visualQuality() { return visualQuality; },
            set visualQuality(value) {
                if (!Number.isNaN(value)) {
                    visualQuality = value;
                    gamespace.#p5?.pixelDensity(value);
                }
            },
            debugColors: {
                COLLIDABLE: "#F00",
                SEMI_COLLIDABLE: "#FF0",
                GROUND: "#000",
                PARTICLE: "#F0F",
                DECAL: "#08F",
                AREA_OF_EFFECT: "#F80",
                REFLECTIVE: "#00F",
                DEFAULT: "#0F0",
            }
        };
    })();
    /**
     * Game settings
     */
    get settings() { return this.#settings; }

    /**
     * Context:
     * To establish a ratio between screen pixels and in-game units, the following method was used:
     *
     * Given a game window with some aspect ratio `a`:
     * - Place the player at (400, 400).
     * - Place the cursor at (0, 0).
     * - Measure how many pixels away from the player the cursor is (axis doesn't matter).
     * - This gives us a ratio: 400 in-game units to some number `p`.
     * - Repeat for various window sizes whose aspect ratios are `a`.
     *
     * Repeat the above for various other aspect ratios.
     *
     * These were then compiled into a Desmos graph, and a curious fact appeared:
     * for each aspect ratio, the relation between the window's width and the amount `p`
     * previously mentioned was linear—minus some outliers.
     *
     * Between aspect ratios, however, the exact ratio changed
     * And thus, we attempt to find a relationship between the aspect ratio and the
     * previously-mentioned ratio. This relation turns out to be exponential, approximated
     * with the function `5.1271399901e^-(1.3697806015a + 2.0079957) + 0.08619961`, where `a` is the aspect ratio.
     *
     * Thus, given an aspect ratio `a`, we may calculate the slope of a line—this slope is the
     * ratio between the window's width and the amount of pixels it takes to travel 400 units.
     * At any given moment, the difference between the mouse's position and that of the player's,
     * when multiplied by the calculated ratio and added to the player's position, will give the
     * point in the game world over which the mouse is hovering.
     *
     * All these findings are summarized (although not annotated) in the following Desmos graph: https://www.desmos.com/calculator/agiykvhwdo
     *
     * **This is literally the worst thing I have ever written.**
     *
     * ~~and now the length of the method's name is the same as the average Java class name~~
     *
     * @returns The ratio between in-game units and screen pixels; it converts from screen pixels to in-game units
     */
    static readonly #superCringeEmpiricallyDerivedPixelToUnitRatio = 400 / ((5.1271399901 * Math.E ** -(1.3697806015 * (window.innerWidth / window.innerHeight) + 2.0079957) + 0.08619961) * window.innerWidth);
    /**
     * Context:
     * To establish a ratio between screen pixels and in-game units, the following method was used:
     *
     * Given a game window with some aspect ratio `a`:
     * - Place the player at (400, 400).
     * - Place the cursor at (0, 0).
     * - Measure how many pixels away from the player the cursor is (axis doesn't matter).
     * - This gives us a ratio: 400 in-game units to some number `p`.
     * - Repeat for various window sizes whose aspect ratios are `a`.
     *
     * Repeat the above for various other aspect ratios.
     *
     * These were then compiled into a Desmos graph, and a curious fact appeared:
     * for each aspect ratio, the relation between the window's width and the amount `p`
     * previously mentioned was linear—minus some outliers.
     *
     * Between aspect ratios, however, the exact ratio changed
     * And thus, we attempt to find a relationship between the aspect ratio and the
     * previously-mentioned ratio. This relation turns out to be exponential, approximated
     * with the function `5.1271399901e^-(1.3697806015a + 2.0079957) + 0.08619961`, where `a` is the aspect ratio.
     *
     * Thus, given an aspect ratio `a`, we may calculate the slope of a line—this slope is the
     * ratio between the window's width and the amount of pixels it takes to travel 400 units.
     * At any given moment, the difference between the mouse's position and that of the player's,
     * when multiplied by the calculated ratio and added to the player's position, will give the
     * point in the game world over which the mouse is hovering.
     *
     * All these findings are summarized (although not annotated) in the following Desmos graph: https://www.desmos.com/calculator/agiykvhwdo
     *
     * **This is literally the worst thing I have ever written.**
     *
     * ~~and now the length of the method's name is the same as the average Java class name~~
     *
     * @returns The ratio between in-game units and screen pixels; it converts from screen pixels to in-game units
     */
    get superCringeEmpiricallyDerivedPixelToUnitRatio() { return Gamespace.#superCringeEmpiricallyDerivedPixelToUnitRatio; }

    /**
     * The timestamp at which the gamespace became ready
     */
    #startup = Date.now();
    /**
     * The timestamp at which the gamespace became ready
     */
    get startup() { return this.#startup; }

    /**
     * `* It's a constructor. It constructs.`
     */
    constructor() {
        // Add listeners to ensure that the additional maps are kept in-sync
        type GameObjects = Gamespace["objects"];
        type GameObjectTypes = keyof GameObjects;
        type GameObjectEventMaps = GameObjects[GameObjectTypes];

        type LayerMapEntry = {
            readonly decals: Map<ObjectId, Decal>,
            readonly emitters: Map<ObjectId, ParticleEmitter>;
            readonly explosions: Map<ObjectId, Explosion>,
            readonly obstaclesOver: Map<ObjectId, Obstacle>,
            readonly obstaclesUnder: Map<ObjectId, Obstacle>,
            readonly particlesOver: ReducibleMap<ObjectId, Particle, Particle[]>,
            readonly particlesUnder: ReducibleMap<ObjectId, Particle, Particle[]>,
            readonly players: Map<ObjectId, PlayerLike>,
            readonly projectilesUnder: ReducibleMap<ObjectId, Projectile, Projectile[]>,
            readonly projectilesOver: ReducibleMap<ObjectId, Projectile, Projectile[]>;
        };

        function generateReducibleMap<K extends { subLayer: number; } = { subLayer: number; }>() {
            return new ReducibleMap<ObjectId, K, K[]>((acc, cur) => {
                if (!acc.length) {
                    // If the array is empty, push immediately
                    acc = [cur];
                } else if (acc[0].subLayer >= cur.subLayer) {
                    // If the first element's subLayer is greater than or equal this one's,
                    // this one will be the smallest; add to beginning
                    acc.unshift(cur);
                } else if (acc.at(-1)!.subLayer <= cur.subLayer) {
                    // If the last element's subLayer is less than or equal this one's,
                    // this one will be the largest; add to end
                    acc.push(cur);
                } else for (let i = 0, l = acc.length; i < l; i++) {
                    // Otherwise loop through and insert
                    if (acc[i].subLayer < cur.subLayer) {
                        acc.push(cur);
                        break;
                    }
                }

                return acc;
            }, []);
        }

        function getAndSetIfAbsent(map: Map<number, LayerMapEntry>, key: number) {
            if (map.has(key)) return map.get(key)!;

            const newMap = {
                decals: new Map,
                emitters: new Map,
                explosions: new Map,
                obstaclesOver: generateReducibleMap<Obstacle>(),
                obstaclesUnder: generateReducibleMap<Obstacle>(),
                particlesOver: generateReducibleMap<Particle>(),
                particlesUnder: generateReducibleMap<Particle>(),
                players: new Map,
                projectilesUnder: generateReducibleMap<Projectile>(),
                projectilesOver: generateReducibleMap<Projectile>(),
            } satisfies MapValue<typeof map> as MapValue<typeof map>;

            map.set(key, newMap);

            return newMap;
        };

        function determineLayerMapKey<K extends GameObjectTypes = GameObjectTypes>(originalKey: K, gameObject: MapValue<GameObjects[K]>): keyof LayerMapEntry {
            type LayeredObjectTypes = "particles" | "projectiles" | "obstacles";

            if (
                ["particles", "projectiles", "obstacles"].includes(originalKey)
            ) {
                return `${originalKey as LayeredObjectTypes}${((gameObject as MapValue<GameObjects[LayeredObjectTypes]>).subLayer >= 0 ? "Over" as const : "Under" as const)}`;
            } else {
                return originalKey as keyof LayerMapEntry;
            }
        }

        for (const key in this.#objects) {
            const map: GameObjectEventMaps = this.#objects[key as GameObjectTypes];

            map.addEventListener("set", (ev: Event, objId: ObjectId, gameObject: GameObject) => {
                const destinationMap = getAndSetIfAbsent(this.#layeredObjects, gameObject.position.z);
                this.#objectPool.set(gameObject.id, gameObject);

                const target = destinationMap[determineLayerMapKey(key as GameObjectTypes, gameObject as MapValue<GameObjects[GameObjectTypes]>)];

                target.set(gameObject.id, gameObject as any);
            });

            map.addEventListener("delete", (_, id, gameObject: GameObject | undefined) => {
                if (!gameObject) return;
                this.#objectPool.delete(id);

                const layer = this.#layeredObjects.get(gameObject.position.z)
                    ?.[determineLayerMapKey(key as GameObjectTypes, gameObject as MapValue<GameObjects[GameObjectTypes]>)];

                if (!layer) return;

                layer.delete(id);
            });

            // You probably shouldn't be calling this
            map.addEventListener("clear", () => {
                for (const [, object] of map)
                    if (!object.destroyed)
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
     * Specify a callback to be invoked when the gamespace becomes ready.
     * If the `ready` event has already been fired, the callback will
     * immediately be invoked
     *
     * This is the recommended method of performing actions on startup
     * @param callback A function that will be called when the gamespace's
     * `ready` event is emitted, or immediately if the gamespace is already
     * ready
     */
    invokeWhenReady(callback: (startupTime: number) => void) {
        if (this.#isReady) return void callback(this.#startup);

        this.#events.once("ready", (_, s) => callback(s));
    }

    /**
     * Starts a given level
     * @param id The level's id
     */
    startLevel(id: number) {
        document.getElementById("main-menu-cont")?.remove?.();
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

            const isGeneric = object instanceof Generic,
                position = isGeneric ? object.body.origin : object.position,
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

            p5.translate(position.x, position.y);
            p5.rotate(velocity.direction + Math.PI / 2);
            p5.rectMode(p5.CENTER);
            p5.fill(linearColor);

            p5.rect(0, vectorLength / 2, vectorWidth, vectorLength);
            // only draw arrowhead for non-zero velocities
            if (magnitude)
                p5.triangle(
                    -2 * vectorWidth, vectorLength,
                    2 * vectorWidth, vectorLength,
                    0, vectorLength - angularVelocityRadius
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
                p5.triangle(
                    2 * vectorWidth - arrowWidth, 0,
                    2 * vectorWidth + arrowWidth, 0,
                    2 * vectorWidth, 15
                );
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

        p5.createCanvas(window.innerWidth, window.innerHeight, p5.WEBGL);

        window.addEventListener("resize", () => p5.resizeCanvas(window.innerWidth, window.innerHeight, false));
        document.body.style.backgroundColor = "#000";

        p5.pixelDensity(this.#settings.visualQuality);
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
        if (gamespace.#currentLevel == srvsdbx_ErrorHandling.Nothing)
            throw new srvsdbx_Errors.IllegalOperation("Not currently in a level");

        this.#currentUpdate = Date.now();

        const p5 = this.#p5!;

        // Run physics updates on all the game objects
        this.#objectPool.forEach(gameObject => {
            "update" in gameObject && gameObject.update();

            if (gameObject instanceof PlayerLike)
                gameObject.statusEffects.forEach(s => {
                    s.update();

                    if (!s.destroyed && gamespace.currentUpdate - s.afflictionTime >= s.prototype.decay)
                        s.destroy();
                });
        });

        // Dispatch collision events
        const size = gamespace.PLAYER_SIZE,
            filter = this.#objectPool
                .toArray()
                .filter((value => value instanceof Generic && value.collidable != CollisionLevels.NONE) as (value: GameObject) => value is Generic),
            bodies = filter.map(v => v.body),
            colliders = (
                filter.filter(
                    object => object instanceof PlayerLike || (object instanceof Obstacle && object.prototype.reflective)
                ) as (PlayerLike | Obstacle)[]
            ).map(
                object => (
                    object instanceof PlayerLike ?
                        object.inventory.containers.main.toArray().filter(
                            i => i instanceof Melee &&
                                i.prototype.isReflective &&
                                (
                                    (i.owner.activeItem != i && i.prototype.holstered?.collider) ||
                                    (i.owner.activeItem == i && i.prototype.worldObject?.collider)
                                ) && (
                                    object.canAttack() || i.prototype.canReflectWhileAttacking
                                )
                        ) as Melee[] :
                        [[object, object.body]] as [[Obstacle, srvsdbx_Geometry.Shape]]
                ).map(entry => {
                    if (entry instanceof Melee) {
                        const collider = entry.getCollider()!,
                            reference = (() => {
                                if (entry.owner.activeItem == entry) {
                                    const ref = entry.getItemReference(),
                                        world = entry.prototype.worldObject;

                                    return {
                                        dimensions: {
                                            width: ref?.dimensions?.width ?? (+world?.dimensions.width! || 0),
                                            height: ref?.dimensions?.height ?? (+world?.dimensions.height! || 0)
                                        },
                                        offset: {
                                            parr: ref?.offset?.parr ?? world?.offset.parr ?? 0,
                                            perp: ref?.offset?.perp ?? world?.offset.perp ?? 0,
                                            offsetParr: world?.collider?.offsetParr ?? 0,
                                            offsetPerp: world?.collider?.offsetPerp ?? 0,
                                            angle: ref?.offset?.angle ?? world?.offset.angle ?? 0
                                        }
                                    };
                                }

                                const holster = entry.prototype.holstered;

                                return {
                                    dimensions: {
                                        width: holster?.dimensions.width ?? 0,
                                        height: holster?.dimensions.height ?? 0
                                    },
                                    offset: {
                                        parr: holster?.offset.parr ?? 0,
                                        perp: holster?.offset.perp ?? 0,
                                        offsetParr: holster?.collider?.offsetParr ?? 0,
                                        offsetPerp: holster?.collider?.offsetPerp ?? 0,
                                        angle: holster?.offset.angle ?? 0
                                    }
                                };
                            })();

                        collider.translate(
                            srvsdbx_Geometry.Vector2D.zeroVector()
                                .plus({ direction: object.angle + Math.PI / 2, magnitude: -reference.offset.parr * size }, true)
                                .plus({ direction: object.angle, magnitude: reference.offset.perp * size }, true)
                                .plus({ direction: object.angle + reference.offset.angle, magnitude: -reference.offset.offsetParr * size }, true)
                                .plus({ direction: object.angle + reference.offset.angle + Math.PI / 2, magnitude: reference.offset.offsetPerp * size }, true)
                                .plus(object.position, true)
                        );

                        collider.setAngle(reference.offset.angle);

                        return [object, collider] as [PlayerLike, srvsdbx_Geometry.Shape];
                    } else return entry;
                })
            ).flat();

        this.#objectPool.forEach(obj => {
            if (
                !(obj instanceof Generic || obj instanceof Projectile)
                || obj.collidable == CollisionLevels.NONE
            ) return;

            const isGeneric = obj instanceof Generic,
                /**
                 * The collision output
                 */
                collisions = (
                    isGeneric
                        ? srvsdbx_Geometry.collisionFunctions.shapeShapes(
                            obj.body,
                            bodies
                        )
                        : srvsdbx_Geometry.collisionFunctions.segmentShapes(
                            {
                                start: obj.lastPosition,
                                end: obj.position
                            },
                            bodies
                        )
                );

            if (collisions == srvsdbx_ErrorHandling.Nothing) return;

            for (const collision of collisions) {
                if (obj.destroyed) break;

                const collisionPoints: srvsdbx_Geometry.Point2D[] = [],
                    /**
                     * The body that `obj` collided with, if any
                     */
                    collidedBody = collision[1],
                    /**
                     * The `GameObject` that `collidedBody` belongs to, if applicable
                     */
                    target = filter.find(v => v.body == collidedBody)!,
                    /**
                     * Stores the point of collision between this projectile and a reflective surface, if it exists
                     */
                    reflectCollision = isGeneric
                        ? void 0
                        : colliders
                            .map(
                                (collider): {
                                    readonly target: PlayerLike | Obstacle,
                                    readonly point: srvsdbx_Geometry.Point2D,
                                    readonly segment: srvsdbx_Geometry.LineSegment;
                                }[] => {
                                    if (collider[0].destroyed)
                                        return void 0 as any;

                                    const [target, body] = collider,
                                        isCircle = body instanceof srvsdbx_Geometry.Circle,

                                        points = isCircle
                                            ? (srvsdbx_Geometry.collisionFunctions.segmentCircle(
                                                { start: obj.lastPosition, end: obj.position },
                                                {
                                                    origin: body.origin,
                                                    radius: (target.radius ?? 0) * ((target as Obstacle<"circle">).scale ?? 1)
                                                }
                                            ) ?? [])
                                                .map(point => [
                                                    point,
                                                    (() => {
                                                        // From the intersection point to the center
                                                        const diff = srvsdbx_Geometry.Vector2D.fromPoint2D(target.body.origin)
                                                            .minus(point);

                                                        // Turn it into a tangent
                                                        diff.direction += Math.PI / 2;

                                                        return {
                                                            start: point,
                                                            end: diff.plus(point)
                                                        } as srvsdbx_Geometry.LineSegment;
                                                    })()
                                                ] as const)
                                            : srvsdbx_Geometry.collisionFunctions.segmentPolygon(
                                                { start: obj.lastPosition, end: obj.position },
                                                (body as srvsdbx_Geometry.Rectangle).vertices
                                            ) ?? [];

                                    return points.map(point => ({
                                        target: target,
                                        point: point[0],
                                        segment: point[1]
                                    }));
                                }
                            )
                            .filter((v, i) => {
                                if (v) return v;

                                colliders.splice(i, 1);
                                return false;
                            })
                            .flat()
                            .sort(({ point: ptA }, { point: ptB }) =>
                                srvsdbx_Geometry.Vector2D.squaredDistanceBetweenPts(ptA, obj.start) -
                                srvsdbx_Geometry.Vector2D.squaredDistanceBetweenPts(ptB, obj.start)
                            )[0],
                    /**
                     * Stores the point of collision between this projectile and a player, if it exists
                     */
                    bulletPlayerCollision =
                        collisions
                            && obj instanceof Projectile && target instanceof PlayerLike
                            && !reflectCollision
                            ? {
                                target: target,
                                point: (
                                    srvsdbx_Geometry.collisionFunctions.segmentCircle(
                                        { start: obj.lastPosition, end: obj.position },
                                        { origin: target.position, radius: target.radius }
                                    ) ?? []
                                ) as srvsdbx_Geometry.Point2D[],
                            }
                            : void 0,
                    /**
                     * Stores the point of collision between this projectile and an obstacle, if it exists
                     */
                    bulletObstacleCollision =
                        collisions
                            && obj instanceof Projectile && target instanceof Obstacle
                            && !reflectCollision
                            ? {
                                target: target,
                                point: (
                                    target.prototype.hitbox.type == "circle"
                                        ? srvsdbx_Geometry.collisionFunctions.segmentCircle(
                                            { start: obj.lastPosition, end: obj.position },
                                            { origin: target.position, radius: (target.body as srvsdbx_Geometry.Circle).radius! }
                                        )
                                        : (srvsdbx_Geometry.collisionFunctions.segmentPolygon(
                                            { start: obj.lastPosition, end: obj.position },
                                            (target as Obstacle<"rectangle">).body.vertices
                                        ) ?? []).map(v => v[0])
                                ) as srvsdbx_Geometry.Point2D[],
                            }
                            : void 0;

                if (!(collidedBody || reflectCollision || bulletObstacleCollision)) return;

                if (isGeneric) {
                    (obj.events as Generic["events"]).dispatchEvent(
                        "collision",
                        target!,
                        collisionPoints
                    );
                    continue;
                }

                /**
                 * The collision event that will be honored
                 * (if multiple collisions are detected, only one can happen)
                 */
                const parsedCollision = (() => {

                    const candidates = [
                        reflectCollision!,
                        bulletObstacleCollision!,
                        bulletPlayerCollision!
                    ].filter(v => v),

                        start = obj.start,
                        sDist = srvsdbx_Geometry.Vector2D.squaredDistanceBetweenPts,
                        getDistToClosestPoint = (pts: srvsdbx_Geometry.Point2D | srvsdbx_Geometry.Point2D[]) =>
                            sDist(
                                Array.isArray(pts)
                                    ? pts.sort((a, b) =>
                                        sDist(a, start) -
                                        sDist(b, start)
                                    )[0]
                                    : pts,
                                start
                            );

                    return candidates.sort((a, b) => getDistToClosestPoint(a.point) - getDistToClosestPoint(b.point))[0];
                })();

                // Exit now, no special logic to run
                if (!parsedCollision) {
                    if (target) obj.events.dispatchEvent("collision", target as Obstacle | PlayerLike, []);
                    continue;
                }

                const dispatchCollision = () => {
                    obj.events.dispatchEvent(
                        "collision",
                        parsedCollision.target,
                        Array.isArray(parsedCollision.point) ? parsedCollision.point : [parsedCollision.point]
                    );
                };

                if (parsedCollision != reflectCollision) {
                    dispatchCollision();
                    continue;
                }

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

                const equal = srvsdbx_Geometry.Vector2D.squaredDistanceBetweenPts(reflectCollision.point, obj.lastPosition) <= 1e-3 ** 2,
                    a = equal ? srvsdbx_Geometry.Vector2D.minus(obj.lastPosition, obj.position) : obj.lastPosition,
                    b = reflectCollision.point,
                    ab = srvsdbx_Geometry.Vector2D.fromPoint2D(b).minus(a),
                    cd = srvsdbx_Geometry.Vector2D.fromPoint2D(reflectCollision.segment.end).minus(reflectCollision.segment.start),
                    reflectTarget = reflectCollision.target;

                obj.reflect(
                    reflectCollision.point,
                    ab.projection(cd) // step 1
                        .scale(2, true) // step 2
                        .plus(a, true) // step 2
                        .minus(b, true) // step 3
                        .direction
                    // Reflections aren't perfect
                    + srvsdbx_Math.toRad(srvsdbx_Math.meanDevPM_random(0, 5, true), "degrees"),
                    reflectTarget
                );

                if (!(reflectTarget instanceof PlayerLike)) {
                    dispatchCollision();
                    continue;
                }

                (reflectTarget.activeItem as Melee).lastReflect = gamespace.currentUpdate;
            }
        });

        // Draw the ground
        //@ts-expect-error
        p5.clear();
        // p5's typings are broken, thanks for that

        gamespace.objects.players.forEach(player => player.unintersect());

        const player = gamespace.player;
        if (player) {
            player.lookAtMouse(p5);

            const { x, y } = player.body.origin,
                shake = (() => {
                    // We generate a random unit vector and scale it; no need for sin nor cos
                    // That being said, I don't know if one sqrt is faster than one sin and one cos…
                    const x = 2 * Math.random() - 1;

                    return {
                        x: player.shakeIntensity * x,
                        y: player.shakeIntensity * Math.sign(Math.random() - 0.5) * Math.sqrt(1 - x ** 2)
                    };
                })();

            this.#cameraPosition.x = x;
            this.#cameraPosition.y = y;

            p5.camera(
                x + shake.x,
                y + shake.y,
                player.view,
                x + shake.x,
                y + shake.y,
                0
            );
        }

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
        for (const [, layer] of this.#layeredObjects) {
            const objects = [
                layer.decals,
                layer.emitters,
                layer.explosions,
                layer.particlesUnder,
                layer.players,
                layer.projectilesUnder,
                layer.obstaclesUnder,
                layer.particlesOver,
                layer.obstaclesOver,
                layer.projectilesOver,
            ];

            for (let i = 0, l = objects.length; i < l; i++) {
                const baseCollection = objects[i],
                    isReducibleMap = "reduced" in baseCollection,
                    collection = isReducibleMap ? baseCollection.reduced : baseCollection;

                for (const entry of collection) {
                    const object = isReducibleMap
                        ? entry as GameObject
                        : (entry as [ObjectId, GameObject])[1];

                    if ("draw" in object)
                        if ( // Don't render if off-screen
                            srvsdbx_Geometry.Vector2D.squaredDistanceBetweenPts(
                                this.#cameraPosition,
                                object.position
                            ) < srvsdbx_Geometry.Vector2D.squaredDist({ x: window.innerWidth, y: window.innerHeight })
                            * Gamespace.#superCringeEmpiricallyDerivedPixelToUnitRatio * 1.21
                        ) object.draw(p5);
                }
            }
        }

        UIManager.update();

        this.#lastUpdate = this.#currentUpdate;
    }
}));

type Gamespace = typeof gamespace;

/**
 * A simplified representation of an imported object
 */
interface SimpleImport {
    /**
     * This object's name
     */
    readonly name: string,
    /**
     * The type of object this is
     */
    readonly objectType: string,
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
    readonly #name: string;
    /**
     * This item's name
     */
    get name() { return this.#name; }

    /**
     * What the item will be referred to as in the HUD; if omitted, then `name` is used
     */
    readonly #displayName?: string;
    /**
     * What the item will be referred to as in the HUD; if omitted, then `name` is used
     */
    get displayName() { return this.#displayName; }

    /**
     * The version of the sandbox this item was made for
     */
    readonly #targetVersion: string;
    /**
     * The version of the sandbox this item was made for
     */
    get targetVersion() { return this.#targetVersion; }

    /**
     * The type of object this is
     */
    readonly #objectType: string;
    /**
     * The type of object this is
     */
    get objectType() { return this.#objectType; }

    /**
     * The namespace this prototype belongs to
     */
    readonly #namespace: string;
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
    readonly #includePath: string;
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
        name: ImportedObject["name"],
        displayName: ImportedObject["displayName"],
        objectType: ImportedObject["objectType"],
        targetVersion: ImportedObject["targetVersion"],
        namespace: ImportedObject["namespace"],
        includePath: ImportedObject["includePath"]
    ) {
        this.#name = name;
        this.#displayName = displayName;
        this.#objectType = objectType;
        this.#targetVersion = targetVersion;
        this.#namespace = namespace;
        this.#includePath = includePath;
    }
}

/**
 * A simplified representation of a game level
 */
interface SimpleLevel extends SimpleImport {
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
    },
    /**
     * A function used to start this level's logic: adding entities,
     * setting the environment up, scripting, etc
     */
    initializer(): void;
}

/**
 * Represents a game level
 */
class Level extends ImportedObject {
    /**
     * Information about the world this level creates
     */
    #world: SimpleLevel["world"];
    /**
     * Information about the world this level creates
     */
    get world() { return this.#world; }

    /**
     * A function used to start this level's logic: adding entities,
     * setting the environment up, scripting, etc
     */
    #initializer: SimpleLevel["initializer"];
    /**
     * A function used to start this level's logic: adding entities,
     * setting the environment up, scripting, etc
     */
    get initializer() { return this.#initializer; }

    static from(data: SimpleLevel) {
        return new Level(
            data.name,
            data.displayName,
            data.objectType,
            data.targetVersion,
            data.namespace,
            data.includePath,
            data.world,
            data.initializer
        );
    }

    /**
     * `It's a constructor. It constructs.`
     */
    constructor(
        name: ImportedObject["name"],
        displayName: ImportedObject["displayName"],
        objectType: ImportedObject["objectType"],
        targetVersion: ImportedObject["targetVersion"],
        namespace: ImportedObject["namespace"],
        includePath: ImportedObject["includePath"],
        world: SimpleLevel["world"],
        initializer: SimpleLevel["initializer"],
    ) {
        super(name, displayName, objectType, targetVersion, namespace, includePath);

        this.#world = world;
        this.#initializer = initializer;
    }
}