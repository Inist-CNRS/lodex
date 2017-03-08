import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import RaisedButton from 'material-ui/RaisedButton';

import { addField } from '../fields';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    button: {
        position: 'absolute',
        bottom: '-68px',
        left: '1.5rem',
        opacity: 1,
        zIndex: 10000,
    },
};

export const ParsingExcerptAddColumnComponent = ({ addColumn, name, p: polyglot }) => (
    <RaisedButton
        className={`btn-excerpt-add-column btn-excerpt-add-column-${name}`}
        label={polyglot.t('add_to_publication')}
        onClick={addColumn}
        primary
        style={styles.button}
    />
);

ParsingExcerptAddColumnComponent.propTypes = {
    addColumn: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchtoProps = (dispatch, { name }) => bindActionCreators({
    addColumn: () => addField(name),
}, dispatch);

export default compose(
    connect(undefined, mapDispatchtoProps),
    translate,
)(ParsingExcerptAddColumnComponent);
