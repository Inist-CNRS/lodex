// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, TextField } from '@mui/material';
import { translate } from '../../i18n/I18NContext';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

import { fromParsing } from '../../admin/selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export const SelectDatasetFieldComponent = ({
    // @ts-expect-error TS7031
    datasetFields,
    // @ts-expect-error TS7031
    handleChange,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    column,
    // @ts-expect-error TS7031
    label,
    // @ts-expect-error TS7031
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
        {/*
         // @ts-expect-error TS7006 */}
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

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    datasetFields: fromParsing.getParsedExcerptColumns(state),
});

export default compose(
    connect(mapStateToProps),
    translate,
    // @ts-expect-error TS2345
)(SelectDatasetFieldComponent);
