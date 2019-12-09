export type Dict<T> = {
    [key: string]: T | undefined; // a given key may not have a value
};

// Array.prototype.map, but for Dict
export function mapDict() {}

// Array.prototype.reduce, but for Dict
export function reduceDict() {}
