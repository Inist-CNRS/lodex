import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { Box, TextField } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import RoutineParamsAdmin from '../shared/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../shared/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../colorUtils';

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
        this.setColors = this.setColors.bind(this);
        this.state = {
            colors: this.props.args.colors || defaultArgs.colors,
        };
    }
    setParams = params => {
        const newParams = {
            ...this.props.args.params,
            ...params,
        };
        updateAdminArgs('params', newParams, this.props);
    };

    setColors(colors) {
        updateAdminArgs(
            'colors',
            colors.split(' ')[0] || defaultArgs.colors,
            this.props,
        );
    }

    setMaxLabelLength = event => {
        const maxLabelLength = event.target.value;
        this.setParams({
            ...this.props.args.params,
            maxLabelLength: parseInt(maxLabelLength, 10),
        });
    };

    setLabelOffset = event => {
        const labelOffset = event.target.value;
        this.setParams({
            ...this.props.args.params,
            labelOffset: parseInt(labelOffset, 10),
        });
    };

    setMinimumScaleValue = event => {
        const minimumScaleValue = event.target.value;
        this.setParams({
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
            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={2}
            >
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    polyglot={polyglot}
                    onChange={this.setParams}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
                <ColorPickerParamsAdmin
                    colors={this.state.colors || defaultArgs.colors}
                    onChange={this.setColors}
                    polyglot={polyglot}
                    monochromatic={true}
                />
                <TextField
                    label={polyglot.t('max_char_number_in_labels')}
                    onChange={this.setMaxLabelLength}
                    value={this.props.args.params.maxLabelLength}
                    fullWidth
                />
                <TextField
                    label={polyglot.t('label_offset')}
                    onChange={this.setLabelOffset}
                    value={this.props.args.params.labelOffset}
                    fullWidth
                />
                <TextField
                    label={polyglot.t('minimum_scale_value')}
                    onChange={this.setMinimumScaleValue}
                    value={this.props.args.params.minimumScaleValue}
                    fullWidth
                />
            </Box>
        );
    }
}

export default translate(HierarchyAdmin);
