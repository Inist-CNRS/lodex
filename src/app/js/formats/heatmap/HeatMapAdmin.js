import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { schemeOrRd } from 'd3-scale-chromatic';
import Checkbox from 'material-ui/Checkbox';

import ColorSchemeSelector from '../../lib/components/ColorSchemeSelector';
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

class HeatMapAdmin extends Component {
    static propTypes = {
        args: {
            colorScheme: PropTypes.arrayOf(PropTypes.string),
            flipAxis: PropTypes.bool,
        },
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: {
            colorScheme: schemeOrRd[9],
            flipAxis: false,
        },
    };

    handleColorSchemeChange = (event, index, colorScheme) => {
        const newArgs = {
            ...this.props.args,
            colorScheme: colorScheme.split(','),
        };
        this.props.onChange(newArgs);
    };

    toggleFlipAxis = () => {
        const { flipAxis, ...state } = this.props.args;
        const newArgs = { ...state, flipAxis: !flipAxis };
        this.props.onChange(newArgs);
    };

    render() {
        const { p: polyglot, args: { colorScheme, flipAxis } } = this.props;

        return (
            <div style={styles.container}>
                <ColorSchemeSelector
                    label={polyglot.t('color_scheme')}
                    onChange={this.handleColorSchemeChange}
                    style={styles.input}
                    value={colorScheme}
                />
                <Checkbox
                    label={polyglot.t('flip_axis')}
                    onCheck={this.toggleFlipAxis}
                    style={styles.input}
                    checked={flipAxis}
                />
            </div>
        );
    }
}

export default translate(HeatMapAdmin);
