import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import { selectField } from '../../fields';
import { fromResource } from '../../public/selectors';
import { fromFields } from '../../sharedSelectors';

import { resource as resourcePropTypes, field as fieldPropTypes, polyglot as polyglotPropTypes } from '../../propTypes';

export const SelectFieldToAddComponent = ({
    contributionFields,
    resource,
    selectedField,
    onSelectField,
    p: polyglot,
}) => (
    <SelectField
        className="select-field"
        floatingLabelText={polyglot.t('select_contribution_field')}
        fullWidth
        value={selectedField}
        onChange={(_, __, value) => onSelectField(value)}
    >
        <MenuItem value="new" className="new" primaryText={polyglot.t('new_contribution_field')} />
        {contributionFields.filter(({ name }) => !resource[name]).map(({ name, label }) => (
            <MenuItem key={name} className={name} value={name} primaryText={label} />
        ))}
    </SelectField>
);

SelectFieldToAddComponent.defaultProps = {
    selectedField: null,
};

SelectFieldToAddComponent.propTypes = {
    contributionFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    onSelectField: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    resource: resourcePropTypes.isRequired,
    selectedField: PropTypes.string,
};

const mapStateToProps = state => ({
    selectedField: fromFields.getSelectedField(state),
    contributionFields: fromFields.getContributionFields(state),
    resource: fromResource.getResourceLastVersion(state),
});

const mapDispatchToProps = {
    onSelectField: selectField,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(SelectFieldToAddComponent);
