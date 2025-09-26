import React from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import { Field } from 'redux-form';
import { MenuItem, Box } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../propTypes';
import FormAutoCompleteField from '../lib/components/FormAutoCompleteField';
import { translate } from '../i18n/I18NContext';

export const FieldSchemeInputComponent = ({
    // @ts-expect-error TS7031
    className,
    // @ts-expect-error TS7031
    name,
    // @ts-expect-error TS7031
    disabled,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    getSchemeSearchRequest,
    // @ts-expect-error TS7031
    getSchemeMenuItemsDataFromResponse,
}) => (
    <Field
        allowNewItem
        className={className}
        name={name}
        disabled={disabled}
        component={FormAutoCompleteField}
        label={polyglot.t('scheme')}
        fullWidth
        style={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        getFetchRequest={getSchemeSearchRequest}
        // @ts-expect-error TS7006
        parseResponse={(response) =>
            getSchemeMenuItemsDataFromResponse(response).map(
                // @ts-expect-error TS7031
                ({ label, uri }) => ({
                    text: uri,
                    value: (
                        <MenuItem
                            sx={{
                                lineHeight: 1,
                            }}
                            value={uri}
                        >
                            <Box
                                sx={{
                                    fontSize: '0.9em',
                                    margin: 0,
                                    padding: '0.2em 0',
                                }}
                            >
                                <b>{label}</b>
                            </Box>
                            <Box
                                component="small"
                                sx={{
                                    fontSize: '0.7em',
                                    color: 'grey',
                                    margin: 0,
                                    padding: 0,
                                }}
                            >
                                {uri}
                            </Box>
                        </MenuItem>
                    ),
                }),
            )
        }
    />
);

FieldSchemeInputComponent.defaultProps = {
    disabled: false,
    className: null,
    name: 'scheme',
};

FieldSchemeInputComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    getSchemeSearchRequest: PropTypes.func.isRequired,
    getSchemeMenuItemsDataFromResponse: PropTypes.func.isRequired,
    className: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
};

const mapStateToProps = () => ({
    // @ts-expect-error TS7006
    getSchemeSearchRequest: (query) => ({
        url: `https://lov.linkeddata.es/dataset/lov/api/v2/term/search?q=${query}`,
    }),
    // @ts-expect-error TS7006
    getSchemeMenuItemsDataFromResponse: (response) =>
        response && response.results
            ? // @ts-expect-error TS7006
              response.results.map((r) => ({
                  label: r.prefixedName[0],
                  uri: r.uri[0],
              }))
            : [],
});

export default compose(
    connect(mapStateToProps),
    translate,
)(FieldSchemeInputComponent);
