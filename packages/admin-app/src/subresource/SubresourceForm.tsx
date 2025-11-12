import { useMemo, useCallback, useEffect } from 'react';
import compose from 'recompose/compose';

import { connect } from 'react-redux';
import { fromParsing, fromSubresources } from '../selectors';
import { Box, Button } from '@mui/material';
import CancelButton from '@lodex/frontend-common/components/CancelButton';
import { useHistory } from 'react-router';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import type { State } from '../reducers';
import { TextField } from '@lodex/frontend-common/form-fields/TextField';
import { AutoCompleteField } from '@lodex/frontend-common/form-fields/AutoCompleteField.tsx';
import { FormProvider, useForm } from 'react-hook-form';
import type { SubResource } from './index';
import { usePrevious } from 'react-use';

export const getKeys = (value: unknown): string[] => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
        return [];
    }
    if (typeof value === 'string') {
        try {
            value = JSON.parse(value);
        } catch (error) {
            return [];
        }
    }
    if (Array.isArray(value)) {
        if (value[0] && typeof value[0] === 'object') {
            return Object.keys(value[0]);
        }
        return [];
    }
    return Object.keys(value as object);
};

export type SubresourceFormProps = {
    onSubmit: (values: SubResource) => void;
    additionnalActions?: React.ReactNode;
    datasetFields: string[];
    excerptLines: Record<string, unknown>[];
    subresources: SubResource[];
    initialValues?: SubResource;
};

export const SubresourceFormComponent = ({
    onSubmit,
    additionnalActions,
    datasetFields,
    excerptLines,
    initialValues,
    subresources,
}: SubresourceFormProps) => {
    const formMethods = useForm<SubResource>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: initialValues,
    });
    const { handleSubmit, setValue, formState, watch } = formMethods;
    const pathSelected = watch('path');
    const { translate } = useTranslate();
    const optionsIdentifier = useMemo(() => {
        const firstExcerptLine =
            excerptLines[0] && pathSelected in excerptLines[0]
                ? excerptLines[0]?.[pathSelected]
                : [];
        return getKeys(firstExcerptLine);
    }, [excerptLines, pathSelected]);

    const history = useHistory();
    const handleCancel = () => {
        history.push('/display/document/subresource');
    };
    const validatePath = useCallback(
        (path: string) =>
            path &&
            subresources
                .filter(({ _id }) => _id !== initialValues?._id)
                .map((sr) => sr.path)
                .includes(path)
                ? translate('subresource_path_validation_error')
                : undefined,
        [initialValues?._id, subresources, translate],
    );
    const prevPathSelected = usePrevious(pathSelected);

    useEffect(() => {
        if (prevPathSelected && pathSelected !== prevPathSelected) {
            setValue('identifier', null);
        }
    }, [pathSelected, setValue, prevPathSelected]);

    return (
        <FormProvider {...formMethods}>
            <Box sx={{ background: 'primary', padding: '20px' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box display="flex" gap="2rem">
                        <TextField
                            name="name"
                            variant="outlined"
                            autoFocus
                            label={translate('subresource_name')}
                            fullWidth
                            required
                        />

                        <AutoCompleteField
                            name="path"
                            label={translate('subresource_path')}
                            className="path"
                            options={datasetFields}
                            clearIdentifier={() => {
                                setValue('identifier', null);
                            }}
                            validate={validatePath}
                            variant="outlined"
                        />

                        <AutoCompleteField
                            className="identifier"
                            name="identifier"
                            options={optionsIdentifier}
                            disabled={!pathSelected}
                            label={translate('subresource_id')}
                            variant="outlined"
                        />
                    </Box>
                    <Box
                        mt={2}
                        display="flex"
                        alignItems="center"
                        sx={{
                            display: 'flex',
                            justifyContent: additionnalActions
                                ? 'space-between'
                                : 'flex-end',
                        }}
                    >
                        {additionnalActions && additionnalActions}
                        <Box>
                            <CancelButton
                                sx={{ height: '100%' }}
                                onClick={handleCancel}
                            >
                                {translate('cancel')}
                            </CancelButton>

                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={!formState.isValid}
                            >
                                {translate('save')}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </FormProvider>
    );
};

const mapStateToProps = (state: State) => ({
    datasetFields: fromParsing.getParsedExcerptColumns(state),
    excerptLines: fromParsing.getExcerptLines(state),
    subresources: fromSubresources.getSubresources(state),
});

export default compose<
    SubresourceFormProps,
    Omit<
        SubresourceFormProps,
        'subresources' | 'datasetFields' | 'excerptLines'
    >
>(connect(mapStateToProps))(SubresourceFormComponent);
