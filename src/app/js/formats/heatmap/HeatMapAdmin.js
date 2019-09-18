import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { schemeOrRd } from 'd3-scale-chromatic';
import Checkbox from '@material-ui/core/Checkbox';

import { GradientSchemeSelector } from '../../lib/components/ColorSchemeSelector';
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
    previewDefaultColor: color => ({
        display: 'inline-block',
        backgroundColor: color,
        height: '1em',
        width: '1em',
        marginLeft: 5,
        border: 'solid 1px black',
    }),
};

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    colorScheme: schemeOrRd[9],
    flipAxis: false,
};

class HeatMapAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
            colorScheme: PropTypes.arrayOf(PropTypes.string),
            flipAxis: PropTypes.bool,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setParams = params => {
        updateAdminArgs('params', params, this.props);
    };

    handleColorSchemeChange = (event, index, colorScheme) => {
        updateAdminArgs('colorScheme', colorScheme.split(','), this.props);
    };

    toggleFlipAxis = () => {
        updateAdminArgs('flipAxis', !this.props.args.flipAxis, this.props);
    };

    render() {
        const {
            p: polyglot,
            args: { params, colorScheme, flipAxis },
        } = this.props;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    polyglot={polyglot}
                    onChange={this.setParams}
                    fieldsToShow={'maxSize, minValue, maxValue, orderBy'}
                />
                <GradientSchemeSelector
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
