import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import { TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';

import { removeField } from '../fields';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export const PublicationExcerptRemoveColumnComponent = ({ removeColumn, name, p: polyglot }) => (
    <TableRowColumn>
        <FlatButton
            className={`btn-excerpt-remove-column btn-excerpt-remove-column-${name}`}
            label={polyglot.t('remove_from_publication')}
            onClick={removeColumn}
            primary
        />
    </TableRowColumn>
);

PublicationExcerptRemoveColumnComponent.propTypes = {
    removeColumn: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchtoProps = (dispatch, { name }) => bindActionCreators({
    removeColumn: () => removeField(name),
}, dispatch);

export default compose(
    connect(undefined, mapDispatchtoProps),
    translate,
)(PublicationExcerptRemoveColumnComponent);
