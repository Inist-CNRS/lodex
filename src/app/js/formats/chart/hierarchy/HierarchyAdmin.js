import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { TextField } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../utils/updateAdminArgs';
import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    params: {
        maxSize: 5000,
        orderBy: 'value/asc',
        maxLabelLength: 25,
        labelOffset: 50,
        minimumScaleValue: 5,
    },
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
};

class HierarchyAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
                maxLabelLength: PropTypes.number,
                labelOffset: PropTypes.number,
                minimumScaleValue: PropTypes.number,
            }),
            colors: PropTypes.string,
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
        showMaxValue: false,
        showMinValue: false,
        showOrderBy: true,
    };

    constructor(props) {
        super(props);
        this.handleColors = this.handleColors.bind(this);
        this.state = {
            colors: this.props.args.colors || defaultArgs.colors,
        };
    }
    handleParams = (params) => {
        const newParams = {
            ...this.props.args.params,
            ...params,
        };
        updateAdminArgs('params', newParams, this.props);
    };

    handleColors(colors) {
        updateAdminArgs(
            'colors',
            colors.split(' ')[0] || defaultArgs.colors,
            this.props,
        );
    }

    handleMaxLabelLength = (event) => {
        const maxLabelLength = event.target.value;
        this.handleParams({
            ...this.props.args.params,
            maxLabelLength: parseInt(maxLabelLength, 10),
        });
    };

    handleLabelOffset = (event) => {
        const labelOffset = event.target.value;
        this.handleParams({
            ...this.props.args.params,
            labelOffset: parseInt(labelOffset, 10),
        });
    };

    handleMinimumScaleValue = (event) => {
        const minimumScaleValue = event.target.value;
        this.handleParams({
            ...this.props.args.params,
            minimumScaleValue: parseInt(minimumScaleValue, 10),
        });
    };

    render() {
        const {
            p: polyglot,
            args: { params },
            showMaxSize,
            showMaxValue,
            showMinValue,
            showOrderBy,
        } = this.props;

        return (
            <FormatGroupedFieldSet>
                <FormatDataParamsFieldSet>
                    <RoutineParamsAdmin
                        params={params || defaultArgs.params}
                        polyglot={polyglot}
                        onChange={this.handleParams}
                        showMaxSize={showMaxSize}
                        showMaxValue={showMaxValue}
                        showMinValue={showMinValue}
                        showOrderBy={showOrderBy}
                    />
                </FormatDataParamsFieldSet>
                <FormatChartParamsFieldSet>
                    <ColorPickerParamsAdmin
                        colors={this.state.colors || defaultArgs.colors}
                        onChange={this.handleColors}
                        polyglot={polyglot}
                        monochromatic={true}
                    />
                    <TextField
                        label={polyglot.t('max_char_number_in_labels')}
                        onChange={this.handleMaxLabelLength}
                        value={this.props.args.params.maxLabelLength}
                        fullWidth
                    />
                    <TextField
                        label={polyglot.t('label_offset')}
                        onChange={this.handleLabelOffset}
                        value={this.props.args.params.labelOffset}
                        fullWidth
                    />
                    <TextField
                        label={polyglot.t('minimum_scale_value')}
                        onChange={this.handleMinimumScaleValue}
                        value={this.props.args.params.minimumScaleValue}
                        fullWidth
                    />
                </FormatChartParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(HierarchyAdmin);
