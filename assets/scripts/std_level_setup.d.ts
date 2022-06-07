declare function std_setup(engine: Matter.Engine, world: Matter.World, p5: import("p5"), level: typeof import("../levels/level0/level").level, font?: {
    font: string | import("p5").Font;
    size?: number;
}): void;
export default std_setup;
