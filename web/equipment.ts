/**
 * The types of equipments there are
 */
type EquipmentTypes = "helmet" | "vest" | "backpack";

/**
 * A simplified representation of a piece of equipment
 */
interface SimpleEquipment extends SimpleInventoryItem {
    /**
     * A protection modifier that will be applied to the owner of this item
     *
     * In the case of helmets, specify the headshot protection and not the bodyshot protection
     */
    readonly protectionModifier?: number;
    /**
     * The type of equipment this is
     */
    readonly type: EquipmentTypes;
    /**
     * Whether this piece of equipment should be displayed in the HUD
     */
    readonly noShow?: boolean;
    /**
     * Whether this piece of equipment is of the highest level
     */
    readonly maxLevel?: boolean;
    /**
     * The level of this piece of equipment
     */
    readonly level: number;
    /**
     * Information about this item's in-game rendition
     */
    readonly worldObject?: {
        /**
         * What color to tint the world image
         */
        readonly tint: string;
        /**
         * The dimensions of this object
         */
        readonly dimensions: {
            /**
             * The image's width, in surviv units
             */
            readonly width: Dimension,
            /**
             * The image's height, in surviv units
             */
            readonly height: Dimension;
        },
        /**
         * The offset at which to draw this piece of equipment, with (0, 0) being the player's center
         *
         * This refers to where the center of the world image will end up
         */
        readonly offset: {
            /**
             * The offset along the axis parallel to the owner's direction, in surviv units
             */
            readonly parr: number,
            /**
             * The offset along the axis perpendicular to the owner's direction, in surviv units
             */
            readonly perp: number,
            /**
             * The angular offset to apply, in radians
             */
            readonly angle: number;
        };
    };
}

/**
 * Represents a piece of equipment that can be by a player
 */
class EquipmentPrototype extends InventoryItemPrototype {
    /**
     * A protection modifier that will be applied to the owner of this item
     */
    readonly #protectionModifier: number;
    /**
     * A protection modifier that will be applied to the owner of this item
     */
    get protectionModifier() { return this.#protectionModifier; }

    /**
     * The level of this piece of equipment
     */
    readonly #level: number;
    /**
     * The level of this piece of equipment
     */
    get level() { return this.#level; }

    /**
     * Whether this piece of equipment should be displayed in the HUD
     */
    readonly #noShow: boolean;
    /**
     * Whether this piece of equipment should be displayed in the HUD
     */
    get noShow() { return this.#noShow; }

    /**
     * Whether this piece of equipment is of the highest level
     */
    readonly #maxLevel: boolean;
    /**
     * Whether this piece of equipment is of the highest level
     */
    get maxLevel() { return this.#maxLevel; }

    /**
     * The type of equipment this is
     */
    readonly #type: EquipmentTypes;
    /**
     * The type of equipment this is
     */
    get type() { return this.#type; }

    /**
     * A protection modifier that will be applied to the owner of this item
     */
    readonly #worldObject: (Omit<SimpleEquipment["worldObject"] & {}, "dimensions"> & { dimensions: { width: number, height: number; }; }) | undefined;
    /**
     * A protection modifier that will be applied to the owner of this item
     */
    get worldObject() { return this.#worldObject; }

    /**
     * Takes a simplified representation of a equipment and converts it into a more rigorous one
     * @param obj The `SimpleEquipment` object to parse
     * @returns A new `EquipmentPrototype`
     */
    static async from(obj: SimpleEquipment): Promise<srvsdbx_ErrorHandling.Result<EquipmentPrototype, srvsdbx_Errors.SandboxError[]>> {
        const errors: srvsdbx_Errors.SandboxError[] = [],
            pathPrefix = `${obj.includePath}/`,
            lootImage = srvsdbx_ErrorHandling.handleResult(
                await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${pathPrefix}${obj.images.loot}`),
                srvsdbx_ErrorHandling.identity,
                e => errors.push(e)
            ),
            worldImage = obj.images.world ? srvsdbx_ErrorHandling.handleResult(
                await srvsdbx_AssetManagement.loadingFunctions.loadImageAsync(`${pathPrefix}${obj.images.world}`),
                srvsdbx_ErrorHandling.identity,
                e => errors.push(e)
            ) : void 0;

        if (errors.length) return { err: errors };

        return {
            res: new EquipmentPrototype(
                obj.name,
                obj.displayName,
                obj.objectType,
                obj.targetVersion,
                obj.namespace,
                obj.includePath,
                {
                    loot: lootImage as srvsdbx_AssetManagement.ImageSrcPair,
                    world: worldImage as srvsdbx_AssetManagement.ImageSrcPair
                },
                obj.moveSpeedPenalties,
                obj.level,
                obj.type,
                obj.noShow ?? false,
                obj.maxLevel ?? false,
                obj.protectionModifier ?? 1,
                obj.worldObject ? {
                    tint: obj.worldObject.tint,
                    dimensions: srvsdbx_AssetManagement.determineImageDimensions(
                        (worldImage as srvsdbx_AssetManagement.ImageSrcPair).asset,
                        obj.worldObject.dimensions
                    ),
                    offset: obj.worldObject.offset,
                } : void 0
            )
        };
    }

    /**
     * `* It's a constructor. It constructs`
     */
    constructor(
        name: ImportedObject["name"],
        displayName: ImportedObject["displayName"],
        objectType: ImportedObject["objectType"],
        targetVersion: ImportedObject["targetVersion"],
        namespace: ImportedObject["namespace"],
        includePath: ImportedObject["includePath"],
        images: InventoryItemPrototype["images"],
        moveSpeedPenalties: InventoryItemPrototype["moveSpeedPenalties"],
        level: EquipmentPrototype["level"],
        type: EquipmentPrototype["type"],
        noShow: EquipmentPrototype["noShow"],
        maxLevel: EquipmentPrototype["maxLevel"],
        protectionModifier: EquipmentPrototype["protectionModifier"],
        worldObject: EquipmentPrototype["worldObject"],
    ) {
        super(
            name,
            displayName,
            objectType,
            targetVersion,
            namespace,
            includePath,
            images,
            moveSpeedPenalties
        );

        this.#level = level;
        this.#type = type;
        this.#noShow = noShow;
        this.#maxLevel = maxLevel;
        this.#protectionModifier = protectionModifier;
        this.#worldObject = worldObject;
    }

    /**
     * Creates a new `Melee` object from this prototype
     * @param owner The `PlayerLike` the created weapon belongs to
     * @returns A new weapon with this object as its prototype
     */
    create(
        owner: PlayerLike
    ) {
        return new Equipment(
            this,
            owner
        );
    }
}

/**
 * Represents a piece of equipment worn by a player
 */
class Equipment
    extends InventoryItem<EquipmentPrototype>
    implements Destroyable {
    /**
     * `* It's a constructor. It constructs.`
     */
    constructor(prototype: EquipmentPrototype, owner: PlayerLike) {
        super(prototype, owner);

        this.owner.modifiers.protection.set(this.prototype.type, this.prototype.protectionModifier);
    }

    override destroy() {
        if (this.destroyed) return;
        this.owner.modifiers?.protection?.delete?.(this.prototype.type);

        super.destroy();
    }
}