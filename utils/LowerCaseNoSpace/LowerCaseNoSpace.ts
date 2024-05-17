export function lowerCaseNoSpace(str: string): string {
  return str?.toLowerCase().replace(/ /g, "");
}
