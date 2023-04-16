declare const _default: {
    name: string;
    targetVersion: string;
    hitbox: {
        type: "circle";
        radius: () => number;
    };
    scale(): number;
    collidable: {
        getHitboxName(): "DEFAULT" | "COLLIDABLE" | "SEMI_COLLIDABLE" | "GROUND" | "PARTICLE" | "DECAL" | "AREA_OF_EFFECT" | "REFLECTIVE";
        getHitboxColor(): string;
    };
    skipProjectileHitIncrement: true;
    destroyable: true;
    armorPlated: false;
    stonePlated: false;
    reflective: false;
    hitParticle: {
        particle: string;
        count: number;
    };
    destroyParticle: {
        particle: string;
        count: () => number;
    };
    residue: {
        decal: string;
    };
    baseHP: number;
    images: string[];
};
export default _default;
