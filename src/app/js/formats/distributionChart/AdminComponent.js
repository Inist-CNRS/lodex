import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        marginLeft: '1rem',
        width: '40%',
    },
    input2: {
        width: '100%',
    },
};

class ChartEdition extends Component {
    static propTypes = {
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
            orderBy: PropTypes.string,
        }),
        colors: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        params: {
            maxSize: 5,
            orderBy: 'value/asc',
        },
        colors: '#1D1A31 #4D2D52 #9A4C95 #F08CAE #C1A5A9',
    };
    constructor(props) {
        super(props);
        const { params, colors } = this.props;
        this.state = { params, colors };
    }

    setMaxSize = maxSize => {
        const { params, ...state } = this.state;
        const newState = { ...state, params: { ...params, maxSize } };
        this.setState(newState);
        this.props.onChange(newState);
    };

    setMaxValue = maxValue => {
        const { params, ...state } = this.state;
        const newState = { ...state, params: { ...params, maxValue } };
        this.setState(newState);
        this.props.onChange(newState);
    };

    setMinValue = minValue => {
        const { params, ...state } = this.state;
        const newState = { ...state, params: { ...params, minValue } };
        this.setState(newState);
        this.props.onChange(newState);
    };

    setOrderBy = orderBy => {
        const { params, ...state } = this.state;
        const newState = { ...state, params: { ...params, orderBy } };
        this.setState(newState);
        this.props.onChange(newState);
    };

    setColors = colors => {
        const newState = { ...this.state, colors };
        this.setState(newState);
        this.props.onChange(newState);
    };

    render() {
        const { p: polyglot } = this.props;
        const {
            params: { maxSize, maxValue, minValue, orderBy },
            colors,
        } = this.state;
        return (
            <div style={styles.container}>
                <TextField
                    floatingLabelText={polyglot.t('max_fields')}
                    onChange={(event, newValue) => this.setMaxSize(newValue)}
                    style={styles.input}
                    value={maxSize}
                />
                <TextField
                    floatingLabelText={polyglot.t('max_value')}
                    onChange={(event, newValue) => this.setMaxValue(newValue)}
                    style={styles.input}
                    value={maxValue}
                />
                <TextField
                    floatingLabelText={polyglot.t('min_value')}
                    onChange={(event, newValue) => this.setMinValue(newValue)}
                    style={styles.input}
                    value={minValue}
                />
                <SelectField
                    floatingLabelText={polyglot.t('order_by')}
                    onChange={(event, index, newValue) =>
                        this.setOrderBy(newValue)
                    }
                    style={styles.input}
                    value={orderBy}
                >
                    <MenuItem
                        value="label/asc"
                        primaryText={polyglot.t('label_asc')}
                    />
                    <MenuItem
                        value="label/desc"
                        primaryText={polyglot.t('label_desc')}
                    />
                    <MenuItem
                        value="value/asc"
                        primaryText={polyglot.t('value_asc')}
                    />
                    <MenuItem
                        value="value/desc"
                        primaryText={polyglot.t('value_desc')}
                    />
                </SelectField>
                <TextField
                    floatingLabelText={polyglot.t('colors_set')}
                    onChange={(event, newValue) => this.setColors(newValue)}
                    style={styles.input2}
                    value={colors}
                />
            </div>
        );
    }
}

export default translate(ChartEdition);
