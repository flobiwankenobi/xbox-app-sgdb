function now() {
  return new Date().toISOString();
}

export const log = {
  info: (...args: unknown[]) => console.info(now(), '[INFO]', ...args),
  warn: (...args: unknown[]) => console.warn(now(), '[WARN]', ...args),
  error: (err: unknown, ...args: unknown[]) =>
    console.error(now(), '[ERROR]', ...args, err instanceof Error ? err.message : String(err)),
  debug: (...args: unknown[]) => console.debug(now(), '[DEBUG]', ...args),
};
