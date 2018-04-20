import React from 'react';
import PropTypes from 'prop-types';
import { field as fieldPropTypes } from '../../propTypes';
//import getLabel from '../shared/getLabel';

const sparqlText = ({ className, field, resource }) => {
    const value = resource[field.name];
    const rawData = value;
    //console.log(value);
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
