export function sliceString(string, length) {
    if (string.length < length) {
        return string;
    }
    return `${string.slice(0,length-1).trimEnd()}..`;
}