import { MenuItem, Select } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import {
    FINISHED,
    labelByStatus,
    type TaskStatusType,
} from '@lodex/common/src/taskStatusType';

type PreComputationSelectorProps = {
    disabled?: boolean;
    value: string | null;
    onChange: (value: string) => void;
    data: {
        id: string;
        name: string;
        status: TaskStatusType | undefined | '';
    }[];
    error?: boolean;
    isLoading?: boolean;
};

export const PreComputationSelector = ({
    disabled,
    value,
    onChange,
    data,
    error,
    isLoading,
}: PreComputationSelectorProps) => {
    const { translate } = useTranslate();
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
            aria-label={translate('select_precomputed_data')}
        >
            {data?.map(
                ({
                    name,
                    id,
                    status,
                }: {
                    name: string;
                    id: string;
                    status: TaskStatusType | undefined | '';
                }) => (
                    <MenuItem
                        key={id}
                        value={id}
                        disabled={status !== FINISHED}
                    >
                        {name} ({translate(labelByStatus[status ?? ''])})
                    </MenuItem>
                ),
            ) || null}
        </Select>
    );
};
