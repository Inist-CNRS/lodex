import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    }

    static defaultProps = {
        maxSize: '10',
        chartWidth: '100%',
    }
    constructor(props) {
        super(props);

        this.state = {
            maxSize: this.props.maxSize,
            chartWidth: this.props.chartWidth,
        };
    }

    setMaxSize = (maxSize) => {
        this.setState({ maxSize });
        this.props.onChange({
            maxSize,
            chartWidth: this.state.chartWidth,
        });
    }

    setWidth = (chartWidth) => {
        this.setState({ chartWidth });
        this.props.onChange({
            maxSize: this.state.maxSize,
            chartWidth,
        });
    }

    render() {
        const { p: polyglot } = this.props;
        const { maxSize, chartWidth } = this.state;
        return (
            <div style={styles.container}>
                <TextField
                    floatingLabelText="Maximun fields number"
                    onChange={(event, newValue) => this.setMaxSize(newValue)}
                    style={styles.input}
                    value={maxSize}
                />
                <SelectField
                    floatingLabelText={polyglot.t('list_format_select_image_width')}
                    onChange={(event, index, newValue) => this.setWidth(newValue)}
                    style={styles.input}
                    value={chartWidth}
                >
                    <MenuItem value="10%" primaryText={polyglot.t('ten_percent')} />
                    <MenuItem value="20%" primaryText={polyglot.t('twenty_percent')} />
                    <MenuItem value="30%" primaryText={polyglot.t('thirty_percent')} />
                    <MenuItem value="50%" primaryText={polyglot.t('fifty_percent')} />
                    <MenuItem value="80%" primaryText={polyglot.t('eighty_percent')} />
                    <MenuItem value="100%" primaryText={polyglot.t('hundred_percent')} />
                </SelectField>
            </div>
        );
    }
}

export default translate(ChartEdition);
