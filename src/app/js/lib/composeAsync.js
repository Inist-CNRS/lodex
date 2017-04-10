export default (...funcs) => async (...args) =>
    funcs.reduce((prevRes, fn) => prevRes.then(fn), Promise.resolve(args));
