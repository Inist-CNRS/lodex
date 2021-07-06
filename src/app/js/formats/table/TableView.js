import React, { Component } from 'react';
import compose from 'recompose/compose';
import injectData from '../injectData';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import PropTypes from 'prop-types';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
} from '@material-ui/core';
import { getViewComponent } from '../index';
import _ from 'lodash';

class TableView extends Component {
    constructor(props) {
        super(props);
        this.onChangePage = this.onChangePage.bind(this);
        this.onChangeRowsPerPage = this.onChangeRowsPerPage.bind(this);
        this.sort = this.sort.bind(this);
        this.state = {
            rowsPerPage: props.pageSize,
            page: 0,
            sortId: undefined,
            sort: false,
        };
    }

    onChangePage(event, newPage) {
        this.setState({
            ...this.state,
            page: newPage,
        });
    }

    onChangeRowsPerPage(event) {
        this.setState({
            ...this.state,
            rowsPerPage: parseInt(event.target.value, 10),
        });
    }

    sort(columnId) {
        let sort = this.state.sort;
        if (columnId === this.state.sortId) {
            switch (sort) {
                case 'asc':
                    sort = 'desc';
                    break;
                default:
                    sort = 'asc';
                    break;
            }
        } else {
            sort = 'asc';
        }
        this.setState({
            ...this.state,
            sortId: columnId,
            sort: sort,
        });
    }

    render() {
        const { data, pageSize, p, columnsParameters } = this.props;

        const buildColumn = (value, index, columnParameter) => {
            const { name, option } = columnParameter.format;
            const { ViewComponent, args } = getViewComponent(
                columnParameter.format.name,
            );

            return (
                <TableCell>
                    {name ? (
                        <ViewComponent
                            resource={value}
                            field={{
                                name: columnParameter.field,
                                valueOfList: value,
                                format: {
                                    name: name,
                                    args: option,
                                },
                            }}
                            {...args}
                            {...option}
                        />
                    ) : (
                        'Error'
                    )}
                </TableCell>
            );
        };

        const getSortDirection = columnId => {
            if (columnId !== this.state.sortId) return false;
            return this.state.sort;
        };

        const sortElement = array => {
            if (this.state.sort === false) return array;
            const sortedArray = _.sortBy(array, [
                o => {
                    const parameter = _.findIndex(columnsParameters, {
                        id: this.state.sortId,
                    });
                    return _.get(o, columnsParameters[parameter].field, '');
                },
            ]);
            return this.state.sort === 'asc'
                ? sortedArray
                : _.reverse(sortedArray);
        };

        return (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columnsParameters.map(column => (
                                <TableCell key={column.id}>
                                    <TableSortLabel
                                        active={
                                            getSortDirection(column.id) !==
                                            false
                                        }
                                        direction={
                                            getSortDirection(column.id) ===
                                            false
                                                ? 'asc'
                                                : getSortDirection(column.id)
                                        }
                                        onClick={() => this.sort(column.id)}
                                    >
                                        {column.title}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortElement(data)
                            .slice(
                                this.state.page * this.state.rowsPerPage,
                                this.state.page * this.state.rowsPerPage +
                                    this.state.rowsPerPage,
                            )
                            .map((entry, index) => (
                                <TableRow key={`${index}-table`}>
                                    {columnsParameters.map(column =>
                                        buildColumn(entry, index, column),
                                    )}
                                </TableRow>
                            ))}
                    </TableBody>
                    <TableFooter>
                        <TablePagination
                            rowsPerPageOptions={[
                                pageSize,
                                pageSize * 2,
                                pageSize * 3,
                                { label: p.t('all'), value: data.length },
                            ]}
                            rowsPerPage={this.state.rowsPerPage}
                            count={data.length}
                            page={this.state.page}
                            onChangePage={this.onChangePage}
                            labelRowsPerPage={p.t('rows_per_page')}
                            onChangeRowsPerPage={this.onChangeRowsPerPage}
                        />
                    </TableFooter>
                </Table>
            </TableContainer>
        );
    }
}

TableView.propTypes = {
    field: fieldPropTypes.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    p: polyglotPropTypes.isRequired,
    columnsParameters: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            field: PropTypes.string.isRequired,
            format: PropTypes.shape({
                name: PropTypes.string.isRequired,
                option: PropTypes.any.isRequired,
            }).isRequired,
        }),
    ).isRequired,
};

const mapStateToProps = (_, { formatData, spaceWidth }) => {
    if (!formatData || !formatData.items) {
        return {
            data: [],
            total: 0,
        };
    }

    return {
        data: formatData.items,
        total: formatData.total,
        spaceWidth,
    };
};

export default compose(
    injectData(null, field => !!field, true),
    connect(mapStateToProps),
    translate,
)(TableView);
