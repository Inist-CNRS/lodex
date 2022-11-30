import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import RoutineParamsAdmin from '../shared/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../shared/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET } from '../colorUtils';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
};

const AsterPlotChartAdmin = ({
    p: polyglot,
    args,
    onChange,
    showMaxSize,
    showMaxValue,
    showMinValue,
    showOrderBy,
}) => {
    const setParams = params => {
        updateAdminArgs(
            'params',
            { ...args.params, ...params },
            {
                args,
                onChange,
            },
        );
    };

    const setColors = colors => {
        updateAdminArgs('colors', colors, {
            args,
            onChange,
        });
    };

    return (
        <div style={styles.container}>
            <RoutineParamsAdmin
                params={args.params}
                onChange={setParams}
                polyglot={polyglot}
                showMaxSize={showMaxSize}
                showMaxValue={showMaxValue}
                showMinValue={showMinValue}
                showOrderBy={showOrderBy}
            />
            <ColorPickerParamsAdmin
                colors={args.colors}
                onChange={setColors}
                polyglot={polyglot}
            />
        </div>
    );
};

AsterPlotChartAdmin.propTypes = {
    args: PropTypes.shape({
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
            orderBy: PropTypes.string,
        }),
        colors: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool,
    showMaxValue: PropTypes.bool,
    showMinValue: PropTypes.bool,
    showOrderBy: PropTypes.bool,
};

export const defaultArgs = {
    params: {
        maxSize: 10,
        maxValue: 100,
        minValue: 0,
        orderBy: 'value/asc',
    },
    colors: MULTICHROMATIC_DEFAULT_COLORSET,
};

AsterPlotChartAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
    showOrderBy: true,
};

export default translate(AsterPlotChartAdmin);
