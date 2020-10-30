import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { Button } from '@material-ui/core';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { exportFields as exportFieldsAction } from '../../exportFields';

const styles = {
    button: {
        marginLeft: 4,
        marginRight: 4,
        marginTop: 4,
    },
};

export const ExportFieldsButtonComponent = ({ handleClick, p: polyglot }) => (
    <Button
        variant="text"
        color="primary"
        onClick={handleClick}
        style={styles.button}
    >
        {polyglot.t('export_fields')}
    </Button>
);

ExportFieldsButtonComponent.propTypes = {
    handleClick: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

ExportFieldsButtonComponent.defaultProps = {
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
)(ExportFieldsButtonComponent);
