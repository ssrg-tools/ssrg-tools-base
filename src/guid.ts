import kuuid from 'kuuid';

/**
 * implements PHP microtime()
 */
export function microtime(asFloat: true): number;
export function microtime(asFloat: false): string;
export function microtime(asFloat = true) {
  const float = Date.now() / 1000;
  if (asFloat) {
    return float;
  }

  return `${float % 1} ${Math.floor(float)}`;
}

export function generate_guid() {
  // pick the nice parts
  return kuuid.id().slice(2, 24);
}
