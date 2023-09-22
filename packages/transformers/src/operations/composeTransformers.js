export default funcs =>
    funcs.reduce(
        (composedTransformer, transformer) => (...args) =>
            composedTransformer(...args).then(transformer),
        v => Promise.resolve(v),
    );
