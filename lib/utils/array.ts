export function toArray(value: string | string[], defaultValue?: string): string[] {
  if (Array.isArray(value)) {
    return value
  }

  defaultValue = defaultValue || '';
  return value === null || value === undefined ? [defaultValue] : [value];
}
