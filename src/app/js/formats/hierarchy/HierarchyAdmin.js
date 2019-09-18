import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import TextField from '@material-ui/core/TextField';

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
        maxSize: 5000,
        orderBy: 'value/asc',
        maxLabelLength: 25,
        labelOffset: 50,
        minimumScaleValue: 5,
    },
    colors: colorUtils.MONOCHROMATIC_DEFAULT_COLORSET,
};

class HierarchyAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
                maxLabelLength: PropTypes.number,
                labelOffset: PropTypes.number,
                minimumScaleValue: PropTypes.number,
            }),
            colors: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
        showMaxSize: PropTypes.bool.isRequired,
        showMaxValue: PropTypes.bool.isRequired,
        showMinValue: PropTypes.bool.isRequired,
        showOrderBy: PropTypes.bool.isRequired,
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
    setParams = params => {
        updateAdminArgs('params', params, this.props);
    };

    setColors(colors) {
        updateAdminArgs(
            'colors',
            colors.split(' ')[0] || defaultArgs.colors,
            this.props,
        );
    }

    setMaxLabelLength = (_, maxLabelLength) => {
        this.setParams({
            ...this.props.args.params,
            maxLabelLength: parseInt(maxLabelLength, 10),
        });
    };

    setLabelOffset = (_, labelOffset) => {
        this.setParams({
            ...this.props.args.params,
            labelOffset: parseInt(labelOffset, 10),
        });
    };

    setMinimumScaleValue = (_, minimumScaleValue) => {
        this.setParams({
            ...this.props.args.params,
            minimumScaleValue: parseInt(minimumScaleValue, 10),
        });
    };

    render() {
        const {
            p: polyglot,
            args: { params },
            showMaxSize = true,
            showMaxValue = false,
            showMinValue = false,
            showOrderBy = true,
        } = this.props;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    polyglot={polyglot}
                    onChange={this.setParams}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
                <ColorPickerParamsAdmin
                    colors={this.state.colors || defaultArgs.colors}
                    onChange={this.setColors}
                    polyglot={polyglot}
                    monochromatic={true}
                />
                <TextField
                    floatingLabelText={polyglot.t('max_char_number_in_labels')}
                    onChange={this.setMaxLabelLength}
                    style={styles.input}
                    value={this.props.args.params.maxLabelLength}
                />
                <TextField
                    floatingLabelText={polyglot.t('label_offset')}
                    onChange={this.setLabelOffset}
                    style={styles.input}
                    value={this.props.args.params.labelOffset}
                />
                <TextField
                    floatingLabelText={polyglot.t('minimum_scale_value')}
                    onChange={this.setMinimumScaleValue}
                    style={styles.input}
                    value={this.props.args.params.minimumScaleValue}
                />
            </div>
        );
    }
}

export default translate(HierarchyAdmin);
