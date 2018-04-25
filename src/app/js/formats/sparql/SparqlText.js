import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import injectData from '../injectData';
import { isURL } from '../../../../common/uris.js';
import Loading from '../../lib/components/Loading';
import { CardText } from 'material-ui/Card';
// import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    Table,
    TableBody,
    TableHeader,
    TableRow,
    TableHeaderColumn,
    TableRowColumn,
} from 'material-ui/Table';
import Pagination from '../../lib/components/Pagination';
import topairs from 'lodash.topairs';
import URL from 'url';

export class sparqlText extends Component {
    handlePageChange = (currentPage, perPage) => { //eslint-disable-line
        //TODO make function to swith page
        // this.props.loadContributedResourcePage({
        //     page: currentPage,
        //     perPage,
        // });
    };

    render() {
        const { className, formatData } = this.props;

        if (formatData != undefined) {
            let total = formatData.results.bindings.length;
            let perPage = 2;
            let currentPage = 0;

            return (
                <div className={className}>
                    <CardText>
                        <Table>
                            <TableHeader
                                displaySelectAll={false}
                                adjustForCheckbox={false}
                            >
                                <TableRow>
                                    {formatData.head.vars.map((data, key) => (
                                        <TableHeaderColumn key={key}>
                                            {data}
                                        </TableHeaderColumn>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                {formatData.results.bindings.map(
                                    (column, key) => (
                                        <TableRow key={key}>
                                            {topairs(column).map(
                                                (line, key) => (
                                                    <TableRowColumn key={key}>
                                                        {line[1].value}
                                                    </TableRowColumn>
                                                ),
                                            )}
                                        </TableRow>
                                    ),
                                )}
                            </TableBody>
                        </Table>
                        <Pagination
                            onChange={this.handlePageChange}
                            total={total}
                            perPage={perPage}
                            currentPage={currentPage}
                            texts={{
                                page: 'page',
                                perPage: 'perPage',
                                showing: 'showing',
                            }}
                        />
                    </CardText>
                </div>
            );
        } else {
            return <Loading>Loading</Loading>;
        }
    }
}

sparqlText.propTypes = {
    className: PropTypes.string,
    formatData: PropTypes.object,
    // p: polyglotPropTypes.isRequired,
};

sparqlText.defaultProps = {
    className: null,
};

export default compose(
    translate,
    injectData(({ field, resource }) => {
        const value = resource[field.name];
        if (!value) {
            return null;
        }
        const request = 'https://data.istex.fr/sparql/?query=' + value.trim();
        const removeLimit = request.replace(/LIMIT\s\d*/, ''); //remove LIMIT with her var
        const removeOffset = removeLimit.replace(/OFFSET\s\d*/, ''); //remove LIMIT with her var
        const requestPagination = removeOffset + ' OFFSET ' + 2 + ' LIMIT ' + 3;
        if (isURL(requestPagination)) {
            const source = URL.parse(requestPagination);
            const target = {
                protocol: source.protocol,
                hostname: source.hostname,
                slashes: source.slashes,
                pathname: source.pathname,
                search: source.search,
            };
            return URL.format(target);
        }
        return null;
    }),
)(sparqlText);
