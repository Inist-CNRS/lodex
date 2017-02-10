import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import translate from 'redux-polyglot/translate';
import withHandlers from 'recompose/withHandlers';

import { TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';

import { polyglot as polyglotPropTypes } from '../../lib/propTypes';

export const ParsingExcerptAddColumnComponent = ({ addColumn, name, p: polyglot }) => (
    <TableRowColumn>
        <FlatButton
            className={`btn-excerpt-add-column btn-excerpt-add-column-${name}`}
            label={polyglot.t('add column')}
            onClick={addColumn}
        />
    </TableRowColumn>
);

ParsingExcerptAddColumnComponent.propTypes = {
    addColumn: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    pure,
    translate,
    withHandlers({
        addColumn: ({ name, onAddColumn }) => () => onAddColumn(name),
    }),
)(ParsingExcerptAddColumnComponent);
