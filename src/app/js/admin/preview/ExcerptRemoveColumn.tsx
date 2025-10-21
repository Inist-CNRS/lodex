import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import { TableCell, Button } from '@mui/material';

import { removeField } from '../../fields';
import { type Field } from '../../propTypes';
import getFieldClassName from '../../lib/getFieldClassName';
import { translate } from '../../i18n/I18NContext';

interface ExcerptRemoveColumnComponentProps {
    removeColumn(...args: unknown[]): unknown;
    field: Field;
    p: unknown;
}

export const ExcerptRemoveColumnComponent = ({
    removeColumn,
    field: { name },
    p: polyglot,
}: ExcerptRemoveColumnComponentProps) => (
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
                {/*
                 // @ts-expect-error TS18046 */}
                {polyglot.t('remove_from_publication')}
            </Button>
        ) : null}
    </TableCell>
);

// @ts-expect-error TS7006
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
    // @ts-expect-error TS2345
)(ExcerptRemoveColumnComponent);
