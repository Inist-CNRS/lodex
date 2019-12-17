import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';
import MenuItem from '@material-ui/core/MenuItem';

import { polyglot as polyglotPropTypes } from '../propTypes';
import FormAutoCompleteField from '../lib/components/FormAutoCompleteField';

const styles = {
    menuItem: {
        lineHeight: 1,
    },
    schemeLabel: {
        fontSize: '0.9em',
        margin: 0,
        padding: '0.2em 0',
    },
    schemeUri: {
        fontSize: '0.7em',
        color: 'grey',
        margin: 0,
        padding: 0,
    },
    targetOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
    },
};

export const FieldSchemeInputComponent = ({
    className,
    name,
    disabled,
    p: polyglot,
    getSchemeSearchRequest,
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
        targetOrigin={styles.targetOrigin}
        getFetchRequest={getSchemeSearchRequest}
        parseResponse={response =>
            getSchemeMenuItemsDataFromResponse(response).map(
                ({ label, uri }) => ({
                    text: uri,
                    value: (
                        <MenuItem style={styles.menuItem} value={uri}>
                            <div style={styles.schemeLabel}>
                                <b>{label}</b>
                            </div>
                            <small style={styles.schemeUri}>{uri}</small>
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
    getSchemeSearchRequest: query => ({
        url: `https://lov.linkeddata.es/dataset/lov/api/v2/term/search?q=${query}`,
    }),
    getSchemeMenuItemsDataFromResponse: response =>
        response && response.results
            ? response.results.map(r => ({
                  label: r.prefixedName[0],
                  uri: r.uri[0],
              }))
            : [],
});

export default compose(
    connect(mapStateToProps),
    translate,
)(FieldSchemeInputComponent);
