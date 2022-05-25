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
        colour: string;
        gridColor: string;
    };
    initializer: () => void;
};
