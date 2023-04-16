interface SimpleMelee extends SimpleEquipableItem {
    readonly autoAttack: boolean;
    readonly damages: {
        readonly damage: number;
        readonly time: number;
        readonly areaOfEffect: {
            readonly offset: {
                readonly parr: number;
                readonly perp: number;
            };
            readonly radius: number;
        };
    }[];
    readonly isReflective?: boolean;
    readonly canReflectWhileAttacking?: boolean;
    readonly maxTargets?: number;
    readonly obstacleMultiplier: number;
    readonly armorPiercing: boolean;
    readonly stonePiercing: boolean;
    readonly worldObject?: {
        readonly tint: string;
        readonly dimensions: {
            readonly width: Dimension;
            readonly height: Dimension;
            readonly layer?: 0 | 1 | 2;
        };
        readonly collider?: ({
            readonly radius: number;
        } | {
            readonly width: Dimension | "match";
            readonly height: Dimension | "match";
        }) & {
            readonly offsetParr: number;
            readonly offsetPerp: number;
        };
        readonly offset: {
            readonly parr: number;
            readonly perp: number;
            readonly angle: number;
        };
    };
    readonly holstered?: {
        readonly image?: string;
        readonly dimensions?: {
            readonly width: Dimension;
            readonly height: Dimension;
            readonly layer?: 0 | 1 | 2;
        };
        readonly collider?: {
            readonly width: Dimension | "match";
            readonly height: Dimension | "match";
            readonly offsetParr: number;
            readonly offsetPerp: number;
        };
        readonly offset?: {
            readonly parr: number;
            readonly perp: number;
            readonly angle: number;
        };
    };
    readonly animations: {
        readonly idle: MayBeFunctionWrapped<srvsdbx_Animation.AnimationSkeleton<ItemAnimation> | "none">;
        readonly using: MayBeFunctionWrapped<srvsdbx_Animation.AnimationSkeleton<ItemAnimation> | "none">;
        readonly deflect?: MayBeFunctionWrapped<srvsdbx_Animation.AnimationSkeleton<ItemAnimation> | "none">;
    };
    readonly addons?: {
        readonly images: string[];
        readonly show?: MayBeFunctionWrapped<boolean, [Melee]>;
        readonly tint: MayBeFunctionWrapped<string, [Melee]>;
        readonly dimensions: {
            readonly width: MayBeFunctionWrapped<Dimension, [Melee]>;
            readonly height: MayBeFunctionWrapped<Dimension, [Melee]>;
            readonly layer: -1 | 1;
        };
        readonly dual?: boolean;
        readonly position: {
            readonly parr: MayBeFunctionWrapped<number, [Melee]>;
            readonly perp: MayBeFunctionWrapped<number, [Melee]>;
        };
    }[];
}
declare class MeleePrototype extends InventoryItemPrototype implements EquipableItemPrototype {
    #private;
    get handPositions(): HandPositions | undefined;
    get autoAttack(): boolean;
    get maxTargets(): number | undefined;
    get damages(): {
        readonly damage: number;
        readonly time: number;
        readonly areaOfEffect: {
            readonly offset: {
                readonly parr: number;
                readonly perp: number;
            };
            readonly radius: number;
        };
    }[];
    get armorPiercing(): boolean;
    get stonePiercing(): boolean;
    get isReflective(): boolean;
    get canReflectWhileAttacking(): boolean;
    get obstacleMultiplier(): number;
    get useDelay(): number;
    get animations(): {
        readonly idle: srvsdbx_Animation.Animation<ItemAnimation> | srvsdbx_Animation.BoundIndeterminateAnimation<ItemAnimation, srvsdbx_Animation.IndeterminateAnimation<ItemAnimation>>;
        readonly using: srvsdbx_Animation.Animation<ItemAnimation> | srvsdbx_Animation.BoundIndeterminateAnimation<ItemAnimation, srvsdbx_Animation.IndeterminateAnimation<ItemAnimation>>;
        readonly deflect: srvsdbx_Animation.Animation<ItemAnimation> | srvsdbx_Animation.BoundIndeterminateAnimation<ItemAnimation, srvsdbx_Animation.IndeterminateAnimation<ItemAnimation>>;
    };
    get worldObject(): (Omit<{
        readonly tint: string;
        readonly dimensions: {
            readonly width: Dimension;
            readonly height: Dimension;
            readonly layer?: 0 | 2 | 1 | undefined;
        };
        readonly collider?: (({
            readonly radius: number;
        } | {
            readonly width: "match" | Dimension;
            readonly height: "match" | Dimension;
        }) & {
            readonly offsetParr: number;
            readonly offsetPerp: number;
        }) | undefined;
        readonly offset: {
            readonly parr: number;
            readonly perp: number;
            readonly angle: number;
        };
    }, "collider"> & {
        readonly collider?: (Omit<({
            readonly radius: number;
        } & {
            readonly offsetParr: number;
            readonly offsetPerp: number;
        }) | ({
            readonly width: "match" | Dimension;
            readonly height: "match" | Dimension;
        } & {
            readonly offsetParr: number;
            readonly offsetPerp: number;
        }), "height" | "width" | "radius"> & ({
            readonly radius: number;
        } | {
            readonly width: number;
            readonly height: number;
        })) | undefined;
    }) | undefined;
    get holstered(): srvsdbx_AssetManagement.ConvertPathsToImages<Required<Omit<{
        readonly image?: string | undefined;
        readonly dimensions?: {
            readonly width: Dimension;
            readonly height: Dimension;
            readonly layer?: 0 | 2 | 1 | undefined;
        } | undefined;
        readonly collider?: {
            readonly width: "match" | Dimension;
            readonly height: "match" | Dimension;
            readonly offsetParr: number;
            readonly offsetPerp: number;
        } | undefined;
        readonly offset?: {
            readonly parr: number;
            readonly perp: number;
            readonly angle: number;
        } | undefined;
    }, "dimensions" | "collider"> & {
        readonly dimensions: {
            readonly width: number;
            readonly height: number;
            readonly layer: 0 | 2 | 1;
        };
        readonly collider: Omit<{
            readonly width: "match" | Dimension;
            readonly height: "match" | Dimension;
            readonly offsetParr: number;
            readonly offsetPerp: number;
        }, "height" | "width"> & {
            readonly width: number;
            readonly height: number;
        };
    }>> | undefined;
    get moveSpeedPenalties(): {
        readonly passive: number;
        readonly active: number;
        readonly using: number;
    };
    get addonsBelow(): (srvsdbx_AssetManagement.ConvertPathsToImages<{
        readonly images: string[];
        readonly show?: MayBeFunctionWrapped<boolean, [Gun]> | undefined;
        readonly tint: MayBeFunctionWrapped<string, [Gun]>;
        readonly dimensions: {
            readonly width: MayBeFunctionWrapped<Dimension, [Gun]>;
            readonly height: MayBeFunctionWrapped<Dimension, [Gun]>;
            readonly layer: 1 | -1;
        };
        readonly dual?: boolean | undefined;
        readonly recoil?: boolean | undefined;
        readonly position: {
            readonly parr: MayBeFunctionWrapped<number, [Gun]>;
            readonly perp: MayBeFunctionWrapped<number, [Gun]>;
        };
    }>[] & {
        readonly [key: number]: {
            readonly dimensions: {
                readonly layer: -1;
            };
        };
    }) | undefined;
    get addonsAbove(): (srvsdbx_AssetManagement.ConvertPathsToImages<{
        readonly images: string[];
        readonly show?: MayBeFunctionWrapped<boolean, [Gun]> | undefined;
        readonly tint: MayBeFunctionWrapped<string, [Gun]>;
        readonly dimensions: {
            readonly width: MayBeFunctionWrapped<Dimension, [Gun]>;
            readonly height: MayBeFunctionWrapped<Dimension, [Gun]>;
            readonly layer: 1 | -1;
        };
        readonly dual?: boolean | undefined;
        readonly recoil?: boolean | undefined;
        readonly position: {
            readonly parr: MayBeFunctionWrapped<number, [Gun]>;
            readonly perp: MayBeFunctionWrapped<number, [Gun]>;
        };
    }>[] & {
        readonly [key: number]: {
            readonly dimensions: {
                readonly layer: 1;
            };
        };
    }) | undefined;
    get addons(): srvsdbx_AssetManagement.ConvertPathsToImages<{
        readonly images: string[];
        readonly show?: MayBeFunctionWrapped<boolean, [Melee]> | undefined;
        readonly tint: MayBeFunctionWrapped<string, [Melee]>;
        readonly dimensions: {
            readonly width: MayBeFunctionWrapped<Dimension, [Melee]>;
            readonly height: MayBeFunctionWrapped<Dimension, [Melee]>;
            readonly layer: 1 | -1;
        };
        readonly dual?: boolean | undefined;
        readonly position: {
            readonly parr: MayBeFunctionWrapped<number, [Melee]>;
            readonly perp: MayBeFunctionWrapped<number, [Melee]>;
        };
    }>[] | undefined;
    get imageMap(): Map<string, srvsdbx_AssetManagement.ImageSrcPair>;
    static from(obj: SimpleMelee): Promise<srvsdbx_ErrorHandling.Result<MeleePrototype, srvsdbx_Errors.SandboxError[]>>;
    constructor(name: ImportedObject["name"], displayName: ImportedObject["displayName"], objectType: ImportedObject["objectType"], targetVersion: ImportedObject["targetVersion"], namespace: ImportedObject["namespace"], includePath: ImportedObject["includePath"], images: InventoryItemPrototype["images"], moveSpeedPenalties: MeleePrototype["moveSpeedPenalties"], handPositions: MeleePrototype["handPositions"], isReflective: MeleePrototype["isReflective"], canReflectWhileAttacking: MeleePrototype["canReflectWhileAttacking"], autoAttack: MeleePrototype["autoAttack"], maxTargets: MeleePrototype["maxTargets"], damages: MeleePrototype["damages"], worldObject: srvsdbx_AssetManagement.ConvertPathsToImages<Omit<SimpleMelee["worldObject"] & {}, "collider"> & {
        readonly collider?: (SimpleMelee["worldObject"] & {})["collider"] & {};
    }> | undefined, holstered: srvsdbx_AssetManagement.ConvertPathsToImages<Omit<Required<SimpleMelee["holstered"] & {}>, "collider"> & {
        readonly collider?: (SimpleMelee["holstered"] & {})["collider"];
    }> | undefined, obstacleMultiplier: MeleePrototype["obstacleMultiplier"], armorPiercing: MeleePrototype["armorPiercing"], stonePiercing: MeleePrototype["stonePiercing"], firingDelay: MeleePrototype["useDelay"], animations: MeleePrototype["animations"], addons: MeleePrototype["addons"], imageMap: Map<string, srvsdbx_AssetManagement.ImageSrcPair>);
    create(owner: PlayerLike): Melee;
}
declare class Melee extends InventoryItem<MeleePrototype> implements EquipableItem<ItemAnimation, "idle" | "using" | "deflect">, Destroyable {
    #private;
    get animationManager(): srvsdbx_Animation.AnimationManager<ItemAnimation, "idle" | "using" | "deflect">;
    get lastUse(): number;
    get cancelledAnimation(): boolean;
    get lastReflect(): number;
    set lastReflect(v: number);
    constructor(prototype: MeleePrototype, owner: PlayerLike);
    getCollider(): srvsdbx_Geometry.Circle | srvsdbx_Geometry.Rectangle | undefined;
    getHandReference(): HandPositions | undefined;
    getItemReference(): {
        readonly image?: string | undefined;
        readonly dimensions?: {
            readonly width?: number | undefined;
            readonly height?: number | undefined;
            readonly layer?: 0 | 2 | 1 | undefined;
        } | undefined;
        readonly offset?: {
            readonly parr?: number | undefined;
            readonly perp?: number | undefined;
            readonly angle?: number | undefined;
        } | undefined;
    } | undefined;
    stopAnimations(): void;
    usePrimary(): void;
    reset(): void;
    destroy(): void;
}
