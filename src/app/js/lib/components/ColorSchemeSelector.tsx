import { MenuItem, TextField } from '@mui/material';
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

const getColorSchemeSelector = (schemes: (readonly string[])[]) => {
    const ColorSchemeSelector = ({
        value = [],
        label,
        onChange,
    }: {
        value: readonly string[];
        label: string;
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    }) => (
        <TextField
            fullWidth
            select
            label={label}
            value={value.join(',')}
            onChange={onChange}
        >
            {schemes.map((scheme) => (
                <MenuItem key={scheme.join(',')} value={scheme.join(',')}>
                    {
                        <ColorScalePreview
                            colorScale={scaleQuantize()
                                .domain([0, 100])
                                // @ts-expect-error TS2322
                                .range(scheme)}
                        />
                    }
                </MenuItem>
            ))}
        </TextField>
    );

    return ColorSchemeSelector;
};

export const GradientSchemeSelector = getColorSchemeSelector(gradientSchemes);
export const CategorySchemeSelector = getColorSchemeSelector(categorySchemes);
