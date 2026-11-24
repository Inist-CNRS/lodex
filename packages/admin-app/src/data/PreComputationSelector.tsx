import { MenuItem, Select } from '@mui/material';
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
    if (isLoading) {
        return <div>{translate('loading')}</div>;
    }

    return (
        <Select
            disabled={disabled || isLoading}
            error={!!error}
            fullWidth
            value={value ?? ''}
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
                        // not the Select's onChange: it is not called when the
                        // item already shown is picked again
                        onClick={() => onChange(id)}
                        disabled={status !== FINISHED}
                    >
                        {name} ({translate(labelByStatus[status ?? ''])})
                    </MenuItem>
                ),
            ) || null}
        </Select>
    );
};
