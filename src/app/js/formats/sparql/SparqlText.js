import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import injectData from '../injectData';
import { isURL } from '../../../../common/uris.js';
import Loading from '../../lib/components/Loading';
import { CardText } from 'material-ui/Card';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    Table,
    TableBody,
    TableHeader,
    TableRow,
    TableHeaderColumn,
    TableRowColumn,
} from 'material-ui/Table';
// import Pagination from '../../lib/components/Pagination';
import topairs from 'lodash.topairs';
import URL from 'url';

const sparqlText = (props, className) => {
    // const { total, currentPage, p: polyglot } = this.props;
    if (props.formatData != undefined) { //eslint-disable-line
        return (
            <div className={className}>
                <CardText>
                    <Table>
                        <TableHeader
                            displaySelectAll={false}
                            adjustForCheckbox={false}
                        >
                            <TableRow>
                                {props.formatData.head.vars.map((data , key) => ( //eslint-disable-line
                                    <TableHeaderColumn key={key}>
                                        {data}
                                    </TableHeaderColumn>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {props.formatData.results.bindings.map( //eslint-disable-line
                                (column, key) => (
                                    <TableRow key={key}>
                                        {topairs(column).map((line, key) => (
                                            <TableRowColumn key={key}>
                                                {line[1].value}
                                            </TableRowColumn>
                                        ))}
                                    </TableRow>
                                ),
                            )}
                        </TableBody>
                    </Table>
                </CardText>
            </div>
        );
    } else {
        return <Loading>loading</Loading>;
    }
};

sparqlText.propTypes = {
    className: PropTypes.string,
    p: polyglotPropTypes.isRequired,
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

        if (isURL(request)) {
            const source = URL.parse(request);
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
