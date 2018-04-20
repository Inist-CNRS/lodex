import React from 'react';
import PropTypes from 'prop-types';
import { field as fieldPropTypes } from '../../propTypes';
import {
    Table,
    TableBody,
    TableHeader,
    TableRow,
    TableHeaderColumn,
    TableRowColumn,
} from 'material-ui/Table';
import axios from 'axios';

const sparqlText = ({ className, field, resource }) => { // eslint-disable-line
    //const value = resource[field.name];
    const value =
        'PREFIX bibo: <http://purl.org/ontology/bibo/> SELECT count(?doi) FROM <https://inist-category.data.istex.fr/notice/graph> WHERE { ?subject bibo:doi ?doi }';
    const url = 'https://data.istex.fr/sparql/?query=' + value.trim();// eslint-disable-line
    // const rawData = await getData(url);
    const rawData = { // eslint-disable-line
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
                            '10.1002/(SICI)1097-4628(19960425)60:4<579::AID-APP11>3.0.CO;2-V',
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
                            '10.1002/(SICI)1097-4628(19960425)60:4<579::AID-APP11>3.0.CO;2-V',
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
                            '10.1002/(SICI)1097-4628(19960425)60:4<579::AID-APP11>3.0.CO;2-V',
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
                            '10.1002/(SICI)1097-4628(19960425)60:4<579::AID-APP11>3.0.CO;2-V',
                    },
                },
            ],
        },
    };
    //console.log(JSON.stringify(await getData(url))); // eslint-disable-line
    //{rawData} <p> {rawData.head.vars[0]} </p>
    return (
        <div className={className}>
            tu m emmerde JSX
            <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>tata</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    <TableRow>
                        <TableRowColumn>TTO</TableRowColumn>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};

const getData = async url => {// eslint-disable-line
    let data;
    await axios
        .get(url)
        .then(function(response) {
            data = response.data;
        })
        .catch(function(error) {
            data = error;
        });
    return data;
};

sparqlText.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

sparqlText.defaultProps = {
    className: null,
};

export default sparqlText;
