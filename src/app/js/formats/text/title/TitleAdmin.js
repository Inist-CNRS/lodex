import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Box, TextField } from '@mui/material';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../shared/updateAdminArgs';
import ColorPickerParamsAdmin from '../../shared/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../colorUtils';

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
        this.setColors = this.setColors.bind(this);
        this.state = {
            colors: this.props.args.colors || defaultArgs.colors,
        };
    }

    setLevel = level => {
        this.props.onChange({ level });
    };

    setColors(colors) {
        updateAdminArgs('colors', colors.split(' ')[0], this.props);
    }

    render() {
        const {
            p: polyglot,
            args: { level },
        } = this.props;

        return (
            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={2}
            >
                <TextField
                    fullWidth
                    select
                    label={polyglot.t('list_format_select_level')}
                    onChange={e => this.setLevel(e.target.value)}
                    value={level}
                >
                    <MenuItem value={1}>{polyglot.t('level1')}</MenuItem>
                    <MenuItem value={2}>{polyglot.t('level2')}</MenuItem>
                    <MenuItem value={3}>{polyglot.t('level3')}</MenuItem>
                    <MenuItem value={4}>{polyglot.t('level4')}</MenuItem>
                </TextField>
                <ColorPickerParamsAdmin
                    colors={this.state.colors || defaultArgs.colors}
                    onChange={this.setColors}
                    polyglot={polyglot}
                    monochromatic={true}
                />
            </Box>
        );
    }
}

export default translate(TitleAdmin);
