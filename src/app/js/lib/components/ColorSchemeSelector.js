import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {
    schemeBlues,
    schemeOrRd,
    schemeBuGn,
    schemeBuPu,
    schemeGnBu,
    schemeGreys,
    schemeOranges,
    schemeGreens,
    schemePuBu,
    schemePuBuGn,
    schemePuRd,
    schemeRdPu,
    schemeYlGn,
    schemeYlGnBu,
    schemeYlOrBr,
    schemeYlOrRd,
} from 'd3-scale-chromatic';
import { scaleQuantize } from 'd3-scale';

import ColorScalePreview from '../../lib/components/ColorScalePreview';

const defaultSchemes = [
    schemeBlues[9],
    schemeOrRd[9],
    schemeBuGn[9],
    schemeBuPu[9],
    schemeGnBu[9],
    schemeGreys[9],
    schemeOranges[9],
    schemeGreens[9],
    schemePuBu[9],
    schemePuBuGn[9],
    schemePuRd[9],
    schemeRdPu[9],
    schemeYlGn[9],
    schemeYlGnBu[9],
    schemeYlOrBr[9],
    schemeYlOrRd[9],
];

const ColorSchemeSelector = ({ value, schemes, style, label, onChange }) => (
    <SelectField
        floatingLabelText={label}
        onChange={onChange}
        style={style}
        value={value.join(',')}
    >
        {schemes.map(scheme => (
            <MenuItem
                key={scheme}
                value={scheme.join(',')}
                primaryText={
                    <ColorScalePreview
                        colorScale={scaleQuantize()
                            .domain([0, 100])
                            .range(scheme)}
                    />
                }
            />
        ))}
    </SelectField>
);

ColorSchemeSelector.propTypes = {
    value: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    style: PropTypes.any,
    schemes: PropTypes.arrayOf(PropTypes.string),
};

ColorSchemeSelector.defaultProps = {
    schemes: defaultSchemes,
};

export default ColorSchemeSelector;
