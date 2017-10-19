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

class ChartEdition extends Component {
    static propTypes = {
        look: PropTypes.string,
        colors: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    }

    static defaultProps = {
        look: 'ribbon',
        colors: '#8B8B8B #5B5B5B #818181',
    }
    constructor(props) {
        super(props);

        this.state = {
            look: this.props.look,
            colors: this.props.colors,
        };
    }

    setLook = (look) => {
        this.setState({ look });
        this.props.onChange({
            colors: this.state.colors,
            look,
        });
    }

    setColors = (colors) => {
        this.setState({ colors });
        this.props.onChange({
            look: this.state.look,
            colors,
        });
    }

    render() {
        const { p: polyglot } = this.props;
        const { colors, look } = this.state;
        return (
            <div style={styles.container}>
                <SelectField
                    floatingLabelText={polyglot.t('order_by')}
                    onChange={(event, index, newValue) => this.setLook(newValue)}
                    style={styles.input}
                    value={look}
                >
                    <MenuItem value="ribbon" primaryText={polyglot.t('ribbon')} />
                    <MenuItem value="badge" primaryText={polyglot.t('badge')} />
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
