import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { withProps } from 'recompose';

import {
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
    TextField,
} from '@material-ui/core';

import { FIELD_FORM_NAME } from '..';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    inset: {
        paddingLeft: 40,
    },
};

export const TabValueSubresourceFieldComponent = ({
    subresource,
    handleChangeSubresource,
    handleChangeColumn,
    columnName,
    subresources,
    handleSelect,
    p: polyglot,
    selected,
}) => (
    <div id="tab-value-subresource-field">
                HELLO SUBFIELD

        <FormControlLabel
            control={
                <Switch
                    value="subresource"
                    onChange={handleSelect}
                    checked={selected}
                />
            }
            label={polyglot.t('a_subresource_field')}
        />
        {selected && (
            <div style={styles.inset}>
                <Select
                    value={subresource}
                    onChange={a => handleChangeSubresource(a.target.value)}
                >
                    {subresources.map(sr => (
                        <MenuItem key={sr._id} value={sr._id}>
                            {sr.name}
                        </MenuItem>
                    ))}
                </Select>
                <TextField
                    fullWidth
                    className="column_name"
                    placeholder={polyglot.t('enter_a_value')}
                    onChange={handleChangeColumn}
                    value={columnName}
                />
            </div>
        )}
    </div>
);

TabValueSubresourceFieldComponent.propTypes = {
    subresource: PropTypes.string,
    handleChangeSubresource: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    handleChangeColumn: PropTypes.func.isRequired,
    columnName: PropTypes.string,
    p: polyglotPropTypes.isRequired,
    selected: PropTypes.bool.isRequired,
    subresources: PropTypes.array,
};

TabValueSubresourceFieldComponent.defaultProps = {
    subresource: '',
};

/**
 * To be able to retrieve the subresourceId from the field
 * We add it to the transformers using 2 REPLACE_REGEX operations
 */
const getSubresourceFieldTransformers = (subresource, columnName) =>
    subresource
        ? [
              {
                  operation: 'COLUMN',
                  args: [
                      {
                          name: 'column',
                          type: 'column',
                          value: subresource.path,
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
                          value: columnName,
                      },
                  ],
              },
              { operation: 'STRING' },
              {
                  operation: 'REPLACE_REGEX',
                  args: [
                      {
                          name: 'searchValue',
                          type: 'string',
                          value: '^(.*)$',
                      },
                      {
                          name: 'replaceValue',
                          type: 'string',
                          value: `(${subresource._id})$1`,
                      },
                  ],
              },
              {
                  operation: 'REPLACE_REGEX',
                  args: [
                      {
                          name: 'searchValue',
                          type: 'string',
                          value: `/^\\((.*)\\)/`,
                      },
                      {
                          name: 'replaceValue',
                          type: 'string',
                          value: ' ', // REPLACE_REGEX Meta can't have an empty replaceValue
                      },
                  ],
              },
              { operation: 'TRIM' }, // CANCEL REPLACE_REGEX empty "replaceValue"
          ]
        : [];

export const isSubresourceFieldTransformation = transformers => {
    const operations = transformers.map(t => t.operation).join('|');
    return (
        operations ===
        'COLUMN|PARSE|GET|STRING|REPLACE_REGEX|REPLACE_REGEX|TRIM'
    );
};

const extractedSubresourceIdRegex = new RegExp(/^\((.*)\)/, 'i');
const extractUriSubresourceId = uri => {
    const [, subresourceId] = extractedSubresourceIdRegex.exec(uri);
    return subresourceId;
};

const extractColumnName = transformers => {
    const getOperation = transformers.find(t => t.operation === 'GET');
    return getOperation.args[0].value;
};

const mapStateToProps = state => {
    const subresources = state.subresource.subresources;
    const transformers = formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    );

    if (isSubresourceFieldTransformation(transformers || [])) {
        const extractedSubresourceId = extractUriSubresourceId(
            transformers[4].args[1].value, // transformers[4] is REPLACE_REGEX transformer from subresources
        );

        const columnName = extractColumnName(transformers);

        return {
            selected: true,
            subresources,
            subresource: extractedSubresourceId,
            columnName,
        };
    }

    return {
        selected: false,
        subresources,
        subresource: subresources[0] ? subresources[0]._id : null,
        columnName: null,
    };
};

export default compose(
    connect(mapStateToProps),
    withProps(({ subresources, subresource }) => {
        const subresourceObject = subresources.find(s => s._id === subresource);
        return { subresourceObject };
    }),
    withHandlers({
        handleSelect: ({ onChange, subresourceObject, columnName }) => () => {
            subresourceObject &&
                onChange(
                    getSubresourceFieldTransformers(
                        subresourceObject,
                        columnName,
                    ),
                );
        },
        handleChangeColumn: ({ subresourceObject, onChange }) => e => {
            subresourceObject &&
                onChange(
                    getSubresourceFieldTransformers(
                        subresourceObject,
                        e.target.value,
                    ),
                );
        },
        handleChangeSubresource: ({
            onChange,
            subresources,
            columnName,
        }) => value => {
            const subresourceObject = subresources.find(s => s._id === value);
            subresourceObject &&
                onChange(
                    getSubresourceFieldTransformers(
                        subresourceObject,
                        columnName,
                    ),
                );
        },
    }),
    translate,
)(TabValueSubresourceFieldComponent);
