import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconDelete from '@material-ui/icons/Delete';
import translate from 'redux-polyglot/translate';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../propTypes';

const styles = {
    compositionContainer: {
        display: 'flex',
    },
    select: {
        flexGrow: 2,
    },
};

const ComposedOfColumn = ({
    fields,
    column,
    index,
    handleSelectColumn,
    handleRemoveColumn,
    p: polyglot,
}) => (
    <div style={styles.compositionContainer}>
        <SelectField
            onChange={handleSelectColumn}
            style={styles.select}
            hintText={polyglot.t('select_a_column')}
            value={column}
            required
        >
            {fields.map(f => (
                <MenuItem
                    className={`composite-field-${index}-${f.name}`}
                    key={`composite-field-${index}-${f.name}`}
                    value={f.name}
                    primaryText={f.label}
                />
            ))}
        </SelectField>
        {index > 1 && (
            <IconButton
                className={`btn-remove-composite-field btn-remove-composite-field-${index}`}
                onClick={handleRemoveColumn}
                title={polyglot.t('remove_composition_column')}
            >
                <IconDelete />
            </IconButton>
        )}
    </div>
);

ComposedOfColumn.propTypes = {
    column: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    handleSelectColumn: PropTypes.func.isRequired,
    handleRemoveColumn: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    p: polyglotPropTypes.isRequired,
};

ComposedOfColumn.defaultProps = {
    columns: [],
};

export default translate(ComposedOfColumn);
