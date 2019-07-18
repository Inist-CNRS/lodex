import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import translate from 'redux-polyglot/translate';

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
    colors:
        '#e6194B #3cb44b #ffe119 #4363d8 #f58231 #911eb4 #42d4f4 #f032e6 #bfef45 #fabebe #469990 #e6beff #9A6324 #fffac8 #800000 #aaffc3 #808000 #ffd8b1 #000075 #a9a9a9 #ffffff #00000',
    maxLegendLength: 31,
};

class StreamgraphAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
        }),
        colors: PropTypes.string,
        maxLegendLength: PropTypes.number,
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setParams = params => updateAdminArgs('params', params, this.props);

    setColors = (_, colors) => {
        updateAdminArgs('colors', colors, this.props);
    };

    setMaxLegendLength = (_, maxLegendLength) => {
        updateAdminArgs('maxLegendLength', maxLegendLength, this.props);
    };

    render() {
        const {
            p: polyglot,
            args: { params, colors, maxLegendLength },
        } = this.props;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    polyglot={polyglot}
                    onChange={this.setParams}
                />
                <TextField
                    floatingLabelText={polyglot.t('colors_set')}
                    onChange={this.setColors}
                    style={styles.input}
                    value={colors}
                />
                <TextField
                    floatingLabelText={polyglot.t('max_char_number_in_legends')}
                    onChange={this.setMaxLegendLength}
                    style={styles.input}
                    value={maxLegendLength}
                />
            </div>
        );
    }
}

export default translate(StreamgraphAdmin);
