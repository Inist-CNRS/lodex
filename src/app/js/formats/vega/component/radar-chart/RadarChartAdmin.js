import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
} from '@material-ui/core';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import updateAdminArgs from '../../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../../shared/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../../shared/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../../colorUtils';
import ToolTips from '../../../shared/ToolTips';

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
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
    axisRoundValue: true,
    scale: 'linear',
    tooltip: false,
    tooltipCategory: 'Category',
    tooltipValue: 'Value',
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
            tooltip: PropTypes.bool,
            tooltipCategory: PropTypes.string,
            tooltipValue: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
        showMaxSize: PropTypes.bool.isRequired,
        showMaxValue: PropTypes.bool.isRequired,
        showMinValue: PropTypes.bool.isRequired,
        showOrderBy: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    constructor(props) {
        super(props);
        this.setColors = this.setColors.bind(this);
        this.setTooltipValue = this.setTooltipValue.bind(this);
        this.setTooltipCategory = this.setTooltipCategory.bind(this);
        this.state = {
            colors: this.props.args.colors || defaultArgs.colors,
        };
    }

    setParams = params => {
        updateAdminArgs('params', params, this.props);
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

    setColors(colors) {
        updateAdminArgs(
            'colors',
            colors.split(' ')[0] || defaultArgs.colors,
            this.props,
        );
    }

    toggleTooltip = () => {
        updateAdminArgs('tooltip', !this.props.args.tooltip, this.props);
    };

    setTooltipCategory(tooltipCategory) {
        updateAdminArgs('tooltipCategory', tooltipCategory, this.props);
    }

    setTooltipValue(tooltipValue) {
        updateAdminArgs('tooltipValue', tooltipValue, this.props);
    }

    render() {
        const {
            p: polyglot,
            showMaxSize = true,
            showMaxValue = true,
            showMinValue = true,
            showOrderBy = true,
        } = this.props;
        const {
            params,
            axisRoundValue,
            scale,
            tooltip,
            tooltipValue,
            tooltipCategory,
        } = this.props.args;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={this.setParams}
                    polyglot={polyglot}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
                <ToolTips
                    checked={tooltip}
                    onChange={this.toggleTooltip}
                    onCategoryTitleChange={this.setTooltipCategory}
                    categoryTitle={tooltipCategory}
                    onValueTitleChange={this.setTooltipValue}
                    valueTitle={tooltipValue}
                    polyglot={polyglot}
                    thirdValue={false}
                />
                <ColorPickerParamsAdmin
                    colors={this.state.colors}
                    onChange={this.setColors}
                    polyglot={polyglot}
                    monochromatic={true}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={this.setAxisRoundValue}
                            style={styles.input}
                            checked={axisRoundValue}
                        />
                    }
                    label={polyglot.t('axis_round_value')}
                />
                <Select
                    label={polyglot.t('scale')}
                    onChange={this.setScale}
                    style={styles.input}
                    value={scale}
                >
                    <MenuItem value="linear">{polyglot.t('linear')}</MenuItem>
                    <MenuItem value="log">{polyglot.t('log')}</MenuItem>
                </Select>
            </div>
        );
    }
}

export default translate(RadarChartAdmin);
