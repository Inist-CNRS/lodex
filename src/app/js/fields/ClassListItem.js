import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import FormAutoCompleteField from '../lib/components/FormAutoCompleteField';
import { fromFields } from '../sharedSelectors';
import { polyglot as polyglotPropTypes } from '../propTypes';
import { changeClass } from './';

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
    fieldContainer: {
        width: '75%',
    },
    field: {
        top: '-25px',
    },
    class: {
        display: 'flex',
    },
};

export const ClassListItem = ({
    fieldName,
    disabled,
    p: polyglot,
    onRemove,
    onChangeClass,
    getSchemeSearchRequest,
    getSchemeMenuItemsDataFromResponse,
}) => (
    <div style={styles.class}>
        <div style={styles.fieldContainer}>
            <Field
                style={styles.field}
                allowNewItem
                fullWidth
                hintText={polyglot.t('enter_class')}
                label={`${polyglot.t('class')} ${parseInt(/\d+/.exec(fieldName)[0], 10) + 1}`}
                name={`${fieldName}.class`}
                component={FormAutoCompleteField}
                disabled={disabled}
                onChange={(_, type) => onChangeClass({ type, fieldName })}
                getFetchRequest={getSchemeSearchRequest}
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
        </div>
        <span>
            <IconButton
                tooltip={polyglot.t('remove_class')}
                onClick={onRemove}
            >
                <ActionDeleteIcon />
            </IconButton>
        </span>
    </div>
);

ClassListItem.propTypes = {
    fieldName: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
    getSchemeSearchRequest: PropTypes.func.isRequired,
    getSchemeMenuItemsDataFromResponse: PropTypes.func.isRequired,
    onChangeClass: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
};

ClassListItem.defaultProps = {
    validate: false,
    isNewField: false,
    disabled: false,
};

const mapStateToProps = state => ({
    fields: fromFields.getFields(state),
    getSchemeSearchRequest: query => ({ url: `http://lov.okfn.org/dataset/lov/api/v2/term/search?q=${query}` }),
    getSchemeMenuItemsDataFromResponse: response => (
        response && response.results
            ? response.results.map(r => ({ label: r.prefixedName[0], uri: r.uri[0] }))
            : []
    ),
});

const mapDispatchToProps = {
    onChangeClass: changeClass,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ClassListItem);
