"use strict";
;
/**
 * Represents the generalization of a type of particle
 */
class ParticlePrototype extends ImportedObject {
    /**
     * The `ImageSrcPair` containing this particle's image
     */
    #image;
    /**
     * The `ImageSrcPair` containing this particle's image
     */
    get image() { return this.#image; }
    /**
     * The length of time this particle will exist for
     */
    #lifetime;
    /**
     * The length of time this particle will exist for
     */
    get lifetime() { return this.#lifetime; }
    /**
     * Pragmatically, a scale factor for this particle's physics: a value of 1 is normal 0.5 is double speed, etc
     */
    #drag;
    /**
     * Pragmatically, a scale factor for this particle's physics: a value of 1 is normal 0.5 is double speed, etc
     */
    get drag() { return this.#drag; }
    /**
     * The angular velocity at which this particle spins
     */
    #rotVel;
    /**
     * The angular velocity at which this particle spins
     */
    get rotVel() { return this.#rotVel; }
    /**
     * Information about the original size of this particle; `scale` applies itself to this
     */
    #baseSize;
    /**
     * Information about the original size of this particle; `scale` applies itself to this
     */
    get baseSize() { return this.#baseSize; }
    /**
     * Information about the scaling of this particle's image
     */
    #scale;
    /**
     * Information about the scaling of this particle's image
     */
    get scale() { return this.#scale; }
    /**
     * Information about the opacity of this particle's image
     */
    #alpha;
    /**
     * Information about the opacity of this particle's image
     */
    get alpha() { return this.#alpha; }
    /**
     * The color to tint this image
     */
    #tint;
    /**
     * The color to tint this image
     */
    get tint() { return this.#tint; }
    /**
     * The sublayering to apply to this particle. Particles whose sublayer is greater than or equal 0 are drawn above the player,
     * those whose sublayer is below 0 are drawn below. As the name implies, a particle on layer 1 will always be above one on layer
     * 0, regardless of the latter's sublayer.
     */
    #subLayer;
    /**
     * The sublayering to apply to this particle. Particles whose sublayer is greater than or equal 0 are drawn above the player,
     * those whose sublayer is below 0 are drawn below. As the name implies, a particle on layer 1 will always be above one on layer
     * 0, regardless of the latter's sublayer.
     */
    get subLayer() { return this.#subLayer; }
    /**
     * Takes a simplified representation of a firearm and converts it into a more rigorous one
     * @param obj The `SimpleParticle` object to parse
     * @returns A new `ParticlePrototype`
     */
    static async from(obj) {
        const errors = [], images = await srvsdbx_AssetManagement.loadImageArray(obj.images, errors, `${obj.includePath}/`);
        if (!errors.length) {
            return {
                res: new ParticlePrototype(obj.name, obj.displayName, obj.includePath, obj.namespace, obj.targetVersion, images, obj.lifetime, obj.drag, obj.rotVel, obj.baseSize, obj.scale, obj.alpha, obj.tint, obj.subLayer)
            };
        }
        return { err: errors };
    }
    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(name, displayName, includePath, namespace, targetVersion, image, lifetime, drag, rotVel, baseSize, scale, alpha, tint, subLayer) {
        super(name, displayName, targetVersion, namespace, includePath);
        const size = gamespace.PLAYER_SIZE;
        function autoOrScale(dim) {
            return dim == "auto" ? dim : dim * size;
        }
        this.#image = image;
        this.#lifetime = lifetime;
        this.#drag = drag;
        this.#rotVel = rotVel;
        this.#baseSize = {
            width: () => autoOrScale(extractValue(baseSize.width)),
            height: () => autoOrScale(extractValue(baseSize.height))
        };
        this.#scale = scale;
        this.#alpha = alpha;
        this.#tint = tint;
        this.#subLayer = subLayer;
    }
}
/**
 * Represents a specific particle in the game world
 */
class Particle extends Generic {
    /**
     * The timestamp this particle was created at
     */
    #created = gamespace.currentUpdate;
    /**
     * The timestamp this particle was created at
     */
    get created() { return this.#created; }
    /**
     * The prototype this particle is based
     */
    #proto;
    /**
     * The prototype this particle is based
     */
    get proto() { return this.#proto; }
    /**
     * The lifetime determined for this specific particle
     */
    #lifetime;
    /**
     * The lifetime determined for this specific particle
     */
    get lifetime() { return this.#lifetime; }
    /**
     * Information about the size this specific particle starts at
     */
    #baseSize;
    /**
     * Information about the size this specific particle starts at
     */
    get baseSize() { return this.#baseSize; }
    /**
     * Information about the scaling of this specific particle's image
     */
    #scale;
    /**
     * Information about the scaling of this specific particle's image
     */
    get scale() { return this.#scale; }
    /**
     * Information about the opacity of this specific particle's image
     */
    #alpha;
    /**
     * Information about the opacity of this specific particle's image
     */
    get alpha() { return this.#alpha; }
    /**
     * The color to tint this particle's image
     */
    #tint;
    /**
     * The color to tint this particle's image
     */
    get tint() { return this.#tint; }
    /**
     * The drag for this particle
     */
    #drag;
    /**
     * The drag for this particle
     */
    get drag() { return this.#drag; }
    /**
     * The angular drag for this particle
     */
    #rotDrag;
    /**
     * The angular drag for this particle
     */
    get rotDrag() { return this.#rotDrag; }
    /**
     * Either a scale factor that overrides this particle's normal one, or `null`, if such behavior isn't desired
     */
    #forcedScale = srvsdbx_ErrorHandling.Nothing;
    /**
     * Either a scale factor that overrides this particle's normal one, or `null`, if such behavior isn't desired
     */
    get forcedScale() { return this.#forcedScale; }
    /**
     * Either an opacity that overrides this particle's normal one, or `null`, if such behavior isn't desired
     */
    #forcedAlpha = srvsdbx_ErrorHandling.Nothing;
    /**
     * Either an opacity that overrides this particle's normal one, or `null`, if such behavior isn't desired
     */
    get forcedAlpha() { return this.#forcedAlpha; }
    /**
     * The sublayering to apply to this particle. Particles whose sublayer is greater than or equal 0 are drawn above the player,
     * those whose sublayer is below 0 are drawn below. As the name implies, a particle on layer 1 will always be above one on layer
     * 0, regardless of the latter's sublayer.
     */
    #subLayer;
    /**
     * The sublayering to apply to this particle. Particles whose sublayer is greater than or equal 0 are drawn above the player,
     * those whose sublayer is below 0 are drawn below. As the name implies, a particle on layer 1 will always be above one on layer
     * 0, regardless of the latter's sublayer.
     *
     * - `get`: Retrieves this particle's sublayer
     *
     * - `set`: Sets this particle's sublayer to the given value if it is not `NaN`
     */
    get subLayer() { return this.#subLayer; }
    set subLayer(v) { !Number.isNaN(v) && (this.#subLayer = v); }
    /**
     * The angle this casing starts at
     */
    #initialAngle;
    /**
     * `* It's a constructor. It constructs.`
     * @param proto The prototype this particle is based
     * @param position At what position to spawn this particle
     */
    constructor(proto, position, angle) {
        const image = pickRandomInArray(proto.image).asset, dimWidth = extractValue(proto.baseSize.width), dimHeight = extractValue(proto.baseSize.height), { width, height } = srvsdbx_AssetManagement.determineImageDimensions(image, {
            width: dimWidth,
            height: dimHeight
        }), body = Matter.Bodies.rectangle(0, 0, width, height), lifetime = extractValue(proto.lifetime);
        super(body, p5 => {
            if (this.destroyed)
                return;
            const body = this.body;
            p5.push();
            p5.translate(body.position.x, body.position.y);
            p5.rotate(this.angle);
            p5.noStroke();
            p5.noFill();
            p5.imageMode(p5.CENTER);
            p5.rectMode(p5.CENTER);
            const scaleFactor = this.getCalculatedScale();
            p5.scale(scaleFactor);
            const color = p5.color(this.tint);
            color.setAlpha(this.getCalculatedAlpha());
            p5.tint(color);
            p5.image(image, 0, 0, width, height);
            p5.pop();
            gamespace.drawDebug(p5, "PARTICLE", () => {
                p5.push();
                p5.rectMode(p5.CENTER);
                p5.translate(body.position.x, body.position.y);
                p5.rotate(this.angle);
                p5.scale(scaleFactor);
                p5.rect(0, 0, width, height);
                p5.pop();
            }, void 0, this);
        }, position, void 0, void 0, angle);
        this.#initialAngle = angle;
        this.collidable = false;
        this.#proto = proto;
        this.#lifetime = lifetime;
        this.#baseSize = {
            width: dimWidth,
            height: dimHeight
        };
        this.#scale = typeof proto.scale == "object" ? {
            start: extractValue(proto.scale.start),
            end: extractValue(proto.scale.end)
        } : proto.scale;
        this.#alpha = typeof proto.alpha == "object" ? {
            start: extractValue(proto.alpha.start),
            end: extractValue(proto.alpha.end)
        } : proto.alpha;
        this.#tint = extractValue(proto.tint);
        this.#drag = extractValue(proto.drag);
        this.#rotDrag = this.#drag / 2;
        this.#subLayer = proto.subLayer ?? 0;
        this.angularVelocityMap.set("intrinsic", extractValue(proto.rotVel));
        gamespace.objects.particles.set(this.id, this);
    }
    /**
     * A version of the method it overrides that allows time-scaling
     */
    update() {
        if (this.destroyed)
            return;
        const bd = this.body, deltaTime = gamespace.currentUpdate - gamespace.lastUpdate, age = gamespace.currentUpdate - this.#created, vel = this.compileVelocities();
        if (age >= this.#lifetime)
            return this.destroy();
        Matter.Body.setPosition(this.body, {
            x: bd.position.x + vel.x * deltaTime * this.#drag,
            y: bd.position.y + vel.y * deltaTime * this.#drag
        });
        this.angle = srvsdbx_Math.normalizeAngle(this.#initialAngle + age * this.#rotDrag * this.compileAngularVelocities() / 1000, "radians");
        this.layer += vel.z * deltaTime;
    }
    /**
     * Identical to the method it overrides, but clears particle-specific object fields
     */
    destroy() {
        gamespace.objects.particles.delete(this.id);
        super.destroy();
        this.#proto = void 0;
    }
    /**
     * Calculates the scale at which this particle would be drawn and returns it
     */
    getCalculatedScale() {
        return this.#forcedScale ?? (typeof this.#scale == "object" ?
            srvsdbx_Animation.easingFunctions.linterp(this.#scale.start, this.#scale.end, (gamespace.currentUpdate - this.#created) / this.#lifetime)
            : extractValue(this.#scale, this));
    }
    /**
     * Force a scale value onto this particle, overriding default behavior
     * @param scale The scale factor to force
     */
    forceScale(scale) {
        if (!Number.isNaN(scale))
            this.#forcedScale = scale;
    }
    /**
     * Undos a forced scale factor applied with `forceScale`
     */
    relaxScale() {
        this.#forcedScale = srvsdbx_ErrorHandling.Nothing;
    }
    /**
     * Calculates the opacity at which this particle would be drawn and returns it
     */
    getCalculatedAlpha() {
        return 255 * (this.#forcedAlpha ??
            (typeof this.#alpha == "object" ?
                srvsdbx_Animation.easingFunctions.linterp(this.#alpha.start, this.#alpha.end, (gamespace.currentUpdate - this.#created) / this.#lifetime)
                : extractValue(this.#alpha, this)));
    }
    /**
     * Force an opacity onto this particle, overriding default behavior
     * @param alpha The opacity to force
     */
    forceAlpha(alpha) {
        if (!Number.isNaN(alpha))
            this.#forcedAlpha = alpha;
    }
    /**
     * Undos a forced opacity applied with `forceAlpha`
     */
    relaxAlpha() {
        this.#forcedAlpha = srvsdbx_ErrorHandling.Nothing;
    }
}
/**
 * Represents the generalization of a certain type of decal
 */
class DecalPrototype extends ImportedObject {
    /**
     * A path to the decal's image
     */
    #image;
    /**
     * A path to the decal's image
     */
    get image() { return this.#image; }
    /**
     * The size of this decal
     */
    #size;
    /**
     * The size of this decal
     */
    get size() { return this.#size; }
    /**
     * The color to tint this decal
     */
    #tint;
    /**
     * The color to tint this decal
     */
    get tint() { return this.#tint; }
    /**
     * Takes a simplified representation of a decal and converts it into a more rigorous one
     * @param obj The `SimpleDecal` object to parse
     * @returns A new `DecalPrototype`
     */
    static async from(obj) {
        const errors = [], image = srvsdbx_ErrorHandling.handleResult(await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${obj.includePath}/${obj.image}`), srvsdbx_ErrorHandling.identity, errors.push);
        if (!errors.length) {
            return {
                res: new DecalPrototype(obj.name, obj.displayName, obj.targetVersion, obj.namespace, obj.includePath, image, obj.size, obj.tint)
            };
        }
        return { err: errors };
    }
    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(name, displayName, targetVersion, namespace, includePath, image, size, tint) {
        super(name, displayName, targetVersion, namespace, includePath);
        const pSize = gamespace.PLAYER_SIZE;
        function autoOrScale(dim) {
            return dim == "auto" ? dim : dim * pSize;
        }
        this.#image = image;
        this.#size = {
            width: () => autoOrScale(extractValue(size.width)),
            height: () => autoOrScale(extractValue(size.height))
        };
        this.#tint = tint;
    }
}
/**
 * Represents a decal in the game world
 */
class Decal {
    /**
     * The `DecalPrototype` this object is based on
     */
    #prototype;
    /**
     * The `DecalPrototype` this object is based on
     */
    get prototype() { return this.#prototype; }
    /**
     * The position of this decal
     */
    #position;
    /**
     * The position of this decal
     */
    get position() { return this.#position; }
    /**
     * The angle of this decal
     */
    #angle;
    /**
     * The angle of this decal
     */
    get angle() { return this.#angle; }
    /**
     * The dimensions of this decal
     */
    #dimensions;
    /**
     * The position of this decal
     */
    get dimensions() { return this.#dimensions; }
    /**
     * The actual dimensions of this decal, after all calculations have been done
     */
    #finalDimensions;
    /**
     * This decal's tint
     */
    #tint;
    /**
     * This decal's tint
     */
    get tint() { return this.#position; }
    /**
     * This decal's id
     */
    #id = generateId();
    /**
     * This decal's id
     */
    get id() { return this.#id; }
    /**
     * Whether or not this decal has been destroyed
     */
    #destroyed = false;
    /**
     * Whether or not this decal has been destroyed
     */
    get destroyed() { return this.#destroyed; }
    /**
     * `* It's a constructor. It constructs.`
     * @param prototype The `DecalPrototype` this decal is based on
     */
    constructor(prototype, position, angle) {
        this.#prototype = prototype;
        const clone = srvsdbx_Geometry.Vector2D.clone(position);
        this.#position = { x: clone.x, y: clone.y, z: position.z ?? 0 };
        this.#angle = angle;
        this.#dimensions = {
            width: extractValue(prototype.size.width),
            height: extractValue(prototype.size.height)
        };
        this.#finalDimensions = srvsdbx_AssetManagement.determineImageDimensions(this.#prototype.image.asset, this.#dimensions);
        this.#tint = extractValue(prototype.tint);
        gamespace.objects.decals.set(this.#id, this);
    }
    /**
     * Draws this decal
     * @param p5 The gamespace's p5 instance
     */
    draw(p5) {
        p5.push();
        p5.translate(this.#position.x, this.#position.y);
        p5.rotate(this.#angle);
        p5.tint(this.#tint);
        p5.image(this.#prototype.image.asset, 0, 0, this.#finalDimensions.width, this.#finalDimensions.height);
        p5.pop();
        gamespace.drawDebug(p5, "DECAL", () => {
            p5.push();
            p5.rectMode(p5.CENTER);
            p5.translate(this.#position.x, this.#position.y);
            p5.rotate(this.#angle);
            p5.rect(0, 0, this.#finalDimensions.width, this.#finalDimensions.height);
            p5.pop();
        }, void 0, {
            body: {
                position: this.#position,
                angle: this.#angle
            },
            compileVelocities() {
                return srvsdbx_Geometry.Vector3D.zeroVec();
            },
            compileAngularVelocities() {
                return 0;
            },
        });
    }
    /**
     * Similar in spirit to `Generic.destroy`, this method clears any object attributes from this object to encourage the GC to clean up
     */
    destroy() {
        // @ts-expect-error
        this.#dimensions = this.#finalDimensions = this.#position = this.#prototype = void 0;
        gamespace.objects.decals.delete(this.id);
    }
}
//#endregion
//# sourceMappingURL=particles.js.map