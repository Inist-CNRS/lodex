import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import * as colorUtils from '../colorUtils';

const styles = {
    input: {
        width: '100%',
    },
    colorpicker: {
        width: '100%',
        'margin-bottom': '15px',
    },
};

const multichromatic_maxLength = 100 * 8 - 1; // "#RRGGBB " is 8 chars, minus the last space, so we can set 100 pickers

class ColorPickerParamsAdmin extends Component {
    static propTypes = {
        colors: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        polyglot: polyglotPropTypes.isRequired,
        monochromatic: PropTypes.bool.isRequired,
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
            colors: e.target.value.split(' ').map(color => ({ color })),
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
        return colors.map((element, i) => (
            <div key={i}>
                <input
                    name="color"
                    type="color"
                    onChange={this.handleChangePicker.bind(this, i)}
                    value={colors[i].color}
                />
            </div>
        ));
    }

    getStateColorsString() {
        return this.state.colors.map(({ color }) => color).join(' ');
    }

    render() {
        const { monochromatic } = this.props;
        return (
            <Fragment>
                <TextField
                    label={
                        monochromatic
                            ? this.props.polyglot.t('Color')
                            : this.props.polyglot.t('colors_set')
                    }
                    onChange={this.handleChangeText}
                    style={styles.colorpicker}
                    value={this.getStateColorsString()}
                    maxLength={monochromatic ? 7 : multichromatic_maxLength}
                />
                {this.createUI()}
            </Fragment>
        );
    }
}

export default ColorPickerParamsAdmin;
