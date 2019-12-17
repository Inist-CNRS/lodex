import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import translate from 'redux-polyglot/translate';
import FlatButton from '@material-ui/core/FlatButton';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { exportFieldsReady as exportFieldsAction } from '../../exportFieldsReady';

const styles = {
    button: {
        marginLeft: 4,
        marginRight: 4,
        marginTop: 4,
    },
};

export const ExportFieldsReadyButtonComponent = ({
    handleClick,
    p: polyglot,
}) => (
    <FlatButton
        primary
        onClick={handleClick}
        label={polyglot.t('export_fields_ready')}
        style={styles.button}
    />
);

ExportFieldsReadyButtonComponent.propTypes = {
    handleClick: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

ExportFieldsReadyButtonComponent.defaultProps = {
    iconStyle: null,
};

const mapDispatchToProps = {
    exportFields: exportFieldsAction,
};

export default compose(
    connect(undefined, mapDispatchToProps),
    withHandlers({
        handleClick: ({ exportFields }) => () => {
            exportFields();
        },
    }),
    translate,
)(ExportFieldsReadyButtonComponent);
