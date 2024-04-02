import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, TextField } from '@mui/material';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

import { fromParsing } from '../../admin/selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export const SelectDatasetFieldComponent = ({
    datasetFields,
    handleChange,
    p: polyglot,
    column,
    label,
    id,
}) => (
    <TextField
        select
        fullWidth
        id={id}
        onChange={(e) => handleChange(e.target.value)}
        label={polyglot.t(label)}
        value={column}
    >
        {datasetFields.map((datasetField) => (
            <MenuItem
                key={`id_${datasetField}`}
                className={`column-${datasetField.replaceAll(' ', '-')}`}
                value={datasetField}
            >
                {datasetField}
            </MenuItem>
        ))}
    </TextField>
);

SelectDatasetFieldComponent.propTypes = {
    datasetFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    column: PropTypes.string,
    label: PropTypes.string.isRequired,
    id: PropTypes.string,
};
SelectDatasetFieldComponent.defaultProps = {
    column: '',
    id: 'select_column',
};

const mapStateToProps = (state) => ({
    datasetFields: fromParsing.getParsedExcerptColumns(state),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(SelectDatasetFieldComponent);
