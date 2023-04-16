/**
 * A namespace containing various error types
 */
namespace srvsdbx_Errors {
    function generate(name: string, inheritFrom: new (message?: string, options?: ErrorOptions) => Error) {
        return class extends inheritFrom {
            constructor(message?: string, options?: ErrorOptions) {
                super(message, options);
                this.name = name;
            }
        };
    }

    /**
     * Represents a general sandbox-related error
     */
    export const SandboxError = generate("SandboxError", Error);
    export type SandboxError = InstanceType<typeof SandboxError>;

    /**
     * Represents an operation which is forbidden for whatever reason
     */
    export const IllegalOperation = generate("IllegalOperation", Error);
    export type IllegalOperation = InstanceType<typeof IllegalOperation>;

    /**
     * Represents an attempt to fetch an object prototype that doesn't exist
     */
    export const PrototypalReferenceError = generate("PrototypalReferenceError", SandboxError);
    export type PrototypalReferenceError = InstanceType<typeof PrototypalReferenceError>;

    /**
     * Represents an attempt to use an undeclared image
     */
    export const UndeclaredImageUsage = generate("UndeclaredImageUsage", SandboxError);
    export type UndeclaredImageUsage = InstanceType<typeof UndeclaredImageUsage>;

    /**
     * Represents an attempt to use a non-existant value
     */
    export const InexistantElementError = generate("InexistantElement", TypeError);
    export type InexistantElement = InstanceType<typeof InexistantElementError>;
}