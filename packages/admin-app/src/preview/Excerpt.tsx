import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withProps from 'recompose/withProps';
import withHandlers from 'recompose/withHandlers';
import memoize from 'lodash/memoize';
import {
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    TableContainer,
    type SxProps,
} from '@mui/material';

import ExcerptHeader from './ExcerptHeader';
import ExcerptRemoveColumn from './ExcerptRemoveColumn';
import ExcerptLine from './ExcerptLine';
import getFieldClassName from '../../../../src/app/js/lib/getFieldClassName';
import { URI_FIELD_NAME } from '@lodex/common';
import { useTranslate } from '../../../../src/app/js/i18n/I18NContext';

const styles = {
    header: {
        cursor: 'pointer',
    },
    table: memoize((separated) => ({
        display: separated ? 'block' : 'table',
        overflowX: 'auto',
        width: 'auto',
        minWidth: separated ? '150px' : '100%',
        border: separated ? 'none' : '1px solid rgb(224, 224, 224)',
    })),
};

const getColStyle = memoize((style) => ({ ...styles.header, ...style }));

interface ExcerptComponentProps {
    areHeadersClickable: boolean;
    columns: {
        _id: string;
        name: string;
    }[];
    colStyle?: SxProps;
    isPreview?: boolean;
    lines: {
        uri: string;
    }[];
    onCellClick(...args: unknown[]): unknown;
    onHeaderClick(...args: unknown[]): unknown;
    loadField?(...args: unknown[]): unknown;
}

export const ExcerptComponent = ({
    colStyle,
    areHeadersClickable,
    columns,
    lines,
    onCellClick,
    onHeaderClick,
    isPreview = false,
}: ExcerptComponentProps) => {
    const { translate } = useTranslate();
    return (
        <TableContainer>
            <Table className="publication-excerpt" sx={styles.table(isPreview)}>
                <TableHead>
                    <TableRow>
                        {columns.map((field) => (
                            <TableCell
                                key={field.name}
                                className={`publication-excerpt-column publication-excerpt-column-${getFieldClassName(
                                    field,
                                )}`}
                                sx={getColStyle({
                                    ...(areHeadersClickable
                                        ? {}
                                        : { cursor: 'default' }),
                                    ...colStyle,
                                })}
                                onClick={() =>
                                    field.name !== URI_FIELD_NAME &&
                                    onHeaderClick(field.name)
                                }
                                // @ts-expect-error TS2322
                                tooltip={
                                    areHeadersClickable
                                        ? translate(
                                              'click_to_edit_publication_field',
                                          )
                                        : ''
                                }
                            >
                                {/*
                             // @ts-expect-error TS2322 */}
                                <ExcerptHeader field={field} />
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {areHeadersClickable && (
                        <TableRow>
                            {columns.map((c) => (
                                <ExcerptRemoveColumn
                                    key={`remove_column_${c._id}`}
                                    // @ts-expect-error TS2322
                                    field={c}
                                    onClick={onCellClick}
                                />
                            ))}
                        </TableRow>
                    )}
                    {lines.map((line, index) => (
                        <ExcerptLine
                            key={line ? `${line.uri}-${index}` : index}
                            line={line}
                            columns={columns}
                            readonly
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default compose(
    pure,
    // @ts-expect-error TS7031
    withProps(({ onHeaderClick }) => ({
        areHeadersClickable: typeof onHeaderClick === 'function',
    })),
    withHandlers({
        // @ts-expect-error TS2322
        onHeaderClick:
            ({ onHeaderClick }) =>
            // @ts-expect-error TS7006
            (col) => {
                if (onHeaderClick) {
                    onHeaderClick(col);
                }
            },
        // @ts-expect-error TS2322
        onCellClick:
            ({ onHeaderClick }) =>
            // @ts-expect-error TS7006
            (col) => {
                if (onHeaderClick) {
                    onHeaderClick(col);
                }
            },
    }),
    // @ts-expect-error TS2345
)(ExcerptComponent);
