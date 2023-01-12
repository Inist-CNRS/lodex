import React from 'react';
import PropTypes from 'prop-types';
import { Switch, FormControlLabel } from '@material-ui/core';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { FIELD_FORM_NAME } from '..';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import SelectSubresourceField from './SelectSubresourceField';

const styles = {
    inset: {
        paddingLeft: 40,
    },
};

export const TabValueSubresourceColumnComponent = ({
    column,
    handleChange,
    handleSelect,
    p: polyglot,
    selected,
    subresourceUri,
}) => (
    <div id="tab-value-subresource-column">
        <FormControlLabel
            control={
                <Switch
                    value="column"
                    onChange={handleSelect}
                    checked={selected}
                />
            }
            label={polyglot.t('a_column')}
        />
        {selected && (
            <div style={styles.inset}>
                <SelectSubresourceField
                    subresourceUri={subresourceUri}
                    handleChange={handleChange}
                    label="select_a_column"
                    column={column}
                />
            </div>
        )}
    </div>
);

TabValueSubresourceColumnComponent.propTypes = {
    column: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selected: PropTypes.bool.isRequired,
    subresourceUri: PropTypes.string,
};

TabValueSubresourceColumnComponent.defaultProps = {
    column: '',
};

export const isSubresourceValueColumnTransformation = transformers => {
    const operations = transformers.map(t => t.operation).join('|');
    return operations === 'COLUMN|PARSE|GET';
};

export const mapStateToProps = (state, { subresourceUri }) => {
    const { subresources } = state.subresource;

    const subresource = subresources.find(s => s._id === subresourceUri);
    if (!subresource) {
        return { selected: false, column: null, subresourcePath: null };
    }

    const transformers = formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    );

    const getOperationIndex = (transformers || []).findIndex(
        t => t.operation === 'GET',
    );

    if (getOperationIndex !== -1) {
        const valueTransformer = transformers[getOperationIndex];

        return {
            selected: isSubresourceValueColumnTransformation(transformers),
            subresourcePath: subresource.path,
            column:
                (valueTransformer.args &&
                    valueTransformer.args[0] &&
                    valueTransformer.args[0].value) ||
                null,
        };
    }

    return { selected: false, column: null, subresourcePath: subresource.path };
};

export default compose(
    connect(mapStateToProps),
    withState('column', 'setColumn', ({ column }) => column),
    withHandlers({
        handleSelect: ({ onChange, column, subresourcePath }) => () => {
            onChange([
                {
                    operation: 'COLUMN',
                    args: [
                        {
                            name: 'column',
                            type: 'column',
                            value: subresourcePath,
                        },
                    ],
                },
                {
                    operation: 'PARSE',
                },
                {
                    operation: 'GET',
                    args: [
                        {
                            name: 'path',
                            type: 'string',
                            value: column,
                        },
                    ],
                },
            ]);
        },
        handleChange: ({ onChange, setColumn, subresourcePath }) => value => {
            setColumn(value);
            onChange([
                {
                    operation: 'COLUMN',
                    args: [
                        {
                            name: 'column',
                            type: 'column',
                            value: subresourcePath,
                        },
                    ],
                },
                {
                    operation: 'PARSE',
                },
                {
                    operation: 'GET',
                    args: [
                        {
                            name: 'path',
                            type: 'string',
                            value: value,
                        },
                    ],
                },
            ]);
        },
    }),
    translate,
)(TabValueSubresourceColumnComponent);
