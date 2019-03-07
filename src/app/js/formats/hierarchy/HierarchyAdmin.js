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
    },
};

class HierarchyAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            maxSize: PropTypes.number,
            maxLabelLength: PropTypes.number,
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
                />{' '}
            </div>
        );
    }
}

export default translate(HierarchyAdmin);
