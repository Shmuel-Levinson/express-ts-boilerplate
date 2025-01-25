export function isEmpty(obj: any): boolean {
    if(!obj) return true;

    return Object.keys(obj).length === 0;
}