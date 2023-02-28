import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withProps from 'recompose/withProps';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import memoize from 'lodash.memoize';
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

const styles = {
    header: {
        cursor: 'pointer',
    },
    table: memoize(separated => ({
        display: separated ? 'block' : 'table',
        overflowX: 'auto',
        width: 'auto',
        minWidth: separated ? '150px' : '100%',
        border: separated ? 'none' : '1px solid rgb(224, 224, 224)',
    })),
};

const getColStyle = memoize(style => ({ ...styles.header, ...style }));

export const ExcerptComponent = ({
    colStyle,
    areHeadersClickable,
    columns,
    lines,
    onCellClick,
    onHeaderClick,
    p: polyglot,
    isPreview = false,
}) => (
    <TableContainer>
        <Table sx={styles.table(isPreview)}>
            <TableHead>
                <TableRow>
                    {columns.map(field => (
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
                            tooltip={
                                areHeadersClickable
                                    ? polyglot.t(
                                          'click_to_edit_publication_field',
                                      )
                                    : ''
                            }
                        >
                            <ExcerptHeader field={field} />
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {areHeadersClickable && (
                    <TableRow>
                        {columns.map(c => (
                            <ExcerptRemoveColumn
                                key={`remove_column_${c._id}`}
                                field={c}
                                onClick={onCellClick}
                            />
                        ))}
                    </TableRow>
                )}
                {lines.map((line, index) => (
                    <ExcerptLine
                        key={`${line.uri}-${index}` || index}
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
    className: 'publication-excerpt',
    colStyle: null,
};

export default compose(
    translate,
    pure,
    withProps(({ onHeaderClick }) => ({
        areHeadersClickable: typeof onHeaderClick === 'function',
    })),
    withHandlers({
        onHeaderClick: ({ onHeaderClick }) => col => {
            if (onHeaderClick) {
                onHeaderClick(col);
            }
        },
        onCellClick: ({ onHeaderClick }) => col => {
            if (onHeaderClick) {
                onHeaderClick(col);
            }
        },
    }),
)(ExcerptComponent);
