import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';

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
        maxSize: 5000,
        maxLabelLength: 25,
        minimumScaleValue: 5,
    },
};

class HierarchyAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            maxSize: PropTypes.number,
            maxLabelLength: PropTypes.number,
            minimumScaleValue: PropTypes.number,
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

    setMaxLabelLength = (_, maxLabelLength) => {
        this.setParams({
            maxLabelLength: parseInt(maxLabelLength, 10),
            maxSize: this.props.args.params.maxSize,
            minimumScaleValue: this.props.args.params.minimumScaleValue,
            maxValue: this.props.args.maxValue,
            minValue: this.props.args.minValue,
            orderBy: this.props.args.orderBy,
        });
    };

    setMinimumScaleValue = (_, minimumScaleValue) => {
        this.setParams({
            maxLabelLength: this.props.args.params.maxLabelLength,
            maxSize: this.props.args.params.maxSize,
            minimumScaleValue: parseInt(minimumScaleValue, 10),
            maxValue: this.props.args.maxValue,
            minValue: this.props.args.minValue,
            orderBy: this.props.args.orderBy,
        });
    };

    render() {
        const {
            p: polyglot,
            args: { params },
        } = this.props;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    polyglot={polyglot}
                    onChange={this.setParams}
                />
                <TextField
                    floatingLabelText={polyglot.t('max_char_number_in_labels')}
                    onChange={this.setMaxLabelLength}
                    style={styles.input}
                    value={this.props.args.params.maxLabelLength}
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
