import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import { TableCell, Button } from '@mui/material';

import { removeField } from '../../../../src/app/js/fields';
import { type Field } from '../../../../src/app/js/propTypes';
import getFieldClassName from '@lodex/frontend-common/utils/getFieldClassName';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

interface ExcerptRemoveColumnComponentProps {
    removeColumn(...args: unknown[]): unknown;
    field: Field;
    p: unknown;
}

export const ExcerptRemoveColumnComponent = ({
    removeColumn,
    field: { name },
}: ExcerptRemoveColumnComponentProps) => {
    const { translate } = useTranslate();
    return (
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
                    {translate('remove_from_publication')}
                </Button>
            ) : null}
        </TableCell>
    );
};

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
    // @ts-expect-error TS2345
)(ExcerptRemoveColumnComponent);
