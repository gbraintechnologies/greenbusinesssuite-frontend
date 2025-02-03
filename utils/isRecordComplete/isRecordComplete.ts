type ExcludeKeys = string[];

export function isRecordComplete<T extends Record<string, any>>(
  obj: T,
  excludeKeys: ExcludeKeys = []
): boolean {
  return Object.keys(obj).every((key) => {
    // Skip excluded keys
    if (excludeKeys.includes(key)) {
      return true;
    }

    // Check if the value is not empty, null, or undefined
    const value = obj[key as keyof T];
    return value !== null && value !== undefined && value !== "";
  });
}
