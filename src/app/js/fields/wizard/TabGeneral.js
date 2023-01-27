import React from 'react';
import { Field, FieldArray, formValueSelector } from 'redux-form';
import translate from 'redux-polyglot/dist/translate';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TextField as MUITextField, Box } from '@mui/material';

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

export const renderTransformer = (
    transformersLocked,
    isSubresourceField,
    polyglot,
) => {
    function RenderTransformer(props) {
        if (transformersLocked) {
            return (
                <Box pt={2}>
                    {polyglot.t(
                        'transformer_no_editable_with_subresource_uid_value',
                    )}
                </Box>
            );
        }

        return (
            <TransformerList
                hideFirstTransformers={isSubresourceField ? 3 : 0}
                {...props}
            />
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
    field,
    subresourceUri,
    arbitraryMode,
    transformersLocked,
    p: polyglot,
}) => {
    return (
        <>
            <FieldLabelInput />
            <Field name="scope" component={TextField} type="hidden" />
            <FieldInternal field={field} />
            <SourceValueToggleConnected
                selectedSubresourceUri={subresourceUri}
                arbitraryMode={arbitraryMode}
            />
            <FieldArray
                name="transformers"
                component={renderTransformer(
                    transformersLocked,
                    !!subresourceUri,
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
    field: fieldPropTypes.isRequired,
    subresourceUri: PropTypes.string,
    arbitraryMode: PropTypes.bool.isRequired,
    transformersLocked: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => {
    const transformers = formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    );

    return {
        transformersLocked: isSubresourceTransformation(transformers || []),
    };
};

export default compose(
    connect(mapStateToProps),
    translate,
)(TabGeneralComponent);
