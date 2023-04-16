declare const _default: {
    name: string;
    targetVersion: string;
    hitbox: {
        type: "rectangle";
        dimensions: {
            width: number;
            height: "auto";
        };
    };
    scale(hp: number): number;
    collidable: {
        getHitboxName(): "DEFAULT" | "COLLIDABLE" | "SEMI_COLLIDABLE" | "GROUND" | "PARTICLE" | "DECAL" | "AREA_OF_EFFECT" | "REFLECTIVE";
        getHitboxColor(): string;
    };
    destroyable: true;
    armorPlated: false;
    stonePlated: true;
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
        noRotate: true;
    };
    baseHP: number;
    images: string[];
};
export default _default;
