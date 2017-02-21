import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';

import { polyglot as polyglotPropTypes } from '../propTypes';
import FormAutoCompleteField from './FormAutoCompleteField';

const styles = {
    menuItem: {
        lineHeight: 1,
    },
    schemeLabel: {
        fontSize: '0.9rem',
        margin: 0,
        padding: '0.2rem 0',
    },
    schemeUri: {
        fontSize: '0.7rem',
        color: 'grey',
        margin: 0,
        padding: 0,
    },
    targetOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
    },
};

export const SchemeAutoCompleteComponent = ({
    name,
    className,
    disabled,
    p: polyglot,
    getSchemeSearchRequest,
    getSchemeMenuItemsDataFromResponse,
}) => (
    <Field
        className={className}
        name={name}
        disabled={disabled}
        component={FormAutoCompleteField}
        label={polyglot.t('scheme')}
        fullWidth
        targetOrigin={styles.targetOrigin}
        fetch={getSchemeSearchRequest}
        parseResponse={response => getSchemeMenuItemsDataFromResponse(response).map(({ label, uri }) => ({
            text: uri,
            value: (
                <MenuItem style={styles.menuItem} value={uri}>
                    <div style={styles.schemeLabel}><b>{label}</b></div>
                    <small style={styles.schemeUri}>{uri}</small>
                </MenuItem>
            ),
        }))}
    />
);

SchemeAutoCompleteComponent.defaultProps = {
    disabled: false,
    className: null,
};

SchemeAutoCompleteComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    getSchemeSearchRequest: PropTypes.func.isRequired,
    getSchemeMenuItemsDataFromResponse: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

const mapStateToProps = () => ({
    getSchemeSearchRequest: query => ({ url: `http://lov.okfn.org/dataset/lov/api/v2/term/search?q=${query}` }),
    getSchemeMenuItemsDataFromResponse: response => (
        response && response.results
            ? response.results.map(r => ({ label: r.prefixedName[0], uri: r.uri[0] }))
            : []
    ),
});

const mapDispatchToProps = {
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(SchemeAutoCompleteComponent);
