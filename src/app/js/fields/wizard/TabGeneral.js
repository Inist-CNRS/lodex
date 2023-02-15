import React from 'react';
import { Field, FieldArray, formValueSelector } from 'redux-form';
import translate from 'redux-polyglot/dist/translate';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TextField as MUITextField, Box, Typography } from '@mui/material';

import FieldLabelInput from '../FieldLabelInput';
import FieldInternal from '../FieldInternal';
import SourceValueToggleConnected from '../sourceValue/SourceValueToggle';
import TransformerList from '../transformers/TransformerList';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { FIELD_FORM_NAME } from '..';

export const isSubresourceTransformation = transformers => {
    const operations = transformers.map(t => t.operation).join('|');
    return (
        operations === 'COLUMN|PARSE|GET|STRING|REPLACE_REGEX|MD5|REPLACE_REGEX'
    );
};

const isSubResourceTransformationWithColumn = transformers => {
    const operations = transformers.map(t => t.operation).join('|');
    return operations.startsWith(
        'COLUMN|PARSE|GET|STRING|REPLACE_REGEX|REPLACE_REGEX|TRIM',
    );
};

export const isArbitraryValue = transformers => {
    return transformers[0]?.operation === 'VALUE';
};

const getHiddenTransformers = (
    isSubresourceField,
    isArbitraryValue,
    isSubResourceTransformationWithColumn,
) => {
    if (isSubResourceTransformationWithColumn) {
        return 7;
    }
    if (isSubresourceField && !isArbitraryValue) {
        return 3;
    }
    return 0;
};

export const renderTransformer = (
    transformersLocked,
    hideFirstTransformers,
    polyglot,
) => {
    function RenderTransformer(props) {
        return (
            <Box pt={5}>
                <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                    {polyglot.t('transformers')}
                </Typography>
                {transformersLocked ? (
                    polyglot.t(
                        'transformer_no_editable_with_subresource_uid_value',
                    )
                ) : (
                    <TransformerList
                        hideFirstTransformers={hideFirstTransformers}
                        {...props}
                    />
                )}
            </Box>
        );
    }

    return RenderTransformer;
};

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
        variant="standard"
        {...input}
        {...custom}
    />
);

export const TabGeneralComponent = ({
    currentEditedField,
    subresourceUri,
    arbitraryMode,
    transformersLocked,
    isArbitraryValue,
    isSubResourceTransformationWithColumn,
    p: polyglot,
}) => {
    const hideFirstTransformers = getHiddenTransformers(
        !!subresourceUri,
        isArbitraryValue,
        isSubResourceTransformationWithColumn,
    );
    return (
        <>
            <FieldLabelInput />
            <Field name="scope" component={TextField} type="hidden" />
            <FieldInternal field={currentEditedField} />
            <SourceValueToggleConnected
                selectedSubresourceUri={subresourceUri}
                arbitraryMode={arbitraryMode}
            />
            <FieldArray
                name="transformers"
                component={renderTransformer(
                    transformersLocked,
                    hideFirstTransformers,
                    polyglot,
                )}
                type="transform"
                rerenderOnEveryChange
            />
        </>
    );
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

TabGeneralComponent.propTypes = {
    currentEditedField: fieldPropTypes.isRequired,
    subresourceUri: PropTypes.string,
    arbitraryMode: PropTypes.bool.isRequired,
    transformersLocked: PropTypes.bool,
    isArbitraryValue: PropTypes.bool,
    isSubResourceTransformationWithColumn: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => {
    const transformers = formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    );

    return {
        transformersLocked: isSubresourceTransformation(transformers || []),
        isArbitraryValue: isArbitraryValue(transformers || []),
        isSubResourceTransformationWithColumn: isSubResourceTransformationWithColumn(
            transformers || [],
        ),
    };
};

export default compose(
    connect(mapStateToProps),
    translate,
)(TabGeneralComponent);
