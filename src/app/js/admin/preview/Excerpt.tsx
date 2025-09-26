import React from 'react';
import PropTypes from 'prop-types';
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
} from '@mui/material';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';
import ExcerptHeader from './ExcerptHeader';
import ExcerptRemoveColumn from './ExcerptRemoveColumn';
import ExcerptLine from './ExcerptLine';
import getFieldClassName from '../../lib/getFieldClassName';
import { URI_FIELD_NAME } from '../../../../common/uris';
import { translate } from '../../i18n/I18NContext';

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

export const ExcerptComponent = ({
    // @ts-expect-error TS7031
    colStyle,
    // @ts-expect-error TS7031
    areHeadersClickable,
    // @ts-expect-error TS7031
    columns,
    // @ts-expect-error TS7031
    lines,
    // @ts-expect-error TS7031
    onCellClick,
    // @ts-expect-error TS7031
    onHeaderClick,
    // @ts-expect-error TS7031
    p: polyglot,
    isPreview = false,
}) => (
    <TableContainer>
        <Table className="publication-excerpt" sx={styles.table(isPreview)}>
            <TableHead>
                <TableRow>
                    {/*
                     // @ts-expect-error TS7006 */}
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
                                    ? polyglot.t(
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
                        {/*
                         // @ts-expect-error TS7006 */}
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
                {/*
                 // @ts-expect-error TS7006 */}
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

ExcerptComponent.propTypes = {
    areHeadersClickable: PropTypes.bool.isRequired,
    columns: PropTypes.arrayOf(fieldPropTypes).isRequired,
    colStyle: PropTypes.object,
    isPreview: PropTypes.bool,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    onCellClick: PropTypes.func.isRequired,
    onHeaderClick: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    loadField: PropTypes.func,
};

ExcerptComponent.defaultProps = {
    colStyle: null,
};

export default compose(
    translate,
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
