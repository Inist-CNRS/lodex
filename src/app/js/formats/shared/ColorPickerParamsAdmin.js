import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, Typography } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const multichromatic_maxLength = 100 * 8 - 1; // "#RRGGBB " is 8 chars, minus the last space, so we can set 100 pickers

class ColorPickerParamsAdmin extends Component {
    static propTypes = {
        colors: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        polyglot: polyglotPropTypes.isRequired,
        monochromatic: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.state = {
            colors: this.props.colors.split(' ').map(color => ({ color })),
        };
    }

    handleChangeText(e) {
        this.setState({
            colors: (e.target.value || '').split(' ').map(color => ({ color })),
        });

        this.props.onChange(e.target.value);
    }

    handleChangePicker(i, e) {
        let colorsBuffer = [...this.state.colors];
        colorsBuffer[i] = { color: e.target.value };

        this.setState({ colors: colorsBuffer });
        this.props.onChange(colorsBuffer.map(({ color }) => color).join(' '));
    }

    createUI() {
        const colors = this.state.colors;
        return (
            <Box display="flex" gap={1}>
                {colors.map((element, i) => (
                    <input
                        key={i}
                        name="color"
                        type="color"
                        onChange={this.handleChangePicker.bind(this, i)}
                        value={colors[i].color}
                    />
                ))}
            </Box>
        );
    }

    getStateColorsString() {
        return this.state.colors.map(({ color }) => color).join(' ');
    }

    render() {
        const { monochromatic } = this.props;
        return (
            <Box marginBottom={2} display="flex" flexWrap="wrap" width="100%">
                <Typography>
                    {monochromatic
                        ? this.props.polyglot.t('Color')
                        : this.props.polyglot.t('colors_set')}
                </Typography>
                <TextField
                    label={this.props.polyglot.t('colors_string')}
                    onChange={this.handleChangeText}
                    value={this.getStateColorsString()}
                    maxLength={monochromatic ? 7 : multichromatic_maxLength}
                    fullWidth
                    sx={{
                        marginBottom: 1,
                        marginTop: 1,
                    }}
                />
                {this.createUI()}
            </Box>
        );
    }
}

export default ColorPickerParamsAdmin;
