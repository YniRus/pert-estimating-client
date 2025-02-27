export type Prettify<T> = T extends object
    ? { [Key in keyof T]: Prettify<T[Key]> }
    : T

export type Promised<T> = T | Promise<T>
export type PartialPick<T, K extends keyof T> = Prettify<Omit<T, K> & Partial<Pick<T, K>>>

// --- Взято из socket.io-client/build/esm/socket.d.ts
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
export declare type Last<T extends unknown[]> = T extends [...infer H, infer L] ? L : unknown
export declare type AllButLast<T extends unknown[]> = T extends [...infer H, infer L] ? H : unknown[]
export declare type FirstArg<T> = T extends (arg: infer Param) => infer Result ? Param : unknown
/* eslint-enable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
