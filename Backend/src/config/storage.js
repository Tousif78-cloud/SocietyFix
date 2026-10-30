// Upload storage adapter placeholder. Images currently remain data URLs in the in-memory complaint record.
// Later this can be replaced with local disk storage or a cloud provider without changing controllers.
export const storageConfig = { provider: 'memory', maxFileSizeBytes: 8 * 1024 * 1024 };
