import assert from "assert";

export const div = (dividend: number, divisor: number) => {
  assert.ok(divisor != 0);
  return dividend / divisor;
};

export const sub = (minuend: number, subtractor: number) => {
  return minuend - subtractor;
};

export const add = (a: number, b: number) => {
  return a + b;
};

export const mul = (multiplicand: number, multiplier: number) => {
  return multiplicand * multiplier;
};
