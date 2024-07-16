export function isConvertibleToNumber(s: string): boolean {
    return !isNaN(parseFloat(s)) && isFinite(parseFloat(s));
}

