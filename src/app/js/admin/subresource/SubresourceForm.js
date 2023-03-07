import React, { useMemo } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
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
import { useHistory } from 'react-router';

const TextField = ({
    label,
    input,
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

export const getKeys = value => {
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
    handleSubmit,
    pristine,
    submitting,
    additionnalActions,
    p: polyglot,
    datasetFields,
    excerptLines,
    pathSelected,
    change,
}) => {
    const optionsIdentifier = useMemo(() => {
        const firstExcerptLine = excerptLines[0]?.[pathSelected] || [];
        return getKeys(firstExcerptLine);
    }, [excerptLines, pathSelected]);

    const history = useHistory();
    const handleCancel = () => {
        history.push('/display/document/subresource');
    };

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
                        renderInput={params => (
                            <MUITextField
                                {...params}
                                label={polyglot.t('subresource_path')}
                                variant="outlined"
                                aria-label="input-path"
                            />
                        )}
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
                    />

                    <Field
                        className="identifier"
                        name="identifier"
                        type="text"
                        component={SubressourceFieldAutoComplete}
                        options={optionsIdentifier}
                        disabled={!pathSelected}
                        renderInput={params => (
                            <MUITextField
                                {...params}
                                label={polyglot.t('subresource_id')}
                                aria-label="input-identifier"
                                variant="outlined"
                            />
                        )}
                        renderOption={(props, option) => {
                            return (
                                <ListItem {...props}>
                                    <Typography>{option}</Typography>
                                </ListItem>
                            );
                        }}
                    />
                </Box>
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
                            disabled={pristine || submitting}
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

const mapStateToProps = state => ({
    datasetFields: fromParsing.getParsedExcerptColumns(state),
    excerptLines: fromParsing.getExcerptLines(state),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(SubresourceFormComponent);
