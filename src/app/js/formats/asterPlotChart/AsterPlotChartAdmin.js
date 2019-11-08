import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import RoutineParamsAdmin from '../shared/RoutineParamsAdmin';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
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
    showUri,
}) => {
    const setParams = params => {
        updateAdminArgs('params', Object.assign({}, args.params, params), {
            args,
            onChange,
        });
    };

    const setUri = (_, newUri) => {
        setParams({
            uri: newUri,
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
            {showUri && (
                <TextField
                    floatingLabelText={polyglot.t('uri')}
                    onChange={setUri}
                    style={styles.input}
                    value={args.params.uri}
                />
            )}
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
            uri: PropTypes.string,
        }),
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool,
    showMaxValue: PropTypes.bool,
    showMinValue: PropTypes.bool,
    showOrderBy: PropTypes.bool,
    showUri: PropTypes.bool,
};

export const defaultArgs = {
    params: {
        maxSize: undefined,
        maxValue: undefined,
        minValue: undefined,
        orderBy: 'value/asc',
        uri: undefined,
    },
};

AsterPlotChartAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: false,
    showMaxValue: false,
    showMinValue: false,
    showOrderBy: false,
    showUri: false,
};

export default translate(AsterPlotChartAdmin);
