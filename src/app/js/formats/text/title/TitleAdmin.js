import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, TextField } from '@mui/material';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../utils/updateAdminArgs';
import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';

export const defaultArgs = {
    level: 1,
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
};

class TitleAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            level: PropTypes.number,
            colors: PropTypes.string,
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

    handleLevel = (level) => {
        this.props.onChange({ level });
    };

    handleColors(colors) {
        updateAdminArgs('colors', colors.split(' ')[0], this.props);
    }

    render() {
        const {
            p: polyglot,
            args: { level },
        } = this.props;

        return (
            <FormatDefaultParamsFieldSet>
                <TextField
                    fullWidth
                    select
                    label={polyglot.t('list_format_select_level')}
                    onChange={(e) => this.handleLevel(e.target.value)}
                    value={level}
                >
                    <MenuItem value={1}>{polyglot.t('level1')}</MenuItem>
                    <MenuItem value={2}>{polyglot.t('level2')}</MenuItem>
                    <MenuItem value={3}>{polyglot.t('level3')}</MenuItem>
                    <MenuItem value={4}>{polyglot.t('level4')}</MenuItem>
                </TextField>
                <ColorPickerParamsAdmin
                    colors={this.state.colors || defaultArgs.colors}
                    onChange={this.handleColors}
                    polyglot={polyglot}
                    monochromatic={true}
                />
            </FormatDefaultParamsFieldSet>
        );
    }
}

export default translate(TitleAdmin);
