import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/pure';
import { spring } from 'react-motion';
import Transition from 'react-motion-ui-pack';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';

import { addField } from '../fields';
import ParsingExcerptColumn from './ParsingExcerptColumn';
import ParsingExcerptAddColumn from './ParsingExcerptAddColumn';
import ActionButton from './ActionButton';

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
    handleShowExistingColumns,
    handleHideExistingColumns,
    lines,
    showAddColumns,
}) => {
    const total = lines.length;

    return (
        <div>
            <Table selectable={false} fixedHeader={false} bodyStyle={styles.wrapper} style={styles.table}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        {columns.map(c => <TableHeaderColumn key={`header_${c}`}>{c}</TableHeaderColumn>)}
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
                                        appear={{
                                            opacity: 0,
                                            translateX: 1000,
                                        }}
                                        enter={{
                                            opacity: spring(1),
                                            translateX: spring(0),
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
            <ActionButton
                onAddNewColumn={handleAddColumn}
                onShowExistingColumns={handleShowExistingColumns}
                onHideExistingColumns={handleHideExistingColumns}
            />
        </div>
    );
};

ParsingExcerptComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleAddColumn: PropTypes.func.isRequired,
    handleShowExistingColumns: PropTypes.func.isRequired,
    handleHideExistingColumns: PropTypes.func.isRequired,
    showAddColumns: PropTypes.bool.isRequired,
};

const mapDispatchToProps = ({
    handleAddColumn: addField,
});

export default compose(
    connect(null, mapDispatchToProps),
    withState('showAddColumns', 'setShowAddColumns', false),
    withHandlers({
        handleShowExistingColumns: ({ setShowAddColumns }) => () => {
            setShowAddColumns(true);
        },
        handleHideExistingColumns: ({ setShowAddColumns }) => () => {
            setShowAddColumns(false);
        },
    }),
    pure,
)(ParsingExcerptComponent);
