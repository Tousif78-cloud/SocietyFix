// MongoDB is intentionally disabled for the first backend iteration.
// Later: install mongoose, read MONGODB_URI from env, and connect here.
export async function connectDatabase() {
  console.info('MongoDB is not connected yet; SocietyFix is using in-memory storage.');
  return { connected: false, adapter: 'memory' };
}
