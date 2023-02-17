/**
 * A class that represents some projectile. Abstract class
 *
 * surviv curiously handles projectiles by only keeping track of
 * its last position and its current one: collision is then done by
 * testing for intersections between that segment and any game bodies.
 * This means that tracer dimensions are purely cosmetic
 */
abstract class Projectile implements Destroyable {
    /**
     * This projectile's id, picked from the same pool as every other id
     */
    readonly #id = generateId();
    /**
     * This projectile's id, picked from the same pool as every other id
     */
    get id() { return this.#id; }

    /**
     * Represents the this projectile's start point (where it spawns)
     */
    #start: srvsdbx_Geometry.Point2D;
    /**
     * Represents the this projectile's start point (where it spawns)
     */
    get start() { return this.#start; }

    /**
     * Represents the projectile's endpoint (where it'll despawn)
     */
    #end: srvsdbx_Geometry.Point2D;
    /**
     * Represents the projectile's endpoint (where it'll despawn)
     */
    get end() { return this.#end; }

    /**
     * The timestamp this projectile was created at
     */
    #created = gamespace.currentUpdate;
    /**
     * The timestamp this projectile was created at
     */
    get created() { return this.#created; }

    #lifetime: number;
    /**
     * Uses this projectile's speed and endpoints to calculate how long it'll live for
     */
    get lifetime() { return this.#lifetime; }

    /**
     * This projectile's current position
     */
    #position: srvsdbx_Geometry.Point2D;
    /**
     * This projectile's position in 3D space
     */
    get position() { return { x: this.#position.x, y: this.#position.y, z: this.layer } as srvsdbx_Geometry.Point3D; }
    set position(v: srvsdbx_Geometry.Point3D) {
        this.#position = { x: v.x, y: v.y };
        this.layer = v.z;
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
    set layer(v) {
        !Number.isNaN(v) && (this.#layer = v);
    }

    /**
     * What sublayer this projectile resides on. Objects on sublayers below 0 are drawn below a player on the same level,
     * while those with a sublayer greater than or equal to 0 are drawn above it.
     */
    #subLayer: number;
    /**
     * What sublayer this projectile resides on. Objects on sublayers below 0 are drawn below a player on the same level,
     * while those with a sublayer greater than or equal to 0 are drawn above it.
     */
    get subLayer() { return this.#subLayer; }

    /**
     * This projectile's last position
     */
    #lastPosition: srvsdbx_Geometry.Point2D;
    /**
     * This projectile's last position
     */
    get lastPosition() { return this.#lastPosition; }

    /**
     * The angle this projectile started at
     */
    #startAngle: number;

    /**
     * The angle of the trajectory this projectile will take
     */
    #trajectory: number;
    /**
     * The angle of the trajectory this projectile will take
     */
    get trajectory() { return this.#trajectory; }

    /**
     * This projectile's current angle
     */
    #angle: number;
    /**
     * This projectile's current angle
     */
    get angle() { return this.#angle; }

    /**
     * This projectile's angular velocity
     */
    #angularVelocity = 0;
    /**
     * This projectile's angular velocity
     */
    get angularVelocity() { return this.#angularVelocity; }

    /**
     * The opacity of this projectile
     */
    #alpha = 255;
    /**
     * The opacity of this projectile
     *
     * `get`: Retrieves this projectile's opacity
     *
     * `set`: Sets this projectile's opacity, except if the provided value is `NaN`
     */
    get alpha() { return this.#alpha; }
    set alpha(v) {
        !Number.isNaN(v) && (this.#alpha = v);
    }

    /**
     * Whether this projectile has been destroyed
     */
    #destroyed = false;

    /**
     * Whether this projectile has been destroyed
     */
    get destroyed() { return this.#destroyed; }

    /**
     * An event target on which listeners can be added
     */
    readonly #events = new SandboxEventTarget<
        {
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
            },
            /**
             * Represents this projectile's destruction
             */
            destroy: {
                /**
                 * The `Event` instance
                 */
                event: Event,
                /**
                 * Nothing
                 */
                args: [];
            };
        }
    >;
    /**
     * An event target on which listeners can be added
     */
    get events() { return this.#events; }

    /**
     * A user-defined function for drawing this object
     */
    #draw: (p5: import("p5")) => void;

    /**
     * Keeps track of the objects this bullet has bounced off of. When a bullet is deviated, its start and endpoints
     * are shifted, effectively creating a new projectile. However, because of floating-point inaccuracy, the next
     * update frame might incorrectly believe the projectile has struck the same surface again, deviating it again,
     * leading to a cycle of reflections.
     *
     * To avoid this, after rebounding off of a surface, the projectile cannot rebound off of it again for one update frame.
     * Projectiles should have traveled far enough to safely clear the surface by then.
     */
    #reflectionRecord = new Map<number, number>();

    /**
     * `* It's a constructor. It constructs.`
     * @param body The matter.js body this object will use
     * @param emitter The `Gun` that spawned this object
     * @param trajectory Information about the trajectory this projectile will follow, conforming to this format:
     * - The starting position must always be given
     * - If the end point is given, specify either the projectile's speed or the time it should take to get from start to end
     * - Otherwise, specify a direction
     * - Out of the projectile's lifetime, its travel distance and speed, specify two
     * @param drawFunc A function that'll be invoked in order to draw this object
     */
    constructor(
        // Starting point must be specified
        trajectory: { start: srvsdbx_Geometry.Point2D; } & (
            // Either the endpoint
            {
                end: srvsdbx_Geometry.Point2D;
            } & (
                /* OPTION 1 */ { speed: number; } // with the projectile's speed
                /* OPTION 2 */ | { lifetime: number; } // or the time between start and end point
            ) |
            // or a direction
            {
                direction: number,
            } & ( // and
                /* OPTION 3 */
                {
                    lifetime: number, // a lifetime and
                    speed: number; // a speed
                } |
                /* OPTION 4 */
                {
                    lifetime: number, // a lifetime
                    distance: number; // and a distance
                } |
                /* OPTION 5 */
                {
                    distance: number, // or a distance
                    speed: number; // and a speed
                }
            )
        ) & { // oh and angle stuff if you feel like it
            initialAngle?: number,
            spinVel?: number;
        },
        drawFunc: (p5: import("p5")) => void,
        subLayer = 0
    ) {
        if (new.target === Projectile) throw new TypeError("Cannot instantiate abstract class 'Projectile'.");

        this.#start = srvsdbx_Geometry.Vector2D.clone(srvsdbx_Geometry.Vector2D.toPoint2D(trajectory.start));
        this.#lastPosition = { x: this.#start.x, y: this.#start.y };
        this.#position = { x: this.#start.x, y: this.#start.y };

        this.#draw = drawFunc;
        this.#angularVelocity = trajectory.spinVel ?? 0;

        if ("end" in trajectory) {
            this.#end = srvsdbx_Geometry.Vector2D.clone(srvsdbx_Geometry.Vector2D.toPoint2D(trajectory.end));

            if ("lifetime" in trajectory) { // OPTION 1
                this.#lifetime = trajectory.lifetime;
            } else { // OPTION 2
                this.#lifetime = srvsdbx_Geometry.Vector2D.distBetweenPts(this.#start, trajectory.end) / trajectory.speed;
            }
        } else {
            if ("distance" in trajectory) {
                if ("lifetime" in trajectory) { // OPTION 4
                    this.#lifetime = trajectory.lifetime;

                    this.#end = srvsdbx_Geometry.Vector2D
                        .fromPolarToVec(
                            trajectory.direction,
                            trajectory.distance
                        )
                        .plus(this.#start)
                        .toPoint2D();
                } else { // OPTION 5
                    this.#end = srvsdbx_Geometry.Vector2D
                        .fromPolarToVec(
                            trajectory.direction,
                            trajectory.distance
                        )
                        .plus(this.#start)
                        .toPoint2D();

                    this.#lifetime = trajectory.distance / trajectory.speed;
                }
            } else { // OPTION 3
                this.#end = srvsdbx_Geometry.Vector2D
                    .fromPolarToVec(
                        trajectory.direction,
                        trajectory.speed * trajectory.lifetime
                    )
                    .plus(this.#start)
                    .toPoint2D();

                this.#lifetime = trajectory.lifetime;
            }
        }

        const difference = srvsdbx_Geometry.Vector2D.minus(this.#end, this.#start);
        this.#trajectory = this.#startAngle = this.#angle = trajectory.initialAngle ?? srvsdbx_Math.normalizeAngle(Math.PI / 2 + Math.atan2(difference.y, difference.x), "radians");

        this.#subLayer = subLayer;
    }

    /**
     * Since this projectile's endpoints and speed are known, we can linearly interpolate between them
     */
    update() {
        if (this.#destroyed) return;

        const deltaTime = gamespace.currentUpdate - this.#created,
            lifetime = this.#lifetime;

        if (deltaTime >= lifetime) return this.destroy();

        this.#lastPosition = srvsdbx_Geometry.Vector2D.clone(this.#position);
        this.#position = srvsdbx_Geometry.Vector2D.lerp(this.#start, this.#end, deltaTime / lifetime);
        this.#angle = this.#startAngle + deltaTime * this.#angularVelocity / 1000;

        // remove reflection records not originating from this or the last update
        for (const [key, value] of this.#reflectionRecord)
            if (value != gamespace.currentUpdate && value != gamespace.lastUpdate)
                this.#reflectionRecord.delete(key);
    }

    /**
     * Calls the user-defined drawing function in order to draw this object
     * @param p5 The gamespace's p5 instance
     */
    draw(p5: import("p5")) {
        if (this.destroyed) return;

        this.#draw(p5);
    }

    /**
     * Sets this projectile's position. Ultimately, this does nothing, as the next `update` call will set it back on track. Does not affect `lastPosition`
     * @param pos The position the move this projectile to
     */
    setPosition(pos: srvsdbx_Geometry.Point2D) {
        this.#position = srvsdbx_Geometry.Vector2D.clone(pos);
    }

    /**
     * Reflects a projectile in a certain direction. This method effectively creates a new projectile by changing
     * most of this one's fields, such as `start`, `end`, `lifetime`, `created` and `angle`.
     * @param origin From where the bullet is being reflected
     * @param direction The direction in which to reflect the projectile
     * @param source The game object which caused the bullet to be deviated. For one tick after being reflected,
     * this bullet cannot be reflected again by the same source. This is done to prevent floating point inaccuracies
     * from causing a bullet from "ping-ponging" within the same reflective surface at a high frequency
     */
    reflect(origin: srvsdbx_Geometry.Point2D, direction: number, source: Generic): srvsdbx_ErrorHandling.Result<undefined, string> {
        if (Number.isNaN(direction)) return { err: "Direction was NaN" };

        if (!this.#reflectionRecord.has(source.id)) {
            this.#reflectionRecord.set(source.id, gamespace.currentUpdate);

            const range = srvsdbx_Geometry.Vector2D.distBetweenPts(this.#start, this.#end),
                dt = gamespace.currentUpdate - this.#created;

            this.#start = srvsdbx_Geometry.Vector2D.clone(this.#lastPosition = this.#position = srvsdbx_Geometry.Vector2D.clone(origin));
            this.#end = srvsdbx_Geometry.Vector2D.fromPolarToVec(direction, range * (1 - (dt / this.#lifetime))).plus(this.#start);
            this.#lifetime -= dt;
            this.#created = gamespace.currentUpdate;
            this.#trajectory = this.#startAngle = this.#angle = srvsdbx_Math.normalizeAngle(Math.PI / 2 + direction, "radians");
        }

        return srvsdbx_ErrorHandling.emptyResult();
    }

    /**
     * Modifies the range of a projectile
     * @param range The new range. If this is shorter than the distance that has been traveled, the projectile is destroyed
     */
    modifyRange(range: number): srvsdbx_ErrorHandling.Result<undefined, string> {
        if (Number.isNaN(range)) return { err: "Range was NaN" };

        const oldRange = srvsdbx_Geometry.Vector2D.distBetweenPts(this.#start, this.#end),
            lifetime = this.#lifetime,
            traveled = oldRange * ((gamespace.currentUpdate - this.#created) / lifetime);

        if (traveled >= range) return { res: void this.destroy() };

        /*
            The way projectiles were designed—lerping between endpoints over a specified timeframe—doesn't play nicely
            with changing endpoints, so we have to do some math to maintain a constant velocity

            Here, the algebra is

            lifetime = distance / speed
                     = (range - traveled) / (oldRange / oldLifetime)
                     = (range - traveled) * oldLifetime / oldRange
            
            since oldLifetime is just lifetime at this point, we can simplify this more

            lifetime = lifetime * ((range - traveled) / oldRange)
            lifetime *= ((range - traveled) / oldRange)
        */
        this.#lifetime *= (range - traveled) / srvsdbx_Geometry.Vector2D.distBetweenPts(this.#start, this.#end);

        this.#end = srvsdbx_Geometry.Vector2D.fromPoint2D(this.#start)
            .plus({
                direction: this.#trajectory - Math.PI / 2,
                magnitude: range
            });

        return srvsdbx_ErrorHandling.emptyResult();
    }

    /**
     * Identical to `Generic.destroy`, but clears projectile-specific object fields
     */
    destroy() {
        this.#events.dispatchEvent("destroy");
        this.#destroyed = true;
        gamespace.objects.projectiles.delete(this.id);

        // @ts-expect-error
        this.#events = this.#start = this.#end = this.#lastPosition = this.#position = this.#draw = this.#reflectionRecord = void 0;
    }
}

/**
 * Represents a bullet fired by a firearm
 */
class Bullet extends Projectile implements Destroyable {
    /**
     * The maximum amount of times a bullet can be reflected
     * before being destroyed
     */
    static #MAX_REFLECTIONS = 3;
    /**
     * The maximum amount of times a bullet can be reflected
     * before being destroyed
     */
    static get MAX_REFLECTIONS() { return this.#MAX_REFLECTIONS; }

    /**
     * Each time this bullet is reflected, its range will be divided by
     * this amount. Note that this applied to the overall range and not the
     * remaining range, meaning that if the bullet's travel distance exceeds
     * its new range, it will immediately be destroyed
     */
    static #REFLECTION_RANGE_DECAY_FACTOR = 1.5;
    /**
     * Each time this bullet is reflected, its range will be divided by
     * this amount. Note that this applied to the overall range and not the
     * remaining range, meaning that if the bullet's travel distance exceeds
     * its new range, it will immediately be destroyed
     */
    static get REFLECTION_RANGE_DECAY_FACTOR() { return this.#REFLECTION_RANGE_DECAY_FACTOR; }

    /**
     * The opacity at which to draw this projectile. Note that the tracer color's
     * opacity will be mixed with this one to yield a final opacity
     */
    #opacity = 1;

    /**
     * The amount of damage this projectile will inflict
     */
    #damage: number;
    /**
     * The amount of damage this projectile will inflict
    */
    get damage() { return this.#damage; }

    /**
     * The amount of times this bullet has been reflected
     *
     * After `Bullet.MAX_REFLECTIONS` reflects, it is destroyed
     */
    #reflectCount = 0;

    /**
     * Records the last time falloff was applied
     */
    #lastFalloffStep = 0;

    /**
     * The amount by which this bullet's damage will be multiplied every 100 surviv units
     */
    #falloff: number;
    /**
     * The amount by which this bullet's damage will be multiplied every 100 surviv units
     */
    get falloff() { return this.#falloff; }

    /**
     * Various informations about this projectile's behavior
     */
    #properties: Ammo["projectileInfo"];
    /**
     * Various informations about this projectile's behavior
     */
    get properties() { return this.#properties; }

    /**
     * Whether or not this projectile's type is `explosive`
     */
    #isExplosive = false;
    /**
     * Whether or not this projectile's type is `explosive`
     */
    get isExplosive() { return this.#isExplosive; }

    /**
     * How many objects this projectile has struck
     */
    #hitCount = 0;
    /**
     * How many objects this projectile has struck
     */
    get hitCount() { return this.#hitCount; }

    /**
     * A `Set` containing the ID's of every object this projectile has hit
     */
    #hitSet = new Set<Generic["id"]>;

    /**
     * The `Gun` that fired this bullet
     */
    readonly #emitter: Gun;

    /**
     * Whether or not this projectile has exploded yet
     */
    #hasExploded = false;

    /**
     * `* It's a constructor. It constructs.`
     * @param position A `Point2D` object dictating this object's starting position
     * @param end A `Point2D` object dictating this object's end point
     * @param speed A number indicating the speed—in units per millisecond—of this projectile
     * @param damage The amount of damage this projectile inflicts by default
     * @param drawFunction A function that will be invoked to draw this object
     * @param properties More information about this projectile's behavior
     * @param persistance Information about how this projectile behaves when striking a target
     * @param effectOnHit A status effect that will be applied to targets when struck
     * @param emitter The `Gun` that fired this bullet
     */
    constructor(
        position: srvsdbx_Geometry.Point2D,
        falloff: number,
        end: srvsdbx_Geometry.Point2D,
        speed: number,
        damage: number,
        drawFunction: (p5: import("p5")) => void,
        properties: Ammo["projectileInfo"],
        persistance: Required<GunPrototype["ballistics"]["persistance"] & {}>,
        effectsOnHit: PrototypeReference<"statusEffects">[] | undefined,
        emitter: Gun
    ) {
        super(
            {
                start: srvsdbx_Geometry.Vector2D.clone(position),
                speed: speed,
                end: srvsdbx_Geometry.Vector2D.clone(end),
                spinVel: extractValue(properties.spinVel)
            },
            drawFunction
        );

        this.#properties = properties;
        this.#emitter = emitter;
        this.#isExplosive = properties.type == "explosive";

        {
            const props = this.#properties as unknown as SimpleAmmo["projectileInfo"] & { type: "explosive"; };

            this.events.addEventListener("collision", (ev, target) => {
                if (target instanceof PlayerLike) {
                    const notInSet = !this.#hitSet.has(target.id);

                    if (notInSet || persistance.allowMultipleHitsPerTarget) {
                        if (effectsOnHit?.length) {
                            for (let i = 0, l = effectsOnHit.length; i < l; i++) {
                                const effect = gamespace.prototypes.statusEffects.get(effectsOnHit[i])!,
                                    effectAlreadyApplied = [...target.statusEffects.values()].find(s => s.prototype == effect);

                                if (effectAlreadyApplied) effectAlreadyApplied.renew();
                                else target.statusEffects.add(new StatusEffect(effect, target));
                            }
                        }

                        if (this.#isExplosive && props.explodeOnContact)
                            this.#explode(
                                srvsdbx_Geometry.Vector2D.fromPoint2D(this.position).toPoint2D(),
                                effectsOnHit
                            );
                        else target.applyDamage(this.#damage, emitter.owner);

                        if (notInSet) {
                            this.#damage *= persistance.hitMultiplier;
                            this.#hitSet.add(target.id);
                        }

                        if (persistance.hitsBeforeDespawn <= ++this.#hitCount) {
                            /*
                                The game runs at a certain tickrate. Every frame, a projectile is in a certain spot.
                                These facts combined mean that the projectile is only ever seen in a handful of spots,
                                and your brain fills in the gaps between those spots.

                                When a projectile hits something, the intuitive response is to immediately destroy it.
                                However, if we do that, a problem arises. Fast-moving projectiles cover more distance
                                in the same amount of time as a slower-moving one does, meaning that the distance between
                                its positions from frame to frame is bigger. Collision-wise, this isn't a problem, because
                                we draw a line from the bullet's position last frame and its position on the current frame
                                and run collision detection on that. But visually, neither of these frames represent where
                                the projectile really stopped—one is too far back, and the other is too far forwards.

                                So we translate the projectile so that it's barely touching the surface it collided with,
                                and we replace the update method with the destroy method (very evil).

                                This event listener is invoked from the collision segment within the gamespace's update
                                method. After updates, we draw everything. Since the bullet hasn't been destroyed, we draw
                                it at the position we just moved it to (just touching the surface it collided with). On
                                the next update cycle (or frame), this projectile's update method is called, but since we
                                replaced it with its destroy method, the projectile is destroyed.

                                Thus we solve our problem, in a rather ugly way, granted, but one that works.
                            */
                            const snap = ev.intersectionPoints.sort(
                                (a, b) => srvsdbx_Geometry.Vector2D.squaredDistBetweenPts(this.start, a)
                                /*   */ - srvsdbx_Geometry.Vector2D.squaredDistBetweenPts(this.start, b)
                            )[0];

                            this.setPosition(snap);

                            this.update = this.destroy;
                        }

                        new Particle(
                            gamespace.prototypes.particles.get("srvsdbx::blood_splat")!,
                            srvsdbx_Geometry.Vector2D.clone(this.position),
                            srvsdbx_Math.randomAngle()
                        );
                    }
                }
            });

            this.events.on("destroy", () => {
                this.#explode(this.end, effectsOnHit);
            });
        }

        this.#falloff = falloff;
        this.#damage = damage;
        gamespace.objects.projectiles.set(this.id, this);
    }

    /**
     * A generic drawing function for bullets originating from firearms
     * @param emitter The firearm that fired this bullet
     */
    static drawFromFirearm(emitter: Gun) {
        const prototype = emitter.prototype,
            ammoInfo = gamespace.prototypes.ammoTypes.get(prototype.caliber)!,
            images = ammoInfo.projectileInfo.images,
            image = pickRandomInArray(images),
            dimensions = srvsdbx_AssetManagement.determineImageDimensions(image.asset, prototype.ballistics.tracer);

        return function(this: Bullet, p5: import("p5")) {
            if (this.destroyed) return;

            const deltaTime = gamespace.currentUpdate - this.created,
                props = this.#properties as unknown as SimpleAmmo["projectileInfo"] & { type: "explosive"; };

            p5.push();

            p5.translate(this.position.x, this.position.y);
            p5.rotate(this.angle);

            p5.noStroke();
            p5.noFill();

            p5.imageMode(p5.CENTER);
            p5.rectMode(p5.CENTER);

            const trail = prototype.ballistics.tracer.trail;

            if (trail) {
                p5.push();

                p5.rotate(this.trajectory - this.angle);

                const trailLength = Math.min(trail.maxLength, srvsdbx_Geometry.Vector2D.distBetweenPts(this.position, this.start));

                p5.translate(trail.offset.perp, trail.offset.parr + trailLength / 2);
                p5.tint(trail.tint);

                trailLength && p5.image(
                    trail.image.asset,
                    0, 0,
                    trail.width, trailLength
                );

                gamespace.drawHitboxIfEnabled(
                    p5,
                    "DEFAULT",
                    () => p5.rect(0, 0, trail.width, trailLength)
                );

                p5.pop();
            }

            if (this.#isExplosive) {
                const scale = (-4 * (props.heightPeak ?? 0) * deltaTime * (deltaTime - this.lifetime)) / this.lifetime ** 2 + 1;

                p5.scale(scale, scale);
            }

            const color = p5.color(ammoInfo.tints.normal);

            let alpha = this.#opacity;

            if (prototype.suppressed) {
                const minOpacity = ammoInfo.alpha.min,
                    maxOpacity = ammoInfo.alpha.max,
                    opacityRate = ammoInfo.alpha.rate,
                    direction = Math.sign(1 - opacityRate) as -1 | 0 | 1;

                if (
                    (minOpacity < this.alpha && direction != -1) ||
                    (this.alpha < maxOpacity && direction != 1)
                ) this.alpha = +Decimal.clamp(this.alpha * opacityRate, minOpacity, maxOpacity);

                alpha *= this.alpha;
            }
            color.setAlpha(alpha * 255);

            p5.tint(color);

            const width = dimensions.width,
                finalLength = prototype.ballistics.tracer.forceMaximumLength
                    ? dimensions.height
                    : Math.min(dimensions.height, srvsdbx_Geometry.Vector2D.distBetweenPts(this.position, this.start)),
                parrOffset = props.spinVel ? 0 : finalLength / 2;

            p5.rectMode(p5.CORNER);

            finalLength && p5.image(
                image.asset,
                0,
                parrOffset,
                width,
                finalLength
            );


            gamespace.drawHitboxIfEnabled(
                p5,
                "DEFAULT",
                () => p5.rect(
                    -width / 2,
                    parrOffset - finalLength / 2,
                    width,
                    finalLength
                )
            );

            p5.rotate(this.trajectory - this.angle);
            gamespace.drawDebug(
                p5,
                "COLLIDABLE", () => {
                    p5.rect(
                        0,
                        0,
                        1,
                        srvsdbx_Geometry.Vector2D.distBetweenPts(this.position, this.lastPosition)
                    );
                },
                () => {
                    p5.translate(0, 0);
                    p5.rotate(-this.trajectory);
                    p5.translate(-this.position.x, -this.position.y);
                },
                this
            );

            p5.pop();
        };
    }

    /**
     * A generic drawing function for bullets originating from explosions (aka shrapnel)
     * @param emitter Information to be used to draw this shrapnel
     */
    static drawFromExplosion(emitter: ExplosionPrototype["shrapnel"] & {}) {
        const { width, height } = srvsdbx_AssetManagement.determineImageDimensions(emitter.tracer.image.asset, emitter.tracer);

        return function(this: Bullet, p5: import("p5")) {
            if (this.destroyed) return;

            p5.push();

            p5.translate(this.position.x, this.position.y);
            p5.rotate(this.angle);

            p5.noStroke();
            p5.noFill();

            p5.imageMode(p5.CENTER);
            p5.rectMode(p5.CENTER);

            p5.tint(emitter.tracer.color);

            const finalLength = Math.min(height, srvsdbx_Geometry.Vector2D.distBetweenPts(this.position, this.start)),
                offset = (this.#properties.spinVel ? -1 : 1) * finalLength / 2;

            // p5 has this weird bug where 0-height images are drawn at full height?
            finalLength && p5.image(
                emitter.tracer.image.asset,
                0,
                offset,
                width,
                finalLength
            );

            gamespace.drawHitboxIfEnabled(p5, "DEFAULT", () => p5.rect(0, offset, width, finalLength));

            gamespace.drawDebug(
                p5,
                "COLLIDABLE",
                () => {
                    p5.rect(
                        0,
                        0,
                        1,
                        srvsdbx_Geometry.Vector2D.distBetweenPts(this.position, this.lastPosition)
                    );
                },
                () => {
                    p5.rotate(-this.angle);
                    p5.translate(-this.position.x, -this.position.y);
                },
                this
            );
            p5.pop();
        };
    }

    /**
     * Creates a piece of shrapnel (internally a special kind of `Bullet`)
     * @param pos This shrapnel's spawn point
     * @param shrapnelData Information about the shrapnel
     * @param emitter The `Gun` that's the root cause of this shrapnel
     */
    static makeShrapnel(pos: srvsdbx_Geometry.Point2D, shrapnelData: ExplosionPrototype["shrapnel"] & {}, emitter: Gun) {
        const trajectory = srvsdbx_Math.randomAngle(),
            start = srvsdbx_Geometry.Vector2D.clone(pos),
            data = shrapnelData;

        return new Bullet(
            start,
            data.falloff,
            srvsdbx_Geometry.Vector2D.fromPolarToVec(trajectory, extractValue(data.range)).plus(start),
            data.velocity,
            data.damage,
            Bullet.drawFromExplosion(data),
            {
                type: "bullet",
                images: [data.tracer.image],
                spinVel: 0
            },
            {
                allowMultipleHitsPerTarget: false,
                hitMultiplier: 0,
                hitsBeforeDespawn: 1
            },
            void 0,
            emitter
        );
    }

    /**
     * Called internally to spawn an explosion at a specified offset
     * @param position The position at which to spawn this explosion
     */
    #explode(position: srvsdbx_Geometry.Point2D, effectsOnHit?: PrototypeReference<"statusEffects">[]) {
        if (this.#properties.type != "explosive" || this.#hasExploded) return;

        const properties = this.#properties as unknown as SimpleAmmo["projectileInfo"] & { type: "explosive"; };
        // Omit makes me lose all the IntelliSense, so the alternative is this suboptimal cast lol

        this.#hasExploded = true;
        new Explosion(
            gamespace.prototypes.explosions.get(properties.explosionType)!,
            {
                x: position.x,
                y: position.y,
                z: this.layer
            },
            this.#emitter,
            effectsOnHit
        );
    }

    override update() {
        super.update();

        if (this.destroyed) return;

        if (srvsdbx_Geometry.Vector2D.squaredDistBetweenPts(this.position, this.start) >= (this.#lastFalloffStep + (100 * gamespace.PLAYER_SIZE)) ** 2) {
            this.#lastFalloffStep += (100 * gamespace.PLAYER_SIZE);

            this.#damage = srvsdbx_Math.sigFigIshMult(this.#damage, this.#falloff);
        }
    }

    /**
     * Identical to the method it overrides, save for the fact that it also modifies this bullet's statistics
     * @param origin From where the bullet is being reflected
     * @param direction The direction in which to reflect the projectile
     * @param source The game object which caused the bullet to be deviated. For one tick after being reflected,
     * this bullet cannot be reflected again by the same source. This is done to prevent floating point inaccuracies
     * from causing a bullet from "ping-ponging" within the same reflective surface at a high frequency
     */
    override reflect(origin: srvsdbx_Geometry.Point2D, direction: number, source: Generic<BaseGenericEvents>): srvsdbx_ErrorHandling.Result<undefined, string> {
        const range = srvsdbx_Geometry.Vector2D.distBetweenPts(this.start, this.end),
            traveled = srvsdbx_Geometry.Vector2D.distBetweenPts(this.start, this.position);

        const baseReflect = srvsdbx_ErrorHandling.handleResult(
            super.reflect(origin, direction, source),
            () => { },
            srvsdbx_ErrorHandling.identity,
        );

        if (baseReflect) return { err: baseReflect };

        this.#damage *= 0.7;
        this.#opacity *= 0.8;
        const newRange = range / (Bullet.#REFLECTION_RANGE_DECAY_FACTOR ** this.#reflectCount);

        if (
            ++this.#reflectCount >= Bullet.#MAX_REFLECTIONS
            || newRange <= traveled
        ) return { res: void this.destroy() };

        this.modifyRange(newRange);

        return srvsdbx_ErrorHandling.emptyResult();
    }

    /**
     * Identical to the method it overrides, but clears some internal fields
     */
    override destroy() {
        super.destroy();

        //@ts-expect-error
        this.#hitSet = this.#emitter = this.#properties = void 0;
    }
}