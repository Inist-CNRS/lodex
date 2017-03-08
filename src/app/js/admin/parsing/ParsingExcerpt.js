import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';

import ParsingExcerptColumn from './ParsingExcerptColumn';
import ParsingExcerptAddColumn from './ParsingExcerptAddColumn';

const styles = {
    table: {
        width: 'auto',
    },
    wrapper: {
        overflowX: 'auto',
    },
    body: {
        position: 'relative',
    },
};

export const getRowStyle = (index, total) => {
    let borderBottom = '1px solid rgb(224, 224, 224)';
    let opacity = 1;

    if (index === (total - 2)) {
        borderBottom = '1px solid rgba(224, 224, 224, 0.25)';
        opacity = 0.25;
    }

    if (index === (total - 1)) {
        borderBottom = '1px solid rgba(224, 224, 224, 0.1)';
        opacity = 0.1;
    }

    return { borderBottom, opacity };
};

export const ParsingExcerptComponent = ({ columns, lines }) => {
    const total = lines.length;

    return (
        <Table selectable={false} fixedHeader={false} bodyStyle={styles.wrapper} style={styles.table}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                    {columns.map(c => <TableHeaderColumn key={`header_${c}`}>{c}</TableHeaderColumn>)}
                </TableRow>
            </TableHeader>
            <TableBody style={styles.body} displayRowCheckbox={false}>
                {lines.map((line, index) => (
                    <TableRow
                        key={`${line._id}_data_row`}
                        style={getRowStyle(index, total)}
                    >
                        {columns.map(c => (
                            <ParsingExcerptColumn
                                key={`${c}_${line._id}`}
                                value={line[c]}
                            >
                                {index === total - 3 &&
                                    <ParsingExcerptAddColumn key={`add_column_${c}`} name={c} />
                                }
                            </ParsingExcerptColumn>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

ParsingExcerptComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default compose(
    pure,
)(ParsingExcerptComponent);
