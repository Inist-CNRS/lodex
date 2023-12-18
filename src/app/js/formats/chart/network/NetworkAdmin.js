import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../shared/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../shared/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../colorUtils';
import { Box } from '@mui/material';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../utils/components/FormatFieldSet';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
};

class NetworkAdmin extends Component {
    static propTypes = {
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
        this.setColors = this.setColors.bind(this);
        this.state = {
            colors: this.props.args.colors || defaultArgs.colors,
        };
    }

    setParams = params => {
        updateAdminArgs('params', params, this.props);
    };

    setColors(colors) {
        updateAdminArgs(
            'colors',
            colors.split(' ')[0] || defaultArgs.colors,
            this.props,
        );
    }

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
                <FormatDataParamsFieldSet>
                    <RoutineParamsAdmin
                        params={params || defaultArgs.params}
                        polyglot={polyglot}
                        onChange={this.setParams}
                        showMaxSize={showMaxSize}
                        showMaxValue={showMaxValue}
                        showMinValue={showMinValue}
                        showOrderBy={showOrderBy}
                    />
                </FormatDataParamsFieldSet>
                <FormatChartParamsFieldSet>
                    <ColorPickerParamsAdmin
                        colors={this.state.colors}
                        onChange={this.setColors}
                        polyglot={polyglot}
                        monochromatic={true}
                    />
                </FormatChartParamsFieldSet>
            </Box>
        );
    }
}

export default translate(NetworkAdmin);
