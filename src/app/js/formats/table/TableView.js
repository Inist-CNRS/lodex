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
    TablePagination,
    TableRow,
} from '@material-ui/core';

class TableView extends Component {
    constructor(props) {
        super(props);
        this.onPageChange = this.onPageChange.bind(this);
        this.state = {
            rowsPerPage: props.pageSize,
            page: 0,
        };
    }

    onPageChange(event, newPage) {
        this.setState({
            rowsPerPage: this.state.rowsPerPage,
            page: newPage,
        });
    }

    render() {
        const { data, pageSize, p } = this.props;

        const link = (id, url) => {
            if (isLocalURL(id))
                return <Link to={getResourceUri({ uri: id })}>{url}</Link>;
            else return <Link to={url}>{url}</Link>;
        };

        return (
            <TableContainer>
                <Table>
                    <TableBody>
                        {data
                            .slice(
                                this.state.page * this.state.rowsPerPage,
                                this.state.page * this.state.rowsPerPage +
                                    this.state.rowsPerPage,
                            )
                            .map((entry, index) => (
                                <TableRow key={`${index}-table`}>
                                    <TableCell>{entry.title}</TableCell>
                                    <TableCell>
                                        {link(entry.id, entry.url)}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                    <TableFooter>
                        <TablePagination
                            rowsPerPageOptions={[
                                pageSize,
                                pageSize * 2,
                                pageSize * 3,
                                { label: p.t('all'), value: -1 },
                            ]}
                            rowsPerPage={this.state.rowsPerPage}
                            count={data.length}
                            page={this.state.page}
                            onChangePage={this.onPageChange}
                            labelRowsPerPage={p.t('rows_per_page')}
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
