import React from 'react';
import PropTypes from 'prop-types';
import { field as fieldPropTypes } from '../../propTypes';
import axios from 'axios';

const sparqlText = async ({ className, field, resource }) => {
    const Tvalue = resource[field.name]; // eslint-disable-line
    const value =
        'PREFIX bibo: <http://purl.org/ontology/bibo/> SELECT count(?doi) FROM <https://inist-category.data.istex.fr/notice/graph> WHERE { ?subject bibo:doi ?doi }';
    const url = 'https://data.istex.fr/sparql/?query=' + value.trim();
    const rawData = await getData(url);
    console.log(rawData); // eslint-disable-line
    //{rawData} <p> {rawData.head.vars[0]} </p>

    return (
        <div className={className}>
            <p>{url}</p>
        </div>
    );
};

const getData = async url => {
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
