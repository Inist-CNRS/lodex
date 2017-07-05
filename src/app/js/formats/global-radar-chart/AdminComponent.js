import React, { Component, PropTypes } from 'react';
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

class RadarChartEdition extends Component {
    static propTypes = {
        maxSize: PropTypes.string,
        orderBy: PropTypes.string,
        colors: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    }

    static defaultProps = {
        maxSize: '5',
        orderBy: 'value/asc',
        colors: '#1D1A31 #4D2D52 #9A4C95 #F08CAE #C1A5A9',
    }
    constructor(props) {
        super(props);

        this.state = {
            maxSize: this.props.maxSize,
            orderBy: this.props.orderBy,
            colors: this.props.colors,
        };
    }

    setMaxSize = (maxSize) => {
        this.setState({ maxSize });
        this.props.onChange({
            maxSize,
            orderBy: this.state.orderBy,
            colors: this.state.colors,
        });
    }

    setOrderBy = (orderBy) => {
        this.setState({ orderBy });
        this.props.onChange({
            maxSize: this.state.maxSize,
            colors: this.state.colors,
            orderBy,
        });
    }

    setColors = (colors) => {
        this.setState({ colors });
        this.props.onChange({
            maxSize: this.state.maxSize,
            orderBy: this.state.orderBy,
            colors,
        });
    }

    render() {
        const { p: polyglot } = this.props;
        const { maxSize, colors, orderBy } = this.state;
        return (
            <div style={styles.container}>
                <TextField
                    floatingLabelText={polyglot.t('max_fields')}
                    onChange={(event, newValue) => this.setMaxSize(newValue)}
                    style={styles.input}
                    value={maxSize}
                />
                <SelectField
                    floatingLabelText={polyglot.t('order_by')}
                    onChange={(event, index, newValue) => this.setOrderBy(newValue)}
                    style={styles.input}
                    value={orderBy}
                >
                    <MenuItem value="label/asc" primaryText={polyglot.t('label_asc')} />
                    <MenuItem value="label/desc" primaryText={polyglot.t('label_desc')} />
                    <MenuItem value="value/asc" primaryText={polyglot.t('value_asc')} />
                    <MenuItem value="value/desc" primaryText={polyglot.t('value_desc')} />
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

export default translate(RadarChartEdition);
