// @ts-expect-error TS6133
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, Typography } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';

const multichromatic_maxLength = 100 * 8 - 1; // "#RRGGBB " is 8 chars, minus the last space, so we can set 100 pickers

class ColorPickerParamsAdmin extends Component {
    static propTypes = {
        colors: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        polyglot: polyglotPropTypes.isRequired,
        monochromatic: PropTypes.bool,
    };

    // @ts-expect-error TS7006
    constructor(props) {
        super(props);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.state = {
            // @ts-expect-error TS2339
            colors: this.props.colors.split(' ').map((color) => ({ color })),
        };
    }

    // @ts-expect-error TS7006
    handleChangeText(e) {
        this.setState({
            colors: (e.target.value || '')
                .split(' ')
                // @ts-expect-error TS7006
                .map((color) => ({ color })),
        });

        // @ts-expect-error TS2339
        this.props.onChange(e.target.value);
    }

    // @ts-expect-error TS7006
    handleChangePicker(i, e) {
        // @ts-expect-error TS2339
        const colorsBuffer = [...this.state.colors];
        colorsBuffer[i] = { color: e.target.value };

        this.setState({ colors: colorsBuffer });
        // @ts-expect-error TS2339
        this.props.onChange(colorsBuffer.map(({ color }) => color).join(' '));
    }

    createUI() {
        // @ts-expect-error TS2339
        const colors = this.state.colors;
        return (
            <Box display="flex" flexWrap="wrap" gap={1}>
                {/*
                 // @ts-expect-error TS7006 */}
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
        // @ts-expect-error TS2339
        return this.state.colors.map(({ color }) => color).join(' ');
    }

    render() {
        // @ts-expect-error TS2339
        const { monochromatic } = this.props;
        return (
            <Box display="flex" flexWrap="wrap" width="100%">
                <Typography>
                    {monochromatic
                        ? // @ts-expect-error TS2339
                          this.props.polyglot.t('Color')
                        : // @ts-expect-error TS2339
                          this.props.polyglot.t('colors_set')}
                </Typography>
                <TextField
                    // @ts-expect-error TS2339
                    label={this.props.polyglot.t('colors_string')}
                    onChange={this.handleChangeText}
                    value={this.getStateColorsString()}
                    // @ts-expect-error TS2322
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
