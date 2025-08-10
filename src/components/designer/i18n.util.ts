export function normalizeKey(key: string): string {
  return key.replaceAll(".", "#");
}
