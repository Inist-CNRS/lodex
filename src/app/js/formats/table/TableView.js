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
import { getResourceUri, isLocalURL } from '../../../../common/uris';
import Link from '../../lib/components/Link';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
} from '@material-ui/core';
import _ from 'lodash';
import { getViewComponent } from '../index';

class TableView extends Component {
    constructor(props) {
        super(props);
        this.onChangePage = this.onChangePage.bind(this);
        this.onChangeRowsPerPage = this.onChangeRowsPerPage.bind(this);
        this.state = {
            rowsPerPage: props.pageSize,
            page: 0,
        };
    }

    onChangePage(event, newPage) {
        this.setState({
            rowsPerPage: this.state.rowsPerPage,
            page: newPage,
        });
    }

    onChangeRowsPerPage(event) {
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: this.state.page,
        });
    }

    render() {
        const { data, pageSize, p, columnsParameters } = this.props;

        // const link = (id, url) => {
        //     if (isLocalURL(id))
        //         return <Link to={getResourceUri({ uri: id })}>{url}</Link>;
        //     else return <Link to={url}>{url}</Link>;
        // };

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
            //
            // return columnParameter.type === 'text' ? (
            //     <TableCell>{_.get(entry, columnParameter.field, '')}</TableCell>
            // ) : (
            //     <TableCell>
            //         {link(entry.id, _.get(entry, columnParameter.field, ''))}
            //     </TableCell>
            // );
        };

        return (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columnsParameters.map(column => (
                                <TableCell key={column.id}>
                                    {column.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data
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
    injectData(null, field => !!field),
    connect(mapStateToProps),
    translate,
)(TableView);
