import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    input: {
        width: '100%',
    },
    colorpicker: {
        width: '100%',
        'margin-bottom': '15px',
    },
};

class ColorPickerParamsAdmin extends Component {
    static propTypes = {
        colors: PropTypes.string,
        onColorsChange: PropTypes.func.isRequired,
        polyglot: polyglotPropTypes.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            colors: this.getColorsArray().map(color => ({ color })),
        };
    }

    getColorsArray() {
        return this.props.colors.split(' ');
    }

    handleChangeText(e) {
        this.setState({
            colors: e.target.value.split(' ').map(color => ({ color })),
        });
        this.props.onColorsChange(e.target.value);
    }

    handleChangePicker(i, e) {
        let colorsBuffer = [...this.state.colors];
        colorsBuffer[i] = { color: e.target.value };

        this.setState({ colors: colorsBuffer });
        this.props.onColorsChange(
            colorsBuffer.map(({ color }) => color).join(' '),
        );
    }

    createUI() {
        const colorsArray = this.getColorsArray();
        return colorsArray.map((element, i) => (
            <div key={i}>
                <input
                    name="color"
                    type="color"
                    onChange={this.handleChangePicker.bind(this, i)}
                    value={colorsArray[i]}
                />
            </div>
        ));
    }

    render() {
        return (
            <Fragment>
                <TextField
                    floatingLabelText={this.props.polyglot.t('colors_set')}
                    onChange={this.handleChangeText.bind(this)}
                    style={styles.colorpicker}
                    value={this.props.colors}
                />
                {this.createUI()}
            </Fragment>
        );
    }
}

export default ColorPickerParamsAdmin;
