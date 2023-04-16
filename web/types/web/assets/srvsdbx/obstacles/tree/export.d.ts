declare const _default: {
    name: string;
    targetVersion: string;
    hitbox: {
        type: "circle";
        radius: () => number;
    };
    scale(hp: number): number;
    collidable: {
        getHitboxName(): "DEFAULT" | "COLLIDABLE" | "SEMI_COLLIDABLE" | "GROUND" | "PARTICLE" | "DECAL" | "AREA_OF_EFFECT" | "REFLECTIVE";
        getHitboxColor(): string;
    };
    destroyable: true;
    armorPlated: false;
    stonePlated: false;
    reflective: false;
    imageScale: number;
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
    subLayer: number;
    images: string[];
};
export default _default;
