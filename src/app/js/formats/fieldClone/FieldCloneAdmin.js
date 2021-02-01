import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { useParams } from 'react-router';

import { MenuItem, Select, FormControl, InputLabel } from '@material-ui/core';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { field as fieldPropTypes } from '../../propTypes';
import { fromFields } from '../../sharedSelectors';
import {
    SCOPE_DATASET,
    SCOPE_GRAPHIC,
    SCOPE_DOCUMENT,
    SCOPE_COLLECTION,
} from '../../../../common/scope';

const styles = {
    container: {
        display: 'flex',
    },
    input: {
        marginLeft: '1rem',
    },
};
export const defaultArgs = {
    value: '',
};

const FieldCloneAdmin = ({ args, onChange, p: polyglot, fields }) => {
    const { filter } = useParams();
    const setValue = e => {
        const newArgs = { value: e.target.value };
        onChange(newArgs);
    };

    const filteredFields = fields.filter(f => isValidClonableField(f, filter));

    return (
        <div style={styles.container}>
            <FormControl fullWidth>
                <InputLabel id="fieldclone-input-label">
                    {polyglot.t('fieldclone_format_value')}
                </InputLabel>
                <Select
                    labelId="fieldclone-input-label"
                    onChange={setValue}
                    style={styles.input}
                    value={args.value}
                >
                    {filteredFields.map(field => {
                        return (
                            <MenuItem value={field.name} key={field.name}>
                                {field.name} - {field.label}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </div>
    );
};

FieldCloneAdmin.propTypes = {
    args: PropTypes.shape({
        value: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
};

FieldCloneAdmin.defaultProps = {
    args: defaultArgs,
    fields: [],
};

const mapStateToProps = state => ({
    fields: fromFields.getFields(state),
});

export const isValidClonableField = (field, filter) => {
    if (field.format && field.format.name === 'fieldClone') {
        return false;
    }

    if (
        filter === SCOPE_DATASET &&
        field.scope !== SCOPE_DATASET &&
        field.scope !== SCOPE_GRAPHIC
    ) {
        return false;
    }

    if (
        filter === SCOPE_DOCUMENT &&
        field.scope !== SCOPE_DOCUMENT &&
        field.scope !== SCOPE_COLLECTION
    ) {
        return false;
    }
    return true;
};

export default compose(connect(mapStateToProps), translate)(FieldCloneAdmin);
