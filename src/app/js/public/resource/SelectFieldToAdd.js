import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';

import { selectField } from '../publication';
import { fromPublication, fromResource } from '../selectors';

import { resource as resourcePropTypes } from '../../propTypes';

export const SelectFieldToAddComponent = ({ contributionFields, resource, selectedField, onSelectField }) => (
    <SelectField
        className="select-field"
        hintText="select field"
        fullWidth
        value={selectedField}
        onChange={(_, __, value) => onSelectField(value)}
    >
        <MenuItem value="new" className="new" primaryText="create a new field" />
        {contributionFields.filter(({ name }) => !resource[name]).map(({ name, label }) => (
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
    resource: resourcePropTypes.isRequired,
    selectedField: PropTypes.string,
};

const mapStateToProps = state => ({
    selectedField: fromPublication.getSelectedField(state),
    contributionFields: fromPublication.getContributionFields(state),
    resource: fromResource.getResourceLastVersion(state),
});

const mapDispatchToProps = {
    onSelectField: selectField,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SelectFieldToAddComponent);
