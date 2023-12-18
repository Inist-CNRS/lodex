import React from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import RoutineParamsAdmin from '../shared/RoutineParamsAdmin';
import { Box, FormControlLabel, FormGroup, Switch } from '@mui/material';
import updateAdminArgs from '../shared/updateAdminArgs';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    debugMode: false,
};

const JsonDebugAdmin = props => {
    const {
        args,
        p,
        showMaxSize,
        showMaxValue,
        showMinValue,
        showOrderBy,
    } = props;
    const { params, debugMode } = args;

    const handleParams = params => {
        updateAdminArgs('params', params, props);
    };

    const toggleDebugMode = () => {
        updateAdminArgs('debugMode', !debugMode, props);
    };

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
        >
            <RoutineParamsAdmin
                params={params || defaultArgs.params}
                onChange={handleParams}
                polyglot={p}
                showMaxSize={showMaxSize}
                showMaxValue={showMaxValue}
                showMinValue={showMinValue}
                showOrderBy={showOrderBy}
            />
            <FormGroup>
                <FormControlLabel
                    control={
                        <Switch
                            checked={debugMode}
                            onChange={toggleDebugMode}
                        />
                    }
                    label={p.t('debugMode')}
                />
            </FormGroup>
        </Box>
    );
};

JsonDebugAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
    showOrderBy: true,
};

JsonDebugAdmin.propTypes = {
    args: PropTypes.shape({
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
            orderBy: PropTypes.string,
        }),
        debugMode: PropTypes.bool,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool.isRequired,
    showMaxValue: PropTypes.bool.isRequired,
    showMinValue: PropTypes.bool.isRequired,
    showOrderBy: PropTypes.bool.isRequired,
};

export default translate(JsonDebugAdmin);
