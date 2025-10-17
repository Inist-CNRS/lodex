export const composeAsync =
    (...funcs: any[]) =>
    async (arg?: any) =>
        funcs.reduce((prevRes, fn) => prevRes.then(fn), Promise.resolve(arg));

export default composeAsync;
