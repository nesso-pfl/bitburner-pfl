type Arg = NS["args"][number] | undefined;

export function arg(arg_: Arg, expected: "string", defaultValue?: string): string;
export function arg(arg_: Arg, expected: "number", defaultValue?: number): number;
export function arg(arg_: Arg, expected: "boolean", defaultValue?: boolean): boolean;
export function arg<T extends Arg, Expected extends "string" | "number" | "boolean">(
  arg_: T,
  expected: Expected,
  defaultValue?: T,
) {
  const returnValue = arg_ ?? defaultValue;
  if (typeof returnValue === expected) {
    return returnValue;
  } else {
    throw new Error(`Expected ${expected} but got ${typeof arg_}`);
  }
}
