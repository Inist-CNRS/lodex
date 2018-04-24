import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import injectData from '../injectData';
import { isURL } from '../../../../common/uris.js';
import {
    Table,
    TableBody,
    TableHeader,
    TableRow,
    TableHeaderColumn,
    TableRowColumn,
} from 'material-ui/Table';
import topairs from 'lodash.topairs';
import URL from 'url';

const sparqlText = (props, { className }) => {
    if (props.formatData != undefined) { //eslint-disable-line
        return (
            <div className={className}>
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
            </div>
        );
    } else {
        return <div>loading</div>;
    }
};

sparqlText.propTypes = {
    className: PropTypes.string,
};

sparqlText.defaultProps = {
    className: null,
};

export default compose(
    translate,
    injectData(({ field, resource }) => {
        const TODOvalue = resource[field.name]; // eslint-disable-line
        const value =
            'PREFIX bibo: <http://purl.org/ontology/bibo/> SELECT count(?doi) FROM <https://inist-category.data.istex.fr/notice/graph> WHERE { ?subject bibo:doi ?doi }';

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
