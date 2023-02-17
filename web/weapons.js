"use strict";
// Guns
// #region
/**
 * A template for in-world guns to base themselves off of—every "AK-47" will have the same damage, so that gets stored here
 * Not every AK will have the same amount of bullets currently in their magazine, however, so that gets stored on the instance
 * of the gun.
 *
 * In a sense, this is a class for classes.
 */
class GunPrototype extends InventoryItemPrototype {
    /**
     * References to this weapon's associated images
     */
    #images;
    /**
     * References to this weapon's associated images
     */
    get images() { return this.#images; }
    /**
     * Whether this weapon is dual-wielded or not
     */
    #dual;
    /**
     * Whether this weapon is dual-wielded or not
     */
    get dual() { return this.#dual; }
    /**
     * The color to tint this weapon's world image. Weapons using custom world images set this to `#FFFFFF`
     */
    #tint;
    /**
     * The color to tint this weapon's world image. Weapons using custom world images set this to `#FFFFFF`
     */
    get tint() { return this.#tint; }
    /**
     * Information about the projectiles this weapon fires
     */
    #ballistics;
    /**
     * Information about the projectiles this weapon fires
     */
    get ballistics() { return this.#ballistics; }
    /**
     * Whether or not this weapon is suppressed. Suppressed weapons' tracers are less opaque, and they make less noise.
     */
    #suppressed;
    /**
     * Whether or not this weapon is suppressed. Suppressed weapons' tracers are less opaque, and they make less noise.
     */
    get suppressed() { return this.#suppressed; }
    /**
     * The internal name of the ammo type object this firearm uses
     */
    #caliber;
    /**
     * The internal name of the ammo type object this firearm uses
     */
    get caliber() { return this.#caliber; }
    /**
     * The smallest possible delay, measured in milliseconds, between two shots
     */
    #useDelay;
    /**
     * The smallest possible delay, measured in milliseconds, between two shots
     */
    get useDelay() { return this.#useDelay; }
    /**
     * The `deployGroup` this weapon belongs to; two weapons belonging to the same non-zero deploy group cannot be quickswitched
     */
    #deployGroup;
    /**
     * The `deployGroup` this weapon belongs to; two weapons belonging to the same non-zero deploy group cannot be quickswitched
     */
    get deployGroup() { return this.#deployGroup; }
    /**
     * Information about the spread this weapon has
     */
    #accuracy;
    /**
     * Information about the spread this weapon has
     */
    get accuracy() { return this.#accuracy; }
    /**
     * Information about the movement speed penalties incurred by the use of this weapon
     */
    #moveSpeedPenalties;
    /**
     * Information about the movement speed penalties incurred by the use of this weapon
     */
    get moveSpeedPenalties() { return this.#moveSpeedPenalties; }
    /**
     * Information about the offset this weapon's world image will be drawn at
     */
    #imageOffset;
    /**
     * Information about the offset this weapon's world image will be drawn at
     */
    get imageOffset() { return this.#imageOffset; }
    /**
     * Information about this world image's dimensions
     */
    #dimensions;
    /**
     * Information about this world image's dimensions
     */
    get dimensions() { return this.#dimensions; }
    /**
     * Information about this weapon's reload procedure
     */
    #reload;
    /**
     * Information about this weapon's reload procedure
     */
    get reload() { return this.#reload; }
    /**
     * Information about the reload procedure used for this weapon when reloading from empty
     */
    #altReload;
    /**
     * Information about the reload procedure used for this weapon when reloading from empty
     */
    get altReload() { return this.#altReload; }
    /**
     * Information about how many rounds this weapon holds
     */
    #magazineCapacity;
    /**
     * Information about how many rounds this weapon holds
     */
    get magazineCapacity() { return this.#magazineCapacity; }
    /**
     *  How long, after switching to this item, its user must wait before using it
     */
    #switchDelay;
    /**
     *  How long, after switching to this item, its user must wait before using it
     */
    get switchDelay() { return this.#switchDelay; }
    /**
     * Information about the position of the shooter's hands
     */
    #handPositions;
    /**
     * Information about the position of the shooter's hands
     */
    get handPositions() { return this.#handPositions; }
    /**
     * Information about the offset projectiles will be spawned at, relative to their normal position
     */
    #projectileSpawnOffset;
    /**
     * Information about the offset projectiles will be spawned at, relative to their normal position
     */
    get projectileSpawnOffset() { return this.#projectileSpawnOffset; }
    /**
     * Information about the casings this weapon ejects
     */
    #casings;
    /**
     * Information about the casings this weapon ejects
     */
    get casings() { return this.#casings; }
    /**
     * Information about the animation of the weapon recoiling into the shooter
     */
    #recoilImpulse;
    /**
     * Information about the animation of the weapon recoiling into the shooter
     */
    get recoilImpulse() { return this.#recoilImpulse; }
    /**
     * What fire mode this weapon uses
     */
    #fireMode;
    /**
     * What fire mode this weapon uses
     */
    get fireMode() { return this.#fireMode; }
    /**
     * Information about this weapon's burst-fire mode, if applicable
     */
    #burstProps;
    /**
     * Information about this weapon's burst-fire mode, if applicable
     */
    get burstProps() { return this.#burstProps; }
    /**
     * Information about this weapon's charging, if applicable
     */
    #chargeProps;
    /**
     * Information about this weapon's charging, if applicable
     */
    get chargeProps() { return this.#chargeProps; }
    /**
     * An array of additional objects that can be rendered alongside this weapon
     *
     * This one is concerned with those residing below the weapon
    */
    #addonsBelow;
    /**
     * An array of additional objects that can be rendered alongside this weapon
     *
     * This one is concerned with those residing below the weapon
     */
    get addonsBelow() { return this.#addonsBelow; }
    /**
     * An array of additional objects that can be rendered alongside this weapon
     *
     * This one is concerned with those residing above the weapon
     */
    #addonsAbove;
    /**
     * An array of additional objects that can be rendered alongside this weapon
    *
    * This one is concerned with those residing above the weapon
    */
    get addonsAbove() { return this.#addonsAbove; }
    /**
     * An array of additional objects that can be rendered alongside this weapon
     */
    #addons;
    /**
     * An array of additional objects that can be rendered alongside this weapon
     */
    get addons() { return this.#addons; }
    /**
     * Takes a simplified representation of a melee weapon and converts it into a more rigorous one
     * @param obj The `SimpleGun` object to parse
     * @returns A new `GunPrototype`
     */
    static async from(obj) {
        const errors = [], pathPrefix = `${obj.includePath}/`, trailImage = obj.ballistics.tracer.trail
            ? srvsdbx_ErrorHandling.handleResult(await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${pathPrefix}/${obj.ballistics.tracer.trail.image}`), srvsdbx_ErrorHandling.identity, errors.push)
            : void 0, lootImage = srvsdbx_ErrorHandling.handleResult(await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${pathPrefix}/${obj.images.loot}`), srvsdbx_ErrorHandling.identity, errors.push), worldImage = srvsdbx_ErrorHandling.handleResult(await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${pathPrefix}/${obj.images.world}`), srvsdbx_ErrorHandling.identity, errors.push), chargeImage = obj.chargeProps?.chargeImage?.image
            ? srvsdbx_ErrorHandling.handleResult(await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${pathPrefix}/${obj.chargeProps.chargeImage.image}`), srvsdbx_ErrorHandling.identity, errors.push)
            : void 0, chargeImageHUD = obj.chargeProps?.chargeImageHUD?.image
            ? srvsdbx_ErrorHandling.handleResult(await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${pathPrefix}/${obj.chargeProps.chargeImageHUD.image}`), srvsdbx_ErrorHandling.identity, errors.push)
            : void 0, addonImages = obj.addons ? await (async () => {
            const array = [];
            for (const addon of obj.addons) {
                array.push(await srvsdbx_AssetManagement.loadImageArray(addon.images, errors, pathPrefix));
            }
            return array;
        })() : void 0;
        if (!errors.length) {
            return {
                res: new GunPrototype(obj.name, obj.displayName, obj.includePath, obj.namespace, obj.targetVersion, {
                    loot: lootImage,
                    world: worldImage
                }, obj.dual, obj.tint, {
                    damage: obj.ballistics.damage,
                    effectsOnHit: obj.ballistics.effectsOnHit,
                    falloff: obj.ballistics.falloff,
                    firstShotAccuracy: obj.ballistics.firstShotAccuracy,
                    headshotMult: obj.ballistics.headshotMult,
                    obstacleMult: obj.ballistics.obstacleMult,
                    persistance: obj.ballistics.persistance,
                    projectiles: obj.ballistics.projectiles,
                    range: obj.ballistics.range,
                    velocity: obj.ballistics.velocity,
                    tracer: {
                        drawAbovePlayer: obj.ballistics.tracer.drawAbovePlayer,
                        forceMaximumLength: obj.ballistics.tracer.forceMaximumLength,
                        height: obj.ballistics.tracer.height,
                        width: obj.ballistics.tracer.width,
                        trail: obj.ballistics.tracer.trail ? {
                            maxLength: obj.ballistics.tracer.trail.maxLength,
                            offset: obj.ballistics.tracer.trail.offset,
                            tint: obj.ballistics.tracer.trail.tint,
                            width: obj.ballistics.tracer.trail.width,
                            image: trailImage,
                        } : void 0
                    }
                }, obj.suppressed, obj.caliber, obj.useDelay, obj.deployGroup, obj.accuracy, obj.moveSpeedPenalties, obj.imageOffset, obj.dimensions, obj.reload, obj.altReload, obj.magazineCapacity, obj.switchDelay, obj.handPositions, obj.projectileSpawnOffset, obj.casings, obj.recoilImpulse, obj.fireMode, obj.burstProps, obj.chargeProps ? {
                    chargeTime: obj.chargeProps.chargeTime,
                    chargeParticle: obj.chargeProps.chargeParticle,
                    speedPenalty: obj.chargeProps.speedPenalty,
                    chargeImage: obj.chargeProps.chargeImage ? {
                        dimensions: obj.chargeProps.chargeImage.dimensions,
                        imageOffset: obj.chargeProps.chargeImage.imageOffset,
                        image: chargeImage,
                    } : void 0,
                    chargeImageHUD: obj.chargeProps.chargeImageHUD ? {
                        growStyle: obj.chargeProps.chargeImageHUD.growStyle,
                        image: chargeImageHUD
                    } : void 0
                } : void 0, obj.addons ?
                    obj.addons.map((addon, i) => {
                        return {
                            dimensions: addon.dimensions,
                            dual: addon.dual,
                            position: addon.position,
                            recoil: addon.recoil,
                            show: addon.show,
                            tint: addon.tint,
                            images: addonImages[i],
                        };
                    })
                    : void 0)
            };
        }
        return { err: errors };
    }
    /**
     * Creates an `Animation` object representing the animation of this weapon recoiling backwards
     * @param handPositions The default hand positions for this weapon
     * @param worldImage This weapon's world image
     * @param dimensions The world image's dimensions
     * @param imageOffset The offset relative to the player at which the world image is drawn
     * @param recoilImpulse Information about the recoil impulse this animation will be based on
     * @returns An `Animation` object representing the weapon recoiling into the shooter
     */
    static generateRecoilAnimation(handPositions, worldImage, dimensions, imageOffset, recoilImpulse) {
        const imageDimensions = srvsdbx_AssetManagement.determineImageDimensions(worldImage.asset, dimensions);
        return new srvsdbx_Animation.Animation({
            duration: recoilImpulse.duration,
            keyframes: [
                {
                    fraction: 0,
                    data: {
                        hands: {
                            leftHand: {
                                parr: handPositions.leftHand.parr + recoilImpulse.direction.parr,
                                perp: handPositions.leftHand.perp + recoilImpulse.direction.perp,
                            },
                            rightHand: handPositions.rightHand ? {
                                parr: handPositions.rightHand.parr + recoilImpulse.direction.parr,
                                perp: handPositions.rightHand.perp + recoilImpulse.direction.perp,
                            } : void 0
                        },
                        item: {
                            dimensions: imageDimensions,
                            offset: {
                                parr: imageOffset.parr + recoilImpulse.direction.parr,
                                perp: imageOffset.perp + recoilImpulse.direction.perp,
                                angle: 0
                            }
                        }
                    }
                },
                {
                    fraction: 1,
                    data: {
                        hands: {
                            leftHand: {
                                parr: handPositions.leftHand.parr,
                                perp: handPositions.leftHand.perp,
                            },
                            rightHand: handPositions.rightHand ? {
                                parr: handPositions.rightHand.parr,
                                perp: handPositions.rightHand.perp,
                            } : void 0
                        },
                        item: {
                            dimensions: imageDimensions,
                            offset: {
                                parr: imageOffset.parr,
                                perp: imageOffset.perp,
                                angle: 0
                            }
                        }
                    }
                }
            ]
        }, (a, b, t) => {
            const leftAHand = a.hands.leftHand, rightAHand = a.hands.rightHand, leftBHand = b.hands.leftHand, rightBHand = b.hands.rightHand, linterp = srvsdbx_Animation.easingFunctions.linterp;
            return {
                hands: {
                    leftHand: {
                        parr: linterp(leftAHand?.parr ?? leftBHand?.parr ?? 0, leftBHand?.parr ?? leftAHand?.parr ?? 0, t),
                        perp: linterp(leftAHand?.perp ?? leftBHand?.perp ?? 0, leftBHand?.perp ?? leftAHand?.perp ?? 0, t)
                    },
                    rightHand: rightAHand || rightBHand ? {
                        parr: linterp(rightAHand?.parr ?? rightBHand?.parr ?? 0, rightBHand?.parr ?? rightAHand?.parr ?? 0, t),
                        perp: linterp(rightAHand?.perp ?? rightBHand?.perp ?? 0, rightBHand?.perp ?? rightAHand?.perp ?? 0, t)
                    } : void 0
                },
                item: {
                    dimensions: imageDimensions,
                    offset: {
                        parr: linterp(a.item.offset?.parr ?? 0, b.item.offset?.parr ?? 0, t),
                        perp: linterp(a.item.offset?.perp ?? 0, b.item.offset?.perp ?? 0, t),
                        angle: 0
                    }
                }
            };
        });
    }
    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(name, displayName, includePath, namespace, targetVersion, images, dual, tint, ballistics, suppressed, caliber, useDelay, deployGroup, accuracy, moveSpeedPenalties, imageOffset, dimensions, reload, altReload, magazineCapacity, switchDelay, handPositions, projectileSpawnOffset, casings, recoilImpulse, fireMode, burstProps, chargeProps, addons) {
        super(name, displayName, targetVersion, namespace, includePath, images, moveSpeedPenalties);
        const size = gamespace.PLAYER_SIZE;
        function autoOrScale(dim) {
            return dim == "auto" ? dim : dim * size;
        }
        this.#images = images;
        this.#ballistics = {
            damage: ballistics.damage,
            velocity: (gun, shooter) => extractValue(ballistics.velocity, gun, shooter) * size / 1000,
            range: (gun, shooter) => extractValue(ballistics.range, gun, shooter) * size,
            tracer: {
                width: autoOrScale(ballistics.tracer.width),
                height: autoOrScale(ballistics.tracer.height),
                drawAbovePlayer: ballistics.tracer.drawAbovePlayer,
                forceMaximumLength: ballistics.tracer.forceMaximumLength,
                trail: ballistics.tracer.trail ? {
                    image: ballistics.tracer.trail.image,
                    tint: ballistics.tracer.trail.tint,
                    width: ballistics.tracer.trail.width * size,
                    maxLength: ballistics.tracer.trail.maxLength * size,
                    offset: {
                        parr: ballistics.tracer.trail.offset.parr * size,
                        perp: ballistics.tracer.trail.offset.perp * size
                    }
                } : void 0
            },
            effectsOnHit: ballistics.effectsOnHit,
            falloff: ballistics.falloff,
            firstShotAccuracy: ballistics.firstShotAccuracy,
            headshotMult: ballistics.headshotMult,
            obstacleMult: ballistics.obstacleMult,
            persistance: ballistics.persistance,
            projectiles: ballistics.projectiles,
        };
        this.#dual = dual;
        this.#suppressed = suppressed;
        this.#tint = tint;
        this.#caliber = caliber;
        this.#useDelay = useDelay;
        this.#deployGroup = deployGroup;
        this.#accuracy = {
            default: accuracy.default,
            moving: accuracy.moving
        };
        this.#moveSpeedPenalties = moveSpeedPenalties;
        this.#imageOffset = {
            parr: imageOffset.parr,
            perp: imageOffset.perp,
        };
        this.#dimensions = {
            width: autoOrScale(dimensions.width),
            height: autoOrScale(dimensions.height),
            layer: dimensions.layer
        };
        this.#reload = reload;
        this.#altReload = altReload;
        this.#magazineCapacity = magazineCapacity;
        this.#switchDelay = switchDelay;
        this.#handPositions = {
            leftHand: {
                parr: handPositions.leftHand.parr,
                perp: handPositions.leftHand.perp,
                layer: handPositions.leftHand.layer
            },
            rightHand: handPositions.rightHand ? {
                parr: handPositions.rightHand.parr,
                perp: handPositions.rightHand.perp,
                layer: handPositions.rightHand.layer
            } : void 0
        };
        this.#projectileSpawnOffset = {
            parr: projectileSpawnOffset.parr * size,
            perp: projectileSpawnOffset.perp * size
        };
        this.#casings = casings ? {
            count: casings.count,
            spawnDelay: casings.spawnDelay,
            spawnOffset: casings.spawnOffset,
            spawnOn: casings.spawnOn,
            velocity: {
                parr: () => extractValue(casings.velocity.parr) * 0.05,
                perp: () => extractValue(casings.velocity.perp) * 0.05
            }
        } : void 0;
        this.#recoilImpulse = {
            duration: recoilImpulse.duration,
            direction: {
                parr: recoilImpulse.direction.parr,
                perp: recoilImpulse.direction.perp,
            }
        };
        this.#fireMode = fireMode;
        this.#burstProps = burstProps;
        this.#chargeProps = chargeProps ? {
            chargeTime: chargeProps.chargeTime,
            chargeImageHUD: chargeProps.chargeImageHUD,
            speedPenalty: chargeProps.speedPenalty,
            chargeImage: chargeProps.chargeImage ? {
                image: chargeProps.chargeImage.image,
                dimensions: chargeProps.chargeImage.dimensions ? {
                    width: autoOrScale(chargeProps.chargeImage.dimensions.width),
                    height: autoOrScale(chargeProps.chargeImage.dimensions.height),
                    layer: chargeProps.chargeImage.dimensions.layer
                } : void 0,
                imageOffset: chargeProps.chargeImage.imageOffset ? {
                    parr: chargeProps.chargeImage.imageOffset.parr,
                    perp: chargeProps.chargeImage.imageOffset.perp
                } : void 0
            } : void 0,
            chargeParticle: chargeProps.chargeParticle ? {
                particle: chargeProps.chargeParticle.particle,
                alpha: chargeProps.chargeParticle.alpha,
                scale: chargeProps.chargeParticle.scale,
                offset: {
                    parr: chargeProps.chargeParticle.offset.parr * size,
                    perp: chargeProps.chargeParticle.offset.perp * size
                }
            } : void 0
        } : void 0;
        this.#addons = addons ?
            addons.map(addon => {
                return {
                    images: addon.images,
                    tint: addon.tint,
                    dual: addon.dual,
                    recoil: addon.recoil,
                    show: addon.show,
                    dimensions: {
                        width: gun => autoOrScale(extractValue(addon.dimensions.width, gun)),
                        height: gun => autoOrScale(extractValue(addon.dimensions.height, gun)),
                        layer: addon.dimensions.layer,
                    },
                    position: {
                        parr: gun => extractValue(addon.position.parr, gun),
                        perp: gun => extractValue(addon.position.perp, gun)
                    }
                };
            })
            : void 0;
        this.#addonsBelow = this.#addons?.filter?.(addon => addon.dimensions.layer == -1);
        this.#addonsAbove = this.#addons?.filter?.(addon => addon.dimensions.layer == 1);
    }
}
/**
 * Represents a physical firearm in the game world
 */
class Gun extends InventoryItem {
    /**
     * An object to manage this item's animations
     */
    #animationManager;
    /**
     * An object to manage this item's animations
     */
    get animationManager() { return this.#animationManager; }
    /**
     * The last time this weapon was fired
     */
    #lastUse = 0;
    /**
     * The last time this weapon was fired
     */
    get lastUse() { return this.#lastUse; }
    /**
     * The ammunition currently in this weapon
     */
    #ammo;
    /**
     * The ammunition currently in this weapon
     */
    get ammo() { return this.#ammo; }
    /**
     * The number of shots this weapon has fired in the current "volley"
     *
     * A "volley" is defined as all the shots fired by a user through a single mouse press
     */
    #shots = 0;
    /**
     * The number of shots this weapon has fired in the current "volley"
     *
     * A "volley" is defined as all the shots fired by a user through a single mouse press
     */
    get shots() { return this.#shots; }
    /**
     * For dual-wielded weapons. Controls whether the left of right gun is fired
     */
    #recoilImpulseParity = 1;
    /**
     * For dual-wielded weapons. Controls whether the left of right gun is fired
     */
    get recoilImpulseParity() { return this.#recoilImpulseParity; }
    /**
     * This weapon image's final dimensions
     */
    #dimensions;
    /**
     * This weapon image's final dimensions
     */
    get dimensions() { return this.#dimensions; }
    /**
     * The final dimensions of this weapon's charged dimensions, if applicable
     */
    #chargedDimensions;
    /**
     * The final dimensions of this weapon's charged dimensions, if applicable
     */
    get chargedDimensions() { return this.#chargedDimensions; }
    /**
     * Whether or not the weapon is currently charged
     */
    #charged;
    /**
     * Whether or not the weapon is currently charged
     */
    get charged() { return this.#charged; }
    /**
     * The last time this weapon started being charged
     */
    #chargeStart;
    /**
     * The last time this weapon started being charged
     */
    get chargeStart() { return this.#chargeStart; }
    /**
     * Whether or not this weapon is currently being charged
     */
    #isCharging;
    /**
     * Whether or not this weapon is currently being charged
     */
    get isCharging() { return this.#isCharging; }
    /**
     * A reference to this weapon's charge particle
     */
    #chargeParticle = srvsdbx_ErrorHandling.Nothing;
    /**
     * Updates this weapon's charge particle, creating it if it is absent and destroying it if it shouldn't be there
     */
    #updateChargeParticle;
    /**
     * Destroys the current charge particle
     */
    #destroyChargeParticle() {
        this.#chargeParticle?.destroy?.();
        this.#chargeParticle = srvsdbx_ErrorHandling.Nothing;
    }
    /**
     * Whether or not this firearm's animation has been cancelled
     */
    #cancelledAnimation = false;
    /**
     * Whether or not this firearm's animation has been cancelled
     */
    get cancelledAnimation() { return this.#cancelledAnimation; }
    /**
     * `* It's a constructor. It constructs.`
     * @param owner The `PlayerLike` that owns this weapon
     * @param prototype The `GunPrototype` this object is based on
     */
    constructor(owner, prototype) {
        super(owner, prototype);
        this.#animationManager = new srvsdbx_Animation.AnimationManager({
            idle: srvsdbx_Animation.Animation.createStillFrame({ hands: prototype.handPositions }),
            using: GunPrototype.generateRecoilAnimation(prototype.handPositions, prototype.images.world, prototype.dimensions, prototype.imageOffset, prototype.recoilImpulse)
        });
        this.#ammo = prototype.magazineCapacity.normal;
        // If the weapon's fire mode isn't a charge mode, we'll say it's always charged
        this.#charged = !prototype.fireMode.includes("charge");
        this.#isCharging = false;
        this.#chargeStart = 0;
        this.#dimensions = srvsdbx_AssetManagement.determineImageDimensions(prototype.images.world.asset, prototype.dimensions);
        this.#chargedDimensions = prototype.chargeProps?.chargeImage
            ? srvsdbx_AssetManagement.determineImageDimensions((prototype.chargeProps.chargeImage.image ?? prototype.images.world).asset, prototype.chargeProps.chargeImage.dimensions ?? prototype.dimensions)
            : srvsdbx_ErrorHandling.Nothing;
        {
            const player = this.owner, body = player.body, chargeProps = this.prototype.chargeProps;
            if (!chargeProps?.chargeParticle)
                this.#updateChargeParticle = () => { };
            else {
                const particleProto = gamespace.prototypes.particles.get(chargeProps.chargeParticle.particle);
                this.#updateChargeParticle = () => {
                    const playerDir = body.angle - Math.PI / 2;
                    if (chargeProps?.chargeParticle?.particle) {
                        const particle = this.#chargeParticle ??= (() => {
                            const p = new Particle(particleProto, srvsdbx_Geometry.Vector2D.fromPoint2D(body.position)
                                .plus({
                                direction: playerDir,
                                magnitude: chargeProps.chargeParticle.offset.parr
                            }, true)
                                .plus({
                                direction: playerDir + Math.PI / 2,
                                magnitude: chargeProps.chargeParticle.offset.perp
                            }, true), player.angle);
                            p.follow(player, {
                                x: 0,
                                y: 0,
                                z: 0,
                                parr: chargeProps.chargeParticle.offset.parr,
                                perp: chargeProps.chargeParticle.offset.perp
                            });
                            return p;
                        })();
                        if (chargeProps.chargeParticle.scale)
                            particle.forceScale(extractValue(chargeProps.chargeParticle.scale, particle.getCalculatedScale(), this, particle));
                        if (chargeProps.chargeParticle.alpha)
                            particle.forceAlpha(extractValue(chargeProps.chargeParticle.alpha, particle.getCalculatedAlpha(), this, particle));
                        particle.angle = playerDir;
                    }
                    else
                        this.#destroyChargeParticle();
                };
            }
        }
    }
    /**
     * Returns this item's current dimensions, taking animations into account
     *
     * **This method will stop expired animations.**
     * More specifically, if an idle animation is running, but the using animation should be used,
     * the idle animation will be terminated
     */
    getItemReference() {
        const timeSinceLastShot = gamespace.currentUpdate - (this.#lastUse ?? 0);
        if (!this.cancelledAnimation &&
            timeSinceLastShot < Math.max(this.prototype.useDelay, this.prototype.recoilImpulse.duration)) {
            this.animationManager.end("idle");
            return this.animationManager.fetch("using")(timeSinceLastShot, true)?.item;
        }
        else {
            this.animationManager.end("using");
            return this.animationManager.fetch("idle")(gamespace.currentUpdate - this.owner.state.lastSwitch, true)?.item;
        }
    }
    /**
     * Serves to stop any animation related to this weapon that are currently playeing
     */
    stopAnimations() {
        this.#animationManager.endAll();
        this.#cancelledAnimation = true;
    }
    /**
     * A standard method for firing a weapon. Unless your weapon does something radically different on fire, use this method
     */
    usePrimary() {
        const player = this.owner, prototype = this.prototype, ammoInfo = gamespace.prototypes.ammoTypes.get(prototype.caliber), body = player.body, isCharge = !!prototype.fireMode.match(/^(auto|release)-charge/), chargeType = isCharge ? prototype.fireMode == "auto-charge" ? "auto" : "release" : srvsdbx_ErrorHandling.Nothing, chargeProps = prototype.chargeProps, isBurst = !!prototype.fireMode.match(/^(auto-)?burst/), burstType = isBurst ? prototype.fireMode.startsWith("auto-") ? "auto" : "semi" : srvsdbx_ErrorHandling.Nothing, shotsPerBurst = isBurst ? parseInt(prototype.fireMode.replace(/^(auto-)?burst-/, ""), 10) ?? 1 : Infinity, shotDelay = (isBurst && prototype.burstProps ? prototype.burstProps.shotDelay : prototype.useDelay) * this.owner.modifiers.ergonomics.reduced, state = player.state;
        if (gamespace.currentUpdate - this.#lastUse >= shotDelay) {
            if (isCharge) { // Terrible charge-fire logic
                // This function, as the name implies, schedules a re-attempt to fire
                const scheduleRetry = () => {
                    player.timers.firing = setTimeout(() => state.attacking && this.usePrimary(), 0);
                };
                // If the user is attacking and we're neither charged nor charging, start charging if the weapon has ammo
                if (!this.#charged && !this.#isCharging && state.attacking && this.#ammo) {
                    this.startCharging();
                    return scheduleRetry();
                }
                // If we're currently charging
                if (this.#isCharging) {
                    this.#updateChargeParticle();
                    // And the charge time has elapsed
                    if (gamespace.currentUpdate - this.#chargeStart >= (chargeProps?.chargeTime ?? 0)) {
                        this.#charged = true;
                        this.#isCharging = false;
                    }
                    else {
                        // Otherwise if the player has stopped attacking,
                        if (!state.attacking)
                            this.stopCharging();
                        else
                            scheduleRetry();
                        // If the player is still attacking, schedule a retry
                        return; // In any case, exit here
                    }
                }
                // If the weapon is charged and the fire style is release-to-fire and the player is holding the attack button, schedule a retry
                // Notice that this.#charged should always be true (because we'd've exited earlier if not), but it's still there just to be clear
                // If the chargeType is "auto", execution "falls through" to the firing code, which is what we want
                // If the player isn't attacking, then the release type must be release, and we want to fallthrough
                if (this.#charged && chargeType == "release" && state.attacking) {
                    this.#updateChargeParticle();
                    return scheduleRetry();
                }
            }
            clearTimerIfPresent(player.timers.firing);
            this.#shots = 0;
            this.#destroyChargeParticle();
            this.#cancelledAnimation = false;
            player.timers.firing = setTimeout(function fire(weapon) {
                const firedAllInBurst = weapon.#shots >= shotsPerBurst;
                // Conditions to stop firing and exit (one of the below)
                if ((
                // Not attacking and
                !state.attacking &&
                    // Not charged and
                    !weapon.#charged &&
                    // We're not in burst or we've fired all the shots in our burst
                    (!isBurst || firedAllInBurst)) ||
                    (
                    // Reloading          and
                    state.reloading &&
                        // It's not a partial reload
                        weapon.determineReloadType().ammoReloaded == "all") ||
                    // We have no ammo
                    weapon.#ammo <= 0 ||
                    // We've fired all the shots in our burst
                    firedAllInBurst) {
                    weapon.#ammo = Math.max(weapon.#ammo, 0);
                    state.firing = false;
                    if (firedAllInBurst) {
                        prototype.dual && (weapon.#recoilImpulseParity *= -1);
                        if (burstType == "auto") {
                            player.timers.firing = setTimeout(() => {
                                clearTimerIfPresent(player.timers.firing);
                                if (state.attacking)
                                    weapon.usePrimary();
                            }, prototype.burstProps ? prototype.burstProps.burstDelay : shotDelay);
                        }
                    }
                    weapon.#shots = 0;
                    return;
                }
                weapon.#charged = false;
                weapon.#isCharging = false;
                state.reloading = false;
                clearTimerIfPresent(player.timers.anticipatedReload);
                clearTimerIfPresent(player.timers.reload);
                if (gamespace.currentUpdate - state.lastSwitch < state.effectiveSwitchDelay) {
                    player.timers.firing = setTimeout(() => {
                        clearTimerIfPresent(player.timers.firing);
                        if (state.attacking)
                            weapon.usePrimary();
                    });
                    return;
                }
                --weapon.#ammo;
                ++weapon.#shots;
                state.firing = true;
                state.noSlow = false;
                prototype.dual && !isBurst && (weapon.#recoilImpulseParity *= -1);
                const size = gamespace.PLAYER_SIZE, playerVelocity = player.compileVelocities(), playerDir = body.angle - Math.PI / 2, ballistics = prototype.ballistics, start = srvsdbx_Geometry.Vector2D.fromPoint2D(body.position)
                    /* parallel      offsets */ .plus({
                    direction: playerDir,
                    magnitude: prototype.projectileSpawnOffset.parr + size * prototype.imageOffset.parr + weapon.#dimensions.height / 2
                }, true)
                    /* perpendicular offsets */ .plus({
                    direction: playerDir + Math.PI / 2,
                    magnitude: weapon.#recoilImpulseParity * prototype.projectileSpawnOffset.perp
                }, true), shouldFSA = ballistics.firstShotAccuracy.enabled && gamespace.currentUpdate - weapon.#lastUse > ballistics.firstShotAccuracy.rechargeTime;
                for (let i = 0, proj = ballistics.projectiles; i < proj; i++) {
                    const deviation = shouldFSA
                        ? 0
                        : (Math.random() - 0.5) * (prototype.accuracy.default + (playerVelocity.squaredLength == 0 ? 0 : prototype.accuracy.moving)), offset = ammoInfo.spawnVar ?
                        "radius" in ammoInfo.spawnVar ?
                            /* spawn variance (circular) */ srvsdbx_Geometry.Vector2D.fromPolarToPt(srvsdbx_Math.randomAngle(), ammoInfo.spawnVar.radius * size) :
                            /* spawn variance (box) */ {
                                x: Math.sign(Math.random() - 0.5) * Math.random() * ammoInfo.spawnVar.width * size,
                                y: Math.sign(Math.random() - 0.5) * Math.random() * ammoInfo.spawnVar.height * size
                            }
                        : srvsdbx_Geometry.Vector2D.zeroPt(), newStart = start.plus(offset);
                    new Bullet(newStart, ballistics.falloff, newStart
                        .plus(srvsdbx_Geometry.Vector2D.fromPolarToPt(playerDir + deviation, Math.max(0, extractValue(ballistics.range, weapon, player)))), extractValue(ballistics.velocity, weapon, player), ballistics.damage * (ballistics.headshotMult != 1 && Math.random() > 0.85 ? ballistics.headshotMult : 1), Bullet.drawFromFirearm(weapon), ammoInfo.projectileInfo, {
                        allowMultipleHitsPerTarget: ballistics.persistance?.allowMultipleHitsPerTarget ?? false,
                        hitMultiplier: ballistics.persistance?.hitMultiplier ?? 0,
                        hitsBeforeDespawn: ballistics.persistance?.hitsBeforeDespawn ?? 1
                    }, ballistics.effectsOnHit, weapon);
                }
                if (prototype.casings?.spawnOn == "fire") {
                    for (let i = 0, limit = prototype.casings.count ?? 1; i < limit; i++) {
                        weapon.makeCasing(prototype.casings.spawnDelay);
                    }
                }
                if (!["semi", "auto-charge", "release-charge"].includes(prototype.fireMode))
                    player.timers.firing = setTimeout(fire, shotDelay, weapon);
                else
                    weapon.#shots = 0;
                if (!weapon.#ammo) {
                    clearTimerIfPresent(player.timers.anticipatedReload);
                    player.timers.anticipatedReload = setTimeout(weapon.#reload.bind(weapon), shotDelay, weapon);
                }
                weapon.#lastUse = gamespace.currentUpdate;
                state.firing = false;
            }, 0, this);
        }
    }
    /**
     * Resets this weapon's fields
     */
    reset() {
        this.#ammo = this.prototype.magazineCapacity.normal;
        this.#isCharging = false;
        this.#chargeStart = 0;
        this.#shots = 0;
        this.#lastUse = 0;
    }
    /**
     * A standard method for reloading a weapon
     */
    standardReload() {
        const proto = this.prototype, owner = this.owner, 
        // Anticipated reloads sometimes fire a few milliseconds too quick
        padding = 5;
        if ( // Conditions for exiting
        // This item isn't active
        this != owner.activeItem ||
            // The magazine is full
            this.#ammo == proto.magazineCapacity.normal ||
            // We're already reloading
            owner.state.reloading ||
            // The weapon's switch delay hasn't passed
            gamespace.currentUpdate - owner.state.lastSwitch < owner.state.effectiveSwitchDelay - padding ||
            // The weapon's firing delay hasn't passed
            gamespace.currentUpdate - this.#lastUse < proto.useDelay * this.owner.modifiers.ergonomics.reduced - padding)
            return;
        this.#reload();
    }
    /**
     * The method that actually reloads this weapon. Can be called directly internally to "force" reloads
     * @param forceChains If reloads are to be chained, this argument specifies whether `standardReload` or `#reload` will be called.
     */
    #reload(forceChains) {
        const proto = this.prototype, owner = this.owner;
        if (this != owner.activeItem)
            return;
        owner.state.attacking = false;
        owner.state.firing = false;
        this.#shots = 0;
        this.#charged = false;
        this.#isCharging = false;
        this.#destroyChargeParticle();
        clearTimerIfPresent(owner.timers.firing);
        owner.state.reloading = gamespace.currentUpdate;
        const r = this.determineReloadType();
        if (proto.casings?.spawnOn == "reload")
            for (let i = 0, limit = proto.casings.count ?? proto.magazineCapacity.normal; i < limit; i++)
                this.makeCasing(proto.casings.spawnDelay);
        this.owner.timers.reload = setTimeout(() => {
            this.#ammo = Math.min(this.#ammo + (r.ammoReloaded == "all" ? Infinity : r.ammoReloaded), proto.magazineCapacity.normal);
            owner.state.reloading = false;
            if (this.#ammo < proto.magazineCapacity.normal && r.chain) {
                clearTimerIfPresent(this.owner.timers.reload);
                (forceChains ? this.#reload : this.standardReload).call(this);
            }
        }, r.duration * this.owner.modifiers.ergonomics.reduced);
    }
    /**
     * Figures out whether, given the weapon's current state, the regular or alternate reload should be used
     */
    determineReloadType() {
        return this.prototype.altReload && !this.#ammo ? this.prototype.altReload : this.prototype.reload;
    }
    /**
     * Starts charging this weapon
     */
    startCharging() {
        this.#isCharging = true;
        this.#chargeStart = gamespace.currentUpdate;
        this.#updateChargeParticle();
    }
    /**
     * Stops charging this weapon
     */
    stopCharging() {
        this.#charged = false;
        this.#isCharging = false;
        this.#destroyChargeParticle();
    }
    /**
     * Spawns a new casing from this weapon, with an optional delay
     * @param delay How much time, in ms, to wait before spawning the casing
     */
    makeCasing(delay) {
        if (this.prototype.casings === void 0)
            return;
        const T = this;
        if (!delay)
            makeCasing();
        else {
            setTimeout(() => {
                if (this.owner.activeItem == this)
                    makeCasing();
            }, delay);
        }
        function makeCasing() {
            const proto = T.prototype, ammo = gamespace.prototypes.ammoTypes.get(proto.caliber);
            if (ammo.casing) {
                const playerDir = T.owner.body.angle - Math.PI / 2, size = gamespace.PLAYER_SIZE, start = srvsdbx_Geometry.Vector2D.fromPoint2D(T.owner.position)
                    .plus(srvsdbx_Geometry.Vector2D.fromPolarToVec(playerDir + Math.PI / 2, (T.#recoilImpulseParity * proto.casings.spawnOffset.perp * size)), true)
                    .plus(srvsdbx_Geometry.Vector2D.fromPolarToVec(playerDir, (proto.casings.spawnOffset.parr + 1) * size), true), sin = -Math.sin(T.owner.angle + Math.PI / 2), cos = Math.cos(T.owner.angle + Math.PI / 2), casingVel = proto.casings.velocity, perp = extractValue(casingVel.perp), parr = extractValue(casingVel.parr), casing = new Particle(gamespace.prototypes.particles.get(ammo.casing), start, T.owner.angle);
                casing.velocityMap.set("intrinsic", {
                    x: sin * perp - cos * parr,
                    y: cos * perp + sin * parr,
                    z: 0
                });
                // Adjust the sign of the angular velocity to match the casing's direction (for leftwards-ejecting guns)
                // If there's no perpendicular component, the gun is ejecting downwards or upwards, so randomize the sign
                casing.angularVelocityMap.set("intrinsic", (() => {
                    const current = casing.angularVelocityMap.get("intrinsic");
                    switch (Math.sign(perp)) {
                        case -1: return current;
                        case 0: return Math.sign(Math.random() - 0.5) * current;
                        case 1: return -current;
                    }
                })());
            }
        }
    }
    /**
     * Clears this instance's object attributes
     */
    destroy() {
        super.destroy();
        // @ts-expect-error
        this.#animationManager = this.#chargeParticle = this.#chargedDimensions = this.#destroyChargeParticle = this.#dimensions = this.#updateChargeParticle = void 0;
    }
}
/**
 * Represents an ammo type
 */
class Ammo extends ImportedObject {
    /**
     * Takes a simplified representation of an ammo type and attempts to convert it into a more rigorous one
     * @param obj The `SimpleAmmo` object to parse
     * @returns Either a new `Ammo` object, or an array containing the errors that prevented its creation
     */
    static async from(ammo) {
        const errors = [], projectileImages = await srvsdbx_AssetManagement.loadImageArray(ammo.projectileInfo.images, errors, `${ammo.includePath}/`);
        if (errors.length) {
            return { err: errors };
        }
        return {
            res: new Ammo(ammo.name, ammo.displayName, ammo.includePath, ammo.namespace, ammo.targetVersion, ammo.tints, ammo.alpha, ammo.spawnVar, ammo.imageOffset, {
                type: ammo.projectileInfo.type,
                explodeOnContact: ammo.projectileInfo.explodeOnContact,
                explosionType: ammo.projectileInfo.explosionType,
                heightPeak: ammo.projectileInfo.heightPeak,
                spinVel: ammo.projectileInfo.spinVel,
                images: projectileImages
            }, ammo.casing)
        };
    }
    /**
     * Information about the various colors of this ammo's tracers
     */
    #tints;
    /**
     * Information about the various colors of this ammo's tracers
     */
    get tints() { return this.#tints; }
    /**
     * Information about how opaque this tracer is
     */
    #alpha;
    /**
     * Information about how opaque this tracer is
     */
    get alpha() { return this.#alpha; }
    /**
     * Either the dimensions of a box or the radius of a circle.
     *
     * The area outlined by this shape defines where projectiles of this ammo type may spawn
     */
    #spawnVar;
    /**
     * Either the dimensions of a box or the radius of a circle.
     *
     * The area outlined by this shape defines where projectiles of this ammo type may spawn
     */
    get spawnVar() { return this.#spawnVar; }
    /**
     * Dictates an offset, relative to the projectile's hitbox, that this tracer will be drawn at
     */
    #imageOffset;
    /**
     * Dictates an offset, relative to the projectile's hitbox, that this tracer will be drawn at
     */
    get imageOffset() { return this.#imageOffset; }
    /**
     * Information pertaining more to the projectile itself
     */
    #projectileInfo;
    /**
     * Information pertaining more to the projectile itself
     */
    get projectileInfo() { return this.#projectileInfo; }
    /**
     * The internal name of the particle corresponding to the casing guns firing this ammo type eject
     */
    #casing;
    /**
     * The internal name of the particle corresponding to the casing guns firing this ammo type eject
     */
    get casing() { return this.#casing; }
    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(name, displayName, includePath, namespace, targetVersion, tints, alpha, spawnVar, imageOffset, projectileInfo, casing) {
        super(name, displayName, targetVersion, namespace, includePath);
        this.#tints = tints;
        this.#alpha = alpha;
        this.#spawnVar = spawnVar;
        this.#imageOffset = imageOffset;
        this.#projectileInfo = projectileInfo;
        this.#casing = casing;
    }
}
// #endregion
//# sourceMappingURL=weapons.js.map