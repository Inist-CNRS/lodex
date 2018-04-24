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

const sparqlText = ({ className }) => {
    const rawData = {
        head: {
            link: [],
            vars: ['subject', 'doi'],
        },
        results: {
            distinct: false,
            ordered: true,
            bindings: [
                {
                    subject: {
                        type: 'uri',
                        value: 'https://api.istex.fr/ark:/67375/WNG-QJ1T66J4-C',
                    },
                    doi: {
                        type: 'literal',
                        value:
                            '10.1002/(SICI)1097-4628(19960425)60:4<579::AID-APP11>3.0.CO;2-V-1',
                    },
                },
                {
                    subject: {
                        type: 'uri',
                        value: 'https://api.istex.fr/ark:/67375/WNG-QJ1T66J4-C',
                    },
                    doi: {
                        type: 'literal',
                        value:
                            '10.1002/(SICI)1097-4628(19960425)60:4<579::AID-APP11>3.0.CO;2-V-2',
                    },
                },
                {
                    subject: {
                        type: 'uri',
                        value: 'https://api.istex.fr/ark:/67375/WNG-QJ1T66J4-C',
                    },
                    doi: {
                        type: 'literal',
                        value:
                            '10.1002/(SICI)1097-4628(19960425)60:4<579::AID-APP11>3.0.CO;2-V-3',
                    },
                },
                {
                    subject: {
                        type: 'uri',
                        value: 'https://api.istex.fr/ark:/67375/WNG-QJ1T66J4-C',
                    },
                    doi: {
                        type: 'literal',
                        value:
                            '10.1002/(SICI)1097-4628(19960425)60:4<579::AID-APP11>3.0.CO;2-V-4',
                    },
                },
            ],
        },
    };
    return (
        <div className={className}>
            <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        {rawData.head.vars.map(data => (
                            <TableHeaderColumn key={data}>
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
        </div>
    );
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
