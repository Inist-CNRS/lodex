import type { TaskStatusType } from '@lodex/common';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { fromPrecomputed } from '../selectors';

// The precomputed list is already loaded in the store by withInitialData:
// read it there instead of requesting /api/precomputed a second time.
export const useFetchPrecomputations = () => {
    const precomputed = useSelector(fromPrecomputed.precomputed);
    const isPrecomputationsLoading = useSelector(fromPrecomputed.isLoading);
    const precomputationsError = useSelector(fromPrecomputed.getError);

    const precomputations = useMemo(
        () =>
            precomputed.map(({ name, _id, status }) => ({
                name,
                id: _id,
                status: status as TaskStatusType | '',
            })),
        [precomputed],
    );

    return {
        precomputations,
        // a reload keeps the current list usable, as react-query did
        isPrecomputationsLoading:
            isPrecomputationsLoading && precomputations.length === 0,
        precomputationsError,
    };
};
