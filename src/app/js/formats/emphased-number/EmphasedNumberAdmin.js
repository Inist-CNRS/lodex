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

class EmphasedNumberAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            size: PropTypes.string,
            colors: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: {
            size: 4,
            colors: '#8B8B8B #5B5B5B #818181',
        },
    };

    setSize = size => {
        const newArgs = {
            ...this.props.args,
            size,
        };
        this.props.onChange(newArgs);
    };

    setColors = colors => {
        const newArgs = {
            ...this.props.args,
            colors,
        };
        this.props.onChange(newArgs);
    };

    render() {
        const { p: polyglot, args: { colors, size } } = this.props;

        return (
            <div style={styles.container}>
                <SelectField
                    floatingLabelText={polyglot.t('list_format_select_size')}
                    onChange={(event, index, newValue) =>
                        this.setSize(newValue)
                    }
                    style={styles.input}
                    value={size}
                >
                    <MenuItem value={1} primaryText={polyglot.t('size1')} />
                    <MenuItem value={2} primaryText={polyglot.t('size2')} />
                    <MenuItem value={3} primaryText={polyglot.t('size3')} />
                    <MenuItem value={4} primaryText={polyglot.t('size4')} />
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

export default translate(EmphasedNumberAdmin);
