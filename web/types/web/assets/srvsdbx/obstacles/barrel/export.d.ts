declare const _default: {
    name: string;
    targetVersion: string;
    hitbox: {
        type: "circle";
        radius: number;
    };
    scale(hp: number): number;
    emitters: {
        spawnDelay: number;
        spawnCount: number;
        area: {
            x: number;
            y: number;
        };
        particleProperties: {
            scale: () => number;
            velocity: () => srvsdbx_Geometry.Point2D;
        };
        shouldSpawn: (state: ParticleEmitterState & {
            readonly obstacle: Obstacle<ObstacleTypes, any>;
        }) => boolean;
        particleTypes: string[];
        initialState: {
            obstacle: any;
        };
    }[];
    collidable: {
        getHitboxName(): "DEFAULT" | "COLLIDABLE" | "SEMI_COLLIDABLE" | "GROUND" | "PARTICLE" | "DECAL" | "AREA_OF_EFFECT" | "REFLECTIVE";
        getHitboxColor(): string;
    };
    destroyable: true;
    armorPlated: false;
    stonePlated: false;
    reflective: true;
    hitParticle: {
        particle: string;
        count: number;
    };
    destroyParticle: {
        particle: string;
        count: () => number;
    };
    destructionExplosion: string;
    baseHP: number;
    images: string[];
};
export default _default;
