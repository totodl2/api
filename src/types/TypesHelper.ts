export type Defined<T extends {}, DefinedKeys extends keyof T = keyof T> = Omit<
  T,
  DefinedKeys
> &
  { [K in DefinedKeys]-?: Exclude<T[K], null | undefined> };
