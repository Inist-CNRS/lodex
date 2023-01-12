import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import updateAdminArgs from '../../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../../shared/RoutineParamsAdmin';
import ToolTips from '../../../shared/ToolTips';
import ColorPickerParamsAdmin from '../../../shared/ColorPickerParamsAdmin';
import { schemeBlues } from 'd3-scale-chromatic';
import { GradientSchemeSelector } from '../../../../lib/components/ColorSchemeSelector';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    input: {
        width: '100%',
    },
};

export const defaultArgs = {
    params: {
        maxSize: undefined,
        orderBy: 'value/asc',
    },
    tooltip: false,
    tooltipCategory: 'Category',
    tooltipValue: 'Value',
    color: '#000000',
    colorScheme: schemeBlues[9],
};

class FlowMapAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
            tooltip: PropTypes.bool,
            tooltipCategory: PropTypes.string,
            tooltipValue: PropTypes.string,
            color: PropTypes.string,
            colorScheme: PropTypes.arrayOf(PropTypes.string),
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
        this.setColor = this.setColor.bind(this);
        this.setTooltipValue = this.setTooltipValue.bind(this);
        this.setTooltipCategory = this.setTooltipCategory.bind(this);
        this.state = {
            color: this.props.args.color || defaultArgs.color,
        };
    }

    setParams = params => {
        updateAdminArgs('params', params, this.props);
    };

    setColor(color) {
        updateAdminArgs(
            'color',
            color.split(' ')[0] || defaultArgs.color,
            this.props,
        );
    }

    setColorScheme = (_, colorScheme) => {
        updateAdminArgs(
            'colorScheme',
            colorScheme.props.value.split(','),
            this.props,
        );
    };

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
            showMaxSize,
            showMaxValue,
            showMinValue,
            showOrderBy,
        } = this.props;
        const {
            params,
            tooltip,
            tooltipValue,
            tooltipCategory,
            colorScheme,
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
                <GradientSchemeSelector
                    label={polyglot.t('color_scheme')}
                    onChange={this.setColorScheme}
                    style={styles.input}
                    value={colorScheme}
                />
                <ColorPickerParamsAdmin
                    colors={this.state.color}
                    onChange={this.setColor}
                    polyglot={polyglot}
                    monochromatic={true}
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
            </div>
        );
    }
}

export default translate(FlowMapAdmin);
