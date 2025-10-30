import { Component } from 'react';
import {
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
} from '@mui/material';
import { getViewComponent } from '../../../index';
import _ from 'lodash';
import type { Field } from '../../../../fields/types';

interface AbstractTableViewProps {
    field: Field;
    data: object[];
    total: number;
    pageSize: number;
    p: unknown;
    columnsParameters: {
        id: number;
        title: string;
        field: string;
        format: {
            name: string;
            option: any;
        };
    }[];
}

class AbstractTableView extends Component<AbstractTableViewProps> {
    // @ts-expect-error TS7006
    static mapStateToProps = (_, { formatData, formatTotal, spaceWidth }) => {
        if (!formatData) {
            return {
                data: [],
                total: 0,
            };
        }

        if (formatData.items) {
            return {
                data: formatData.items,
                total: formatData.total,
                spaceWidth,
            };
        }

        if (Array.isArray(formatData)) {
            return {
                data: formatData,
                total: formatTotal || formatData.length,
                spaceWidth,
            };
        }

        return {
            data: [],
            total: 0,
        };
    };

    // @ts-expect-error TS7006
    constructor(props) {
        super(props);
        this.onChangePage = this.onChangePage.bind(this);
        this.onChangeRowsPerPage = this.onChangeRowsPerPage.bind(this);
        this.onSort = this.onSort.bind(this);
        this.state = {
            rowsPerPage: props.pageSize,
            page: 0,
            sortId: undefined,
            sortOn: undefined,
            sort: false,
        };
    }

    UNSAFE_componentWillMount() {
        if (this.props.columnsParameters.length >= 1) {
            this.onSort(this.props.columnsParameters[0]);
        }
    }

    // @ts-expect-error TS7006
    onStateChange(state) {
        this.setState(state);
    }

    // @ts-expect-error TS7006
    onChangePage(event, newPage) {
        const newState = {
            ...this.state,
            page: newPage,
        };

        this.onStateChange(newState);
    }

    // @ts-expect-error TS7006
    onChangeRowsPerPage(event) {
        const newState = {
            ...this.state,
            rowsPerPage: parseInt(event.target.value, 10),
        };

        this.onStateChange(newState);
    }

    // @ts-expect-error TS7006
    onSort(column) {
        const columnId = column.id;
        const columnField = column.field;
        // @ts-expect-error TS2339
        let sort = this.state.sort;
        // @ts-expect-error TS2339
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
        const newState = {
            ...this.state,
            sortId: columnId,
            sortOn: columnField,
            sort: sort,
        };

        this.onStateChange(newState);
    }

    // @ts-expect-error TS7006
    getCellInnerHtml(value, index, columnParameter) {
        const { name, option } = columnParameter.format;
        // @ts-expect-error TS2554
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

    // @ts-expect-error TS7006
    getSortDirection(columnId) {
        // @ts-expect-error TS2339
        if (columnId !== this.state.sortId) return false;
        // @ts-expect-error TS2339
        return this.state.sort;
    }

    // @ts-expect-error TS7006
    sortData(array, columnsParameters) {
        // @ts-expect-error TS2339
        if (this.state.sort === false) return array;
        const sortedArray = _.sortBy(array, [
            (o) => {
                const parameter = _.findIndex(columnsParameters, {
                    // @ts-expect-error TS2339
                    id: this.state.sortId,
                });
                return _.get(o, columnsParameters[parameter].field, '');
            },
        ]);
        // @ts-expect-error TS2339
        return this.state.sort === 'asc' ? sortedArray : _.reverse(sortedArray);
    }

    // @ts-expect-error TS7006
    getTableHead(columnsParameters) {
        return (
            <TableHead>
                <TableRow>
                    {/*
                     // @ts-expect-error TS7006 */}
                    {columnsParameters.map((column) => (
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
                                onClick={() => this.onSort(column)}
                            >
                                {column.title}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    // @ts-expect-error TS7006
    getTableFooter(pageSize, dataTotal, polyglot) {
        // @ts-expect-error TS7031
        const labelDisplayedRows = ({ from, to, count }) =>
            polyglot
                .t('showing')
                .replace('{total}', count)
                .replace('{from}', from)
                .replace('{to}', to);
        return (
            <TableFooter>
                {/*
                 // @ts-expect-error TS2769 */}
                <TablePagination
                    rowsPerPageOptions={[
                        pageSize,
                        pageSize * 2,
                        pageSize * 3,
                        { label: polyglot.t('all'), value: dataTotal },
                    ]}
                    // @ts-expect-error TS2339
                    rowsPerPage={this.state.rowsPerPage}
                    count={dataTotal}
                    // @ts-expect-error TS2339
                    page={this.state.page}
                    onPageChange={this.onChangePage}
                    onRowsPerPageChange={this.onChangeRowsPerPage}
                    labelRowsPerPage={polyglot.t('rows_per_page')}
                    backIconButtonText={polyglot.t('previous')}
                    nextIconButtonText={polyglot.t('next')}
                    labelDisplayedRows={labelDisplayedRows}
                />
            </TableFooter>
        );
    }
}

export default AbstractTableView;
