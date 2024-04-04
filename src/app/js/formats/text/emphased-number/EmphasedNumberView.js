import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import commaNumber from 'comma-number';
import compose from 'recompose/compose';

import { field as fieldPropTypes } from '../../../propTypes';
import Bigbold from './Bigbold';
import injectData from '../../injectData';

function getNumber(numb) {
    if (Number.isInteger(numb)) {
        // /api/run/count-all
        // /api/run/total-of
        return numb;
    }
    if (Array.isArray(numb) && numb.length === 1) {
        // /api/run/count-by-fields
        const { value } = numb.shift();
        return Number(value);
    }
    if (Array.isArray(numb)) {
        // just an array
        return Number(numb.length);
    }
    if (Number.isInteger(numb.total)) {
        // all others routines
        return Number(numb.total);
    }
    return 0;
}

class EmphasedNumberView extends Component {
    render() {
        const { field, className, resource, formatData, size, colors } =
            this.props;

        const value = getNumber(formatData || resource[field.name]);
        return (
            <div className={className}>
                <Bigbold
                    value={commaNumber(value, ' ')}
                    colors={colors}
                    size={size}
                />
            </div>
        );
    }
}

EmphasedNumberView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object,
    formatData: PropTypes.number,
    className: PropTypes.string,
    size: PropTypes.number.isRequired,
    colors: PropTypes.string.isRequired,
};

EmphasedNumberView.defaultProps = {
    className: null,
};

export default compose(
    translate,
    injectData(({ field, resource }) => {
        // Try to use the field value as a number, otherwise it's probably a routine
        const value = resource[field.name];
        return isNaN(value) ? value : null;
    }),
)(EmphasedNumberView);
