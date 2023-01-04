import React from 'react';
import PropTypes from 'prop-types';
import { Switch, FormControlLabel, Select, MenuItem } from '@material-ui/core';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { FIELD_FORM_NAME } from '../';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    inset: {
        paddingLeft: 40,
    },
};

export const StepValueSubresourceComponent = ({
    subresource,
    handleChange,
    subresources,
    handleSelect,
    p: polyglot,
    selected,
}) => (
    <div id="step-value-subresource">
        <FormControlLabel
            control={
                <Switch
                    value="subresource"
                    onChange={handleSelect}
                    checked={selected}
                />
            }
            label={polyglot.t('a_subresource_uri')}
        />
        {selected && (
            <div style={styles.inset}>
                <Select
                    value={subresource}
                    onChange={a => handleChange(a.target.value)}
                >
                    {subresources.map(sr => (
                        <MenuItem key={sr._id} value={sr._id}>
                            {sr.name}
                        </MenuItem>
                    ))}
                </Select>
            </div>
        )}
    </div>
);

StepValueSubresourceComponent.propTypes = {
    subresource: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selected: PropTypes.bool.isRequired,
    subresources: PropTypes.array,
};

StepValueSubresourceComponent.defaultProps = {
    subresource: '',
};

const getSubresourceTransformers = subresource =>
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
                          value: subresource.identifier,
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
                          value: `${subresource._id}/$1`,
                      },
                  ],
              },
              { operation: 'MD5', args: [] },
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
                          value: `uid:/$1`,
                      },
                  ],
              },
          ]
        : [];

export const isSubresourceTransformation = transformers => {
    const operations = transformers.map(t => t.operation).join('|');
    return (
        operations === 'COLUMN|PARSE|GET|STRING|REPLACE_REGEX|MD5|REPLACE_REGEX'
    );
};

const extractUriSubresourceId = uri => {
    const [_, subresourceId] = uri.split('/');
    return subresourceId;
};

const mapStateToProps = state => {
    const subresources = state.subresource.subresources;
    const transformers = formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    );

    if (isSubresourceTransformation(transformers || [])) {
        const extractedSubresourceId = extractUriSubresourceId(
            transformers[4].args[1].value, // transformers[4] is REPLACE_REGEX transformer from subresources
        );

        return {
            selected: true,
            subresources,
            subresource: extractedSubresourceId,
        };
    }

    return {
        selected: false,
        subresources,
        subresource: subresources[0] ? subresources[0]._id : null,
    };
};

export default compose(
    connect(mapStateToProps),
    withState(
        'subresource',
        'setSubresource',
        ({ subresource }) => subresource,
    ),
    withHandlers({
        handleSelect: ({ onChange, subresources, subresource }) => () => {
            const subresourceObject = subresources.find(
                s => s._id === subresource,
            );

            if (subresourceObject) {
                onChange(getSubresourceTransformers(subresourceObject));
            }
        },
        handleChange: ({ onChange, subresources, setSubresource }) => value => {
            setSubresource(value);
            const subresourceObject = subresources.find(s => s._id === value);

            if (subresourceObject) {
                onChange(getSubresourceTransformers(subresourceObject));
            }
        },
    }),
    translate,
)(StepValueSubresourceComponent);
