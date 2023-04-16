type EquipmentTypes = "helmet" | "vest" | "backpack";
interface SimpleEquipment extends SimpleInventoryItem {
    readonly protectionModifier?: number;
    readonly type: EquipmentTypes;
    readonly noShow?: boolean;
    readonly maxLevel?: boolean;
    readonly level: number;
    readonly worldObject?: {
        readonly tint: string;
        readonly dimensions: {
            readonly width: Dimension;
            readonly height: Dimension;
        };
        readonly offset: {
            readonly parr: number;
            readonly perp: number;
            readonly angle: number;
        };
    };
}
declare class EquipmentPrototype extends InventoryItemPrototype {
    #private;
    get protectionModifier(): number;
    get level(): number;
    get noShow(): boolean;
    get maxLevel(): boolean;
    get type(): EquipmentTypes;
    get worldObject(): (Omit<{
        readonly tint: string;
        readonly dimensions: {
            readonly width: Dimension;
            readonly height: Dimension;
        };
        readonly offset: {
            readonly parr: number;
            readonly perp: number;
            readonly angle: number;
        };
    }, "dimensions"> & {
        dimensions: {
            width: number;
            height: number;
        };
    }) | undefined;
    static from(obj: SimpleEquipment): Promise<srvsdbx_ErrorHandling.Result<EquipmentPrototype, srvsdbx_Errors.SandboxError[]>>;
    constructor(name: ImportedObject["name"], displayName: ImportedObject["displayName"], objectType: ImportedObject["objectType"], targetVersion: ImportedObject["targetVersion"], namespace: ImportedObject["namespace"], includePath: ImportedObject["includePath"], images: InventoryItemPrototype["images"], moveSpeedPenalties: InventoryItemPrototype["moveSpeedPenalties"], level: EquipmentPrototype["level"], type: EquipmentPrototype["type"], noShow: EquipmentPrototype["noShow"], maxLevel: EquipmentPrototype["maxLevel"], protectionModifier: EquipmentPrototype["protectionModifier"], worldObject: EquipmentPrototype["worldObject"]);
    create(owner: PlayerLike): Equipment;
}
declare class Equipment extends InventoryItem<EquipmentPrototype> implements Destroyable {
    constructor(prototype: EquipmentPrototype, owner: PlayerLike);
    destroy(): void;
}
