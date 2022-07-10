declare class AI {
    #private;
    get state(): string;
    get subState(): string;
    get player(): playerLike;
    get target(): void | playerLike;
    get memory(): {
        cancelReloadOnSpot: boolean;
        lastPosition: {
            x: number;
            y: number;
        };
        lastTargetPos: {
            x: number;
            y: number;
        };
        strafe: {
            dir: [boolean, boolean, boolean, boolean];
            timestamp: number;
        };
        wanderTarget: {
            x: number;
            y: number;
        };
        weaponLoadState: [boolean, boolean];
    };
    constructor(player: playerLike);
    debug(): void;
    update(): void;
}
export default AI;
