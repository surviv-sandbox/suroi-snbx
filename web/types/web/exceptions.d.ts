declare namespace srvsdbx_Errors {
    const SandboxError: {
        new (message?: string, options?: ErrorOptions): {
            name: string;
            message: string;
            stack?: string | undefined;
            cause?: unknown;
        };
    };
    type SandboxError = InstanceType<typeof SandboxError>;
    const IllegalOperation: {
        new (message?: string, options?: ErrorOptions): {
            name: string;
            message: string;
            stack?: string | undefined;
            cause?: unknown;
        };
    };
    type IllegalOperation = InstanceType<typeof IllegalOperation>;
    const PrototypalReferenceError: {
        new (message?: string, options?: ErrorOptions): {
            name: string;
            message: string;
            stack?: string | undefined;
            cause?: unknown;
        };
    };
    type PrototypalReferenceError = InstanceType<typeof PrototypalReferenceError>;
    const UndeclaredImageUsage: {
        new (message?: string, options?: ErrorOptions): {
            name: string;
            message: string;
            stack?: string | undefined;
            cause?: unknown;
        };
    };
    type UndeclaredImageUsage = InstanceType<typeof UndeclaredImageUsage>;
    const InexistantElementError: {
        new (message?: string, options?: ErrorOptions): {
            name: string;
            message: string;
            stack?: string | undefined;
            cause?: unknown;
        };
    };
    type InexistantElement = InstanceType<typeof InexistantElementError>;
}
