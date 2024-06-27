import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, TextField } from '@mui/material';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../utils/updateAdminArgs';
import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import {
    FormatDataParamsFieldSet,
    FormatDefaultParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    size: 4,
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
    params: {
        maxSize: 200,
    },
};

class EmphasedNumberAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            size: PropTypes.number,
            colors: PropTypes.string,
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    constructor(props) {
        super(props);
        this.handleColors = this.handleColors.bind(this);
        this.state = {
            colors: this.props.args.colors || defaultArgs.colors,
        };
    }

    handleSize = (size) => {
        const newArgs = {
            ...this.props.args,
            size,
        };
        this.props.onChange(newArgs);
    };

    handleColors(colors) {
        updateAdminArgs('colors', colors.split(' ')[0], this.props);
    }

    handleParams = (params) => updateAdminArgs('params', params, this.props);

    render() {
        const {
            p: polyglot,
            args: { size, params },
        } = this.props;

        return (
            <FormatGroupedFieldSet>
                <FormatDataParamsFieldSet>
                    <RoutineParamsAdmin
                        params={params || defaultArgs.params}
                        onChange={this.handleParams}
                        polyglot={polyglot}
                        showMaxSize={true}
                        showMaxValue={true}
                        showMinValue={true}
                        showOrderBy={false}
                    />
                </FormatDataParamsFieldSet>
                <FormatDefaultParamsFieldSet defaultExpanded>
                    <TextField
                        fullWidth
                        select
                        label={polyglot.t('list_format_select_size')}
                        onChange={(e) => this.handleSize(e.target.value)}
                        value={size}
                    >
                        <MenuItem value={1}>{polyglot.t('size1')}</MenuItem>
                        <MenuItem value={2}>{polyglot.t('size2')}</MenuItem>
                        <MenuItem value={3}>{polyglot.t('size3')}</MenuItem>
                        <MenuItem value={4}>{polyglot.t('size4')}</MenuItem>
                    </TextField>
                    <ColorPickerParamsAdmin
                        colors={this.state.colors || defaultArgs.colors}
                        onChange={this.handleColors}
                        polyglot={polyglot}
                        monochromatic={true}
                    />
                </FormatDefaultParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(EmphasedNumberAdmin);
