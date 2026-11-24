import { useCallback, type ChangeEvent } from 'react';

import { toPageSize } from './pageSize';
import type { ResourcesListArgs } from './types';

export const useResourcesListHandlers = <A extends ResourcesListArgs>(
    args: A,
    onChange: (args: A) => void,
) => {
    const toggleAllowToLoadMore = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                allowToLoadMore: event.target.checked,
            });
        },
        [onChange, args],
    );

    const toggleOpenInNewTab = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                openInNewTab: event.target.checked,
            });
        },
        [onChange, args],
    );

    const handlePageSize = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const pageSize = toPageSize(parseInt(event.target.value, 10));
            onChange({
                ...args,
                pageSize,
                params: {
                    ...args.params,
                    maxSize: pageSize,
                },
            });
        },
        [args, onChange],
    );

    return { toggleAllowToLoadMore, toggleOpenInNewTab, handlePageSize };
};
