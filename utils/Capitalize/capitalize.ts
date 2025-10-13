export default function toCamelCase(str: string): string {
  return str[0]?.toUpperCase() + str?.slice(1);
}

export function capitalize(s: string) {
  return s ? s?.charAt(0).toUpperCase() + s?.slice(1).toLowerCase() : "";
}
