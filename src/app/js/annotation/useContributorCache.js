import { useCallback, useMemo } from 'react';

const CONTRIBUTOR_LOCALSTORAGE_KEY = 'contributor';

export function useContributorCache() {
    const contributor = useMemo(() => {
        const contributorCache = localStorage?.getItem(
            CONTRIBUTOR_LOCALSTORAGE_KEY,
        );

        if (contributorCache) {
            return JSON.parse(contributorCache);
        }

        return null;
    }, []);

    const updateContributorCache = useCallback(
        ({ authorName, authorEmail, authorRememberMe }) => {
            console.log(
                'updateContributorCache',
                authorName,
                authorEmail,
                authorRememberMe,
            );
            if (!authorRememberMe) {
                localStorage.removeItem(CONTRIBUTOR_LOCALSTORAGE_KEY);
                return;
            }

            localStorage.setItem(
                CONTRIBUTOR_LOCALSTORAGE_KEY,
                JSON.stringify({ authorName, authorEmail, authorRememberMe }),
            );
        },
        [],
    );

    return useMemo(
        () => ({
            contributor,
            updateContributorCache,
        }),
        [contributor, updateContributorCache],
    );
}
