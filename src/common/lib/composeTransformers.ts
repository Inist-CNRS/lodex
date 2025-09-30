export default (funcs: any) => funcs.reduce(
    (composedTransformer: any, transformer: any) =>
        (...args: any[]) =>
            composedTransformer(...args).then(transformer),
    (v: any) => Promise.resolve(v),
);
