import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'inline-flex',
    },
    input: {
        marginLeft: '1rem',
    },
};

class ChartEdition extends Component {
    static propTypes = {
        maxSize: PropTypes.string,
        chartWidth: PropTypes.string,
        colors: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    }

    static defaultProps = {
        maxSize: '10',
        chartWidth: '100%',
        colors: '#1D1A31 #4D2D52 #9A4C95 #F08CAE #C1A5A9',
    }
    constructor(props) {
        super(props);

        this.state = {
            maxSize: this.props.maxSize,
            chartWidth: this.props.chartWidth,
            colors: this.props.colors,
        };
    }

    setMaxSize = (maxSize) => {
        this.setState({ maxSize });
        this.props.onChange({
            maxSize,
            chartWidth: this.state.chartWidth,
            colors: this.state.colors,
        });
    }

    setWidth = (chartWidth) => {
        this.setState({ chartWidth });
        this.props.onChange({
            maxSize: this.state.maxSize,
            colors: this.state.colors,
            chartWidth,
        });
    }

    setColors = (colors) => {
        this.setState({ colors });
        this.props.onChange({
            maxSize: this.state.maxSize,
            chartWidth: this.state.chartWidth,
            colors,
        });
    }

    render() {
        const { p: polyglot } = this.props;
        const { maxSize, colors } = this.state;
        return (
            <div style={styles.container}>
                <TextField
                    floatingLabelText={polyglot.t('Maximun fields number')}
                    onChange={(event, newValue) => this.setMaxSize(newValue)}
                    style={styles.input}
                    value={maxSize}
                />
                <TextField
                    floatingLabelText={polyglot.t('Colors set')}
                    onChange={(event, newValue) => this.setColors(newValue)}
                    style={styles.input}
                    value={colors}
                />
            </div>
        );
    }
}

export default translate(ChartEdition);
