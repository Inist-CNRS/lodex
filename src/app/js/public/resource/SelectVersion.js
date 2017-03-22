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

export const SelectVersionComponent = ({ versions, selectedVersion, onSelectVersion, p: polyglot }) => (
    <SelectField
        className="select-version"
        floatingLabelText={polyglot.t('versions')}
        value={selectedVersion}
        onChange={(_, __, value) => onSelectVersion(value)}
        fullWidth
    >
        {versions.map((date, index, { length }) => (
            <MenuItem
                key={date}
                className={`version version_${index}`}
                value={index}
                primaryText={
                    `${moment(date).format('L HH:mm:ss')}${index === length - 1 ? ` (${polyglot.t('latest')})` : ''}`
                }
            />
        ))}
    </SelectField>
);

SelectVersionComponent.propTypes = {
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
)(SelectVersionComponent);
