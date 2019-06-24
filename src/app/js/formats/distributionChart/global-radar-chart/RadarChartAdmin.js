import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import translate from 'redux-polyglot/translate';
import Checkbox from 'material-ui/Checkbox';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../shared/RoutineParamsAdmin';

import * as colorUtils from '../../colorUtils';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        width: '100%',
    },
};

export const defaultArgs = {
    params: {
        maxSize: 5,
        orderBy: 'value/asc',
    },
    colors: colorUtils.MONOCHROMATIC_DEFAULT_COLORSET,
    axisRoundValue: true,
    scale: 'linear',
};

class RadarChartAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
            colors: PropTypes.string,
            axisRoundValue: PropTypes.bool,
            scale: PropTypes.oneOf(['log', 'linear']),
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setParams = params => {
        updateAdminArgs('params', params, this.props);
    };

    setColors = (_, colors) => {
        updateAdminArgs('colors', colors, this.props);
    };

    setAxisRoundValue = () => {
        updateAdminArgs(
            'axisRoundValue',
            !this.props.args.axisRoundValue,
            this.props,
        );
    };

    setScale = (_, __, scale) => {
        updateAdminArgs('scale', scale, this.props);
    };

    render() {
        const { p: polyglot } = this.props;
        const { params, colors, axisRoundValue, scale } = this.props.args;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={this.setParams}
                    polyglot={polyglot}
                />
                <TextField
                    floatingLabelText={polyglot.t('colors_set')}
                    onChange={this.setColors}
                    style={styles.input}
                    value={colors}
                />
                <Checkbox
                    label={polyglot.t('axis_round_value')}
                    onCheck={this.setAxisRoundValue}
                    style={styles.input}
                    checked={axisRoundValue}
                />
                <SelectField
                    floatingLabelText={polyglot.t('scale')}
                    onChange={this.setScale}
                    style={styles.input}
                    value={scale}
                >
                    <MenuItem
                        value="linear"
                        primaryText={polyglot.t('linear')}
                    />
                    <MenuItem value="log" primaryText={polyglot.t('log')} />
                </SelectField>
            </div>
        );
    }
}

export default translate(RadarChartAdmin);
