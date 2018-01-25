import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import commaNumber from 'comma-number';

import { field as fieldPropTypes } from '../../propTypes';
import Bigbold from './Bigbold';

class EmphasedNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    render() {
        const { field, className, resource } = this.props;
        const size =
            field.format && field.format.args && field.format.args.size
                ? field.format.args.size
                : 1;
        const { colors } = field.format.args || { colors: '' };
        const colorsSet = String(colors)
            .split(/[^\w]/)
            .filter(x => x.length > 0)
            .map(x => String('#').concat(x));
        const values = [].concat(resource[field.name]);

        return (
            <div className={className}>
                {values.map((entry, index) => {
                    const key = String(index).concat('EmphasedNumber');
                    const val = commaNumber(entry, ' ');
                    return (
                        <Bigbold
                            key={key}
                            value={val}
                            colorsSet={colorsSet}
                            size={size}
                        />
                    );
                })}
            </div>
        );
    }
}

EmphasedNumber.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object,
    className: PropTypes.string,
};

EmphasedNumber.defaultProps = {
    className: null,
};

export default translate(EmphasedNumber);
