import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import moment from 'moment';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { polyglot as polyglotPropTypes } from '../../propTypes';

import { selectVersion } from '../resource';
import { fromResource } from '../selectors';

export const SelectFieldToAddComponent = ({ versions, selectedVersion, onSelectVersion, p: polyglot }) => (
    <SelectField
        className="select-field"
        floatingLabelText={polyglot.t('versions')}
        value={selectedVersion}
        onChange={(_, __, value) => onSelectVersion(value)}
        autoWidth
    >
        {versions.map((date, index, { length }) => (
            <MenuItem
                key={date}
                className={date}
                value={index}
                primaryText={
                    `${moment(date).format('llll')}${index === length - 1 ? ` (${polyglot.t('latest')})` : ''}`
                }
            />
        ))}
    </SelectField>
);

SelectFieldToAddComponent.propTypes = {
    versions: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectVersion: PropTypes.func.isRequired,
    selectedVersion: PropTypes.number.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    versions: fromResource.getVersions(state),
    selectedVersion: fromResource.getSelectedVersion(state),
});

const mapDispatchToProps = {
    onSelectVersion: selectVersion,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(SelectFieldToAddComponent);
