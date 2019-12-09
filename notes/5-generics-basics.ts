import { HasEmail } from "./1-basics";

/**
 * (1) Generics allow us to parameterize types in the same way that
 * -   functions parameterize values
 */

// param determines the value of x
function wrappedValue(x: any) {
    return {
        value: x
    };
}

// type param<X> determines the type of x
interface WrappedValue<X> {
    value: X;
}

// passing a type string[] to <X>
// value will have any type we pass in to <X>
let val: WrappedValue<string[]> = { value: [] };
val.value;

/**
 * we can name these params whatever we want, but a common convention
 * is to use capital letters starting with `T` (a C++ convention from "templates")
 */

/**
 * (2) Type parameters can have default types
 * -   just like function parameters can have default values
 */

// for Array.prototype.filter
// What types are you filtering for?
interface FilterFunction<T = any> {
    (val: T): boolean;
}

const stringFilter: FilterFunction<string> = val => typeof val === "string";
// stringFilter(0); // 🚨 ERROR
stringFilter("abc"); // ✅ OK

// can be used with any value
const truthyFilter: FilterFunction = val => val;
truthyFilter(0); // false
truthyFilter(1); // true
truthyFilter(""); // false
truthyFilter(["abc"]); // true

/**
 * (3) You don't have to use exactly your type parameter as an arg
 * -   things that are based on your type parameter are fine too
 */

function resolveOrTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        // start the timeout, reject when it triggers
        const task = setTimeout(() => reject("time up!"), timeout);

        promise.then(val => {
            // cancel the timeout
            clearTimeout(task);

            // resolve with the value
            resolve(val);
        });
    });
}
resolveOrTimeout(fetch(""), 3000);

/**
 * (4) Type parameters can have constraints
 */
//

// in this case T types must have an id property that has a value of a string
// constraints can tell you more about what the function's implementation needs
// the function required values to have an id property

// pass in any array with objects that have at least {id: string} - may have other properties
function arrayToDict<T extends { id: string }>(array: T[]): { [k: string]: T } {
    const out: { [k: string]: T } = {};
    array.forEach(val => {
        out[val.id] = val;
    });
    return out;
}

// the function only knows about the parts of T that it needs ({id: string})
// using a generic allows us to return everything that was passed in and no less
// generics allow us to retain type fidelity

const myDict = arrayToDict([
    { id: "a", value: "first", lisa: "Huang" },
    { id: "b", value: "second" }
]);

/**
 * (5) Type parameters are associated with scopes, just like function arguments
 */

function startTuple<T>(a: T) {
    return function finishTuple<U>(b: U) {
        return [a, b] as [T, U];
    };
}
const myTuple = startTuple(["first"])(42);

/**
 * (6) When to use generics
 *
 * - Generics are necessary when we want to describe a relationship between
 * - two or more types (i.e., a function argument and return type).
 *
 * - aside from interfaces and type aliases, If a type parameter is used only once
 * - it can probably be eliminated
 */

interface Shape {
    draw();
    isDrawn: boolean;
}
interface Circle extends Shape {
    radius: number;
}

// bad example - unneeded abstraction
// function drawShapes1<S extends Shape>(shapes: S[]) {
//     shapes.forEach(s => s.draw());
// }

// bad example - unneeded abstraction
function drawShapes1<S extends Shape>(shapes: S[]): S[] {
    return shapes.map(s => s.draw());
}

const cir: Circle = { draw() {}, isDrawn: false, radius: 4 };
drawShapes1([cir]).map(c => c.draw()); // this is now an array of Shapes not an array of Circles - we lost what we passed in

// it's not necessary to give the shapes argument the type Circle because the function doesn't use
// all of Circle's properties (radius)

// ASK FOR WHAT YOU NEED AND RETURN EVERYTHING YOU CAN
// you want consumers of this function to still access the additional properties of other shapes
function drawShapes2(shapes: Shape[]) {
    // this is simpler. Above type param is not necessary
    shapes.forEach(s => s.draw());
}
