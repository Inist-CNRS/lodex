import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { schemeOrRd } from 'd3-scale-chromatic';

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
        colorScheme: PropTypes.arrayOf(PropTypes.string),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        colorScheme: schemeOrRd[9],
    };
    constructor(props) {
        super(props);
        const { colorScheme } = this.props;
        this.state = { colorScheme };
    }

    setColorScheme = (_, __, colorScheme) => {
        const newState = { ...this.state, colorScheme: colorScheme.split(',') };
        this.setState(newState);
        this.props.onChange(newState);
    };

    render() {
        const { p: polyglot } = this.props;
        const { colorScheme } = this.state;

        return (
            <div style={styles.container}>
                <ColorSchemeSelector
                    label={polyglot.t('color_scheme')}
                    onChange={this.setColorScheme}
                    style={styles.input}
                    value={colorScheme}
                />
            </div>
        );
    }
}

export default translate(HeatMapAdmin);
