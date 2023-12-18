import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { useParams } from 'react-router';

import { MenuItem, TextField } from '@mui/material';
import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../../propTypes';
import { fromFields } from '../../../sharedSelectors';
import {
    SCOPE_DATASET,
    SCOPE_GRAPHIC,
    SCOPE_DOCUMENT,
    SCOPE_COLLECTION,
} from '../../../../../common/scope';
import { FormatDefaultParamsFieldSet } from '../../utils/components/FormatFieldSet';

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
        <FormatDefaultParamsFieldSet>
            <TextField
                fullWidth
                select
                onChange={setValue}
                value={args.value}
                label={polyglot.t('fieldclone_format_value')}
            >
                {filteredFields.map(field => {
                    return (
                        <MenuItem value={field.name} key={field.name}>
                            {field.name} - {field.label}
                        </MenuItem>
                    );
                })}
            </TextField>
        </FormatDefaultParamsFieldSet>
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
        (filter === SCOPE_DATASET || filter === SCOPE_GRAPHIC) &&
        field.scope !== SCOPE_DATASET &&
        field.scope !== SCOPE_GRAPHIC
    ) {
        return false;
    }

    if (
        (filter === SCOPE_DOCUMENT || filter === SCOPE_COLLECTION) &&
        field.scope !== SCOPE_DOCUMENT &&
        field.scope !== SCOPE_COLLECTION
    ) {
        return false;
    }
    return true;
};

export default compose(connect(mapStateToProps), translate)(FieldCloneAdmin);
