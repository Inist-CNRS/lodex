import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import { TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';

import { addField } from '../fields';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export const ParsingExcerptAddColumnComponent = ({ addColumn, name, p: polyglot }) => (
    <TableRowColumn>
        <FlatButton
            className={`btn-excerpt-add-column btn-excerpt-add-column-${name}`}
            label={polyglot.t('add_column')}
            onClick={addColumn}
        />
    </TableRowColumn>
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
