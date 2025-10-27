import { MenuItem, Select } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import fetch from '@lodex/frontend-common/fetch/fetch';
import { getUserSessionStorageInfo } from '@lodex/frontend-common/getUserSessionStorageInfo';
import { useEffect, useMemo } from 'react';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { getRequest } from '@lodex/frontend-common/user/reducer';

type PreComputationSelectorProps = {
    disabled?: boolean;
    value: string | null;
    onChange: (value: string) => void;
};

export const PreComputationSelector = ({
    disabled,
    value,
    onChange,
}: PreComputationSelectorProps) => {
    const { translate } = useTranslate();
    const { data, error, isLoading } = useQuery(
        ['fetchPrecomputations'],
        async () => {
            const { token } = getUserSessionStorageInfo();
            const request = getRequest(
                { token },
                {
                    method: 'GET',
                    url: `/api/precomputed`,
                },
            );
            const { response } = await fetch(request);

            // Fetch precomputations from API
            return response.map(
                ({ name, _id }: { name: string; _id: string }) => ({
                    name,
                    id: _id,
                }),
            );
        },
    );

    const defaultValue = useMemo(() => {
        if (isLoading || error || !data || data.length === 0) {
            return null;
        }
        return data[0].id;
    }, [data, error, isLoading]);

    useEffect(() => {
        if (value !== null) return;
        if (defaultValue !== null) {
            onChange(defaultValue);
        }
    }, [defaultValue, onChange, value]);

    if (isLoading) {
        return <div>{translate('loading')}</div>;
    }

    return (
        <Select
            disabled={disabled || isLoading}
            defaultValue={defaultValue}
            error={!!error}
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value as string)}
        >
            {data?.map((precomp: { name: string; id: string }) => (
                <MenuItem key={precomp.id} value={precomp.id}>
                    {precomp.name}
                </MenuItem>
            )) || null}
        </Select>
    );
};
