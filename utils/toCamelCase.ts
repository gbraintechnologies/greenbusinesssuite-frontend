export function toCamelCase(input: string): string {
  // Check if the string is already in camelCase
  const isCamelCase = /^[a-z]+([A-Z][a-z]*)*$/.test(input);
  if (isCamelCase) {
    return input; // Return the string as it is if it's already in camelCase
  }

  return input
    ?.toLowerCase() // Convert the string to lowercase
    ?.split(" ") // Split the string by spaces
    ?.map(
      (word, index) =>
        index === 0
          ? word // Keep the first word lowercase
          : word.charAt(0).toUpperCase() + word.slice(1) // Capitalize the first letter of subsequent words
    )
    ?.join(""); // Join all the words together
}

export function fromCamelCase(input: string): string {
  // Check if the string is in camelCase
  const isCamelCase = /^[a-z]+([A-Z][a-z]*)*$/.test(input);

  if (!isCamelCase) {
    return input; // Return the string as is if it's already in normal case
  }

  return input
    ?.replace(/([a-z])([A-Z])/g, "$1 $2") // Add a space before uppercase letters
    ?.replace(/^./, (match) => match.toUpperCase()); // Capitalize the first letter
}

export function capAndSpace(input: string): string {
  return input
    ?.replace(/([a-z])([A-Z])/g, "$1 $2") // Add a space before uppercase letters
    ?.replace(/^./, (match) => match.toUpperCase()); // Capitalize the first letter
}
