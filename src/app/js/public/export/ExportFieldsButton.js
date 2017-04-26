import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import translate from 'redux-polyglot/translate';
import RaisedButton from 'material-ui/RaisedButton';

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
    <RaisedButton
        onClick={handleClick}
        label={polyglot.t('export_fields')}
        style={styles.button}
    />
);

ExportFieldsButtonComponent.propTypes = {
    handleClick: PropTypes.func.isRequired,
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
