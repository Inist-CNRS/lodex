import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import { TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';

import { removeField } from '../fields';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../propTypes';
import getFieldClassName from '../../lib/getFieldClassName';

export const PublicationExcerptRemoveColumnComponent = ({ removeColumn, field: { label = '', name }, p: polyglot }) => (
    <TableRowColumn>
        {name !== 'uri'
        ? (
            <FlatButton
                className={`btn-excerpt-remove-column btn-excerpt-remove-column-${getFieldClassName({ label })}`}
                label={polyglot.t('remove_from_publication')}
                onClick={removeColumn}
                primary
            />
        )
        : null}
    </TableRowColumn>
);

PublicationExcerptRemoveColumnComponent.propTypes = {
    removeColumn: PropTypes.func.isRequired,
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchtoProps = (dispatch, { field: { name } }) => bindActionCreators({
    removeColumn: () => removeField(name),
}, dispatch);

export default compose(
    connect(undefined, mapDispatchtoProps),
    translate,
)(PublicationExcerptRemoveColumnComponent);
