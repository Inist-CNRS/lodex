/* eslint react/no-array-index-key: off */

import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import { polyglot as polyglotPropTypes } from '../../../propTypes';

const styles = {
    inset: {
        paddingLeft: 40,
    },
    radio: {
        marginTop: 12,
    },
    select: {
        width: '100%',
    },
};

export const ConcatFieldComponent = ({
    p: polyglot,
    datasetFields,
    handleChange,
    handleRemoveColumn,
    column,
}) => (
    <div>
        <SelectField
            id="select_column"
            onChange={handleChange}
            style={styles.select}
            hintText={polyglot.t('select_a_column')}
            value={column}
        >
            {datasetFields.map(datasetField => (
                <MenuItem
                    key={datasetField}
                    value={datasetField}
                    primaryText={datasetField}
                />
            ))}
        </SelectField>
        <IconButton
            tooltip={polyglot.t('remove_column')}
            onClick={handleRemoveColumn}
        >
            <ActionDeleteIcon />
        </IconButton>
    </div>
);

ConcatFieldComponent.propTypes = {
    datasetFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    column: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    handleRemoveColumn: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

ConcatFieldComponent.defaultProps = {
    column: null,
};

export default compose(
    withHandlers({
        handleChange: ({ handleChange, index }) => (event, key, value) => handleChange(event, key, value, index),
        handleRemoveColumn: ({ handleRemoveColumn, index }) => handleRemoveColumn(index),
    }),
    translate,
)(ConcatFieldComponent);
