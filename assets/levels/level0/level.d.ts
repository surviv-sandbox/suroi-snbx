export declare const level: {
    name: string;
    description: string;
    levelData: {
        obstacles: obstacle[];
        players: playerLike[];
    };
    world: {
        width: number;
        height: number;
        color: string;
        gridColor: string;
    };
    color: string;
    initializer: () => void;
};
