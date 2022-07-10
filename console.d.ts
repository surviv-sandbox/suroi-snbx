interface cslData {
    timestamp: timestamp;
    type: "log" | "important" | "warn" | "warn_severe" | "error" | "fatal_error";
    content: string | {
        main: string;
        detail: string;
    };
}
declare class csl {
    #private;
    get content(): {
        timestamp: number;
        type: "error" | "log" | "important" | "warn" | "warn_severe" | "fatal_error";
        content: string | {
            main: string;
            detail: string;
        };
    }[];
    get opened(): boolean;
    get position(): {
        x: number;
        y: number;
    };
    constructor();
    open(): void;
    close(): void;
    log(message: cslData["content"] | string, important?: boolean): void;
    warn(message: cslData["content"] | string, severe?: boolean): void;
    error(message: cslData["content"] | string, fatal?: boolean): void;
    clear(): void;
    generateWarningWidget(): HTMLDivElement;
}
