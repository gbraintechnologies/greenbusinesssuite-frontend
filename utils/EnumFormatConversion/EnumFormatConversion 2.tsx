export function toEnumFormat(input: string): string {
  return input
    .toUpperCase()
    .replace(/-/g, "_") // Replace hyphens with underscores
    .replace(/ /g, "_"); // Replace spaces with underscores
}

export function fromEnumFormat(input: string): string {
  return input
    .toLowerCase()
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
}
