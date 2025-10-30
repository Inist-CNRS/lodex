import { useState, useEffect, type ReactNode } from 'react';
import { CircularProgress } from '@mui/material';

import AdminOnlyAlert from '../../../lib/components/AdminOnlyAlert';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

const circularProgress = (
    <CircularProgress
        variant="indeterminate"
        size={20}
        // @ts-expect-error TS2322
        innerStyle={{
            display: 'flex',
            marginLeft: 8,
        }}
    />
);

interface SkipFoldProps {
    children(...args: unknown[]): ReactNode;
    getData(...args: unknown[]): unknown;
}

const SkipFold = ({ children, getData }: SkipFoldProps) => {
    const { translate } = useTranslate();
    const [data, setData] = useState(null);
    const [error, setError] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // @ts-expect-error TS2571
        getData({ children, getData })
            // @ts-expect-error TS7006
            .then((fetchedData) => {
                setData(fetchedData);
                setIsLoading(false);
            })
            // @ts-expect-error TS7006
            .catch((fetchError) => {
                console.error(fetchError);
                setError(true);
                setIsLoading(false);
            });
    }, [children, getData]);

    if (error) {
        return <AdminOnlyAlert>{translate('istex_error')}</AdminOnlyAlert>;
    }

    if (isLoading) {
        return circularProgress;
    }

    // @ts-expect-error TS18047
    if (!data.hits.length) {
        return null;
    }

    return children({ children, getData, data });
};

export default SkipFold;
