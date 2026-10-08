declare module '@ezs/core/fusible' {
    /**
     * Creates a new fusible identifier
     */
    export function createFusible(): Promise<string>;

    /**
     * Checks if a fusible exists
     */
    export function checkFusible(
        fusible: string | undefined | null,
    ): Promise<boolean>;

    /**
     * Enables a fusible (creates its marker file)
     */
    export function enableFusible(fusible: string): Promise<boolean>;

    /**
     * Disables a fusible (removes its marker file)
     */
    export function disableFusible(fusible: string): Promise<boolean>;

    /**
     * Watches a fusible and calls a callback when it's deleted
     */
    export function watchFusible(
        fusible: string | undefined | null,
        func?: () => void,
    ): Promise<() => void>;
}
