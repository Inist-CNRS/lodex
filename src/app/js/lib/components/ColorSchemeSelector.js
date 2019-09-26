import React from 'react';
import PropTypes from 'prop-types';
import { Select, MenuItem } from '@material-ui/core';
import { scaleQuantize } from 'd3-scale';
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
    schemeAccent,
    schemeDark2,
    schemePaired,
    schemePastel1,
    schemePastel2,
    schemeSet1,
    schemeSet2,
    schemeSet3,
} from 'd3-scale-chromatic';

const gradientSchemes = [
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
const categorySchemes = [
    schemeAccent,
    schemeDark2,
    schemePaired,
    schemePastel1,
    schemePastel2,
    schemeSet1,
    schemeSet2,
    schemeSet3,
];

import ColorScalePreview from '../../lib/components/ColorScalePreview';

const getColorSchemeSelector = schemes => {
    const ColorSchemeSelector = ({ value = [], style, label, onChange }) => (
        <Select
            floatingLabelText={label}
            onChange={onChange}
            style={style}
            value={value.join(',')}
        >
            {schemes.map(scheme => (
                <MenuItem key={scheme} value={scheme.join(',')}>
                    <ColorScalePreview
                        colorScale={scaleQuantize()
                            .domain([0, 100])
                            .range(scheme)}
                    />
                </MenuItem>
            ))}
        </Select>
    );
    ColorSchemeSelector.propTypes = {
        value: PropTypes.arrayOf(PropTypes.string),
        onChange: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        style: PropTypes.any,
    };

    return ColorSchemeSelector;
};

export const GradientSchemeSelector = getColorSchemeSelector(gradientSchemes);
export const CategorySchemeSelector = getColorSchemeSelector(categorySchemes);
