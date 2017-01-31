import fetch from 'isomorphic-fetch';

// http://lov.okfn.org/dataset/lov/api/v2/vocabulary/info?vocab=schema
export const isSchemeValidFactory = fetchImpl => async (scheme) => {
    const { status } = await fetchImpl(
        `http://lov.okfn.org/dataset/lov/api/v2/vocabulary/info?vocab=${scheme}`,
    );

    return status !== 404;
};

export const isSchemeValid = isSchemeValidFactory(fetch);
