type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

export function deepMerge<T extends PlainObject, U extends PlainObject>(
  base: T,
  override: U,
): T & U {
  const result: PlainObject = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const existing = result[key];
    if (isPlainObject(existing) && isPlainObject(value)) {
      result[key] = deepMerge(existing, value);
      continue;
    }
    result[key] = value;
  }

  return result as T & U;
}
