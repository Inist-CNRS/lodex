import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';
//import { schemeAccent } from 'd3-scale-chromatic';
//import { GradientSchemeSelector } from '../../lib/components/ColorSchemeSelector';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import RoutineParamsAdmin from '../shared/RoutineParamsAdmin';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        width: '100%',
    },
};

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    // colorScheme: schemeAccent,
    diameter: 500,
    colors: '#1D1A31 #4D2D52 #9A4C95 #F08CAE #C1A5A9',
};

class BubbleAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
            //colorScheme: PropTypes.arrayOf(PropTypes.string),
            diameter: PropTypes.number,
            colors: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setParams = params => updateAdminArgs('params', params, this.props);

    setColorScheme = (_, __, colorScheme) => {
        updateAdminArgs('colorScheme', colorScheme.split(','), this.props);
    };

    setDiameter = (_, diameter) => {
        updateAdminArgs('diameter', diameter, this.props);
    };

    /*handleColorSchemeChange = (event, index, colorScheme) => {
        updateAdminArgs('colorScheme', colorScheme.split(','), this.props);
    };*/

    setColors = (_, colors) => {
        updateAdminArgs('colors', colors, this.props);
    };

    render() {
        const {
            p: polyglot,
            args: { params, colors },
        } = this.props;
        const { diameter /*, colorScheme*/ } = this.props.args;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={this.setParams}
                    polyglot={polyglot}
                />
                {/*
                <GradientSchemeSelector
                    label={polyglot.t('color_scheme')}
                    onChange={this.handleColorSchemeChange}
                    style={styles.input}
                    value={colorScheme}
                />
                */}
                <TextField
                    floatingLabelText={polyglot.t('diameter')}
                    onChange={this.setDiameter}
                    style={styles.input}
                    value={diameter}
                />
                <TextField
                    floatingLabelText={polyglot.t('colors_set')}
                    onChange={this.setColors}
                    style={styles.input}
                    value={colors}
                />
            </div>
        );
    }
}

export default translate(BubbleAdmin);
