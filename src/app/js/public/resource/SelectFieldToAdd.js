import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';

import { getNewContributionsField } from './';
import { selectField, getSelectedField } from '../';

export const SelectFieldToAddComponent = ({ contributionFields, selectedField, onSelectField }) => (
    <SelectField
        className="select-field"
        hintText="select field"
        fullWidth
        value={selectedField}
        onChange={(_, __, value) => onSelectField(value)}
    >
        <MenuItem value="new" className="new" primaryText="create a new field" />
        {contributionFields.map(({ name, label }) => (
            <MenuItem className={name} value={name} primaryText={label} />
        ))}
    </SelectField>
);

SelectFieldToAddComponent.defaultProps = {
    selectedField: null,
};

SelectFieldToAddComponent.propTypes = {
    contributionFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectField: PropTypes.func.isRequired,
    selectedField: PropTypes.string,
};

const mapStateToProps = state => ({
    selectedField: getSelectedField(state),
    contributionFields: getNewContributionsField(state),
});

const mapDispatchToProps = {
    onSelectField: selectField,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SelectFieldToAddComponent);
