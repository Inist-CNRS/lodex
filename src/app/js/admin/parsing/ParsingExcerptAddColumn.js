import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import memoize from 'lodash.memoize';

import RaisedButton from 'material-ui/RaisedButton';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    button: memoize(atTop => ({
        bottom: atTop ? '0' : '-68px',
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '80%',
        display: 'flex',
        zIndex: 1,
    })),
};

export const ParsingExcerptAddColumnComponent = ({
    handleAddColumn,
    name,
    p: polyglot,
    atTop,
}) => (
    <RaisedButton
        className={`btn-excerpt-add-column btn-excerpt-add-column-${name.replace(
            ' ',
            '-',
        )}`}
        label={polyglot.t('add_to_publication')}
        onClick={handleAddColumn}
        primary
        style={styles.button(atTop)}
    />
);

ParsingExcerptAddColumnComponent.propTypes = {
    atTop: PropTypes.bool.isRequired,
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
