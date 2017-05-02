import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { spring } from 'react-motion';
import Transition from 'react-motion-ui-pack';

import { Table, TableBody, TableHeader, TableRow } from 'material-ui/Table';

import { addField } from '../../fields';
import ParsingExcerptAddColumn from './ParsingExcerptAddColumn';
import ParsingExcerptColumn from './ParsingExcerptColumn';
import ParsingExcerptHeaderColumn from './ParsingExcerptHeaderColumn';

const styles = {
    table: {
        display: 'block',
        overflowX: 'auto',
        width: 'auto',
        borderLeft: '1px solid rgb(224, 224, 224)',
    },
    body: {
        position: 'relative',
    },
};

export const getRowStyle = (index, total) => {
    let opacity = 1;

    if (index === (total - 2)) {
        opacity = 0.45;
    }

    if (index === (total - 1)) {
        opacity = 0.25;
    }

    return { opacity, height: 36 };
};

export const ParsingExcerptComponent = ({
    columns,
    handleAddColumn,
    lines,
    showAddColumns,
}) => {
    const total = lines.length;

    return (
        <Table selectable={false} fixedHeader={false} style={styles.table}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                    {columns.map(column => (
                        <ParsingExcerptHeaderColumn
                            key={`header_${column}`}
                            column={column}
                        />
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody style={styles.body} displayRowCheckbox={false}>
                {lines.map((line, index) => (
                    <TableRow
                        displayBorder={false}
                        key={`${line._id}_data_row`}
                        style={getRowStyle(index, total)}
                    >
                        {columns.map(c => (
                            <ParsingExcerptColumn
                                key={`${c}_${line._id}`}
                                value={line[c]}
                            >
                                <Transition
                                    component={false}
                                    enter={{
                                        opacity: spring(1),
                                    }}
                                    leave={{
                                        opacity: 0,
                                    }}
                                    runOnMount
                                >
                                    {showAddColumns && index === total - 3 &&
                                        <ParsingExcerptAddColumn
                                            key={`add_column_${c}`}
                                            name={c}
                                            onAddColumn={handleAddColumn}
                                        />
                                    }
                                </Transition>
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
    handleAddColumn: PropTypes.func.isRequired,
    showAddColumns: PropTypes.bool.isRequired,
};

const mapDispatchToProps = ({
    handleAddColumn: addField,
});

export default compose(
    connect(undefined, mapDispatchToProps),
    pure,
)(ParsingExcerptComponent);
