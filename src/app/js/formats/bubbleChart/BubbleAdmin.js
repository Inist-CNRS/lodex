import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';
import { schemeAccent } from 'd3-scale-chromatic';
import { CategorySchemeSelector } from '../../lib/components/ColorSchemeSelector';

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

export const defaultArgs = {
    colorScheme: schemeAccent,
    diameter: 500,
};

class BubbleAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            colorScheme: PropTypes.arrayOf(PropTypes.string),
            diameter: PropTypes.number,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setColorScheme = (_, __, colorScheme) => {
        const newState = {
            ...this.props.args,
            colorScheme: colorScheme.split(','),
        };
        this.props.onChange(newState);
    };

    setDiameter = (_, diameter) => {
        const newState = {
            ...this.props.args,
            diameter,
        };
        this.props.onChange(newState);
    };

    render() {
        const { p: polyglot } = this.props;
        const { diameter, colorScheme } = this.props.args;

        return (
            <div style={styles.container}>
                <CategorySchemeSelector
                    label={polyglot.t('color_scheme')}
                    onChange={this.setColorScheme}
                    style={styles.input}
                    value={colorScheme}
                />
                <TextField
                    floatingLabelText={polyglot.t('diameter')}
                    onChange={this.setDiameter}
                    style={styles.input}
                    value={diameter}
                />
            </div>
        );
    }
}

export default translate(BubbleAdmin);
