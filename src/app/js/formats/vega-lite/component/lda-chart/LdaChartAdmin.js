import React from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import ColorPickerParamsAdmin from '../../../shared/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../../colorUtils';
import updateAdminArgs from '../../../shared/updateAdminArgs';

export const defaultArgs = {
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
};

const LdaChartAdmin = props => {
    const { args, p } = props;
    const { colors } = args;

    const handleColors = colors => {
        updateAdminArgs('colors', colors || defaultArgs.colors, props);
    };

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
        >
            <ColorPickerParamsAdmin
                colors={colors}
                onChange={handleColors}
                polyglot={p}
            />
        </Box>
    );
};

LdaChartAdmin.defaultProps = {
    args: defaultArgs,
};

LdaChartAdmin.propTypes = {
    args: PropTypes.shape({
        colors: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(LdaChartAdmin);
