import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { schemeBlues, schemeOrRd } from 'd3-scale-chromatic';

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

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    colorScheme: schemeOrRd[9],
    hoverColorScheme: schemeBlues[9],
};

class CartographyAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
            colorScheme: PropTypes.arrayOf(PropTypes.string),
            hoverColorScheme: PropTypes.arrayOf(PropTypes.string),
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

    setHoverColorScheme = (_, __, hoverColorScheme) => {
        updateAdminArgs(
            'hoverColorScheme',
            hoverColorScheme.split(','),
            this.props,
        );
    };

    render() {
        const {
            p: polyglot,
            args: { params },
        } = this.props;
        const { colorScheme, hoverColorScheme } = this.props.args;
        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={this.setParams}
                    polyglot={polyglot}
                    fieldsToShow={'maxSize, minValue, maxValue, orderBy'}
                />
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
