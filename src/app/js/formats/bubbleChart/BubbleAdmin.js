import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import RoutineParamsAdmin from '../shared/RoutineParamsAdmin';

import * as colorUtils from '../colorUtils';

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
    diameter: 500,
    colors: colorUtils.MULTICHROMATIC_DEFAULT_COLORSET,
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

    setDiameter = (_, diameter) => {
        updateAdminArgs('diameter', diameter, this.props);
    };

    setColors = (_, colors) => {
        updateAdminArgs('colors', colors, this.props);
    };

    render() {
        const {
            p: polyglot,
            args: { params, colors },
        } = this.props;
        const { diameter } = this.props.args;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={this.setParams}
                    polyglot={polyglot}
                    fieldsToShow={'maxSize, minValue, maxValue, orderBy'}
                />
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
