import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';

import RaisedButton from 'material-ui/RaisedButton';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    button: {
        bottom: '-68px',
        position: 'absolute',
        left: '1.5rem',
        zIndex: 10000,
    },
};

export const ParsingExcerptAddColumnComponent = ({ handleAddColumn, name, p: polyglot, style }) => (
    <RaisedButton
        className={`btn-excerpt-add-column btn-excerpt-add-column-${name}`}
        label={polyglot.t('add_to_publication')}
        onClick={handleAddColumn}
        primary
        style={Object.assign({}, styles.button, style)}
    />
);

ParsingExcerptAddColumnComponent.propTypes = {
    handleAddColumn: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    style: PropTypes.object, // eslint-disable-line
    p: polyglotPropTypes.isRequired,
};

ParsingExcerptAddColumnComponent.defaultProps = {
    style: null,
};

export default compose(
    withHandlers({
        handleAddColumn: ({ name, onAddColumn }) => () => onAddColumn(name),
    }),
    translate,
)(ParsingExcerptAddColumnComponent);
