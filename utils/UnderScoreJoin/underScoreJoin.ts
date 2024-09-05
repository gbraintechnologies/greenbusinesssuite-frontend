export default function toJoin(str: string | undefined): string {
    if (typeof str === 'string') {
        // Remove underscores, convert to lowercase, and capitalize the first letter
        const formatted = str.replace(/_/g, "").toLowerCase();
        
        // Capitalize only the first letter
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
    return ""; // Return an empty string if input is undefined
}
