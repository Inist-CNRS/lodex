import React, { useMemo, useCallback } from 'react';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
// @ts-expect-error TS7016
import { propTypes as reduxFormPropTypes, Field } from 'redux-form';
import PropTypes from 'prop-types';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import SubressourceFieldAutoComplete from './SubressourceFieldAutoComplete';
import { connect } from 'react-redux';
import { fromParsing } from '../selectors';
import {
    Box,
    Button,
    ListItem,
    Typography,
    TextField as MUITextField,
} from '@mui/material';
import CancelButton from '../../lib/components/CancelButton';
// @ts-expect-error TS7016
import { useHistory } from 'react-router';
import { translate } from '../../i18n/I18NContext';

const TextField = ({
    // @ts-expect-error TS7031
    label,
    // @ts-expect-error TS7031
    input,
    // @ts-expect-error TS7031
    meta: { touched, invalid, error },
    ...custom
}) => (
    <MUITextField
        label={label}
        placeholder={label}
        error={touched && invalid}
        helperText={touched && error}
        {...input}
        {...custom}
    />
);

// @ts-expect-error TS7006
export const getKeys = (value) => {
    if (!value || value.length === 0) {
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
    return Object.keys(value);
};

const SubresourceFormComponent = ({
    // @ts-expect-error TS7031
    handleSubmit,
    // @ts-expect-error TS7031
    pristine,
    // @ts-expect-error TS7031
    submitting,
    // @ts-expect-error TS7031
    additionnalActions,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    datasetFields,
    // @ts-expect-error TS7031
    excerptLines,
    // @ts-expect-error TS7031
    pathSelected,
    // @ts-expect-error TS7031
    change,
    // @ts-expect-error TS7031
    subresources,
    // @ts-expect-error TS7031
    invalid,
}) => {
    const optionsIdentifier = useMemo(() => {
        const firstExcerptLine = excerptLines[0]?.[pathSelected] || [];
        return getKeys(firstExcerptLine);
    }, [excerptLines, pathSelected]);

    const history = useHistory();
    const handleCancel = () => {
        history.push('/display/document/subresource');
    };

    const validatePath = useCallback(
        (path) =>
            // @ts-expect-error TS7006
            path && subresources.map((sr) => sr.path).includes(path)
                ? polyglot.t('subresource_path_validation_error')
                : undefined,
        [subresources],
    );

    return (
        <Box sx={{ background: 'primary', padding: '20px' }}>
            <form onSubmit={handleSubmit}>
                <Box display="flex" gap={2}>
                    <Field
                        name="name"
                        variant="outlined"
                        autoFocus
                        component={TextField}
                        label={polyglot.t('subresource_name')}
                        fullWidth
                        aria-label="input-name"
                    />

                    <Field
                        className="path"
                        name="path"
                        type="text"
                        component={SubressourceFieldAutoComplete}
                        options={datasetFields}
                        // @ts-expect-error TS7006
                        renderInput={(params) => (
                            <MUITextField
                                {...params}
                                label={polyglot.t('subresource_path')}
                                variant="outlined"
                                aria-label="input-path"
                            />
                        )}
                        // @ts-expect-error TS7006
                        renderOption={(props, option) => {
                            return (
                                <ListItem {...props}>
                                    <Typography>{option}</Typography>
                                </ListItem>
                            );
                        }}
                        clearIdentifier={() => {
                            change('identifier', '');
                        }}
                        validate={validatePath}
                    />

                    <Field
                        className="identifier"
                        name="identifier"
                        type="text"
                        component={SubressourceFieldAutoComplete}
                        options={optionsIdentifier}
                        disabled={!pathSelected}
                        // @ts-expect-error TS7006
                        renderInput={(params) => (
                            <MUITextField
                                {...params}
                                label={polyglot.t('subresource_id')}
                                aria-label="input-identifier"
                                variant="outlined"
                            />
                        )}
                        // @ts-expect-error TS7006
                        renderOption={(props, option) => {
                            return (
                                <ListItem {...props}>
                                    <Typography>{option}</Typography>
                                </ListItem>
                            );
                        }}
                    />
                </Box>
                {/*
                 // @ts-expect-error TS2769 */}
                <Box
                    mt={2}
                    display="flex"
                    align="center"
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
                            {polyglot.t('cancel')}
                        </CancelButton>

                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={pristine || submitting || invalid}
                        >
                            {polyglot.t('save')}
                        </Button>
                    </Box>
                </Box>
            </form>
        </Box>
    );
};

SubresourceFormComponent.propTypes = {
    ...reduxFormPropTypes,
    p: polyglotPropTypes.isRequired,
};

TextField.propTypes = {
    label: PropTypes.string,
    input: PropTypes.shape({ name: PropTypes.string }),
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        invalid: PropTypes.bool,
        error: PropTypes.string,
    }),
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    datasetFields: fromParsing.getParsedExcerptColumns(state),
    // @ts-expect-error TS2339
    excerptLines: fromParsing.getExcerptLines(state),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(SubresourceFormComponent);
