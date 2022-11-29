import React from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const returnParsedValue = value => {
    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
};

const isPrimitive = value => {
    return value !== Object(value);
};

const ParsingEditCell = ({ cell }) => {
    return (
        <div>
            <div>{cell.value}</div>
        </div>
    );
};

ParsingEditCell.propTypes = {
    cell: PropTypes.object.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(ParsingEditCell);
