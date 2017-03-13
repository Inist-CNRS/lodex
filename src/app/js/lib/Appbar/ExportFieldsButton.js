import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import memoize from 'lodash.memoize';

import translate from 'redux-polyglot/translate';
import IconButton from 'material-ui/IconButton';
import DescriptionIcon from 'material-ui/svg-icons/action/description';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { exportFields as exportFieldsAction } from '../../exportFields';

const styles = {
    icon: {
        color: 'white',
    },
};

const getStyles = memoize(style => Object.assign({}, styles.icon, style));

export const ExportFieldsButtonComponent = ({ handleClick, iconStyle, p: polyglot }) => (
    <IconButton
        onClick={handleClick}
        iconStyle={getStyles(iconStyle)}
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
    exportFields: exportFieldsAction,
});

export default compose(
    connect(undefined, mapDispatchToProps),
    withHandlers({
        handleClick: ({ exportFields }) => () => {
            exportFields();
        },
    }),
    translate,
)(ExportFieldsButtonComponent);
