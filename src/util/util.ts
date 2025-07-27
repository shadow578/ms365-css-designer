export function mapRecord<T extends Record<string, T[keyof T]>, U>(
  record: T,
  transform: (value: T[keyof T], key: keyof T) => U,
): { [K in keyof T]: U } {
  const result = {} as { [K in keyof T]: U };
  for (const key in record) {
    if (record.hasOwnProperty(key)) {
      result[key] = transform(record[key], key);
    }
  }
  return result;
}

export function filterRecord<T extends Record<string, T[keyof T]>>(
  record: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): { [K in keyof T]: T[keyof T] } {
  const result = {} as { [K in keyof T]: T[keyof T] };
  for (const key in record) {
    if (record.hasOwnProperty(key) && predicate(record[key], key)) {
      result[key] = record[key];
    }
  }
  return result;
}
