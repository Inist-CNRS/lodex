import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import translate from 'redux-polyglot/translate';
import IconButton from 'material-ui/IconButton';
import DescriptionIcon from 'material-ui/svg-icons/action/description';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { exportFields } from '../../admin/export';

const styles = {
    icon: {
        color: 'white',
    },
};

export const ExportFieldsButtonComponent = ({ handleClick, iconStyle, p: polyglot }) => (
    <IconButton
        onClick={handleClick}
        iconStyle={Object.assign({}, styles.icon, iconStyle)}
        tooltip={polyglot.t('export_fields')}
    >
        <DescriptionIcon />
    </IconButton>
);

ExportFieldsButtonComponent.propTypes = {
    handleClick: PropTypes.func.isRequired,
    iconStyle: PropTypes.object, // eslint-disable-line
    p: polyglotPropTypes.isRequired,
};

ExportFieldsButtonComponent.defaultProps = {
    iconStyle: null,
};


const mapDispatchToProps = ({
    handleClick: exportFields,
});

export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(ExportFieldsButtonComponent);
