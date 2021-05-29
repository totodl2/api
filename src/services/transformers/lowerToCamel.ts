// eslint-disable-next-line prettier/prettier
type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : Lowercase<S>

type ObjectToCamelCase<T> = {
  [K in keyof T as CamelCase<string &K>]: AnyToCamelCase<T[K]>
}

type AnyToCamelCase<Type> = Type extends (infer ArrayType)[]
  ? AnyToCamelCase<ArrayType>[]
  : Type extends {}
  ? ObjectToCamelCase<Type>
  : Type;

const transformKey = (key:string) =>
  key.replace(/_([^_])/g, (match, letter:string) => letter.toUpperCase());

const lowerToCamel = <T = any>(data: T): AnyToCamelCase<T> => {
  if (data === null || data === undefined) {
    return data as AnyToCamelCase<T>;
  }

  if (Array.isArray(data)) {
    return data.map(value => lowerToCamel(value)) as AnyToCamelCase<T>;
  }

  if (typeof data === 'object') {
    return Object
      .entries(data)
      .reduce((prev, [key, value]) => ({
        ...prev,
        [transformKey(key)]: lowerToCamel(value),
      }), {}) as AnyToCamelCase<T>;
  }

  return data as AnyToCamelCase<T>;
};

export default lowerToCamel;
