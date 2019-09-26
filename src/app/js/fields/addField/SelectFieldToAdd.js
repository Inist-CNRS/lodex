import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import { selectField } from '../../fields';
import { fromResource } from '../../public/selectors';
import { fromFields } from '../../sharedSelectors';

import {
    resource as resourcePropTypes,
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';

export const SelectFieldToAddComponent = ({
    contributionFields,
    resource,
    selectedField,
    onSelectField,
    p: polyglot,
}) => (
    <FormControl>
        <InputLabel>{polyglot.t('select_contribution_field')}</InputLabel>
        <Select
            className="select-field"
            fullWidth
            value={selectedField}
            onChange={(_, __, value) => onSelectField(value)}
        >
            <MenuItem value="new" className="new">
                {polyglot.t('new_contribution_field')}
            </MenuItem>
            {contributionFields
                .filter(({ name }) => !resource[name])
                .map(({ name, label }) => (
                    <MenuItem key={name} className={name} value={name}>
                        {label}
                    </MenuItem>
                ))}
        </Select>
    </FormControl>
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
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    translate,
)(SelectFieldToAddComponent);
