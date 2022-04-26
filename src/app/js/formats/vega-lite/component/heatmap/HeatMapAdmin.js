import React, { Component } from 'react';
import translate from 'redux-polyglot/translate';
import { schemeOrRd } from 'd3-scale-chromatic';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel } from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import updateAdminArgs from '../../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../../shared/RoutineParamsAdmin';
import { GradientSchemeSelector } from '../../../../lib/components/ColorSchemeSelector';
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
    previewDefaultColor: color => ({
        display: 'inline-block',
        backgroundColor: color,
        height: '1em',
        width: '1em',
        marginLeft: 5,
        border: 'solid 1px black',
    }),
};

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    colorScheme: schemeOrRd[9],
    flipAxis: false,
    tooltip: false,
    tooltipSource: 'Source',
    tooltipTarget: 'Target',
    tooltipWeight: 'Weight',
};

class HeatMapAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
            colorScheme: PropTypes.arrayOf(PropTypes.string),
            flipAxis: PropTypes.bool,
            tooltip: PropTypes.bool,
            tooltipSource: PropTypes.string,
            tooltipTarget: PropTypes.string,
            tooltipWeight: PropTypes.string,
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
        showMaxSize: true,
        showMaxValue: true,
        showMinValue: true,
        showOrderBy: true,
    };

    constructor(props) {
        super(props);
        this.setTooltipSource = this.setTooltipSource.bind(this);
        this.setTooltipTarget = this.setTooltipTarget.bind(this);
        this.setTooltipWeight = this.setTooltipWeight.bind(this);
    }

    setParams = params => {
        updateAdminArgs('params', params, this.props);
    };

    handleColorSchemeChange = (_, colorScheme) => {
        updateAdminArgs(
            'colorScheme',
            colorScheme.props.value.split(','),
            this.props,
        );
    };

    toggleFlipAxis = () => {
        updateAdminArgs('flipAxis', !this.props.args.flipAxis, this.props);
    };

    toggleTooltip = () => {
        updateAdminArgs('tooltip', !this.props.args.tooltip, this.props);
    };

    setTooltipSource(tooltipSource) {
        updateAdminArgs('tooltipSource', tooltipSource, this.props);
    }

    setTooltipTarget(tooltipTarget) {
        updateAdminArgs('tooltipTarget', tooltipTarget, this.props);
    }

    setTooltipWeight(tooltipWeight) {
        updateAdminArgs('tooltipWeight', tooltipWeight, this.props);
    }

    render() {
        const {
            p: polyglot,
            args: {
                params,
                colorScheme,
                flipAxis,
                tooltip,
                tooltipSource,
                tooltipTarget,
                tooltipWeight,
            },
            showMaxSize,
            showMaxValue,
            showMinValue,
            showOrderBy,
        } = this.props;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    polyglot={polyglot}
                    onChange={this.setParams}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
                <ToolTips
                    checked={tooltip}
                    onChange={this.toggleTooltip}
                    onCategoryTitleChange={this.setTooltipSource}
                    categoryTitle={tooltipSource}
                    onValueTitleChange={this.setTooltipTarget}
                    valueTitle={tooltipTarget}
                    polyglot={polyglot}
                    thirdValue={true}
                    onThirdValueChange={this.setTooltipWeight}
                    thirdValueTitle={tooltipWeight}
                />
                <GradientSchemeSelector
                    label={polyglot.t('color_scheme')}
                    onChange={this.handleColorSchemeChange}
                    style={styles.input}
                    value={colorScheme}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={this.toggleFlipAxis}
                            style={styles.input}
                            checked={flipAxis}
                        />
                    }
                    label={polyglot.t('flip_axis')}
                />
            </div>
        );
    }
}

export default translate(HeatMapAdmin);
