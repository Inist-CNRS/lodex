import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { translate } from '../../../i18n/I18NContext';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../utils/updateAdminArgs';
import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH } from '../../utils/colorUtils';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/desc',
    },
    colors: MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH,
    maxLegendLength: 30,
    height: 300,
};

class StreamgraphAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
            colors: PropTypes.string,
            maxLegendLength: PropTypes.number,
            height: PropTypes.number.isRequired,
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

    // @ts-expect-error TS7006
    constructor(props) {
        super(props);
        this.handleColors = this.handleColors.bind(this);
        this.state = {
            // @ts-expect-error TS2339
            colors: this.props.args.colors || defaultArgs.colors,
        };
    }

    // @ts-expect-error TS7006
    handleParams = (params) => updateAdminArgs('params', params, this.props);

    // @ts-expect-error TS7006
    handleColors(colors) {
        updateAdminArgs('colors', colors || defaultArgs.colors, this.props);
    }

    // @ts-expect-error TS7006
    handleMaxLegendLength = (e) => {
        updateAdminArgs('maxLegendLength', e.target.value, this.props);
    };

    // @ts-expect-error TS7006
    handleHeight = (e) => {
        updateAdminArgs('height', e.target.value, this.props);
    };

    render() {
        const {
            // @ts-expect-error TS2339
            p: polyglot,
            // @ts-expect-error TS2339
            args: { params, maxLegendLength, height },
            // @ts-expect-error TS2339
            showMaxSize,
            // @ts-expect-error TS2339
            showMaxValue,
            // @ts-expect-error TS2339
            showMinValue,
            // @ts-expect-error TS2339
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
                <FormatChartParamsFieldSet defaultExpanded>
                    <ColorPickerParamsAdmin
                        // @ts-expect-error TS2339
                        colors={this.state.colors}
                        onChange={this.handleColors}
                        polyglot={polyglot}
                    />
                    <TextField
                        label={polyglot.t('max_char_number_in_legends')}
                        onChange={this.handleMaxLegendLength}
                        value={maxLegendLength}
                        fullWidth
                    />
                    <TextField
                        label={polyglot.t('height_px')}
                        onChange={this.handleHeight}
                        value={height}
                        fullWidth
                    />
                </FormatChartParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(StreamgraphAdmin);
