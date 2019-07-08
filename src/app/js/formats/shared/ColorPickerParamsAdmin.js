import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

import { polyglot as polyglotPropTypes } from '../../propTypes';

import updateAdminArgs from '../shared/updateAdminArgs';

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
        numberOfPickers: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            colors: this.getColorsArray().map(color => ({ color })),
            numberOfPickers: this.getColorsArray().length,
        };
    }

    getColorsArray() {
        return this.props.colors.split(' ');
    }

    handleChangeText(e) {
        this.setState({ numberOfPickers: e.target.value.split(' ').length });
        this.props.onColorsChange(e.target.value);
        this.setState({
            colors: e.target.value.split(' ').map(color => ({ color })),
        });
    }

    handleChangePicker(i, e) {
        const { value } = e.target;
        let colorsBuffer = [...this.state.colors];
        colorsBuffer[i] = { color: value };

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
        const colors = this.props.colors;
        const polyglot = this.props.polyglot;
        return (
            <Fragment>
                <TextField
                    floatingLabelText={polyglot.t('colors_set')}
                    onChange={this.handleChangeText.bind(this)}
                    style={styles.colorpicker}
                    value={colors}
                />
                {this.createUI()}
            </Fragment>
        );
    }
}

export default ColorPickerParamsAdmin;
