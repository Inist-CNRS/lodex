import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import SparqlRequest from './SparqlRequest';
import { isURL } from '../../../../../common/uris.js';
import { CardText } from 'material-ui/Card';
import { field as fieldPropTypes } from '../../../propTypes';
import {
    Table,
    TableBody,
    TableHeader,
    TableRow,
    TableHeaderColumn,
    TableRowColumn,
} from 'material-ui/Table';
import Pagination from '../../../lib/components/Pagination';
import topairs from 'lodash.topairs';
import URL from 'url';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';

const perPage = 10;
let currentPage = 0;

const styles = {
    icon: {
        verticalAlign: 'bottom',
        width: '5%',
    },
    container: {
        display: 'block',
        width: '100%',
        color: 'lightGrey',
    },
    input: {
        fontSize: '0.7em',
        width: '95%',
        borderImage: 'none',
    },
};

export class sparqlText extends Component {
    handlePageChange = (currentPage, perPage) => { //eslint-disable-line
        //TODO make function to swith page
        // this.props.loadContributedResourcePage({
        //     page: currentPage,
        //     perPage,
        // });
    };

    render() {
        const { className, rawData, sparql, resource, field } = this.props;

        if (rawData != undefined) {
            const requestText =
                sparql.hostname + '?query=' + resource[field.name];
            return (
                <div className={className}>
                    <div style={styles.container}>
                        <IconButton style={styles.icon}>
                            <ActionSearch color="lightGrey" />
                        </IconButton>
                        <TextField
                            style={styles.input}
                            name="sparqlRequest"
                            value={requestText}
                        />
                    </div>
                    <CardText>
                        <Table>
                            <TableHeader
                                displaySelectAll={false}
                                adjustForCheckbox={false}
                            >
                                <TableRow>
                                    {rawData.head.vars.map((data, key) => (
                                        <TableHeaderColumn key={key}>
                                            {data}
                                        </TableHeaderColumn>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                {rawData.results.bindings.map((column, key) => (
                                    <TableRow key={key}>
                                        {topairs(column).map((line, key) => (
                                            <TableRowColumn key={key}>
                                                {line[1].value}
                                            </TableRowColumn>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Pagination
                            onChange={this.handlePageChange}
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
            return <span> </span>;
        }
    }
}

sparqlText.propTypes = {
    className: PropTypes.string,
    rawData: PropTypes.object,
    sparql: PropTypes.object,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

sparqlText.defaultProps = {
    className: null,
};

export default compose(
    translate,
    SparqlRequest(({ field, resource, sparql }) => {
        const value = resource[field.name];
        if (!value) {
            return null;
        }
        let constructURL = sparql.hostname;
        !constructURL.startsWith('http://') ||
        !constructURL.startsWith('https://')
            ? (constructURL = 'https://' + constructURL)
            : null;

        !constructURL.endsWith('?query=')
            ? (constructURL = constructURL + '?query=')
            : null;

        constructURL = constructURL + value.trim();
        constructURL = constructURL.replace(/LIMIT\s\d*/, ''); //remove LIMIT with her var
        constructURL = constructURL.replace(/OFFSET\s\d*/, ''); //remove OFFSER with her var
        const requestPagination =
            constructURL +
            ' OFFSET ' +
            perPage * currentPage +
            ' LIMIT ' +
            perPage;
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
