import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import translate from 'redux-polyglot/translate';
import IconButton from 'material-ui/IconButton';
import DescriptionIcon from 'material-ui/svg-icons/action/description';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { exportFields } from '../../admin/export';

export const ExportFieldsButtonComponent = ({ handleClick, p: polyglot }) => (
    <IconButton onClick={handleClick} tooltip={polyglot.t('export_fields')} >
        <DescriptionIcon color="white" />
    </IconButton>
);

ExportFieldsButtonComponent.propTypes = {
    handleClick: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchToProps = ({
    handleClick: exportFields,
});

export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(ExportFieldsButtonComponent);
