import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import { TableCell, Button } from '@mui/material';

import { removeField } from '../../fields';
import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';
import getFieldClassName from '../../lib/getFieldClassName';
import { translate } from '../../i18n/I18NContext';

export const ExcerptRemoveColumnComponent = ({
    removeColumn,
    field: { name },
    p: polyglot,
}) => (
    <TableCell>
        {name !== 'uri' ? (
            <Button
                variant="text"
                className={`btn-excerpt-remove-column btn-excerpt-remove-column-${getFieldClassName(
                    { name },
                )}`}
                onClick={removeColumn}
                color="warning"
            >
                {polyglot.t('remove_from_publication')}
            </Button>
        ) : null}
    </TableCell>
);

ExcerptRemoveColumnComponent.propTypes = {
    removeColumn: PropTypes.func.isRequired,
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchtoProps = (dispatch, { field: { name } }) =>
    bindActionCreators(
        {
            removeColumn: () => removeField(name),
        },
        dispatch,
    );

export default compose(
    connect(undefined, mapDispatchtoProps),
    translate,
)(ExcerptRemoveColumnComponent);
