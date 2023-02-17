/// <reference types="p5" />
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
        event: CollisionEvent;
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
declare abstract class Generic<E extends BaseGenericEvents = BaseGenericEvents> implements Destroyable {
    #private;
    /**
     * A reference to the matter.js body this object contains
     */
    get body(): Matter.Body;
    protected set body(b: Matter.Body);
    /**
     * Whether or not this object can currently be collided with
     */
    collidable: boolean;
    /**
     * A map to collect velocities acting upon this object; these are then compiled into one net velocity each physics tick
     */
    get velocityMap(): ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
    /**
     * A map to collect angular velocities acting upon this object; these are then compiled into one net angular velocity each physics tick
     */
    get angularVelocityMap(): ReducibleMap<string, number, number>;
    /**
     * This game object's orientation. **Does not affect its hitbox.**
     *
     * `get`: Gets this object's location
     *
     * `set`: Sets this object's angle to the provided value if it is not `NaN`
     */
    get angle(): number;
    set angle(v: number);
    /**
     * This object's z position
     *
     * `get`: This object's position
     *
     * `set`: If the provided value isn't `NaN`, changes this object's z position
     */
    get layer(): number;
    set layer(v: number);
    /**
     * This objet's position in 3D space
     */
    get position(): srvsdbx_Geometry.Point3D;
    /**
     * The color to fill this object with
     */
    fillColor: string;
    /**
     * The color to stroke this shape with
     */
    strokeColor: string;
    /**
     * An event target on which listeners can be added
     */
    get events(): SandboxEventTarget<E>;
    /**
     * Whether or not this Generic has been destroyed (and by extension, whether or not it's safe to call `.update` or `.draw` on it)
     */
    get destroyed(): boolean;
    /**
     * This generic's id
     */
    get id(): number;
    /**
     * The `Generic` to which this object is locked via `follow`
     */
    get parent(): srvsdbx_ErrorHandling.Maybe<Generic<BaseGenericEvents>>;
    /**
     * The offset at which this object will follow its parent, relative to the parent's position
     * - `x`: The offset to apply along the x-axis
     * - `y`: The offset to apply along the y-axis
     * - `z`: The offset to apply along the z-axis
     * - `parr`: The offset to apply along the axis parallel to the parent's orientation
     * - `perp`: The offset to apply along the axis perpendicular to the parent's orientation
     */
    get followOffset(): {
        x: number;
        y: number;
        z: number;
        parr: number;
        perp: number;
    };
    /**
     * A Map whose values are `Generic`s following this object and whose keys are their corresponding `id`s
     */
    get followers(): Map<number, Generic<BaseGenericEvents>>;
    /**
     * `* It's a constructor. It constructs.`
     * @param body The matter.js body this object will use
     * @param drawFunction A function that'll be invoked in order to draw this object
     * @param position A `Point2D` object dictating this object's starting position
     * @param fillColor Optionally specify this projectile's fill color
     * @param strokeColor Optionally specify this projectile's stroke color
     */
    constructor(body: Matter.Body, drawFunction: (p5: import("p5")) => void, position: srvsdbx_Geometry.Point2D | srvsdbx_Geometry.Point3D, fillColor?: string, strokeColor?: string, angle?: number);
    /**
     * A generic method for drawing polygons. Uses `fillColor` and `strokeColor`.
     * @param p5 The gamespace's p5 instance
     */
    static drawPolygon(this: Generic, p5: import("p5")): void;
    /**
     * A generic method for drawing circles. Uses `fillColor` and `strokeColor`
     * @param p5 The gamespace's p5 instance
     */
    static drawCircle(this: Generic, p5: import("p5")): void;
    /**
     * Modifies this object's position in accordance to its velocities
     */
    update(): void;
    /**
     * Sets this generic's position instantly
     * @param position The position to place this object at
     */
    setPosition(position: srvsdbx_Geometry.Point2D): void;
    /**
     * Calls the user-defined drawing function in order to draw this object
     * @param p5 The gamespace's p5 instance
     */
    draw(p5: import("p5")): void;
    /**
     * Clears any object attributes from this instance to encourage the GC to clean up
     *
     * It also removes this body from the active `Matter.World` instance and from the appropriate `gamespace.objects` collection
     */
    destroy(): void;
    /**
     * Uses the various velocities currently applied to this object (through `velocityMap`) to determine a net velocity
     *
     * Does not take the time since the last physics update into account.
     */
    compileVelocities(): srvsdbx_Geometry.Vector3D;
    /**
     * Uses the various angular velocities currently applied to this object (through `angVelocityMap`) to determine a net angular velocity
     *
     * Does not take the time since the last physics update into account.
     */
    compileAngularVelocities(): number;
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
    follow(obj: Generic, offset?: {
        x: number;
        y: number;
        z: number;
        parr: number;
        perp: number;
    }): void;
    /**
     * Removes this object's bondage to another
     */
    unfollow(): void;
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
        readonly width: number;
        /**
         * The world's height
         */
        readonly height: number;
        /**
         * The ground's color
         */
        readonly color: string;
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
declare const gamespace: {
    /**
     * The default radius for a player, in pixels
     */
    readonly PLAYER_SIZE: number;
    /**
     * The position of the camera
     */
    "__#4@#cameraPosition": srvsdbx_Geometry.Point2D;
    /**
     * A copy of the camera's position
     */
    readonly cameraPosition: {
        x: number;
        y: number;
    };
    /**
     * A reference to the level currently being played
     */
    "__#4@#currentLevel": Level | undefined;
    /**
     * A reference to the level currently being played
     */
    readonly currentLevel: Level | undefined;
    /**
     * Returns the timestamp of the current tick. Ensures that long updates are consistent.
     */
    "__#4@#currentUpdate": number;
    /**
     * Returns the timestamp of the current tick. Ensures that long updates are consistent.
     */
    readonly currentUpdate: number;
    /**
     * A reference to the Matter.js Engine object belonging to the current level
     */
    "__#4@#engine": Matter.Engine | undefined;
    /**
     * A reference to the Matter.js Engine object belonging to the current level
     */
    readonly engine: Matter.Engine | undefined;
    /**
     * An event target on which listeners can be added
     */
    readonly "__#4@#events": SandboxEventTarget<{
        ready: {
            event: Event;
            args: [number];
        };
    }>;
    /**
     * An event target on which listeners can be added
     */
    readonly events: SandboxEventTarget<{
        ready: {
            event: Event;
            args: [number];
        };
    }>;
    /**
     * The last timestamp that an update was performed on
     */
    "__#4@#lastUpdate": number;
    /**
     * The last timestamp that an update was performed on
     */
    readonly lastUpdate: number;
    /**
     * An array containing the game's levels
     */
    readonly "__#4@#levels": Level[];
    /**
     * An array containing the game's levels
     */
    readonly levels: Level[];
    /**
     * An object containing data about which keys are currently being pressed
     */
    readonly "__#4@#keys": {
        readonly [key: string]: boolean;
    };
    /**
     * An object containing data about which keys are currently being pressed
     */
    readonly keys: {
        readonly [key: string]: boolean;
    };
    /**
     * Returns whether the game has finished loading all its assets and is ready to play
     */
    "__#4@#isReady": boolean;
    /**
     * Returns whether the game has finished loading all its assets and is ready to play
     */
    readonly isReady: boolean;
    /**
     * A reference to every game object currently in the game world
     */
    readonly "__#4@#objects": {
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
    };
    /**
     * A reference to every game object currently in the game world
     */
    readonly objects: {
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
    };
    /**
     * Organizes the game objects by layer
     */
    readonly "__#4@#layeredObjects": Map<number, {
        decals: Map<number, Decal>;
        explosions: Map<number, Explosion>;
        obstacles: Map<number, Generic>;
        particlesOver: Map<number, Particle>;
        particlesUnder: Map<number, Particle>;
        players: Map<number, PlayerLike>;
        projectilesUnder: Map<number, Projectile>;
        projectilesOver: Map<number, Projectile>;
    }>;
    /**
     * Aggregates every game object
     */
    readonly "__#4@#objectPool": Map<number, GameObject>;
    /**
     * A collection of every object prototype registered with the game
     */
    readonly "__#4@#prototypes": {
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
    };
    /**
    * A collection of every object prototype registered with the game
    */
    readonly prototypes: {
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
    };
    /**
     * A reference to the p5 instance currently in use
     */
    "__#4@#p5": srvsdbx_ErrorHandling.Maybe<import("p5")>;
    readonly p5: import("p5");
    /**
     * A reference to the player currently in the game world
     */
    "__#4@#player": srvsdbx_ErrorHandling.Maybe<Player>;
    /**
     * A reference to the player currently in the game world
     */
    readonly player: srvsdbx_ErrorHandling.Maybe<{
        readonly "__#16@#shakeIntensities": ReducibleMap<string, number, number>;
        readonly shakeIntensity: number;
        addShake(source: string, strength: number, origin: srvsdbx_Geometry.Point2D): void;
        removeShake(source: string): void;
        "__#16@#determineShakeIntensity"(origin: {
            x: number;
            y: number;
        }, strength: number): number;
        destroy(): void;
        readonly "__#15@#inventory": Inventory;
        readonly inventory: Inventory;
        "__#15@#previousActiveIndex": number;
        readonly previousActiveIndex: number;
        "__#15@#activeItemIndex": number;
        readonly activeItemIndex: number;
        readonly activeItem: (InventoryItem<InventoryItemPrototype> & EquipableItem<ItemAnimation>) | undefined; /**
         * A map to collect angular velocities acting upon this object; these are then compiled into one net angular velocity each physics tick
         */
        readonly "__#15@#state": {
            attacking: boolean;
            effectiveSwitchDelay: number;
            firing: boolean;
            lastSwitch: number;
            lastFreeSwitch: number;
            noSlow: boolean;
            reloading: number | false;
        };
        readonly state: {
            attacking: boolean;
            effectiveSwitchDelay: number;
            firing: boolean;
            lastSwitch: number;
            lastFreeSwitch: number;
            noSlow: boolean;
            reloading: number | false;
        };
        "__#15@#maxHealth": number;
        maxHealth: number;
        "__#15@#health": number;
        readonly health: number;
        readonly "__#15@#timers": {
            anticipatedReload: number | false; /**
             * The `Generic` to which this object is locked via `follow`
             */
            firing: number | false; /**
             * The offset at which this object will follow its parent, relative to the parent's position
             * - `x`: The offset to apply along the x-axis
             * - `y`: The offset to apply along the y-axis
             * - `z`: The offset to apply along the z-axis
             * - `parr`: The offset to apply along the axis parallel to the parent's orientation
             * - `perp`: The offset to apply along the axis perpendicular to the parent's orientation
             */
            reload: number | false;
        };
        readonly timers: {
            anticipatedReload: number | false; /**
             * The `Generic` to which this object is locked via `follow`
             */
            firing: number | false; /**
             * The offset at which this object will follow its parent, relative to the parent's position
             * - `x`: The offset to apply along the x-axis
             * - `y`: The offset to apply along the y-axis
             * - `z`: The offset to apply along the z-axis
             * - `parr`: The offset to apply along the axis parallel to the parent's orientation
             * - `perp`: The offset to apply along the axis perpendicular to the parent's orientation
             */
            reload: number | false;
        };
        readonly "__#15@#hands": {
            leftHand: {
                parr: number;
                perp: number;
            };
            rightHand: {
                parr: number;
                perp: number;
            };
        };
        readonly hands: {
            leftHand: {
                parr: number;
                perp: number;
            };
            rightHand: {
                parr: number;
                perp: number;
            };
        };
        readonly "__#15@#speed": {
            default: number;
        };
        readonly speed: {
            default: number;
        };
        "__#15@#aimPoint": srvsdbx_Geometry.Point2D;
        readonly aimPoint: srvsdbx_Geometry.Point2D;
        "__#15@#view": number;
        readonly view: number;
        "__#15@#modifiers": {
            readonly damage: ReducibleMap<string, number, number>;
            readonly protection: ReducibleMap<string, number, number>;
            readonly speed: ReducibleMap<string, number, number>;
            readonly ergonomics: ReducibleMap<string, number, number>;
        };
        readonly modifiers: {
            readonly damage: ReducibleMap<string, number, number>;
            readonly protection: ReducibleMap<string, number, number>;
            readonly speed: ReducibleMap<string, number, number>;
            readonly ergonomics: ReducibleMap<string, number, number>;
        };
        readonly "__#15@#statusEffects": Set<StatusEffect<{}>>;
        readonly statusEffects: Set<StatusEffect<{}>>;
        "__#15@#radius": number;
        radius: number;
        swapWeapons(): void;
        setActiveItemIndex(slotId: number): void;
        compileVelocities(): srvsdbx_Geometry.Vector3D;
        determineMoveSpeed(): number;
        lookAtMouse(p5: import("p5")): void;
        lookAtPoint(pt: srvsdbx_Geometry.Point2D): void;
        applyDamage(amount: number, source?: PlayerLike | undefined): srvsdbx_ErrorHandling.Result<undefined, string>;
        applyHealing(amount: number, source?: PlayerLike | undefined): srvsdbx_ErrorHandling.Result<undefined, string>;
        setHealth(amount: number): srvsdbx_ErrorHandling.Result<undefined, string>;
        /**
         * A reference to the matter.js body this object contains
         */
        "__#3@#body": Matter.Body;
        /**
         * A reference to the matter.js body this object contains
         */
        body: Matter.Body;
        /**
         * Whether or not this object can currently be collided with
         */
        collidable: boolean;
        /**
         * A map to collect velocities acting upon this object; these are then compiled into one net velocity each physics tick
         */
        readonly "__#3@#velocityMap": ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
        /**
         * A map to collect velocities acting upon this object; these are then compiled into one net velocity each physics tick
         */
        readonly velocityMap: ReducibleMap<string, srvsdbx_Geometry.Point3D, srvsdbx_Geometry.Vector3D>;
        /**
         * A map to collect angular velocities acting upon this object; these are then compiled into one net angular velocity each physics tick
         */
        readonly "__#3@#angularVelocityMap": ReducibleMap<string, number, number>;
        /**
         * A map to collect angular velocities acting upon this object; these are then compiled into one net angular velocity each physics tick
         */
        readonly angularVelocityMap: ReducibleMap<string, number, number>;
        /**
         * This game object's orientation. **Does not affect its hitbox.**
         */
        "__#3@#angle": number;
        /**
         * This game object's orientation. **Does not affect its hitbox.**
         *
         * `get`: Gets this object's location
         *
         * `set`: Sets this object's angle to the provided value if it is not `NaN`
         */
        angle: number;
        /**
         * This object's z position
         */
        "__#3@#layer": number;
        /**
         * This object's z position
         *
         * `get`: This object's position
         *
         * `set`: If the provided value isn't `NaN`, changes this object's z position
         */
        layer: number;
        /**
         * This objet's position in 3D space
         */
        readonly position: srvsdbx_Geometry.Point3D;
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
        readonly "__#3@#draw": (p5: import("p5")) => void;
        /**
         * An event target on which listeners can be added
         */
        readonly "__#3@#events": SandboxEventTarget<{
            collision: {
                event: CollisionEvent;
                args: [Generic<BaseGenericEvents>];
            };
            death: {
                event: Event;
                args: [PlayerLike | undefined];
            };
            kill: {
                event: Event;
                args: [PlayerLike]; /**
                 * A reference to the matter.js body this object contains
                 */
            };
        }>;
        /**
         * An event target on which listeners can be added
         */
        readonly events: SandboxEventTarget<{
            collision: {
                event: CollisionEvent;
                args: [Generic<BaseGenericEvents>];
            };
            death: {
                event: Event;
                args: [PlayerLike | undefined];
            };
            kill: {
                event: Event;
                args: [PlayerLike]; /**
                 * A reference to the matter.js body this object contains
                 */
            };
        }>;
        /**
         * Whether or not this Generic has been destroyed (and by extension, whether or not it's safe to call `.update` or `.draw` on it)
         */
        "__#3@#destroyed": boolean;
        /**
         * Whether or not this Generic has been destroyed (and by extension, whether or not it's safe to call `.update` or `.draw` on it)
         */
        readonly destroyed: boolean;
        /**
         * This generic's id
         */
        readonly "__#3@#id": number;
        /**
         * This generic's id
         */
        readonly id: number;
        /**
         * The `Generic` to which this object is locked via `follow`
         */
        "__#3@#parent": srvsdbx_ErrorHandling.Maybe<Generic>;
        /**
         * The `Generic` to which this object is locked via `follow`
         */
        readonly parent: srvsdbx_ErrorHandling.Maybe<Generic<BaseGenericEvents>>;
        /**
         * The offset at which this object will follow its parent, relative to the parent's position
         * - `x`: The offset to apply along the x-axis
         * - `y`: The offset to apply along the y-axis
         * - `z`: The offset to apply along the z-axis
         * - `parr`: The offset to apply along the axis parallel to the parent's orientation
         * - `perp`: The offset to apply along the axis perpendicular to the parent's orientation
         */
        "__#3@#followOffset": {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        };
        /**
         * The offset at which this object will follow its parent, relative to the parent's position
         * - `x`: The offset to apply along the x-axis
         * - `y`: The offset to apply along the y-axis
         * - `z`: The offset to apply along the z-axis
         * - `parr`: The offset to apply along the axis parallel to the parent's orientation
         * - `perp`: The offset to apply along the axis perpendicular to the parent's orientation
         */
        readonly followOffset: {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        };
        /**
         * A Map whose values are `Generic`s following this object and whose keys are their corresponding `id`s
         */
        readonly "__#3@#followers": Map<number, Generic>;
        /**
         * A Map whose values are `Generic`s following this object and whose keys are their corresponding `id`s
         */
        readonly followers: Map<number, Generic<BaseGenericEvents>>;
        /**
         * Modifies this object's position in accordance to its velocities
         */
        update(): void;
        /**
         * Sets this generic's position instantly
         * @param position The position to place this object at
         */
        setPosition(position: srvsdbx_Geometry.Point2D): void;
        /**
         * Calls the user-defined drawing function in order to draw this object
         * @param p5 The gamespace's p5 instance
         */
        draw(p5: import("p5")): void;
        /**
         * Uses the various angular velocities currently applied to this object (through `angVelocityMap`) to determine a net angular velocity
         *
         * Does not take the time since the last physics update into account.
         */
        compileAngularVelocities(): number;
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
        follow(obj: Generic, offset?: {
            x: number;
            y: number;
            z: number;
            parr: number;
            perp: number;
        }): void;
        /**
         * Removes this object's bondage to another
         */
        unfollow(): void;
    }>;
    /**
     * Game settings
     */
    readonly "__#4@#settings": {
        drawHitboxes: boolean;
        drawVelocities: boolean;
        hitboxStyle: "stroke" | "fill" | "both";
        readonly debugColors: {
            COLLIDABLE: string;
            GROUND: string;
            PARTICLE: string;
            DECAL: string;
            AREA_OF_EFFECT: string;
            REFLECTIVE: string;
            DEFAULT: string;
        };
    };
    /**
     * Game settings
     */
    readonly settings: {
        drawHitboxes: boolean;
        drawVelocities: boolean;
        hitboxStyle: "stroke" | "fill" | "both";
        readonly debugColors: {
            COLLIDABLE: string;
            GROUND: string;
            PARTICLE: string;
            DECAL: string;
            AREA_OF_EFFECT: string;
            REFLECTIVE: string;
            DEFAULT: string;
        };
    };
    /**
     * The timestamp at which the gamespace became ready
     */
    "__#4@#startup": number;
    /**
     * The timestamp at which the gamespace became ready
     */
    readonly startup: number;
    /**
     * A reference to the Matter.js World object used by the current level
     */
    readonly world: Matter.World | undefined;
    /**
     * Starts a given level
     * @param id The level's id
     */
    startLevel(id: number): void;
    /**
     * Calls `drawHitboxIfEnabled` and `drawVelocityIfEnabled`
     * @param p5 The game's p5 instance
     * @param style What color to draw the hitbox with. Must be one specified in `hitboxColors`
     * @param hitboxCallback The function to be called to draw the object's hitbox
     * @param transition A function that will be called between hitboxes and velocity. Useful for transforming the canvas in some way before drawing velocities.
     * @param object The generic object whose velocities should be drawn
     */
    drawDebug(p5: import("p5"), style: keyof typeof this.settings.debugColors, hitboxCallback: (p5: import("p5")) => void, transition: ((p5: import("p5")) => void) | undefined, object: Generic<BaseGenericEvents> | Projectile): void;
    /**
     * If `drawHitboxes` is on, draws an object's hitbox according to the style and the provided drawing function
     * @param p5 The game's p5 instance
     * @param style What color to draw the hitbox with. Must be one specified in `hitboxColors`
     * @param callback The drawing function to be called to draw the object
     */
    drawHitboxIfEnabled(p5: import("p5"), style: keyof typeof this.settings.debugColors, callback: (p5: import("p5")) => void): void;
    /**
     * If `drawVelocities` is on, draws two vectors representing the object's linear and angular velocities respectively
     * @param p5 The game's p5 instance
     * @param object The generic object whose velocities should be drawn
     */
    drawVelocityIfEnabled(p5: import("p5"), object: Generic | Projectile): void;
    /**
     * A generic function for performing common level setup, like creating the canvas and configuring p5
     * @param p5 The p5 instance used by the current level
     * @param player The player object
     */
    setup(p5: import("p5"), player: Player): void;
    /**
     * A generic function for performing common game logic, like physics
     */
    update(): void;
};
/**
 * A simplified representation of an imported object
 */
interface SimpleImport {
    /**
     * This gun's name
     */
    readonly name: string;
    /**
     * The name this item will be referred to as in the HUD; if omitted, the value for `name` is used.
     */
    readonly displayName?: string;
    /**
     * The version of the sandbox this object was made for
     */
    readonly targetVersion: string;
    /**
     * The namespace this object belongs to
     */
    readonly namespace: string;
    /**
     * From where this object was imported
     */
    readonly includePath: string;
}
/**
 * Represents an object imported from somewhere
 */
declare class ImportedObject {
    #private;
    /**
     * This item's name
     */
    get name(): string;
    /**
     * What the item will be referred to as in the HUD; if omitted, then `name` is used
     */
    get displayName(): string | undefined;
    /**
     * The version of the sandbox this item was made for
     */
    get targetVersion(): string;
    /**
     * The namespace this prototype belongs to
     */
    get namespace(): string;
    /**
     * An internal name used to avoid naming conflicts
     */
    get internalName(): string;
    /**
     * From where this item was imported
     */
    get includePath(): string;
    /**
     * `It's a constructor. It constructs.`
     * @param name This object's name, as it will appear in-game
     * @param targetVersion The version of the sandbox this object targets
     * @param namespace From where this object was imported
     * @param includePath From where this object was imported
     */
    constructor(name: typeof ImportedObject.prototype.name, displayName: typeof ImportedObject.prototype.displayName, targetVersion: typeof ImportedObject.prototype.targetVersion, namespace: typeof ImportedObject.prototype.namespace, includePath: typeof ImportedObject.prototype.includePath);
}
type Gamespace = typeof gamespace;