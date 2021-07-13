import React, { Component } from 'react';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../../propTypes';
import PropTypes from 'prop-types';
import {
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
} from '@material-ui/core';
import { getViewComponent } from '../../index';
import _ from 'lodash';

class AbstractTableView extends Component {
    static propTypes = {
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

    static mapStateToProps = (_, { formatData, spaceWidth }) => {
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

    constructor(props) {
        super(props);
        this.onChangePage = this.onChangePage.bind(this);
        this.onChangeRowsPerPage = this.onChangeRowsPerPage.bind(this);
        this.onSort = this.onSort.bind(this);
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

    onSort(columnId) {
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

    getCellInnerHtml(value, index, columnParameter) {
        const { name, option } = columnParameter.format;
        const { ViewComponent, args } = getViewComponent(
            columnParameter.format.name,
        );
        if (name === undefined || name === null)
            return (
                <TableCell>{_.get(value, columnParameter.field, '')}</TableCell>
            );
        return (
            <TableCell>
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
            </TableCell>
        );
    }

    getSortDirection(columnId) {
        if (columnId !== this.state.sortId) return false;
        return this.state.sort;
    }

    sortData(array, columnsParameters) {
        if (this.state.sort === false) return array;
        const sortedArray = _.sortBy(array, [
            o => {
                const parameter = _.findIndex(columnsParameters, {
                    id: this.state.sortId,
                });
                return _.get(o, columnsParameters[parameter].field, '');
            },
        ]);
        return this.state.sort === 'asc' ? sortedArray : _.reverse(sortedArray);
    }

    getTableHead(columnsParameters) {
        return (
            <TableHead>
                <TableRow>
                    {columnsParameters.map(column => (
                        <TableCell key={column.id}>
                            <TableSortLabel
                                active={
                                    this.getSortDirection(column.id) !== false
                                }
                                direction={
                                    this.getSortDirection(column.id) === false
                                        ? 'asc'
                                        : this.getSortDirection(column.id)
                                }
                                onClick={() => this.onSort(column.id)}
                            >
                                {column.title}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    getTableFooter(pageSize, dataTotal, polyglot) {
        return (
            <TableFooter>
                <TablePagination
                    rowsPerPageOptions={[
                        pageSize,
                        pageSize * 2,
                        pageSize * 3,
                        { label: polyglot.t('all'), value: dataTotal.length },
                    ]}
                    rowsPerPage={this.state.rowsPerPage}
                    count={dataTotal.length}
                    page={this.state.page}
                    onChangePage={this.onChangePage}
                    labelRowsPerPage={polyglot.t('rows_per_page')}
                    onChangeRowsPerPage={this.onChangeRowsPerPage}
                />
            </TableFooter>
        );
    }
}

export default AbstractTableView;
