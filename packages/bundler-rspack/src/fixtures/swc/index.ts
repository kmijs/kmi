// @ts-ignore
import react from 'react';
console.log(react);
type GenericIdentityFn<T> = (arg: T) => T

function identity<T>(arg: T): T {
  return arg;
}

const myIdentity: GenericIdentityFn<number> = identity;

const output = myIdentity(1);

console.log(output);