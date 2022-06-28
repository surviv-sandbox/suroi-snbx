declare const perf: {
    _timers: {
        a: number | void;
        b: number | void;
    };
    _data: {
        ticks: number;
        tps: number[];
        frames: number;
        fps: number[];
    };
    config: {
        history: number;
        critical_tickrate: number;
        critical_framerate: number;
    };
    mode: {
        tps: number;
        fps: number;
    };
    showMeters(tpsMode: 0 | 1 | 2 | void, fpsMode: 0 | 1 | 2 | void, config: {
        history: number;
        critical_tickrate: number;
        critical_framerate: number;
    } | void): void;
};
