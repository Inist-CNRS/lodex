import fetch from 'isomorphic-fetch';

// http://lov.okfn.org/dataset/lov/api/v2/term/search?vocab=schema
export const isSchemeValidFactory = fetchImpl => async (scheme) => {
    const { status } = await fetchImpl(
        `http://lov.okfn.org/dataset/lov/api/v2/term/search?vocab=${scheme}`,
    );

    return status !== 404;
};

export default isSchemeValidFactory(fetch);
