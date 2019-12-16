export type Dict<T> = {
    [key: string]: T | undefined; // a given key may not have a value
};

// Array.prototype.map, but for Dict
export function mapDict<T, S>(
    dict: Dict<T>,
    cb: (arg: T, idx: number) => S
): Dict<S> {
    const result: Dict<S> = {};

    Object.keys(dict).forEach((k, idx) => {
        const item = dict[k];
        if (typeof item !== "undefined") {
            // do not transform entry to dict if value is undefined
            // '', 0 are ok
            result[k] = cb(item, idx);
        }
    });

    return result;
}

// output is inferred by the arguments being passed in
// S is not explicitly specified
// very flexible code
mapDict(
    {
        a: "a",
        b: "b",
        c: "c"
    },
    str => [str]
); // output is now a dict of strings

mapDict(
    {
        a: "a",
        b: "b",
        c: "c"
    },
    str => ({
        val: str
    })
); // output is now a dict of wrapped values

// Array.prototype.reduce, but for Dict
export function reduceDict<T, S>(
    dict: Dict<T>,
    reducer: (val: S, item: T, idx: number) => S,
    initialVal: S
) {
    let val: S = initialVal;

    Object.keys(dict).forEach((key, idx) => {
        const item = dict[key];
        if (typeof item !== "undefined") {
            val = reducer(val, item, idx);
        }
    });

    return val;
}
