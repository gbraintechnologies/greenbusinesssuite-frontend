export default function toSpace(str: string | undefined): string {
  if (typeof str === 'string') {
      return str.replace(/_/g, " ");
  }
  return ""; // Return an empty string or handle the error as needed
}
  