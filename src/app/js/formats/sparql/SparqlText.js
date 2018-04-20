import React from 'react';
import PropTypes from 'prop-types';
import { field as fieldPropTypes } from '../../propTypes';
//import getLabel from '../shared/getLabel';

const sparqlText = ({ className /*, field, resource*/ }) => {
    //const value = resource[field.name];
    const value =
        'PREFIX bibo: <http://purl.org/ontology/bibo/> SELECT count(?doi) FROM <https://inist-category.data.istex.fr/notice/graph> WHERE { ?subject bibo:doi ?doi }';
    const rawData = 'https://data.istex.fr/sparql/?query=' + value.trim();
    return (
        <div>
            <p className={className}> {rawData} </p>
        </div>
    );
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
