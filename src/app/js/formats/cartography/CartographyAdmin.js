import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { schemeBlues, schemeOrRd } from 'd3-scale-chromatic';

import { GradientSchemeSelector } from '../../lib/components/ColorSchemeSelector';

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
    previewDefaultColor: color => ({
        display: 'inline-block',
        backgroundColor: color,
        height: '1em',
        width: '1em',
        marginLeft: 5,
        border: 'solid 1px black',
    }),
};

class CartographyAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            colorScheme: PropTypes.arrayOf(PropTypes.string),
            hoverColorScheme: PropTypes.arrayOf(PropTypes.string),
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: {
            colorScheme: schemeOrRd[9],
            hoverColorScheme: schemeBlues[9],
        },
    };

    setColorScheme = (_, __, colorScheme) => {
        const newState = {
            ...this.props.args,
            colorScheme: colorScheme.split(','),
        };
        this.props.onChange(newState);
    };

    setHoverColorScheme = (_, __, hoverColorScheme) => {
        const newState = {
            ...this.props.args,
            hoverColorScheme: hoverColorScheme.split(','),
        };
        this.props.onChange(newState);
    };

    render() {
        const { p: polyglot } = this.props;
        const { colorScheme, hoverColorScheme } = this.props.args;

        return (
            <div style={styles.container}>
                <GradientSchemeSelector
                    label={polyglot.t('color_scheme')}
                    onChange={this.setColorScheme}
                    style={styles.input}
                    value={colorScheme}
                />
                <GradientSchemeSelector
                    label={polyglot.t('hover_color_scheme')}
                    onChange={this.setHoverColorScheme}
                    style={styles.input}
                    value={hoverColorScheme}
                />
            </div>
        );
    }
}

export default translate(CartographyAdmin);
