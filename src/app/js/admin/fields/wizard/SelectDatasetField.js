import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { fromParsing } from '../../selectors';

import { polyglot as polyglotPropTypes } from '../../../propTypes';

const styles = {
    select: {
        width: '100%',
    },
};

export const SelectDatasetFieldComponent = ({
    datasetFields,
    handleChange,
    p: polyglot,
    column,
    label,
    id,
}) => (
    <SelectField
        id={id}
        onChange={handleChange}
        style={styles.select}
        floatingLabelText={polyglot.t(label)}
        value={column}
    >
        {datasetFields.map(datasetField => (
            <MenuItem
                key={`id_${datasetField}`}
                className={`column-${datasetField}`}
                value={datasetField}
                primaryText={datasetField}
            />
        ))}
    </SelectField>
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
    column: undefined,
    id: 'select_column',
};

const mapStateToProps = state => ({
    datasetFields: fromParsing.getParsedExcerptColumns(state),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(SelectDatasetFieldComponent);
