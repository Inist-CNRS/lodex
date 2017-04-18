import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withProps from 'recompose/withProps';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import memoize from 'lodash.memoize';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';

import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../propTypes';
import ExcerptHeader from './ExcerptHeader';
import ExcerptRemoveColumn from './ExcerptRemoveColumn';
import ExcerptLine from './ExcerptLine';
import getFieldClassName from '../../lib/getFieldClassName';

const styles = {
    header: {
        cursor: 'pointer',
    },
    table: memoize(separated => ({
        display: 'block',
        overflowX: 'auto',
        width: 'auto',
        borderLeft: separated ? 'none' : '1px solid rgb(224, 224, 224)',
    })),
    cell: {
        cursor: 'pointer',
    },
};

const getColStyle = memoize(style => Object.assign(styles.header, style));

export const ExcerptComponent = ({
    colStyle,
    areHeadersClickable,
    className,
    columns,
    lines,
    onCellClick,
    onHeaderClick,
    p: polyglot,
    isPreview = false,
}) => (
    <Table
        className={className}
        selectable={false}
        fixedHeader={false}
        style={styles.table(isPreview)}
        onCellClick={onCellClick}
    >
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow onCellClick={onHeaderClick}>
                {columns.map(field => (
                    <TableHeaderColumn
                        key={field.name}
                        className={
                            `publication-excerpt-column publication-excerpt-column-${
                                getFieldClassName(field)
                            }`
                        }
                        style={getColStyle(colStyle)}
                        tooltip={areHeadersClickable ? polyglot.t('click_to_edit_publication_field') : ''}
                    >
                        <ExcerptHeader field={field} />
                    </TableHeaderColumn>))}
            </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
            {lines.map((line, index) => (
                <ExcerptLine key={`${line.uri}-${index}` || index} line={line} columns={columns} />
            ))}
            {areHeadersClickable &&
                <TableRow>
                    {columns.map(c => (
                        <ExcerptRemoveColumn key={`remove_column_${c}`} field={c} />
                    ))}
                </TableRow>
            }
        </TableBody>
    </Table>
);

ExcerptComponent.propTypes = {
    areHeadersClickable: PropTypes.bool.isRequired,
    className: PropTypes.string,
    columns: PropTypes.arrayOf(fieldPropTypes).isRequired,
    colStyle: PropTypes.object, // eslint-disable-line
    isPreview: PropTypes.bool, // eslint-disable-line
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    onCellClick: PropTypes.func.isRequired,
    onHeaderClick: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
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
        onHeaderClick: ({ onHeaderClick }) => (_, __, col) => {
            if (onHeaderClick) {
                onHeaderClick(col - 1);
            }
        },
        onCellClick: ({ onHeaderClick }) => (_, col) => {
            if (onHeaderClick) {
                onHeaderClick(col - 1);
            }
        },
    }),
)(ExcerptComponent);
