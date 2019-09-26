import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Button, TableCell } from '@material-ui/core';

import { removeField } from '../../fields';
import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';
import getFieldClassName from '../../lib/getFieldClassName';

export const ExcerptRemoveColumnComponent = ({
    removeColumn,
    field: { name },
    p: polyglot,
}) => (
    <TableCell>
        {name !== 'uri' ? (
            <Button
                className={`btn-excerpt-remove-column btn-excerpt-remove-column-${getFieldClassName(
                    { name },
                )}`}
                onClick={removeColumn}
                secondary
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
    connect(
        undefined,
        mapDispatchtoProps,
    ),
    translate,
)(ExcerptRemoveColumnComponent);
