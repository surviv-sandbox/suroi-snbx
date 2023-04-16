interface SimpleGun extends SimpleEquipableItem {
    readonly images: {
        readonly loot: string;
        readonly world: string;
    };
    readonly handPositions: {
        readonly leftHand: HandPositions["leftHand"] & {};
        readonly rightHand?: HandPositions["rightHand"] & {};
    };
    readonly dual: boolean;
    readonly tint: string;
    readonly ballistics: {
        readonly damage: number;
        readonly noCollide?: boolean;
        readonly velocity: MayBeFunctionWrapped<number, [Gun, PlayerLike]>;
        readonly range: MayBeFunctionWrapped<number, [Gun, PlayerLike]>;
        readonly tracer: {
            readonly width: Dimension;
            readonly height: Dimension;
            readonly drawAbovePlayer?: boolean;
            readonly forceMaximumLength?: boolean;
            readonly noShrink?: boolean;
            readonly trail?: {
                readonly image: string;
                readonly maxLength: number;
                readonly width: number;
                readonly tint: string;
                readonly offset: {
                    readonly parr: number;
                    readonly perp: number;
                };
            };
            readonly offset?: {
                readonly parr: number;
                readonly perp: number;
            };
        };
        readonly persistance?: {
            readonly hitsBeforeDespawn?: number;
            readonly allowMultipleHitsPerTarget?: boolean;
            readonly hitMultiplier?: number;
        };
        readonly effectsOnHit?: PrototypeReference<"statusEffects">[];
        readonly obstacleMultiplier: number;
        readonly headshotMultiplier: number;
        readonly firstShotAccuracy: {
            readonly enabled: boolean;
            readonly rechargeTime: number;
        };
        readonly falloff: number;
        readonly projectiles: number;
    };
    readonly effectsOnFire?: {
        readonly radius: number;
        readonly effects: PrototypeReference<"statusEffects">[];
    }[];
    readonly suppressed: boolean;
    readonly caliber: PrototypeReference<"ammos">;
    readonly deployGroup: number;
    readonly accuracy: {
        readonly default: number;
        readonly moving: number;
    };
    readonly imageOffset: {
        readonly parr: number;
        readonly perp: number;
    };
    readonly dimensions: {
        readonly width: Dimension;
        readonly height: Dimension;
        readonly layer: 0 | 1 | 2;
    };
    readonly switchDelay: number;
    readonly reload: {
        readonly duration: number;
        readonly ammoReloaded: number | "all";
        readonly chain: boolean;
    };
    readonly altReload?: {
        readonly duration: number;
        readonly ammoReloaded: number | "all";
        readonly chain: boolean;
    };
    readonly magazineCapacity: {
        readonly normal: number;
        readonly firepower: number;
    };
    readonly projectileSpawnOffset: {
        readonly parr: number;
        readonly perp: number;
    };
    readonly casings?: {
        readonly count?: number;
        readonly spawnOffset: {
            readonly parr: number;
            readonly perp: number;
        };
        readonly velocity: {
            readonly parr: MayBeFunctionWrapped<number>;
            readonly perp: MayBeFunctionWrapped<number>;
        };
        readonly spawnOn: "fire" | "reload";
        readonly spawnDelay: number;
    };
    readonly recoilImpulse: {
        readonly direction: {
            readonly parr: number;
            readonly perp: number;
        };
        readonly duration: number;
    };
    readonly fireMode: "automatic" | "semi" | `${"auto-" | ""}burst-${number}` | `${"auto" | "release"}-charge`;
    readonly burstProps?: {
        readonly shotDelay: number;
        readonly burstDelay: number;
    };
    readonly chargeProps?: {
        readonly chargeTime: number;
        readonly speedPenalty?: number;
        readonly chargeImage?: {
            readonly image?: string;
            readonly dimensions?: {
                readonly width: Dimension;
                readonly height: Dimension;
                readonly layer: 0 | 1 | 2;
            };
            readonly imageOffset?: {
                readonly parr: number;
                readonly perp: number;
            };
        };
        readonly chargeImageHUD?: {
            readonly image: string;
            readonly growStyle: "clip" | "scale";
        };
        readonly chargeParticle?: {
            readonly particle: PrototypeReference<"particles">;
            readonly offset: {
                readonly parr: number;
                readonly perp: number;
            };
            readonly scale?: MayBeFunctionWrapped<number, [number, Gun, Particle]>;
            readonly alpha?: MayBeFunctionWrapped<number, [number, Gun, Particle]>;
        };
    };
    readonly addons?: {
        readonly images: string[];
        readonly show?: MayBeFunctionWrapped<boolean, [Gun]>;
        readonly tint: MayBeFunctionWrapped<string, [Gun]>;
        readonly dimensions: {
            readonly width: MayBeFunctionWrapped<Dimension, [Gun]>;
            readonly height: MayBeFunctionWrapped<Dimension, [Gun]>;
            readonly layer: -1 | 1;
        };
        readonly dual?: boolean;
        readonly recoil?: boolean;
        readonly position: {
            readonly parr: MayBeFunctionWrapped<number, [Gun]>;
            readonly perp: MayBeFunctionWrapped<number, [Gun]>;
        };
    }[];
}
declare class GunPrototype extends InventoryItemPrototype implements EquipableItemPrototype {
    #private;
    get images(): {
        readonly loot: srvsdbx_AssetManagement.ImageSrcPair;
        readonly world: srvsdbx_AssetManagement.ImageSrcPair;
    };
    get dual(): boolean;
    get tint(): string;
    get ballistics(): srvsdbx_AssetManagement.ConvertPathsToImages<{
        readonly damage: number;
        readonly noCollide?: boolean | undefined;
        readonly velocity: MayBeFunctionWrapped<number, [Gun, PlayerLike]>;
        readonly range: MayBeFunctionWrapped<number, [Gun, PlayerLike]>;
        readonly tracer: {
            readonly width: Dimension;
            readonly height: Dimension;
            readonly drawAbovePlayer?: boolean | undefined;
            readonly forceMaximumLength?: boolean | undefined;
            readonly noShrink?: boolean | undefined;
            readonly trail?: {
                readonly image: string;
                readonly maxLength: number;
                readonly width: number;
                readonly tint: string;
                readonly offset: {
                    readonly parr: number;
                    readonly perp: number;
                };
            } | undefined;
            readonly offset?: {
                readonly parr: number;
                readonly perp: number;
            } | undefined;
        };
        readonly persistance?: {
            readonly hitsBeforeDespawn?: number | undefined;
            readonly allowMultipleHitsPerTarget?: boolean | undefined;
            readonly hitMultiplier?: number | undefined;
        } | undefined;
        readonly effectsOnHit?: string[] | undefined;
        readonly obstacleMultiplier: number;
        readonly headshotMultiplier: number;
        readonly firstShotAccuracy: {
            readonly enabled: boolean;
            readonly rechargeTime: number;
        };
        readonly falloff: number;
        readonly projectiles: number;
    }>;
    get suppressed(): boolean;
    get caliber(): string;
    get useDelay(): number;
    get deployGroup(): number;
    get accuracy(): {
        readonly default: number;
        readonly moving: number;
    };
    get moveSpeedPenalties(): {
        readonly passive: number;
        readonly active: number;
        readonly using: number;
    };
    get imageOffset(): {
        readonly parr: number;
        readonly perp: number;
    };
    get dimensions(): {
        readonly width: Dimension;
        readonly height: Dimension;
        readonly layer: 0 | 2 | 1;
    };
    get reload(): {
        readonly duration: number;
        readonly ammoReloaded: number | "all";
        readonly chain: boolean;
    };
    get altReload(): {
        readonly duration: number;
        readonly ammoReloaded: number | "all";
        readonly chain: boolean;
    } | undefined;
    get magazineCapacity(): {
        readonly normal: number;
        readonly firepower: number;
    };
    get effectsOnFire(): {
        readonly radius: number;
        readonly effects: string[];
    }[] | undefined;
    get switchDelay(): number;
    get handPositions(): {
        readonly leftHand: {
            readonly parr: number;
            readonly perp: number;
            readonly layer?: 0 | 1 | undefined;
        };
        readonly rightHand?: {
            readonly parr: number;
            readonly perp: number;
            readonly layer?: 0 | 1 | undefined;
        } | undefined;
    };
    get projectileSpawnOffset(): {
        readonly parr: number;
        readonly perp: number;
    };
    get casings(): {
        readonly count?: number | undefined;
        readonly spawnOffset: {
            readonly parr: number;
            readonly perp: number;
        };
        readonly velocity: {
            readonly parr: MayBeFunctionWrapped<number, []>;
            readonly perp: MayBeFunctionWrapped<number, []>;
        };
        readonly spawnOn: "reload" | "fire";
        readonly spawnDelay: number;
    } | undefined;
    get recoilImpulse(): {
        readonly direction: {
            readonly parr: number;
            readonly perp: number;
        };
        readonly duration: number;
    };
    get fireMode(): "automatic" | "semi" | `burst-${number}` | `auto-burst-${number}` | "auto-charge" | "release-charge";
    get burstProps(): {
        readonly shotDelay: number;
        readonly burstDelay: number;
    } | undefined;
    get chargeProps(): srvsdbx_AssetManagement.ConvertPathsToImages<{
        readonly chargeTime: number;
        readonly speedPenalty?: number | undefined;
        readonly chargeImage?: {
            readonly image?: string | undefined;
            readonly dimensions?: {
                readonly width: Dimension;
                readonly height: Dimension;
                readonly layer: 0 | 2 | 1;
            } | undefined;
            readonly imageOffset?: {
                readonly parr: number;
                readonly perp: number;
            } | undefined;
        } | undefined;
        readonly chargeImageHUD?: {
            readonly image: string;
            readonly growStyle: "clip" | "scale";
        } | undefined;
        readonly chargeParticle?: {
            readonly particle: string;
            readonly offset: {
                readonly parr: number;
                readonly perp: number;
            };
            readonly scale?: MayBeFunctionWrapped<number, [number, Gun, Particle]> | undefined;
            readonly alpha?: MayBeFunctionWrapped<number, [number, Gun, Particle]> | undefined;
        } | undefined;
    }> | undefined;
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
    }>[] | undefined;
    get imageMap(): Map<string, srvsdbx_AssetManagement.ImageSrcPair>;
    static from(obj: SimpleGun): Promise<srvsdbx_ErrorHandling.Result<GunPrototype, srvsdbx_Errors.SandboxError[]>>;
    static generateRecoilAnimation(handPositions: GunPrototype["handPositions"], worldImage: InventoryItemPrototype["images"]["world"] & {}, dimensions: GunPrototype["dimensions"], imageOffset: GunPrototype["imageOffset"], recoilImpulse: GunPrototype["recoilImpulse"]): srvsdbx_Animation.Animation<Required<ItemAnimation & {
        item: {
            offset: {
                parr: number;
                perp: number;
            };
        };
    }>>;
    constructor(name: ImportedObject["name"], displayName: ImportedObject["displayName"], objectType: ImportedObject["objectType"], includePath: ImportedObject["includePath"], namespace: ImportedObject["namespace"], targetVersion: ImportedObject["targetVersion"], images: GunPrototype["images"], dual: GunPrototype["dual"], tint: GunPrototype["tint"], ballistics: GunPrototype["ballistics"], effectsOnFire: GunPrototype["effectsOnFire"], suppressed: GunPrototype["suppressed"], caliber: GunPrototype["caliber"], useDelay: GunPrototype["useDelay"], deployGroup: GunPrototype["deployGroup"], accuracy: GunPrototype["accuracy"], moveSpeedPenalties: GunPrototype["moveSpeedPenalties"], imageOffset: GunPrototype["imageOffset"], dimensions: GunPrototype["dimensions"], reload: GunPrototype["reload"], altReload: GunPrototype["altReload"], magazineCapacity: GunPrototype["magazineCapacity"], switchDelay: GunPrototype["switchDelay"], handPositions: GunPrototype["handPositions"], projectileSpawnOffset: GunPrototype["projectileSpawnOffset"], casings: GunPrototype["casings"], recoilImpulse: GunPrototype["recoilImpulse"], fireMode: GunPrototype["fireMode"], burstProps: GunPrototype["burstProps"], chargeProps: GunPrototype["chargeProps"], addons: GunPrototype["addons"], imageMap: Map<string, srvsdbx_AssetManagement.ImageSrcPair>);
    create(owner: PlayerLike): Gun;
}
declare class Gun extends InventoryItem<GunPrototype> implements EquipableItem<Required<ItemAnimation> & {
    item: {
        offset: {
            parr: number;
            perp: number;
        };
    };
}>, Destroyable {
    #private;
    get animationManager(): srvsdbx_Animation.AnimationManager<Required<ItemAnimation & {
        readonly item: {
            readonly offset: {
                readonly parr: number;
                readonly perp: number;
            };
        };
    }>, "idle" | "using">;
    get lastUse(): number;
    get ammo(): number;
    get shots(): number;
    get recoilImpulseParity(): number;
    get dimensions(): {
        readonly width: number;
        readonly height: number;
    };
    get chargedDimensions(): srvsdbx_ErrorHandling.Maybe<{
        readonly width: number;
        readonly height: number;
    }>;
    get charged(): boolean;
    get chargeStart(): number;
    get isCharging(): boolean;
    get cancelledAnimation(): boolean;
    scheduleReload(delay: number): () => void;
    get reloadTimer(): {
        value: number | false;
        clear: () => void;
    };
    constructor(prototype: GunPrototype, owner: PlayerLike);
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
    } & {
        readonly offset: {
            readonly parr: number;
            readonly perp: number;
        };
    };
    getHandReference(): HandPositions;
    stopAnimations(): void;
    usePrimary(): void;
    reset(): void;
    standardReload(): void;
    determineReloadType(): {
        readonly duration: number;
        readonly ammoReloaded: number | "all";
        readonly chain: boolean;
    };
    startCharging(): void;
    stopCharging(): void;
    makeCasing(delay?: number): void;
    destroy(): void;
}
interface SimpleAmmo extends SimpleImport {
    readonly tints: {
        readonly normal: string;
        readonly saturated: string;
        readonly chambered: string;
    };
    readonly alpha: {
        readonly rate: number;
        readonly min: number;
        readonly max: number;
    };
    readonly spawnVar?: {
        readonly width: number;
        readonly height: number;
    } | {
        readonly radius: number;
    };
    readonly imageOffset: {
        readonly parr: number;
        readonly perp: number;
    };
    readonly projectileInfo: ({
        readonly type: "explosive";
        readonly explosionType: PrototypeReference<"explosions">;
        readonly explodeOnContact: boolean;
    } | {
        readonly type: "bullet";
    }) & {
        scale?: (t: number) => number;
        alpha?: (t: number) => number;
        readonly images: string[] | "none";
        readonly spinVel?: MayBeFunctionWrapped<number>;
    };
    readonly casing?: string;
}
declare class Ammo extends ImportedObject {
    #private;
    static from(ammo: SimpleAmmo): Promise<srvsdbx_ErrorHandling.Result<Ammo, srvsdbx_Errors.SandboxError[]>>;
    get tints(): {
        readonly normal: string;
        readonly saturated: string;
        readonly chambered: string;
    };
    get alpha(): {
        readonly rate: number;
        readonly min: number;
        readonly max: number;
    };
    get spawnVar(): {
        readonly width: number;
        readonly height: number;
    } | {
        readonly radius: number;
    } | undefined;
    get imageOffset(): {
        readonly parr: number;
        readonly perp: number;
    };
    get projectileInfo(): ({
        readonly type: "explosive";
        readonly explosionType: string;
        readonly explodeOnContact: boolean;
    } | {
        readonly type: "bullet";
    }) & {
        scale: (t: number) => number;
        alpha: (t: number) => number;
        readonly images: "none" | srvsdbx_AssetManagement.ImageSrcPair[];
        readonly spinVel?: MayBeFunctionWrapped<number, []> | undefined;
    };
    get casing(): string | undefined;
    constructor(name: ImportedObject["name"], displayName: ImportedObject["displayName"], objectType: ImportedObject["objectType"], includePath: ImportedObject["includePath"], namespace: ImportedObject["namespace"], targetVersion: ImportedObject["targetVersion"], tints: Ammo["tints"], alpha: Ammo["alpha"], spawnVar: Ammo["spawnVar"], imageOffset: Ammo["imageOffset"], projectileInfo: Ammo["projectileInfo"], casing: Ammo["casing"]);
}
