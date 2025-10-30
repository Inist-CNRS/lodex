import classnames from 'classnames';
import compose from 'recompose/compose';
import { TableCell } from '@mui/material';
import { connect } from 'react-redux';

import { fromFields } from '../../sharedSelectors';
import { isLongText, getShortText } from '../../lib/longTexts';
import getFieldClassName from '../../lib/getFieldClassName';
import parseValue from '../../../../common/tools/parseValue';
import { translate } from '../../i18n/I18NContext';

const styles = {
    // @ts-expect-error TS7006
    cell: (readonly) => ({
        cursor: readonly ? 'default' : 'pointer',
        height: 'auto',
    }),
};

interface ExcerptLineColComponentProps {
    field: unknown;
    value?: string;
    readonly?: boolean;
}

export const ExcerptLineColComponent = ({
    field,
    value = '',
    readonly,
}: ExcerptLineColComponentProps) =>
    isLongText(value) ? (
        <TableCell
            title={value}
            sx={styles.cell(readonly)}
            className={classnames(
                'publication-preview-column',
                getFieldClassName(field),
            )}
        >
            {getShortText(value)}
        </TableCell>
    ) : (
        <TableCell
            sx={styles.cell(readonly)}
            className={classnames(
                'publication-preview-column',
                getFieldClassName(field),
            )}
        >
            {`${value}`}
        </TableCell>
    );

// @ts-expect-error TS7006
const mapStateToProps = (state, { field, line }) => {
    const getLineCol = fromFields.getLineColGetter(state, field);
    const parsedValue = parseValue(getLineCol(line));
    return {
        value:
            typeof parsedValue === 'object'
                ? JSON.stringify(parsedValue)
                : parsedValue,
    };
};

export default compose(
    translate,
    connect(mapStateToProps),
    // @ts-expect-error TS2345
)(ExcerptLineColComponent);
