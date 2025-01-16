import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../utils/updateAdminArgs';
import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    diameter: 500,
    colors: MULTICHROMATIC_DEFAULT_COLORSET,
};

class BubbleAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
            diameter: PropTypes.number,
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
        this.handleColors = this.handleColors.bind(this);
        this.state = {
            colors: this.props.args.colors || defaultArgs.colors,
        };
    }

    handleParams = (params) => updateAdminArgs('params', params, this.props);

    handleColors(colors) {
        updateAdminArgs('colors', colors, this.props);
    }

    handleDiameter = (e) => {
        updateAdminArgs('diameter', e.target.value, this.props);
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
        const { diameter } = this.props.args;

        return (
            <FormatGroupedFieldSet>
                <FormatDataParamsFieldSet>
                    <RoutineParamsAdmin
                        params={params || defaultArgs.params}
                        onChange={this.handleParams}
                        polyglot={polyglot}
                        showMaxSize={showMaxSize}
                        showMaxValue={showMaxValue}
                        showMinValue={showMinValue}
                        showOrderBy={showOrderBy}
                    />
                </FormatDataParamsFieldSet>
                <FormatChartParamsFieldSet defaultExpanded>
                    <ColorPickerParamsAdmin
                        colors={this.state.colors || defaultArgs.colors}
                        onChange={this.handleColors}
                        polyglot={polyglot}
                    />
                    <TextField
                        label={polyglot.t('diameter')}
                        onChange={this.handleDiameter}
                        value={diameter}
                        fullWidth
                    />
                </FormatChartParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(BubbleAdmin);
