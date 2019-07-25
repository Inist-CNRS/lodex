import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import RoutineParamsAdmin from '../shared/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../shared/ColorPickerParamsAdmin';
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
    colors: colorUtils.MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH,
    maxLegendLength: 30,
    height: 300,
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
            colors: PropTypes.string,
        }),
        maxLegendLength: PropTypes.number,
        height: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    constructor(props) {
        super(props);
        this.setColors = this.setColors.bind(this);
        this.state = {
            colors: this.props.args.colors || defaultArgs.colors,
        };
    }

    setParams = params => updateAdminArgs('params', params, this.props);

    setColors(colors) {
        updateAdminArgs('colors', colors || defaultArgs.colors, this.props);
    }

    setMaxLegendLength = (_, maxLegendLength) => {
        updateAdminArgs('maxLegendLength', maxLegendLength, this.props);
    };

    setHeight = (_, height) => {
        updateAdminArgs('height', height, this.props);
    };

    render() {
        const {
            p: polyglot,
            args: { params, maxLegendLength, height },
        } = this.props;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    polyglot={polyglot}
                    onChange={this.setParams}
                />
                <ColorPickerParamsAdmin
                    colors={this.state.colors}
                    onChange={this.setColors}
                    polyglot={polyglot}
                />
                <TextField
                    floatingLabelText={polyglot.t('max_char_number_in_legends')}
                    onChange={this.setMaxLegendLength}
                    style={styles.input}
                    value={maxLegendLength}
                />
                <TextField
                    floatingLabelText={polyglot.t('height_px')}
                    onChange={this.setHeight}
                    style={styles.input}
                    value={height}
                />
            </div>
        );
    }
}

export default translate(StreamgraphAdmin);
