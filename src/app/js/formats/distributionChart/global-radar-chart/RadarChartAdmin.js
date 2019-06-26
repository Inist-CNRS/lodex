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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

let isFirstLoading = true; // to fetch values into the picker fields

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

    setColorsWithColorPicker = () => {
        updateAdminArgs('colors', this.getColorsFromPicker(), this.props);
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

    constructor(props) {
        super(props);
        isFirstLoading = true; // to initialize values on admin UI opening
        const colorsArray = this.props.args.colors.split(' ');

        this.state = {
            colors: [{ color: colorsArray[0] }],
        };

        let numberOfPickers = this.getNumberOfPickers();
        for (let index = 1; index < numberOfPickers; index++) {
            this.state = {
                colors: [...this.state.colors, { color: colorsArray[index] }],
            };
        }
    }

    handleChange(i, e) {
        const { value } = e.target;
        let colors = [...this.state.colors];
        colors[i] = { color: value };
        this.setState({ colors });
    }

    getColorsFromPicker() {
        let numberOfPickers = this.getNumberOfPickers();
        let res = '';
        for (var i = 0; i < numberOfPickers; i++) {
            if (i == 0) {
                res += this.state.colors[i].color;
            } else {
                res += ' ' + this.state.colors[i].color;
            }
        }
        this.setColors;
        return res;
    }

    createUI() {
        const { colors } = this.props.args;
        const colorsArray = colors.split(' ');
        if (isFirstLoading) {
            isFirstLoading = false;
            return colorsArray.map((element, i) => (
                <div key={i}>
                    <input
                        name="color"
                        type="color"
                        onChange={this.handleChange.bind(this, i)}
                        value={colorsArray[i]} // this assignment should only be done once
                    />
                </div>
            ));
        } else {
            return colorsArray.map((element, i) => (
                <div key={i}>
                    <input
                        name="color"
                        type="color"
                        onChange={this.handleChange.bind(this, i)}
                    />
                </div>
            ));
        }
    }

    getNumberOfPickers() {
        const { colors } = this.props.args;
        return colors.split(' ').length;
    }

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
                {this.createUI()}
                <br />
                <FontAwesomeIcon
                    icon={faArrowUp}
                    height={24}
                    onClick={this.setColorsWithColorPicker.bind(this)}
                />
                <br />
                <br />
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
