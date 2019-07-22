export type scalar = string | number | boolean

export type RecStr<T> = Record<string, T>
// export type RecNum<T> = Record<number, T>
// export type RecAny<T> = Record<any, T>

export type Writable<T> = { -readonly [P in keyof T]: T[P] }
