export function toArray<T>(value?: T | T[], defaultValue?: T): T[] {
  if (Array.isArray(value)) {
    return value;
  }

  defaultValue = defaultValue || ('' as any);
  return value === null || value === undefined
    ? [defaultValue as T]
    : [value as T];
}
