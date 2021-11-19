//https://www.geeksforgeeks.org/how-to-generate-random-number-in-given-range-using-javascript/
// returnts pseudo random float between min-max
export function randRange(min:number, max:number):number { 
    return Math.random() * (max - min) + min;
} 