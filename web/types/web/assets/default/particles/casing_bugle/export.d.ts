declare const _default: {
    name: string;
    targetVersion: string;
    images: string[];
    lifetime: () => number;
    drag: () => number;
    rotVel: number;
    baseSize: {
        width: number;
        height: "auto";
    };
    scale: {
        start: number;
        end: number;
    };
    alpha: {
        start: number;
        end: number;
        interp: srvsdbx_Animation.EasingFunction & {
            default(t: number): number;
            bindToBounds(a: number, b: number): (t: number) => number;
        };
    };
    tint: string;
};
export default _default;
